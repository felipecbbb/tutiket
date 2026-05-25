"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  removeMember,
  updateMemberRole,
} from "@/server/actions/memberships";
import type { OrgMemberRole } from "@/db/schema";

const ASSIGNABLE_ROLES: OrgMemberRole[] = [
  "admin",
  "organizer",
  "pr_manager",
  "pr_member",
  "validator",
];

type Props = {
  member: {
    organizationId: string;
    userId: string;
    name: string;
    email: string;
    role: OrgMemberRole;
    status: "active" | "inactive";
    createdAt: string;
  };
};

export function MemberRow({ member }: Props) {
  const router = useRouter();
  const [role, setRole] = useState<OrgMemberRole>(member.role);
  const [pending, startTransition] = useTransition();
  const isOwner = role === "owner";

  function changeRole(next: OrgMemberRole) {
    setRole(next);
    startTransition(async () => {
      try {
        await updateMemberRole(member.organizationId, member.userId, next);
        toast.success(`${member.email} → ${next}`);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error");
        setRole(member.role);
      }
    });
  }

  function handleRemove() {
    if (!confirm(`¿Quitar a ${member.email} del equipo?`)) return;
    startTransition(async () => {
      try {
        await removeMember(member.organizationId, member.userId);
        toast.success("Miembro eliminado");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error");
      }
    });
  }

  return (
    <tr className="border-t border-border hover:bg-muted/30">
      <td className="px-4 py-3 font-medium">{member.name}</td>
      <td className="px-4 py-3 text-muted-foreground">{member.email}</td>
      <td className="px-4 py-3">
        {isOwner ? (
          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
            Owner
          </span>
        ) : (
          <select
            value={role}
            disabled={pending}
            onChange={(e) => changeRole(e.target.value as OrgMemberRole)}
            className="h-8 rounded-md border border-border bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {ASSIGNABLE_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        )}
      </td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
            member.status === "active"
              ? "bg-accent/30 text-accent-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {member.status}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        {!isOwner && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={pending}
            aria-label="Eliminar"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </td>
    </tr>
  );
}
