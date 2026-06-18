import type { SimulationResult } from "@/lib/types";
import { formatEur, formatPct } from "@/lib/format";

export function ComparisonView({
  dca,
  lump,
}: {
  dca: SimulationResult;
  lump: SimulationResult;
}) {
  const dcaWins = dca.finalValue >= lump.finalValue;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <StrategyCard
          title="DCA mensuel"
          accent="var(--brand)"
          result={dca}
          winner={dcaWins}
        />
        <StrategyCard
          title="Apport unique"
          accent="var(--gold)"
          result={lump}
          winner={!dcaWins}
        />
      </div>
      <p className="rounded-md border border-border bg-surface-soft/40 px-3 py-2 text-center text-xs text-muted">
        À capital égal investi ({formatEur(dca.totalInvested)}), la stratégie{" "}
        <strong style={{ color: dcaWins ? "var(--brand)" : "var(--gold)" }}>
          {dcaWins ? "DCA mensuel" : "apport unique"}
        </strong>{" "}
        aurait mieux performé sur cette période (
        {formatEur(Math.abs(dca.finalValue - lump.finalValue))} d&apos;écart).
      </p>
    </div>
  );
}

function StrategyCard({
  title,
  accent,
  result,
  winner,
}: {
  title: string;
  accent: string;
  result: SimulationResult;
  winner: boolean;
}) {
  const positive = result.profit >= 0;
  return (
    <div
      className="card-glass p-4"
      style={winner ? { borderColor: accent } : undefined}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
          {title}
        </span>
        {winner && (
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-background"
            style={{ background: accent }}
          >
            Gagnant
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1.5 text-sm tabular-nums">
        <Row label="Investi" value={formatEur(result.totalInvested)} />
        <Row label="Valeur finale" value={formatEur(result.finalValue)} strong />
        <Row
          label="Plus / moins-value"
          value={`${formatEur(result.profit)} (${formatPct(result.roiPct)})`}
          color={positive ? "var(--gain)" : "var(--loss)"}
        />
        <Row
          label="Perf. annualisée"
          value={formatPct(result.annualizedPct)}
          color={result.annualizedPct >= 0 ? "var(--gain)" : "var(--loss)"}
        />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  color,
  strong,
}: {
  label: string;
  value: string;
  color?: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted">{label}</span>
      <span
        className={strong ? "font-semibold" : "font-medium"}
        style={color ? { color } : undefined}
      >
        {value}
      </span>
    </div>
  );
}
