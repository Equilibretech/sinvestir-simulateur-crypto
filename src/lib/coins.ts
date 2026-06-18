export interface Coin {
  id: string;
  symbol: string;
  name: string;
  /** Paire EUR sur Binance. */
  pair: string;
  /** Couleur d'accent de la crypto (pour les graphiques). */
  color: string;
}

/** Cryptos supportées par la démo. */
export const COINS: Coin[] = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", pair: "BTCEUR", color: "#f7931a" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", pair: "ETHEUR", color: "#627eea" },
  { id: "solana", symbol: "SOL", name: "Solana", pair: "SOLEUR", color: "#14f195" },
  { id: "binancecoin", symbol: "BNB", name: "BNB", pair: "BNBEUR", color: "#f0b90b" },
  { id: "ripple", symbol: "XRP", name: "XRP", pair: "XRPEUR", color: "#8ea1b3" },
  { id: "cardano", symbol: "ADA", name: "Cardano", pair: "ADAEUR", color: "#0033ad" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", pair: "DOGEEUR", color: "#c2a633" },
];

export function getCoin(id: string): Coin | undefined {
  return COINS.find((c) => c.id === id);
}
