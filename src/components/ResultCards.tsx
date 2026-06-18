import type { SimulationResult } from "@/lib/types";
import { formatEur, formatPct } from "@/lib/format";

export function ResultCards({ result }: { result: SimulationResult }) {
  const positive = result.profit >= 0;
  const accent = positive ? "var(--gain)" : "var(--loss)";

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Card label="Total investi" value={formatEur(result.totalInvested)} />
      <Card label="Valeur finale" value={formatEur(result.finalValue)} />
      <Card
        label="Plus / moins-value"
        value={formatEur(result.profit)}
        sub={formatPct(result.roiPct)}
        color={accent}
      />
    </div>
  );
}

function Card({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="card-glass p-4">
      <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
      <div
        className="mt-1 text-2xl font-semibold tabular-nums"
        style={color ? { color } : undefined}
      >
        {value}
      </div>
      {sub && (
        <div className="mt-0.5 text-sm font-medium tabular-nums" style={{ color }}>
          {sub}
        </div>
      )}
    </div>
  );
}
