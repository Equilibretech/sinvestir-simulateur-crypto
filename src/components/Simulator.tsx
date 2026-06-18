"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COINS, getCoin } from "@/lib/coins";
import { simulate } from "@/lib/simulate";
import type { PricePoint, SimulationInput, SimulationResult } from "@/lib/types";
import { ResultCards } from "./ResultCards";
import { MetricsRow } from "./MetricsRow";
import { ComparisonView } from "./ComparisonView";
import { EvolutionChart, type ChartLine } from "./EvolutionChart";
import { AiExplanation } from "./AiExplanation";

type Strategy = "lump" | "monthly" | "compare";

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
  const [strategy, setStrategy] = useState<Strategy>("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [prices, setPrices] = useState<PricePoint[]>([]);
  const [source, setSource] = useState<"live" | "snapshot" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const amount = Math.max(0, Number(amountText.replace(",", ".")) || 0);

  // Miroirs de l'état pour lecture "fraîche" dans l'effet de chargement.
  const startRef = useRef(startDate);
  startRef.current = startDate;
  const endRef = useRef(endDate);
  endRef.current = endDate;
  // Dates souhaitées issues d'un lien partagé, appliquées au 1er chargement.
  const desiredDates = useRef<{ start?: string; end?: string }>({});

  // Lecture des paramètres d'URL au montage (scénario partagé).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("coin") && getCoin(p.get("coin")!)) setCoinId(p.get("coin")!);
    if (p.get("amt")) setAmountText(p.get("amt")!);
    const f = p.get("freq");
    if (f === "lump" || f === "monthly" || f === "compare") setStrategy(f);
    desiredDates.current = {
      start: p.get("start") ?? undefined,
      end: p.get("end") ?? undefined,
    };
  }, []);

  // Charge les prix à chaque changement de crypto, puis cale les dates aux bornes.
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
          // Priorité aux dates d'un lien partagé (1er chargement), sinon état courant.
          const want = desiredDates.current;
          desiredDates.current = {};
          const wantEnd = want.end ?? endRef.current;
          const end = wantEnd && wantEnd >= min && wantEnd <= max ? wantEnd : max;
          const wantStart = want.start ?? startRef.current;
          const start =
            wantStart && wantStart >= min && wantStart <= end
              ? wantStart
              : maxIso(subYears(end, 3), min);
          setEndDate(end);
          setStartDate(start);
        }
      })
      .catch(() => !cancelled && setError("Chargement des prix impossible."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinId]);

  // Synchronise l'URL avec l'état (scénario partageable) sans recharger.
  useEffect(() => {
    if (!startDate || !endDate) return;
    const p = new URLSearchParams({
      coin: coinId,
      amt: amountText,
      freq: strategy,
      start: startDate,
      end: endDate,
    });
    window.history.replaceState(null, "", `?${p.toString()}`);
  }, [coinId, amountText, strategy, startDate, endDate]);

  const bounds = useMemo(
    () =>
      prices.length > 0
        ? { min: prices[0].date, max: prices[prices.length - 1].date }
        : { min: "", max: "" },
    [prices],
  );

  // Calcul : résultat simple (lump/monthly) ou paire de résultats (compare).
  const { single, compare } = useMemo<{
    single: SimulationResult | null;
    compare: { dca: SimulationResult; lump: SimulationResult } | null;
  }>(() => {
    if (prices.length === 0 || !startDate || !endDate || amount <= 0)
      return { single: null, compare: null };
    if (startDate > endDate) return { single: null, compare: null };
    const base = { coinId, amount, startDate, endDate };
    try {
      if (strategy === "compare") {
        const dca = simulate({ ...base, frequency: "monthly" }, prices);
        // L'apport unique investit le MÊME capital total, en une fois à J0.
        const lump = simulate(
          { ...base, amount: dca.totalInvested, frequency: "lump" },
          prices,
        );
        return { single: null, compare: { dca, lump } };
      }
      return {
        single: simulate({ ...base, frequency: strategy }, prices),
        compare: null,
      };
    } catch {
      return { single: null, compare: null };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prices, coinId, amount, strategy, startDate, endDate]);

  const activePreset = useMemo(() => {
    if (!bounds.max || endDate !== bounds.max) return null;
    for (const p of PRESETS) {
      const s =
        p.years === "max"
          ? bounds.min
          : maxIso(subYears(bounds.max, p.years), bounds.min);
      if (s === startDate) return p.label;
    }
    return null;
  }, [startDate, endDate, bounds]);

  function applyPreset(years: number | "max") {
    if (!bounds.max) return;
    setEndDate(bounds.max);
    setStartDate(
      years === "max" ? bounds.min : maxIso(subYears(bounds.max, years), bounds.min),
    );
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard indisponible */
    }
  }

  const coin = getCoin(coinId)!;
  const invalidRange = Boolean(startDate && endDate && startDate > endDate);
  const hasResult = Boolean(single || compare);

  // Données + courbes du graphe selon le mode.
  const chart = useMemo<{ data: Record<string, string | number>[]; lines: ChartLine[] }>(() => {
    if (single) {
      return {
        data: single.series.map((p) => ({
          date: p.date,
          value: p.value,
          invested: p.invested,
        })),
        lines: [
          { key: "value", name: "Valeur", color: "var(--brand)", kind: "area" },
          { key: "invested", name: "Investi", color: "var(--gold)", kind: "line", dashed: true },
        ],
      };
    }
    if (compare) {
      return {
        data: compare.dca.series.map((p, i) => ({
          date: p.date,
          dca: p.value,
          lump: compare.lump.series[i]?.value ?? 0,
        })),
        lines: [
          { key: "dca", name: "DCA mensuel", color: "var(--brand)", kind: "area" },
          { key: "lump", name: "Apport unique", color: "var(--gold)", kind: "line" },
        ],
      };
    }
    return { data: [], lines: [] };
  }, [single, compare]);

  const aiInput: SimulationInput = {
    coinId,
    amount,
    frequency: strategy === "compare" ? "monthly" : strategy,
    startDate,
    endDate,
  };

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
          <div className="grid grid-cols-3 gap-2">
            <Segment active={strategy === "lump"} onClick={() => setStrategy("lump")}>
              Apport unique
            </Segment>
            <Segment active={strategy === "monthly"} onClick={() => setStrategy("monthly")}>
              DCA mensuel
            </Segment>
            <Segment active={strategy === "compare"} onClick={() => setStrategy("compare")}>
              Comparer
            </Segment>
          </div>
        </Field>

        <Field label={strategy === "lump" ? "Montant investi (€)" : "Montant par mois (€)"}>
          <input
            type="text"
            inputMode="decimal"
            placeholder="1000"
            className="field w-full px-3 py-2 text-sm tabular-nums"
            value={amountText}
            onChange={(e) => setAmountText(e.target.value.replace(/[^\d.,]/g, ""))}
          />
          {strategy === "compare" && (
            <span className="mt-1 block text-[11px] text-muted">
              L&apos;apport unique investit le même total à la première date.
            </span>
          )}
        </Field>

        <Field label="Période">
          <div className="grid grid-cols-4 gap-2">
            {PRESETS.map((p) => {
              const active = activePreset === p.label;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p.years)}
                  aria-pressed={active}
                  className="rounded-md border px-2 py-1.5 text-xs font-medium transition"
                  style={{
                    borderColor: active ? "var(--brand)" : "var(--border)",
                    background: active ? "rgba(16,152,247,0.12)" : "transparent",
                    color: active ? "var(--foreground)" : "var(--text-muted)",
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Début">
            <input
              type="date"
              className="field w-full min-w-0 px-3 py-2 text-sm"
              value={startDate}
              min={bounds.min}
              max={endDate || bounds.max}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Field>
          <Field label="Fin">
            <input
              type="date"
              className="field w-full min-w-0 px-3 py-2 text-sm"
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

        <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-3">
          <span className="text-[11px] leading-relaxed text-muted">
            Données :{" "}
            {source === "live" ? (
              <span style={{ color: "var(--gain)" }}>Binance (live)</span>
            ) : source === "snapshot" ? (
              <span style={{ color: "var(--gold)" }}>snapshot (fallback)</span>
            ) : (
              "…"
            )}
          </span>
          <button
            type="button"
            onClick={copyLink}
            className="shrink-0 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted transition hover:border-brand hover:text-foreground"
          >
            {copied ? "Lien copié ✓" : "Copier le lien"}
          </button>
        </div>
      </form>

      {/* Résultats */}
      <div className="space-y-4">
        {error && (
          <div className="card-glass p-4 text-sm" style={{ color: "var(--loss)" }}>
            {error}
          </div>
        )}

        {loading && !hasResult && (
          <div className="card-glass p-8 text-center text-sm text-muted">
            Chargement des données {coin.name}…
          </div>
        )}

        {!loading && !hasResult && !error && (
          <div className="card-glass p-8 text-center text-sm text-muted">
            {amount <= 0
              ? "Saisissez un montant pour lancer la simulation."
              : "Ajustez la période pour voir un résultat."}
          </div>
        )}

        {single && (
          <>
            <div className="flex items-center justify-between text-xs text-muted">
              <span>
                {single.contributions} versement{single.contributions > 1 ? "s" : ""}
              </span>
              <span>
                {strategy === "monthly" ? "DCA mensuel" : "Apport unique"} · {coin.name}
              </span>
            </div>
            <ResultCards result={single} />
            <MetricsRow result={single} />
            <EvolutionChart data={chart.data} lines={chart.lines} />
            <AiExplanation input={aiInput} result={single} coinName={coin.name} />
          </>
        )}

        {compare && (
          <>
            <div className="flex items-center justify-between text-xs text-muted">
              <span>{compare.dca.contributions} versements (DCA)</span>
              <span>Comparaison · {coin.name}</span>
            </div>
            <ComparisonView dca={compare.dca} lump={compare.lump} />
            <EvolutionChart
              data={chart.data}
              lines={chart.lines}
              title="DCA vs apport unique"
            />
          </>
        )}

        {hasResult && (
          <p className="text-center text-[11px] text-muted">
            Simulation rétrospective sur données historiques. Les performances passées ne
            préjugent pas des performances futures.
          </p>
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
      className="rounded-md border px-2 py-2 text-xs font-medium transition"
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
