"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Camera, CameraOff, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { Scanner as QRScanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { validateQR, type ValidationResult } from "@/server/actions/validations";
import { Button } from "@/components/ui/button";

type Feedback =
  | { state: "idle" }
  | { state: "scanning" }
  | { state: "ok"; attendee: string | null; kind: string; at: number }
  | { state: "error"; reason: string; at: number };

const REASON_TEXT: Record<string, string> = {
  invalid: "QR inválido o sin permisos",
  wrong_event: "Entrada de otro evento",
  duplicate: "Ya fue validada antes",
  cancelled: "Entrada cancelada o reembolsada",
};

export function Scanner({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [active, setActive] = useState(true);
  const [feedback, setFeedback] = useState<Feedback>({ state: "idle" });
  const [pending, startTransition] = useTransition();
  const lastScanRef = useRef<{ qr: string; at: number } | null>(null);

  const handleResult = useCallback(
    (qr: string) => {
      // Debounce: ignora el mismo QR durante 2s
      const now = Date.now();
      if (lastScanRef.current && lastScanRef.current.qr === qr && now - lastScanRef.current.at < 2000) {
        return;
      }
      lastScanRef.current = { qr, at: now };

      setFeedback({ state: "scanning" });
      startTransition(async () => {
        try {
          const res: ValidationResult = await validateQR(qr, eventId);
          if (res.ok) {
            setFeedback({
              state: "ok",
              attendee: res.ticket.attendee,
              kind: res.ticket.kind,
              at: Date.now(),
            });
            // Vibración si está disponible
            navigator.vibrate?.(80);
          } else {
            setFeedback({
              state: "error",
              reason: REASON_TEXT[res.reason] ?? res.reason,
              at: Date.now(),
            });
            navigator.vibrate?.([60, 80, 60]);
          }
          router.refresh();
        } catch (err) {
          setFeedback({
            state: "error",
            reason: err instanceof Error ? err.message : "Error inesperado",
            at: Date.now(),
          });
        }
      });
    },
    [eventId, router],
  );

  function onDetect(detected: IDetectedBarcode[]) {
    if (detected.length === 0) return;
    handleResult(detected[0].rawValue);
  }

  // Auto-volver a "idle" tras 3 segundos para no ocupar la cámara
  useEffect(() => {
    if (feedback.state === "ok" || feedback.state === "error") {
      const t = window.setTimeout(() => {
        setFeedback({ state: "idle" });
      }, 3000);
      return () => window.clearTimeout(t);
    }
  }, [feedback]);

  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-black">
        {active ? (
          <QRScanner
            onScan={onDetect}
            constraints={{ facingMode: "environment" }}
            styles={{ container: { width: "100%", height: "100%" } }}
            scanDelay={400}
            allowMultiple={false}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <CameraOff className="size-10" />
          </div>
        )}

        {/* Overlay feedback */}
        {feedback.state !== "idle" && feedback.state !== "scanning" && (
          <div
            className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm ${
              feedback.state === "ok"
                ? "bg-accent/40"
                : "bg-destructive/40"
            }`}
          >
            <div className="rounded-2xl bg-card border border-border p-6 text-center shadow-lg max-w-xs">
              {feedback.state === "ok" ? (
                <>
                  <CheckCircle2 className="size-12 text-accent-foreground mx-auto" />
                  <p className="mt-3 font-display text-2xl font-bold">¡Válida!</p>
                  {feedback.attendee && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {feedback.attendee}
                    </p>
                  )}
                  <p className="mt-0.5 text-xs uppercase tracking-widest text-muted-foreground">
                    {feedback.kind}
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="size-12 text-destructive mx-auto" />
                  <p className="mt-3 font-display text-xl font-bold">Rechazada</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {feedback.reason}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
        {feedback.state === "scanning" && (
          <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-background/80 backdrop-blur px-3 py-1.5 text-center text-xs">
            Validando…
          </div>
        )}
      </div>

      <div className="mt-3 flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActive((a) => !a)}
          disabled={pending}
        >
          {active ? <CameraOff className="size-4" /> : <Camera className="size-4" />}
          {active ? "Pausar" : "Reanudar"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            lastScanRef.current = null;
            setFeedback({ state: "idle" });
          }}
        >
          <RotateCcw className="size-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
