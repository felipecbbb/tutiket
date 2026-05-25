import { and, eq, sql } from "drizzle-orm";
import { requireSession } from "@/server/auth";
import { db } from "@/lib/db";
import { organizationMembers, prMembers } from "@/db/schema";
import { SignOutButton } from "@/components/shared/sign-out-button";
import { NotificationsBell } from "@/components/shared/notifications-bell";
import { Sidebar } from "@/components/shared/sidebar";
import { SidebarToggle } from "@/components/shared/sidebar-toggle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const role = ((session.user as { role?: string }).role ?? "user") as
    | "user"
    | "organizer"
    | "validator"
    | "pr_member"
    | "pr_manager"
    | "admin";

  // Detección de capacidades adicionales: memberships activas + RR.PP.
  const [orgsCount, prCount] = await Promise.all([
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.userId, session.user.id),
          eq(organizationMembers.status, "active"),
        ),
      ),
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(prMembers)
      .where(eq(prMembers.userId, session.user.id)),
  ]);
  const hasOrgs = (orgsCount[0]?.n ?? 0) > 0;
  const isPrMember = (prCount[0]?.n ?? 0) > 0;

  const sidebarProps = {
    role,
    email: session.user.email,
    name: session.user.name,
    hasOrgs,
    isPrMember,
  };

  return (
    <div className="panel-shell min-h-screen flex">
      {/* Sidebar fijo desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-border bg-card flex-col">
        <Sidebar {...sidebarProps} />
      </aside>

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-8">
            <SidebarToggle>
              <Sidebar {...sidebarProps} />
            </SidebarToggle>
            <div className="flex-1" />
            <NotificationsBell />
            <SignOutButton />
          </div>
        </header>

        <main className="flex-1 px-4 py-8 lg:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
