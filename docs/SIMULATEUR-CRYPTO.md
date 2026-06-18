# Logique fonctionnelle — Simulateur crypto à transposer

> Modèle : https://sinvestir.fr/simulateur-crypto-monnaie/
> C'est un **outil de backtesting rétrospectif** (pas de prédiction) : il calcule ce qu'aurait
> donné un investissement passé sur une crypto, sur données historiques.

## Entrées utilisateur
1. **Cryptomonnaie** — choix parmi un large catalogue (Bitcoin, Ethereum, …).
2. **Montant investi** — capital alloué.
3. **Fréquence d'investissement** :
   - Apport unique (lump sum)
   - Récurrent quotidien
   - Récurrent hebdomadaire
   - Récurrent mensuel (DCA)
4. **Période** — date de début et date de fin.

## Calculs / résultats affichés
- **Total investi** cumulé sur la période.
- **Évolution de la valeur du portefeuille** dans le temps.
- **Plus-value / moins-value** estimée.
- **Comparaison de scénarios** (ex. lump sum vs DCA).
- **Graphique** de progression de la valeur.

## Logique
1. L'utilisateur configure le scénario.
2. Le système traite les **prix historiques** de la crypto sur la période.
3. **DCA** → achats cumulés au prix historique réel à chaque date d'investissement.
4. **Lump sum** → un seul achat au prix de la date d'entrée.
5. Affiche la **valeur théorique** du portefeuille à la date de sortie.

> Mention légale présente : « les résultats ne constituent pas un indicateur fiable de performance future ».

## Données de prix — pistes pour la démo
- **CoinGecko API** (`/coins/{id}/market_chart/range`) — gratuit, historique large, pas de clé pour usage léger.
- Option : jeu de données figé (snapshot JSON) pour une démo 100% autonome et rapide, sans dépendre d'un quota d'API.
- Décision à acter dans le README (partis pris).

## Périmètre proposé pour le test (demi-journée)
- MVP : 2-3 cryptos majeures (BTC, ETH, +1), apport unique + DCA mensuel.
- 1 graphique d'évolution + cartes de résultats (investi / valeur finale / +/- value en €  et %).
- Responsive + thème S'investir.
- Composant `<SimulateurCrypto />` autonome et embarquable (peu de props, peu de dépendances).
