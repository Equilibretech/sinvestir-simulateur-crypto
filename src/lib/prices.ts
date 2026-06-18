import type { PricePoint } from "./types";
import snapshot from "@/data/snapshot.json";

const SNAPSHOT = snapshot as Record<string, PricePoint[]>;

export interface PricesResult {
  prices: PricePoint[];
  /** "live" si CoinGecko a répondu, "snapshot" si on est retombé sur le fallback. */
  source: "live" | "snapshot";
}

/**
 * Récupère l'historique journalier (EUR) d'une crypto.
 * Stratégie hybride : CoinGecko en live, repli sur le snapshot embarqué en cas d'échec
 * (API down, quota dépassé, hors-ligne).
 */
export async function getPrices(coinId: string): Promise<PricesResult> {
  try {
    const live = await fetchFromCoinGecko(coinId);
    if (live.length > 0) return { prices: live, source: "live" };
  } catch {
    // on bascule sur le fallback ci-dessous
  }
  return { prices: SNAPSHOT[coinId] ?? [], source: "snapshot" };
}

async function fetchFromCoinGecko(coinId: string): Promise<PricePoint[]> {
  const url =
    `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart` +
    `?vs_currency=eur&days=365`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    // Cache CoinGecko 1h côté serveur Next pour limiter les appels / le quota.
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`);

  const data = (await res.json()) as { prices: [number, number][] };
  const byDay = new Map<string, number>();
  for (const [ms, price] of data.prices) {
    const date = new Date(ms).toISOString().slice(0, 10);
    byDay.set(date, Math.round(price * 100) / 100); // dernier prix du jour
  }
  return [...byDay.entries()]
    .map(([date, price]) => ({ date, price }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Bornes de dates disponibles (basées sur le snapshot, ~365 derniers jours). */
export function availableRange(coinId: string): { min: string; max: string } {
  const s = SNAPSHOT[coinId] ?? [];
  if (s.length === 0) return { min: "", max: "" };
  return { min: s[0].date, max: s[s.length - 1].date };
}
