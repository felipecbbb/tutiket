import Link from "next/link";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";

type EventCardProps = {
  slug: string;
  name: string;
  location: string;
  category: string;
  startDate: Date | string;
  bannerUrl?: string | null;
  thumbnailUrl?: string | null;
  capacity: number;
  ticketsSold: number;
};

export function EventCard({
  slug,
  name,
  location,
  category,
  startDate,
  bannerUrl,
  thumbnailUrl,
  capacity,
  ticketsSold,
}: EventCardProps) {
  const cover = bannerUrl ?? thumbnailUrl ?? null;
  const ratio = capacity > 0 ? Math.min(100, Math.round((ticketsSold / capacity) * 100)) : 0;
  const soldOut = capacity > 0 && ticketsSold >= capacity;

  return (
    <Link
      href={`/eventos/${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="size-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
        )}
        <span className="absolute top-3 left-3 rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest backdrop-blur">
          {category}
        </span>
        {soldOut && (
          <span className="absolute top-3 right-3 rounded-full bg-destructive px-2.5 py-1 text-[10px] font-bold uppercase text-destructive-foreground">
            Agotado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <h3 className="font-display text-xl font-bold leading-tight tracking-tight group-hover:text-primary">
          {name}
        </h3>
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {formatDate(startDate, { weekday: "short", day: "2-digit", month: "short" })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            <span className="truncate">{location}</span>
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${ratio}%` }}
            />
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground/70 transition-colors group-hover:text-primary">
            Ver
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
