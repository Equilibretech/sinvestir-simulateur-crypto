import { NextResponse } from "next/server";
import type { SimulationResult, SimulationInput } from "@/lib/types";

const MODEL = "anthropic/claude-haiku-4.5";

interface ExplainBody {
  input: SimulationInput;
  result: SimulationResult;
  coinName: string;
}

export async function POST(request: Request) {
  const { input, result, coinName } = (await request.json()) as ExplainBody;

  const facts = buildFacts(input, result, coinName);
  const apiKey = process.env.OPENROUTER_API_KEY;

  // Fallback déterministe si aucune clé n'est configurée : la démo marche toujours.
  if (!apiKey) {
    return NextResponse.json({ explanation: templateExplanation(facts), source: "template" });
  }

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: facts },
        ],
      }),
    });

    if (!res.ok) throw new Error(`OpenRouter ${res.status}`);
    const data = await res.json();
    const explanation: string =
      data?.choices?.[0]?.message?.content?.trim() || templateExplanation(facts);
    return NextResponse.json({ explanation, source: "ai" });
  } catch {
    return NextResponse.json({ explanation: templateExplanation(facts), source: "template" });
  }
}

const SYSTEM_PROMPT = `Tu es l'assistant pédagogique des simulateurs S'investir.
On te donne le résultat chiffré d'une simulation d'investissement passé en cryptomonnaie.
Explique le résultat en français, en 3 à 4 phrases claires, ton calme et factuel, sans jargon.
Mets en perspective la stratégie (apport unique vs versements réguliers/DCA) et la volatilité.
Termine TOUJOURS par un rappel que les performances passées ne préjugent pas des performances futures.
N'invente aucun chiffre : utilise uniquement ceux fournis.
Réponds en texte brut, sans markdown : pas de titres (#), pas d'astérisques (**), pas de listes à puces.`;

function buildFacts(
  input: SimulationInput,
  r: SimulationResult,
  coinName: string,
): string {
  const strat =
    input.frequency === "lump"
      ? "apport unique (lump sum)"
      : "versements mensuels réguliers (DCA)";
  return [
    `Crypto : ${coinName}`,
    `Stratégie : ${strat}`,
    `Période : du ${input.startDate} au ${input.endDate}`,
    `Nombre de versements : ${r.contributions}`,
    `Total investi : ${fmt(r.totalInvested)} €`,
    `Valeur finale : ${fmt(r.finalValue)} €`,
    `Plus/moins-value : ${fmt(r.profit)} € (${r.roiPct > 0 ? "+" : ""}${r.roiPct} %)`,
  ].join("\n");
}

function templateExplanation(facts: string): string {
  // Repli sans IA : on reformule les faits de façon lisible.
  return (
    `Voici la lecture de votre simulation :\n${facts}\n\n` +
    `Ce résultat reflète l'évolution réelle des prix sur la période choisie. ` +
    `Rappel : les performances passées ne préjugent pas des performances futures.`
  );
}

function fmt(n: number): string {
  return n.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
}
