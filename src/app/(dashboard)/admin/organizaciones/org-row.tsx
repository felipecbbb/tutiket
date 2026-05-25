"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  adminDeleteOrg,
  adminUpdateOrgStatus,
} from "@/server/actions/admin";

type OrgStatus = "pending" | "verified" | "rejected";
const STATUSES: OrgStatus[] = ["pending", "verified", "rejected"];

type Props = {
  org: {
    id: string;
    name: string;
    slug: string;
    sector: string;
    location: string;
    status: OrgStatus;
    createdAt: string;
  };
};

export function OrgRow({ org }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<OrgStatus>(org.status);
  const [pending, startTransition] = useTransition();

  function change(next: OrgStatus) {
    setStatus(next);
    startTransition(async () => {
      try {
        await adminUpdateOrgStatus(org.id, next);
        toast.success(`Estado → ${next}`);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error");
        setStatus(org.status);
      }
    });
  }

  function handleDelete() {
    if (!confirm(`¿Eliminar "${org.name}"?`)) return;
    startTransition(async () => {
      try {
        await adminDeleteOrg(org.id);
        toast.success("Eliminada");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error");
      }
    });
  }

  return (
    <tr className="border-t border-border hover:bg-muted/30">
      <td className="px-4 py-3">
        <div className="font-medium">{org.name}</div>
        <div className="text-xs text-muted-foreground">{org.slug}</div>
      </td>
      <td className="px-4 py-3 capitalize text-muted-foreground">
        {org.sector.replace("_", " ")}
      </td>
      <td className="px-4 py-3 text-muted-foreground">{org.location}</td>
      <td className="px-4 py-3">
        <select
          value={status}
          disabled={pending}
          onChange={(e) => change(e.target.value as OrgStatus)}
          className="h-8 rounded-md border border-border bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{org.createdAt}</td>
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
