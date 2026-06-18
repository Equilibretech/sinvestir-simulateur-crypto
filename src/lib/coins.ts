export interface Coin {
  id: string;
  symbol: string;
  name: string;
  /** Couleur d'accent de la crypto (pour les graphiques). */
  color: string;
}

/** Cryptos supportées par la démo. */
export const COINS: Coin[] = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", color: "#f7931a" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", color: "#627eea" },
  { id: "solana", symbol: "SOL", name: "Solana", color: "#14f195" },
];

export function getCoin(id: string): Coin | undefined {
  return COINS.find((c) => c.id === id);
}
