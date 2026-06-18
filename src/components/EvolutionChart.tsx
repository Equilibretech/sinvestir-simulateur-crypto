"use client";

import {
  Area,
  ComposedChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { downsample } from "@/lib/series";
import { formatEur, formatDateFr } from "@/lib/format";

export interface ChartLine {
  key: string;
  name: string;
  color: string;
  kind: "area" | "line";
  dashed?: boolean;
}

export function EvolutionChart({
  data,
  lines,
  title = "Évolution du portefeuille",
}: {
  data: Record<string, string | number>[];
  lines: ChartLine[];
  title?: string;
}) {
  const points = downsample(data, 180);

  return (
    <div className="card-glass p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
          {lines.map((l) => (
            <span key={l.key} className="flex items-center gap-1.5">
              <span
                className="inline-block"
                style={
                  l.kind === "area"
                    ? { width: 12, height: 8, borderRadius: 2, background: l.color }
                    : { width: 12, height: 2, background: l.color }
                }
              />
              {l.name}
            </span>
          ))}
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={points} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <defs>
              {lines
                .filter((l) => l.kind === "area")
                .map((l) => (
                  <linearGradient key={l.key} id={`fill-${l.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={l.color} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={l.color} stopOpacity={0} />
                  </linearGradient>
                ))}
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
            {lines.map((l) =>
              l.kind === "area" ? (
                <Area
                  key={l.key}
                  type="monotone"
                  dataKey={l.key}
                  name={l.name}
                  stroke={l.color}
                  strokeWidth={2}
                  fill={`url(#fill-${l.key})`}
                  isAnimationActive={false}
                />
              ) : (
                <Line
                  key={l.key}
                  type="monotone"
                  dataKey={l.key}
                  name={l.name}
                  stroke={l.color}
                  strokeWidth={1.8}
                  strokeDasharray={l.dashed ? "4 3" : undefined}
                  dot={false}
                  isAnimationActive={false}
                />
              ),
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
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
