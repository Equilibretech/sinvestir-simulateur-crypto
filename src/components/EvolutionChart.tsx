"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SeriesPoint } from "@/lib/types";
import { formatEur, formatDateFr } from "@/lib/format";

export function EvolutionChart({ series }: { series: SeriesPoint[] }) {
  return (
    <div className="card-glass p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Évolution du portefeuille</h3>
        <Legend />
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="valueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              tickFormatter={(d: string) => d.slice(2, 7)}
              minTickGap={32}
              stroke="#1e293b"
            />
            <YAxis
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
              width={42}
              stroke="#1e293b"
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              name="Valeur"
              stroke="var(--brand)"
              strokeWidth={2}
              fill="url(#valueFill)"
            />
            <Line
              type="monotone"
              dataKey="invested"
              name="Investi"
              stroke="var(--gold)"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-4 text-xs text-muted">
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-3 rounded-sm" style={{ background: "var(--brand)" }} />
        Valeur
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-0.5 w-3" style={{ background: "var(--gold)" }} />
        Investi
      </span>
    </div>
  );
}

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card-glass px-3 py-2 text-xs">
      <div className="mb-1 font-medium">{label ? formatDateFr(label) : ""}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 tabular-nums">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted">{p.name}</span>
          <span className="ml-auto font-medium">{formatEur(p.value)}</span>
        </div>
      ))}
    </div>
  );
}
