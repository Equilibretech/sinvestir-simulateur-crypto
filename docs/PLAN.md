# Plan de réalisation (demi-journée)

## ✅ Décisions verrouillées (18 juin 2026)
- **Périmètre : MVP propre + 1 touche IA.** 2-3 cryptos (BTC/ETH/+1), apport unique + DCA mensuel,
  graphique d'évolution + cartes de résultats, thème S'investir, responsive.
  **Touche IA** : explication en langage naturel des résultats (via Claude API) — pour matcher le poste « Dev IA ».
- **Données prix : hybride** — CoinGecko API en live, **fallback** sur snapshot JSON embarqué si l'API échoue.
- **Déploiement : Vercel** (auth interactive à faire le moment venu).
- **Repo : GitHub** sous le compte `Equilibretech` (gh CLI déjà connecté).

## Credentials nécessaires (le moment venu, pas avant)
- [ ] **Auth Vercel** — `npm i -g vercel && vercel login` (interactif) OU token Vercel.
- [ ] **Clé API Anthropic** (`ANTHROPIC_API_KEY`) pour la touche IA sur la démo déployée.
      (Modèle pressenti : Haiku 4.5 pour une explication rapide et peu coûteuse — à confirmer à l'implémentation.)

## Choix techniques proposés (à valider)
- **Next.js (App Router) + TypeScript** → compatibilité directe avec la stack interne (Next.js/Vercel).
  Justifie le choix vs Nuxt du site cible : on vise l'infra interne, pas le site public.
- **Tailwind CSS v4** → mêmes tokens que le site cible (déjà en Tailwind v4 OKLCH).
- **Police Lexend** via `next/font/google`.
- **Recharts** (ou Chart.js) pour le graphique d'évolution.
- **CoinGecko API** pour l'historique de prix (+ fallback snapshot JSON pour robustesse démo).
- **Déploiement Vercel**.
- Composant `<SimulateurCrypto />` isolé, sans état global, embarquable en iframe/widget.

## Étapes
- [ ] 1. Scaffold Next.js + Tailwind + Lexend + tokens design (voir DESIGN-TOKENS.md).
- [ ] 2. Layout/thème sombre fidèle à simulateurs.sinvestir.fr (header, cartes glass, accents).
- [ ] 3. Formulaire d'entrées (crypto, montant, fréquence, période).
- [ ] 4. Moteur de calcul (lump sum + DCA) avec données historiques.
- [ ] 5. Affichage résultats : cartes (investi / valeur / +/-value €+%) + graphique.
- [ ] 6. Responsive desktop/mobile.
- [ ] 7. README (lancement, partis pris, justif. choix stack, intégrabilité).
- [ ] 8. Déploiement Vercel + vérif lien public.
- [ ] 9. (Bonus) Loom 5 min + suggestions d'amélioration.
- [ ] 10. Dépôt via formulaire Tally : https://tally.so/r/81E2lA

## Suggestions d'amélioration (bonus — à affiner après exploration)
- *(à compléter en explorant réellement leurs outils)*
- Idées pistes : comparateur multi-stratégies, export PDF du scénario, capture de leads
  (cohérent avec HubSpot), partage d'un scénario via URL, agent IA d'explication des résultats.

## Échéancier
- Deadline : **mercredi 1er juillet 2026, 23h59**.
- Aujourd'hui : 18 juin → ~13 jours de marge (mais charge cible = ½ journée).
