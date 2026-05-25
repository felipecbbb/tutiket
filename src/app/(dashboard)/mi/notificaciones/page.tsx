import Link from "next/link";
import { Bell, BellOff } from "lucide-react";
import {
  countMyUnreadNotifications,
  listMyNotifications,
} from "@/server/actions/notifications";
import { formatDate } from "@/lib/utils";
import { MarkAllReadButton } from "./mark-all-read";
import { NotificationRow } from "./notification-row";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const [items, unread] = await Promise.all([
    listMyNotifications(50),
    countMyUnreadNotifications(),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/mi"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Mi cuenta
      </Link>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            · Notificaciones ·
          </p>
          <h1 className="mt-1 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Tu bandeja
          </h1>
        </div>
        {unread > 0 && <MarkAllReadButton count={unread} />}
      </div>

      {items.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <BellOff className="size-6 text-muted-foreground" />
          <p className="font-display text-2xl font-bold">Sin notificaciones</p>
          <p className="text-sm text-muted-foreground">
            Aquí aparecerán avisos importantes: compras, validaciones, comisiones…
          </p>
        </div>
      ) : (
        <ul className="mt-8 flex flex-col gap-2">
          {items.map((n) => (
            <NotificationRow
              key={n.id}
              notification={{
                id: n.id,
                title: n.title,
                message: n.message,
                read: n.read,
                type: n.type,
                createdAt: formatDate(n.createdAt, {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }}
            />
          ))}
        </ul>
      )}

      <div className="mt-8 inline-flex items-center gap-2 text-xs text-muted-foreground">
        <Bell className="size-3" />
        Realtime con Pusher se conectará cuando configures las keys.
      </div>
    </div>
  );
}
