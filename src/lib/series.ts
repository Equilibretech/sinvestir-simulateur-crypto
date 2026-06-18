/**
 * Réduit le nombre de points d'une série pour l'affichage (graphe),
 * sans toucher aux données de calcul. Conserve toujours le premier et le
 * dernier point. Utile en mode "Max" (2000+ points journaliers) pour la
 * fluidité, notamment sur mobile.
 */
export function downsample<T>(points: T[], maxPoints = 180): T[] {
  if (points.length <= maxPoints) return points;
  const step = (points.length - 1) / (maxPoints - 1);
  const out: T[] = [];
  for (let i = 0; i < maxPoints; i++) {
    out.push(points[Math.round(i * step)]);
  }
  // Garantit la présence exacte du dernier point.
  out[out.length - 1] = points[points.length - 1];
  return out;
}
