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
  // Flux de trésorerie pour le calcul du taux de rendement annualisé (XIRR).
  const cashflows: { date: string; amount: number }[] = [];

  for (const point of window) {
    if (contributionDates.has(point.date)) {
      units += amount / point.price;
      invested += amount;
      contributions += 1;
      cashflows.push({ date: point.date, amount: -amount }); // sortie de trésorerie
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

  // Encaissement final (revente théorique) pour fermer la série de flux.
  cashflows.push({ date: window[window.length - 1].date, amount: finalValue });

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
    avgEntryPrice: units > 0 ? round2(invested / units) : 0,
    annualizedPct: round2(xirr(cashflows) * 100),
    maxDrawdownPct: round2(maxDrawdown(series) * 100),
  };
}

/** Repli maximal (pic → creux) de la valeur du portefeuille, en fraction positive. */
function maxDrawdown(series: SeriesPoint[]): number {
  let peak = 0;
  let maxDd = 0;
  for (const p of series) {
    if (p.value > peak) peak = p.value;
    if (peak > 0) {
      const dd = (peak - p.value) / peak;
      if (dd > maxDd) maxDd = dd;
    }
  }
  return maxDd;
}

/**
 * Taux de rendement annualisé money-weighted (XIRR).
 * Résout NPV(taux) = 0 par Newton-Raphson, repli sur bissection.
 * Gère aussi bien l'apport unique (= CAGR) que le DCA.
 */
function xirr(cashflows: { date: string; amount: number }[]): number {
  if (cashflows.length < 2) return 0;
  const t0 = new Date(cashflows[0].date + "T00:00:00Z").getTime();
  const years = (c: { date: string }) =>
    (new Date(c.date + "T00:00:00Z").getTime() - t0) / (365 * 24 * 3600 * 1000);

  const npv = (rate: number) =>
    cashflows.reduce((s, c) => s + c.amount / Math.pow(1 + rate, years(c)), 0);

  // Newton-Raphson
  let rate = 0.1;
  for (let i = 0; i < 50; i++) {
    const f = npv(rate);
    const d = (npv(rate + 1e-5) - f) / 1e-5;
    if (Math.abs(d) < 1e-9) break;
    const next = rate - f / d;
    if (!isFinite(next)) break;
    if (Math.abs(next - rate) < 1e-7) return clampRate(next);
    rate = next;
  }

  // Repli : bissection sur un intervalle large.
  let lo = -0.9999;
  let hi = 10;
  let flo = npv(lo);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fmid = npv(mid);
    if (Math.abs(fmid) < 1e-6) return clampRate(mid);
    if (flo * fmid < 0) hi = mid;
    else {
      lo = mid;
      flo = fmid;
    }
  }
  return clampRate((lo + hi) / 2);
}

function clampRate(r: number): number {
  if (!isFinite(r)) return 0;
  return Math.max(-0.9999, Math.min(100, r));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
