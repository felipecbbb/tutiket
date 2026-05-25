import * as React from "react";
import { cn } from "@/lib/utils";

type SeparatorProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
  label?: string;
};

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = "horizontal", label, ...props }, ref) => {
    if (label) {
      return (
        <div
          ref={ref}
          role="separator"
          className={cn("flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground", className)}
          {...props}
        >
          <div className="h-px flex-1 bg-border" />
          <span>{label}</span>
          <div className="h-px flex-1 bg-border" />
        </div>
      );
    }
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          "bg-border shrink-0",
          orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
          className,
        )}
        {...props}
      />
    );
  },
);
Separator.displayName = "Separator";

export { Separator };
