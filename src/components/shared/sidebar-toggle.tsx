"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export function SidebarToggle({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger mobile */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        className="lg:hidden inline-flex size-9 items-center justify-center rounded-md border border-border bg-card hover:bg-muted"
      >
        <Menu className="size-4" />
      </button>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-card shadow-xl overflow-y-auto">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-md hover:bg-muted"
            >
              <X className="size-4" />
            </button>
            <div onClick={() => setOpen(false)}>{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
