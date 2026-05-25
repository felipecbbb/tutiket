"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Circle } from "lucide-react";
import { markNotificationRead } from "@/server/actions/notifications";

const TYPE_COLOR: Record<string, string> = {
  payment_completed: "bg-accent/30 text-accent-foreground",
  payment_failed: "bg-destructive/20 text-destructive",
  ticket_refunded: "bg-muted text-muted-foreground",
  pr_join_request: "bg-primary/20 text-primary",
  verifier_invitation: "bg-primary/20 text-primary",
  organization_verified: "bg-accent/30 text-accent-foreground",
};

type Props = {
  notification: {
    id: string;
    title: string;
    message: string;
    read: boolean;
    type: string;
    createdAt: string;
  };
};

export function NotificationRow({ notification }: Props) {
  const router = useRouter();
  const [read, setRead] = useState(notification.read);
  const [pending, startTransition] = useTransition();

  function markRead() {
    if (read) return;
    setRead(true);
    startTransition(async () => {
      try {
        await markNotificationRead(notification.id);
        router.refresh();
      } catch {
        setRead(false);
      }
    });
  }

  return (
    <li
      onClick={markRead}
      className={`flex gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
        read
          ? "border-border bg-card"
          : "border-primary/30 bg-primary/5 hover:border-primary/50"
      }`}
    >
      <div className="pt-0.5">
        {read ? (
          <Check className="size-4 text-muted-foreground" />
        ) : (
          <Circle className="size-3 fill-primary text-primary" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${TYPE_COLOR[notification.type] ?? "bg-muted text-muted-foreground"}`}
          >
            {notification.type.replace(/_/g, " ")}
          </span>
          <span className="text-xs text-muted-foreground">
            {notification.createdAt}
          </span>
        </div>
        <p className="mt-1 font-medium">{notification.title}</p>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
      </div>
      {pending && <span className="text-xs text-muted-foreground">…</span>}
    </li>
  );
}
