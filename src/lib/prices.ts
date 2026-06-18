import type { PricePoint } from "./types";
import snapshot from "@/data/snapshot.json";
import { getCoin } from "./coins";

const SNAPSHOT = snapshot as Record<string, PricePoint[]>;

export interface PricesResult {
  prices: PricePoint[];
  /** "live" si Binance a répondu, "snapshot" si on est retombé sur le fallback. */
  source: "live" | "snapshot";
}

/**
 * Récupère l'historique journalier (EUR) d'une crypto.
 * Stratégie hybride : Binance en live (multi-années), repli sur le snapshot
 * embarqué en cas d'échec (API down, géo-blocage, hors-ligne).
 */
export async function getPrices(coinId: string): Promise<PricesResult> {
  try {
    const live = await fetchFromBinance(coinId);
    if (live.length > 0) return { prices: live, source: "live" };
  } catch {
    // on bascule sur le fallback ci-dessous
  }
  return { prices: SNAPSHOT[coinId] ?? [], source: "snapshot" };
}

async function fetchFromBinance(coinId: string): Promise<PricePoint[]> {
  const symbol = getCoin(coinId)?.pair;
  if (!symbol) return [];

  const byDay = new Map<string, number>();
  let endTime: number | undefined;

  // Pagination : Binance limite à 1000 bougies/appel. On remonte jusqu'à ~8 ans.
  for (let i = 0; i < 3; i++) {
    let url =
      `https://api.binance.com/api/v3/klines` +
      `?symbol=${symbol}&interval=1d&limit=1000`;
    if (endTime) url += `&endTime=${endTime}`;

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      // Cache 1h côté serveur Next pour limiter les appels.
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Binance ${res.status}`);

    const klines = (await res.json()) as [number, string, string, string, string][];
    if (!Array.isArray(klines) || klines.length === 0) break;

    for (const k of klines) {
      const date = new Date(k[0]).toISOString().slice(0, 10);
      byDay.set(date, Math.round(parseFloat(k[4]) * 100) / 100); // close
    }
    endTime = klines[0][0] - 1; // juste avant la plus ancienne bougie
    if (klines.length < 1000) break;
  }

  return [...byDay.entries()]
    .map(([date, price]) => ({ date, price }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
