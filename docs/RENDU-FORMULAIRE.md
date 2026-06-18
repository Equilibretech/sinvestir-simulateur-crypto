# Réponses pour le formulaire Tally (rendu du test)

Formulaire : https://tally.so/r/81E2lA

- **1. Prénom et Nom** : Antoine Verdure
- **2. Email** : antoine@equilibretech.com
- **3. Lien démo** : https://sinvestir-simulateur-test.vercel.app
- **4. Repo GitHub** : https://github.com/Equilibretech/sinvestir-simulateur-crypto
- **9. Consentement** : Oui

---

## 6. Choix techniques / Partis pris

J'ai bâti le simulateur sur **Next.js (App Router) + TypeScript**, pour rester aligné sur votre
stack interne (Next.js / Supabase / Vercel) — là où vivront les vraies missions (outils internes,
agents IA, automatisations). Le site vitrine simulateurs.sinvestir.fr est en Nuxt, mais j'ai
volontairement visé l'infrastructure cible plutôt que le site public, tout en **reproduisant
fidèlement son identité visuelle** (Tailwind v4, police Lexend, thème navy + accent or, repris des
tokens de votre CSS).

Partis pris principaux :
- **Composant `<Simulator/>` autonome et embarquable** : aucun état global, peu de dépendances
  (Recharts pour le graphe). Il peut remplacer le simulateur actuel (drop-in) ou être embarqué en
  iframe depuis sinvestir.fr.
- **Moteur de calcul en fonction pure** (backtest apport unique / DCA, performance annualisée XIRR,
  max drawdown), recalculé côté client instantanément.
- **Données hybrides** : API publique Binance en live (paires EUR, historique multi-années, sans
  clé) avec **repli automatique sur un snapshot embarqué** si l'API est indisponible → la démo
  fonctionne toujours. Fonctions serveur déployées en région Europe (fra1) car Binance bloque les IP US.
- **Touche IA** (cohérente avec le poste « Dev IA ») : explication des résultats en langage naturel
  via un modèle Claude (OpenRouter), appelé depuis une route serveur pour ne jamais exposer la clé,
  avec un fallback déterministe si la clé est absente.
- **Partage de scénario par URL** (paramètres dans le lien) — utile pour le marketing / la capture
  de leads.

## 7. Suggestions d'amélioration / développement pour S'investir

Après avoir exploré vos simulateurs, quelques pistes :
- **Capture de leads contextualisée** : à la fin d'une simulation, proposer d'envoyer le détail par
  email et pousser le contact dans **HubSpot** (votre stack) pour le nurturing.
- **Agent IA conseiller** : aller au-delà de l'explication — un agent qui répond aux questions
  (« et si j'avais commencé 6 mois plus tôt ? »), compare des scénarios et s'appuie sur votre contenu
  pédagogique (RAG).
- **Benchmarks de mise en perspective** : comparer la crypto à un Livret A, un ETF World ou
  l'inflation, pour un message responsable et différenciant.
- **Socle commun de simulateurs** : un design system + un moteur de calcul mutualisés (avec tests
  automatisés) pour décliner rapidement de nouveaux outils et fiabiliser les calculs financiers.
- **Automatisations n8n** : rafraîchissement des données, génération de rapports PDF, dashboards de
  pilotage interne — proche des missions réelles décrites.
- **Analytics produit** : mesurer quels simulateurs/scénarios sont les plus utilisés pour prioriser.

## 8. Temps de réalisation
À renseigner honnêtement de ton côté (le périmètre de base ≈ une demi-journée ; les options ajoutées
— comparaison, métriques avancées, multi-cryptos, partage URL, IA — ont demandé du temps en plus).
