import { cn } from "@/lib/utils";

/**
 * Logo Noa Events.
 * Marca: cuadrado oscuro con "noa" + pequeño punto de color (sticker
 * decorativo, herencia del "smiley" de la familia Noa).
 */
type LogoProps = {
  variant?: "mark" | "full" | "wordmark";
  className?: string;
  size?: "sm" | "md" | "lg";
};

const SIZE = {
  sm: { mark: "size-7 text-[11px]", text: "text-sm", dot: "size-1.5 -right-0.5 -top-0.5" },
  md: { mark: "size-9 text-sm", text: "text-base", dot: "size-2 -right-0.5 -top-0.5" },
  lg: { mark: "size-12 text-lg", text: "text-xl", dot: "size-2.5 -right-1 -top-1" },
};

export function Logo({ variant = "full", className, size = "md" }: LogoProps) {
  const s = SIZE[size];

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
    <span className={cn("inline-flex items-center gap-2 font-sans tracking-tight", className)}>
      <span className="relative inline-block">
        <span
          aria-hidden
          className={cn(
            "inline-flex items-center justify-center rounded-xl bg-foreground font-bold leading-none text-background lowercase",
            s.mark,
          )}
        >
          noa
        </span>
        <span
          aria-hidden
          className={cn(
            "absolute rounded-full bg-[#FF6B5B] ring-2 ring-background",
            s.dot,
          )}
        />
      </span>
      {variant === "full" && (
        <span className={cn("font-medium text-foreground/80 lowercase tracking-tight", s.text)}>
          events
        </span>
      )}
    </span>
  );
}
