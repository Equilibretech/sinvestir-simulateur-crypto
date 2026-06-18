import type {
  PricePoint,
  SimulationInput,
  SimulationResult,
  SeriesPoint,
} from "./types";

/**
 * Moteur de backtest rétrospectif.
 *
 * Reprend la logique du simulateur crypto S'investir :
 * - "lump" : un apport unique au premier jour de la période ;
 * - "monthly" : un versement récurrent (DCA) le même jour chaque mois.
 *
 * On accumule les unités achetées au prix historique réel de chaque date
 * de versement, puis on valorise le portefeuille à chaque point de la série.
 *
 * `prices` doit être trié par date croissante et couvrir la période.
 */
export function simulate(
  input: SimulationInput,
  prices: PricePoint[],
): SimulationResult {
  const { amount, frequency, startDate, endDate } = input;

  const window = prices
    .filter((p) => p.date >= startDate && p.date <= endDate)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (window.length === 0) {
    throw new Error("Aucune donnée de prix sur la période demandée.");
  }

  // Dates de versement.
  const contributionDates = new Set<string>();
  if (frequency === "lump") {
    contributionDates.add(window[0].date);
  } else {
    // DCA mensuel : on vise le même jour du mois que la date de début,
    // en prenant le premier jour de cotation disponible >= date cible.
    const start = new Date(window[0].date + "T00:00:00Z");
    const dayOfMonth = start.getUTCDate();
    const cursor = new Date(start);
    const last = new Date(window[window.length - 1].date + "T00:00:00Z");

    while (cursor <= last) {
      const iso = cursor.toISOString().slice(0, 10);
      const point = window.find((p) => p.date >= iso);
      if (point) contributionDates.add(point.date);
      // Mois suivant, en gérant les mois plus courts (ex: 31 -> 28/30).
      const y = cursor.getUTCFullYear();
      const m = cursor.getUTCMonth();
      const daysNextMonth = new Date(Date.UTC(y, m + 2, 0)).getUTCDate();
      cursor.setUTCDate(1);
      cursor.setUTCMonth(m + 1);
      cursor.setUTCDate(Math.min(dayOfMonth, daysNextMonth));
    }
  }

  let units = 0;
  let invested = 0;
  let contributions = 0;
  const series: SeriesPoint[] = [];

  for (const point of window) {
    if (contributionDates.has(point.date)) {
      units += amount / point.price;
      invested += amount;
      contributions += 1;
    }
    series.push({
      date: point.date,
      invested: round2(invested),
      value: round2(units * point.price),
    });
  }

  const lastPrice = window[window.length - 1].price;
  const finalValue = units * lastPrice;
  const profit = finalValue - invested;

  return {
    totalInvested: round2(invested),
    finalValue: round2(finalValue),
    profit: round2(profit),
    roiPct: invested > 0 ? round2((profit / invested) * 100) : 0,
    totalUnits: units,
    contributions,
    series,
    firstPrice: window[0].price,
    lastPrice,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
