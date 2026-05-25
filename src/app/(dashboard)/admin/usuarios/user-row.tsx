"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  adminDeleteUser,
  adminUpdateUserRole,
} from "@/server/actions/admin";
import type { UserRole } from "@/server/auth";

const ROLES: UserRole[] = [
  "user",
  "validator",
  "pr_member",
  "pr_manager",
  "organizer",
  "admin",
];

type Props = {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: string;
    emailVerified: boolean;
  };
};

export function UserRow({ user }: Props) {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(user.role);
  const [pending, startTransition] = useTransition();

  function changeRole(next: UserRole) {
    setRole(next);
    startTransition(async () => {
      try {
        await adminUpdateUserRole(user.id, next);
        toast.success(`${user.email} → ${next}`);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error");
        setRole(user.role);
      }
    });
  }

  function handleDelete() {
    if (!confirm(`¿Eliminar a ${user.email}? Soft delete.`)) return;
    startTransition(async () => {
      try {
        await adminDeleteUser(user.id);
        toast.success("Eliminado");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error");
      }
    });
  }

  return (
    <tr className="border-t border-border hover:bg-muted/30">
      <td className="px-4 py-3">
        <div className="font-medium">{user.name}</div>
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>{user.email}</span>
          {!user.emailVerified && (
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
              sin verificar
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <select
          value={role}
          disabled={pending}
          onChange={(e) => changeRole(e.target.value as UserRole)}
          className="h-8 rounded-md border border-border bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{user.createdAt}</td>
      <td className="px-4 py-3 text-right">
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          aria-label="Eliminar"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
        >
          <Trash2 className="size-4" />
        </button>
      </td>
    </tr>
  );
}
