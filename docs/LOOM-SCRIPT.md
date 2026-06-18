# Script Loom — 5 min max

> Conseil : caméra activée (visage en médaillon), partage d'écran sur la démo
> https://sinvestir-simulateur-test.vercel.app . Ton naturel, pas besoin de lire mot à mot.

## 0:00 – 0:30 · Qui je suis (caméra)
« Bonjour, Antoine Verdure, développeur — je tiens Equilibretech. Merci pour ce test, je vous
présente en 5 minutes ce que j'ai réalisé : la transposition de votre simulateur crypto au format
de votre suite simulateurs.sinvestir.fr, avec quelques ajouts. »

## 0:30 – 1:15 · Vue d'ensemble & design
- Montrer la page d'accueil.
- « J'ai repris votre identité visuelle : thème sombre navy, accent or, police Lexend, cartes en
  verre — directement inspirés des tokens de votre CSS. »
- Pointer le logo, l'en-tête, l'esprit général.

## 1:15 – 2:30 · La démo en action
- Choisir Bitcoin, **DCA mensuel**, 1000 €/mois, période 3 ans → commenter le résultat
  (total investi, valeur finale, +/- value), le graphe valeur vs investi.
- Montrer les **métriques** : prix d'achat moyen, perf annualisée, max drawdown.
- Cliquer **Analyse IA** → « une explication en langage naturel, via un modèle Claude ; c'est le
  clin d'œil au poste de Dev IA. »

## 2:30 – 3:15 · Le mode Comparer (le point fort)
- Cliquer **Comparer** → « à capital égal, apport unique vs DCA, sur le même graphe. »
- Commenter le gagnant et l'écart. « C'est la fonction du simulateur d'origine, poussée plus loin. »

## 3:15 – 4:00 · Robustesse & intégrabilité
- Changer de crypto (7 dispos), bouger les dates / presets, **copier le lien** (scénario partageable).
- « Données Binance en live avec repli automatique sur un snapshot — la démo marche toujours. »
- « Tout est un composant autonome et embarquable, pensé pour s'intégrer dans votre stack Next.js. »

## 4:00 – 4:40 · Choix techniques (caméra)
- « Next.js + TypeScript + Tailwind + Vercel, aligné sur votre stack interne. Le site vitrine est en
  Nuxt, mais j'ai visé l'infra cible — c'est expliqué dans le README. »
- « Calculs en fonctions pures (backtest, XIRR, drawdown), clé IA jamais exposée côté client. »

## 4:40 – 5:00 · Suggestions & clôture (caméra)
- « Côté pistes : capture de leads vers HubSpot, agent IA conseiller, benchmarks (Livret A, ETF),
  et un socle de simulateurs mutualisé. »
- « Le code et la démo sont dans le formulaire. Au plaisir d'échanger. Merci ! »

## Aide-mémoire chiffres (à adapter le jour J, données live)
- BTC, DCA 1000 €/mois, 3 ans : ~37 000 € investis.
- Mode Comparer (capital égal) : l'apport unique au creux de 2023 surperforme nettement le DCA.
