import Link from "next/link";
import { ArrowDown, ArrowUp, Gift, Sparkles } from "lucide-react";
import {
  getMyPoints,
  listAvailableRewards,
  listMyLoyaltyTransactions,
} from "@/server/actions/loyalty";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RedeemButton } from "./redeem-button";

export const dynamic = "force-dynamic";

export default async function MyPointsPage() {
  const [points, txs, available] = await Promise.all([
    getMyPoints(),
    listMyLoyaltyTransactions(50),
    listAvailableRewards(),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/mi" className="text-sm text-muted-foreground hover:text-foreground">
        ← Mi cuenta
      </Link>
      <p className="mt-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
        · Twinpoints ·
      </p>
      <h1 className="mt-1 font-display text-4xl font-bold tracking-tight md:text-5xl">
        Tu fidelidad
      </h1>

      <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-6">
        <div className="flex items-center gap-3">
          <Sparkles className="size-6 text-primary" />
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Puntos disponibles
            </p>
            <p className="font-display text-4xl font-bold tabular-nums">
              {points.toLocaleString("es-ES")}
            </p>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
          <Gift className="size-5" />
          Premios disponibles
        </h2>
        {available.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center text-sm text-muted-foreground">
            Aún no hay premios disponibles. Vuelve más tarde.
          </div>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {available.map((r) => (
              <li key={r.id}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{r.name}</CardTitle>
                    <CardDescription>
                      {r.description ?? "Sin descripción"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-display text-2xl font-bold text-primary">
                          {r.costPoints.toLocaleString("es-ES")}
                        </p>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">
                          puntos
                        </p>
                      </div>
                      <RedeemButton
                        rewardId={r.id}
                        disabled={
                          points < r.costPoints ||
                          (r.stock !== null && r.redeemed >= r.stock)
                        }
                        label={
                          r.stock !== null && r.redeemed >= r.stock
                            ? "Agotado"
                            : points < r.costPoints
                              ? "Te faltan puntos"
                              : "Canjear"
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold mb-4">Movimientos recientes</h2>
        {txs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-4 text-sm text-muted-foreground">
            Aún sin movimientos. Acumula puntos comprando entradas.
          </div>
        ) : (
          <ul className="divide-y divide-border rounded-xl border border-border bg-card">
            {txs.map((tx) => {
              const positive = tx.type === "earn" || tx.type === "adjust";
              return (
                <li
                  key={tx.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid size-8 place-items-center rounded-full ${
                        positive
                          ? "bg-accent/30 text-accent-foreground"
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      {positive ? (
                        <ArrowUp className="size-4" />
                      ) : (
                        <ArrowDown className="size-4" />
                      )}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{tx.reason}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(tx.createdAt, {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-display tabular-nums font-bold ${
                      positive ? "text-accent-foreground" : "text-primary"
                    }`}
                  >
                    {positive ? "+" : "−"}
                    {tx.points.toLocaleString("es-ES")}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
