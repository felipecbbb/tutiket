import Link from "next/link";
import {
  BarChart3,
  Bell,
  Building2,
  CalendarCheck,
  Gift,
  Home,
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

type Role = "user" | "organizer" | "validator" | "pr_member" | "pr_manager" | "admin";

type NavItem = { href: string; label: string; icon: LucideIcon; roles?: Role[] };

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
        roles: ["organizer", "admin"],
      },
      {
        href: "/eventos-gestion",
        label: "Eventos",
        icon: CalendarCheck,
        roles: ["organizer", "admin"],
      },
      {
        href: "/locales",
        label: "Locales",
        icon: MapPin,
        roles: ["organizer", "admin"],
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

function visible(item: NavItem, role: Role) {
  if (!item.roles) return true;
  return item.roles.includes(role);
}

export function Sidebar({
  role,
  email,
  name,
}: {
  role: Role;
  email: string;
  name: string;
}) {
  return (
    <nav className="flex h-full flex-col p-4">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 font-display text-lg font-bold"
      >
        <span className="inline-flex size-7 items-center justify-center rounded-md bg-foreground text-background">
          <Home className="size-4" />
        </span>
        <span>proyecto</span>
      </Link>

      <div className="flex-1 overflow-y-auto -mx-1 px-1">
        {NAV_GROUPS.map((group) => {
          const items = group.items.filter((i) => visible(i, role));
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
