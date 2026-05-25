import Link from "next/link";
import {
  BarChart3,
  Bell,
  Building2,
  CalendarCheck,
  Gift,
  LayoutDashboard,
  MapPin,
  Megaphone,
  Receipt,
  ScanLine,
  Settings,
  Shield,
  Sparkles,
  Ticket,
  User,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/shared/logo";

type Role = "user" | "organizer" | "validator" | "pr_member" | "pr_manager" | "admin";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Visible si globalRole está en la lista. Si undefined → siempre visible. */
  roles?: Role[];
  /** Visible adicionalmente si el user TIENE memberships en alguna org
   *  (cubre el caso "soy user global pero owner de una org"). */
  alsoIfHasOrgs?: boolean;
  /** Visible adicionalmente si el user TIENE prMember row (es RR.PP.). */
  alsoIfIsPrMember?: boolean;
};

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Mi cuenta",
    items: [
      { href: "/mi", label: "Perfil", icon: User },
      { href: "/mi/notificaciones", label: "Notificaciones", icon: Bell },
      { href: "/mi/puntos", label: "Twinpoints", icon: Sparkles },
    ],
  },
  {
    title: "Organizador",
    items: [
      {
        href: "/org",
        label: "Mis organizaciones",
        icon: Building2,
        roles: ["organizer", "pr_manager", "admin"],
        alsoIfHasOrgs: true,
      },
      {
        href: "/eventos-gestion",
        label: "Eventos",
        icon: CalendarCheck,
        roles: ["organizer", "pr_manager", "admin"],
        alsoIfHasOrgs: true,
      },
      {
        href: "/locales",
        label: "Locales",
        icon: MapPin,
        roles: ["organizer", "pr_manager", "admin"],
        alsoIfHasOrgs: true,
      },
    ],
  },
  {
    title: "RR.PP.",
    items: [
      {
        href: "/pr",
        label: "Mi panel",
        icon: Megaphone,
        roles: ["pr_member", "pr_manager", "admin"],
        alsoIfIsPrMember: true,
      },
    ],
  },
  {
    title: "Validación",
    items: [
      {
        href: "/validar",
        label: "Escanear entradas",
        icon: ScanLine,
        roles: ["validator", "organizer", "admin"],
        alsoIfHasOrgs: true,
      },
    ],
  },
  {
    title: "Super-admin",
    items: [
      { href: "/admin", label: "Resumen", icon: LayoutDashboard, roles: ["admin"] },
      { href: "/admin/usuarios", label: "Usuarios", icon: Users, roles: ["admin"] },
      { href: "/admin/organizaciones", label: "Organizaciones", icon: Building2, roles: ["admin"] },
      { href: "/admin/eventos", label: "Eventos", icon: Ticket, roles: ["admin"] },
      { href: "/admin/venues", label: "Locales", icon: MapPin, roles: ["admin"] },
    ],
  },
  {
    title: "Ajustes",
    items: [
      { href: "/ajustes", label: "Cuenta", icon: Settings },
    ],
  },
];

function visible(
  item: NavItem,
  role: Role,
  ctx: { hasOrgs: boolean; isPrMember: boolean },
) {
  if (!item.roles) return true;
  if (item.roles.includes(role)) return true;
  if (item.alsoIfHasOrgs && ctx.hasOrgs) return true;
  if (item.alsoIfIsPrMember && ctx.isPrMember) return true;
  return false;
}

export function Sidebar({
  role,
  email,
  name,
  hasOrgs = false,
  isPrMember = false,
}: {
  role: Role;
  email: string;
  name: string;
  /** True si el user tiene al menos una membership activa en una org */
  hasOrgs?: boolean;
  /** True si el user tiene fila en pr_members */
  isPrMember?: boolean;
}) {
  const ctx = { hasOrgs, isPrMember };

  return (
    <nav className="flex h-full flex-col p-4">
      <Link
        href="/"
        aria-label="Noa Events"
        className="mb-6 inline-flex items-center hover:opacity-80 transition-opacity"
      >
        <Logo variant="full" size="md" />
      </Link>

      <div className="flex-1 overflow-y-auto -mx-1 px-1">
        {NAV_GROUPS.map((group) => {
          const items = group.items.filter((i) => visible(i, role, ctx));
          if (items.length === 0) return null;
          return (
            <div key={group.title} className="mt-4 first:mt-0">
              <p className="px-2 mb-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                {group.title}
              </p>
              <ul className="flex flex-col gap-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <Link
          href="/ajustes"
          className="block rounded-lg bg-muted/50 px-3 py-2.5 hover:bg-muted"
        >
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
          <div className="mt-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            <Shield className="size-3" />
            {role}
          </div>
        </Link>
      </div>

      {/* keep imports satisfied for unused icons we may use later */}
      <span className="hidden">
        <BarChart3 />
        <Gift />
        <Receipt />
      </span>
    </nav>
  );
}
