"use client";

import { useState } from "react";
import type { SimulationInput, SimulationResult } from "@/lib/types";

export function AiExplanation({
  input,
  result,
  coinName,
}: {
  input: SimulationInput;
  result: SimulationResult;
  coinName: string;
}) {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"ai" | "template" | null>(null);

  async function explain() {
    setLoading(true);
    setText("");
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, result, coinName }),
      });
      const data = await res.json();
      setText(data.explanation ?? "");
      setSource(data.source ?? null);
    } catch {
      setText("Impossible de générer l'explication pour le moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card-glass p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <span aria-hidden>✨</span> Analyse IA
        </h3>
        <button
          onClick={explain}
          disabled={loading}
          className="rounded-md px-3 py-1.5 text-xs font-medium text-background transition disabled:opacity-50"
          style={{ background: "var(--brand)" }}
        >
          {loading ? "Analyse…" : text ? "Régénérer" : "Expliquer ce résultat"}
        </button>
      </div>

      {text ? (
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">
          {text}
        </p>
      ) : (
        !loading && (
          <p className="mt-3 text-sm text-muted">
            Obtenez une lecture en langage naturel de votre simulation.
          </p>
        )
      )}

      {source === "template" && text && (
        <p className="mt-2 text-[11px] text-muted/70">
          Mode hors-ligne (clé IA non configurée) — explication générée localement.
        </p>
      )}
    </div>
  );
}
