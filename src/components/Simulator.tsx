"use client";

import { useEffect, useMemo, useState } from "react";
import { COINS, getCoin } from "@/lib/coins";
import { simulate } from "@/lib/simulate";
import type { Frequency, PricePoint, SimulationInput } from "@/lib/types";
import { ResultCards } from "./ResultCards";
import { EvolutionChart } from "./EvolutionChart";
import { AiExplanation } from "./AiExplanation";

const PRESETS: { label: string; years: number | "max" }[] = [
  { label: "1 an", years: 1 },
  { label: "3 ans", years: 3 },
  { label: "5 ans", years: 5 },
  { label: "Max", years: "max" },
];

/**
 * Composant autonome et embarquable.
 * Aucune dépendance à un état global : il peut être déposé tel quel dans
 * simulateurs.sinvestir.fr ou embarqué en iframe depuis sinvestir.fr.
 */
export function Simulator() {
  const [coinId, setCoinId] = useState("bitcoin");
  // Le montant est stocké en texte pour permettre l'effacement du champ.
  const [amountText, setAmountText] = useState("1000");
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [prices, setPrices] = useState<PricePoint[]>([]);
  const [source, setSource] = useState<"live" | "snapshot" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const amount = Math.max(0, Number(amountText.replace(",", ".")) || 0);

  // Charge les prix à chaque changement de crypto.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/prices?coin=${coinId}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const pts: PricePoint[] = data.prices ?? [];
        setPrices(pts);
        setSource(data.source ?? null);
        if (pts.length > 0) {
          const min = pts[0].date;
          const max = pts[pts.length - 1].date;
          // Période par défaut : 3 dernières années (ou tout l'historique si plus court).
          setEndDate(max);
          setStartDate(maxIso(subYears(max, 3), min));
        }
      })
      .catch(() => !cancelled && setError("Chargement des prix impossible."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [coinId]);

  const bounds = useMemo(
    () =>
      prices.length > 0
        ? { min: prices[0].date, max: prices[prices.length - 1].date }
        : { min: "", max: "" },
    [prices],
  );

  const input: SimulationInput = { coinId, amount, frequency, startDate, endDate };

  const result = useMemo(() => {
    if (prices.length === 0 || !startDate || !endDate || amount <= 0) return null;
    if (startDate > endDate) return null;
    try {
      return simulate(input, prices);
    } catch {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prices, coinId, amount, frequency, startDate, endDate]);

  function applyPreset(years: number | "max") {
    if (!bounds.max) return;
    setEndDate(bounds.max);
    setStartDate(years === "max" ? bounds.min : maxIso(subYears(bounds.max, years), bounds.min));
  }

  const coin = getCoin(coinId)!;
  const invalidRange = Boolean(startDate && endDate && startDate > endDate);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[340px_1fr]">
      {/* Panneau de configuration */}
      <form className="card-glass h-fit space-y-4 p-5" onSubmit={(e) => e.preventDefault()}>
        <Field label="Cryptomonnaie">
          <select
            className="field w-full px-3 py-2 text-sm"
            value={coinId}
            onChange={(e) => setCoinId(e.target.value)}
          >
            {COINS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.symbol})
              </option>
            ))}
          </select>
        </Field>

        <Field label="Stratégie">
          <div className="grid grid-cols-2 gap-2">
            <Segment active={frequency === "lump"} onClick={() => setFrequency("lump")}>
              Apport unique
            </Segment>
            <Segment
              active={frequency === "monthly"}
              onClick={() => setFrequency("monthly")}
            >
              DCA mensuel
            </Segment>
          </div>
        </Field>

        <Field
          label={frequency === "lump" ? "Montant investi (€)" : "Montant par mois (€)"}
        >
          <input
            type="text"
            inputMode="decimal"
            placeholder="1000"
            className="field w-full px-3 py-2 text-sm tabular-nums"
            value={amountText}
            onChange={(e) => setAmountText(e.target.value.replace(/[^\d.,]/g, ""))}
          />
        </Field>

        <Field label="Période">
          <div className="grid grid-cols-4 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p.years)}
                className="rounded-md border border-border px-2 py-1.5 text-xs font-medium text-muted transition hover:border-brand hover:text-foreground"
              >
                {p.label}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Début">
            <input
              type="date"
              className="field w-full px-3 py-2 text-sm"
              value={startDate}
              min={bounds.min}
              max={endDate || bounds.max}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Field>
          <Field label="Fin">
            <input
              type="date"
              className="field w-full px-3 py-2 text-sm"
              value={endDate}
              min={startDate || bounds.min}
              max={bounds.max}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Field>
        </div>

        {invalidRange && (
          <p className="text-xs" style={{ color: "var(--loss)" }}>
            La date de début doit précéder la date de fin.
          </p>
        )}

        <p className="text-[11px] leading-relaxed text-muted">
          Données :{" "}
          {source === "live" ? (
            <span style={{ color: "var(--gain)" }}>Binance (live)</span>
          ) : source === "snapshot" ? (
            <span style={{ color: "var(--gold)" }}>snapshot local (fallback)</span>
          ) : (
            "…"
          )}
          {bounds.min && ` · historique depuis ${bounds.min}`}
        </p>
      </form>

      {/* Résultats */}
      <div className="space-y-4">
        {error && (
          <div className="card-glass p-4 text-sm" style={{ color: "var(--loss)" }}>
            {error}
          </div>
        )}

        {loading && !result && (
          <div className="card-glass p-8 text-center text-sm text-muted">
            Chargement des données {coin.name}…
          </div>
        )}

        {!loading && !result && !error && (
          <div className="card-glass p-8 text-center text-sm text-muted">
            {amount <= 0
              ? "Saisissez un montant pour lancer la simulation."
              : "Ajustez la période pour voir un résultat."}
          </div>
        )}

        {result && (
          <>
            <div className="flex items-center justify-between text-xs text-muted">
              <span>
                {result.contributions} versement{result.contributions > 1 ? "s" : ""}
              </span>
              <span>
                {frequency === "monthly" ? "DCA mensuel" : "Apport unique"} ·{" "}
                {coin.name}
              </span>
            </div>
            <ResultCards result={result} />
            <EvolutionChart series={result.series} />
            <AiExplanation input={input} result={result} coinName={coin.name} />
            <p className="text-center text-[11px] text-muted">
              Simulation rétrospective sur données historiques. Les performances passées
              ne préjugent pas des performances futures.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/** Soustrait n années à une date ISO (YYYY-MM-DD). */
function subYears(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y - n}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Renvoie la plus grande des deux dates ISO. */
function maxIso(a: string, b: string): string {
  return a >= b ? a : b;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

function Segment({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border px-3 py-2 text-sm font-medium transition"
      style={{
        borderColor: active ? "var(--brand)" : "var(--border)",
        background: active ? "rgba(16,152,247,0.12)" : "transparent",
        color: active ? "var(--foreground)" : "var(--text-muted)",
      }}
    >
      {children}
    </button>
  );
}
