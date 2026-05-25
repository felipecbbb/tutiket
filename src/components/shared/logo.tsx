import { cn } from "@/lib/utils";

/**
 * Logo Noa Events.
 *
 * Variantes:
 * - "mark"  → solo el cuadrado "noa" (cuando hay poco espacio)
 * - "full"  → cuadrado "noa" + texto "events"
 * - "wordmark" → texto "noa events" en línea (para emails)
 *
 * Mantiene la identidad Noa (DM Sans bold minúscula sobre cuadrado oscuro)
 * y añade "events" como sub-producto.
 */
type LogoProps = {
  variant?: "mark" | "full" | "wordmark";
  className?: string;
  size?: "sm" | "md" | "lg";
};

const SIZE_MAP = {
  sm: { mark: "size-7 text-[11px]", text: "text-sm" },
  md: { mark: "size-9 text-sm", text: "text-base" },
  lg: { mark: "size-12 text-lg", text: "text-xl" },
};

export function Logo({ variant = "full", className, size = "md" }: LogoProps) {
  const s = SIZE_MAP[size];

  if (variant === "wordmark") {
    return (
      <span
        className={cn(
          "inline-flex items-baseline gap-1 font-sans font-bold tracking-tight",
          s.text,
          className,
        )}
      >
        <span>noa</span>
        <span className="font-normal text-muted-foreground">events</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-sans tracking-tight",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "inline-flex items-center justify-center rounded-xl bg-foreground font-bold leading-none text-background lowercase",
          s.mark,
        )}
      >
        noa
      </span>
      {variant === "full" && (
        <span
          className={cn(
            "font-medium text-foreground/80 lowercase tracking-tight",
            s.text,
          )}
        >
          events
        </span>
      )}
    </span>
  );
}
