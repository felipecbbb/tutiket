import Link from "next/link";
import { Bell } from "lucide-react";
import { countMyUnreadNotifications } from "@/server/actions/notifications";

export async function NotificationsBell() {
  let count = 0;
  try {
    count = await countMyUnreadNotifications();
  } catch {
    return null;
  }
  return (
    <Link
      href="/mi/notificaciones"
      aria-label={`Notificaciones${count > 0 ? ` (${count})` : ""}`}
      className="relative inline-flex size-9 items-center justify-center rounded-full border border-border hover:bg-muted"
    >
      <Bell className="size-4" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
