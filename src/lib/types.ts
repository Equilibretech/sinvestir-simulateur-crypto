/** Un point de prix journalier. */
export interface PricePoint {
  /** Date ISO (YYYY-MM-DD). */
  date: string;
  /** Prix de clôture en EUR. */
  price: number;
}

export type Frequency = "lump" | "monthly";

export interface SimulationInput {
  /** Identifiant de la crypto (ex: "bitcoin"). */
  coinId: string;
  /** Montant en EUR : total pour lump sum, par versement pour le DCA. */
  amount: number;
  frequency: Frequency;
  /** Bornes de la période, ISO YYYY-MM-DD. */
  startDate: string;
  endDate: string;
}

/** Point de la série temporelle du portefeuille (pour le graphique). */
export interface SeriesPoint {
  date: string;
  /** Montant cumulé investi à cette date. */
  invested: number;
  /** Valeur de marché du portefeuille à cette date. */
  value: number;
}

export interface SimulationResult {
  totalInvested: number;
  finalValue: number;
  profit: number;
  roiPct: number;
  /** Nombre d'unités de crypto détenues à la fin. */
  totalUnits: number;
  /** Nombre de versements effectués. */
  contributions: number;
  series: SeriesPoint[];
  /** Prix d'entrée (premier prix de la période). */
  firstPrice: number;
  /** Prix de sortie (dernier prix de la période). */
  lastPrice: number;
}
