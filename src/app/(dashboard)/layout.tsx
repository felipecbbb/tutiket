import { requireSession } from "@/server/auth";
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

  return (
    <div className="panel-shell min-h-screen flex">
      {/* Sidebar fijo desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-border bg-card flex-col">
        <Sidebar role={role} email={session.user.email} name={session.user.name} />
      </aside>

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-8">
            <SidebarToggle>
              <Sidebar role={role} email={session.user.email} name={session.user.name} />
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
