export function formatEur(n: number, maxFractionDigits = 2): string {
  return n.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: maxFractionDigits,
  });
}

export function formatPct(n: number): string {
  return `${n > 0 ? "+" : ""}${n.toLocaleString("fr-FR", {
    maximumFractionDigits: 2,
  })} %`;
}

export function formatDateFr(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
