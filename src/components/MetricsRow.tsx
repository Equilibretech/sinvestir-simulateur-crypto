import type { SimulationResult } from "@/lib/types";
import { formatEur, formatPct } from "@/lib/format";

export function MetricsRow({ result }: { result: SimulationResult }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Metric label="Prix d'achat moyen" value={formatEur(result.avgEntryPrice)} />
      <Metric label="Prix de sortie" value={formatEur(result.lastPrice)} />
      <Metric
        label="Perf. annualisée"
        value={formatPct(result.annualizedPct)}
        color={result.annualizedPct >= 0 ? "var(--gain)" : "var(--loss)"}
      />
      <Metric
        label="Repli max (drawdown)"
        value={`-${result.maxDrawdownPct.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} %`}
        color="var(--loss)"
      />
    </div>
  );
}

function Metric({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="card-glass p-3">
      <div className="text-[11px] uppercase tracking-wide text-muted">{label}</div>
      <div
        className="mt-1 text-base font-semibold tabular-nums"
        style={color ? { color } : undefined}
      >
        {value}
      </div>
    </div>
  );
}
