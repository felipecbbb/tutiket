import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type UserRole = "user" | "organizer" | "validator" | "pr_member" | "admin";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Garantiza que hay un usuario logueado. Si no, redirige a /login con
 * el path actual como `redirect` query.
 */
export async function requireSession(opts?: { redirectTo?: string }) {
  const session = await getSession();
  if (!session?.user) {
    const params = new URLSearchParams();
    if (opts?.redirectTo) params.set("redirect", opts.redirectTo);
    redirect(`/login${params.size ? `?${params.toString()}` : ""}`);
  }
  return session;
}

/**
 * Garantiza que el usuario tiene uno de los roles permitidos.
 * Si no hay sesión → /login. Si rol insuficiente → /mi (con flag).
 */
export async function requireRole(
  allowed: UserRole[],
  opts?: { redirectTo?: string },
) {
  const session = await requireSession(opts);
  const role = (session.user as { role?: UserRole }).role;
  if (!role || !allowed.includes(role)) {
    redirect("/mi?error=forbidden");
  }
  return session;
}
