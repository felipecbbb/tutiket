import Link from "next/link";
import { requireSession } from "@/server/auth";
import { SignOutButton } from "@/components/shared/sign-out-button";
import { NotificationsBell } from "@/components/shared/notifications-bell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const role = (session.user as { role?: string }).role ?? "user";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3 lg:px-12">
          <Link href="/" className="font-display text-xl font-bold">
            <span className="inline-block rotate-[-2deg] rounded-md bg-foreground px-2 py-0.5 text-background">
              proyecto
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="/mi" className="hover:text-primary">
              Mi cuenta
            </Link>
            {(role === "organizer" || role === "admin") && (
              <Link href="/org" className="hover:text-primary">
                Organizaciones
              </Link>
            )}
            {(role === "validator" || role === "organizer" || role === "admin") && (
              <Link href="/validar" className="hover:text-primary">
                Validar
              </Link>
            )}
            {(role === "pr_member" || role === "pr_manager" || role === "admin") && (
              <Link href="/pr" className="hover:text-primary">
                RR.PP.
              </Link>
            )}
            {role === "admin" && (
              <Link href="/admin" className="hover:text-primary">
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2 text-sm">
            <NotificationsBell />
            <span className="hidden text-muted-foreground sm:inline">
              {session.user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10 lg:px-12">{children}</main>
    </div>
  );
}
