# Brief — Test technique Développeur IA freelance · S'investir

> Source : email de Florian (équipe S'investir, recrutement) reçu le 18 juin 2026
> + page Notion de consignes détaillées.

## 🎯 Mission

Transposer le **simulateur crypto** de S'investir au **format de leur suite de simulateurs**,
et en livrer une **démo en ligne fonctionnelle**.

> On reprend la **logique fonctionnelle** du simulateur crypto et on l'**habille** aux
> couleurs et standards visuels de `simulateurs.sinvestir.fr`, comme s'il rejoignait leur suite d'outils.

### Références
| Rôle | Lien |
|------|------|
| Simulateur à transposer (modèle fonctionnel) | https://sinvestir.fr/simulateur-crypto-monnaie/ |
| Design & standards cibles (suite d'outils) | https://simulateurs.sinvestir.fr/ |
| Page de consignes (Notion) | https://large-field-8e6.notion.site/S-investir-Recrute-Test-Technique-D-veloppeur-IA-380d3bf6ddf380368922f39f4e2bf5ec |
| Formulaire de rendu (Tally) | https://tally.so/r/81E2lA |

## ⏱️ Cadre

- **Charge estimée** : une demi-journée. Périmètre volontairement réduit.
- **À titre gracieux** (non rémunéré).
- On ne cherche **pas un produit fini** mais du **code propre + une démo qui marche**.
- ⚠️ Les missions réelles ne porteront PAS sur les simulateurs : outils internes, **agents IA**,
  automatisations (facturation, analyse de patrimoine, dashboards, intégrations HubSpot/WooCommerce/Sheets).
  Le simulateur n'est qu'un exercice d'évaluation court et autonome.

## ✅ Livrable attendu

1. **Démo en ligne fonctionnelle** — cœur du test, résultat concret et manipulable.
   Déploiement **de préférence sur Vercel** (ce qu'ils utilisent).
2. **Fidélité au design S'investir** — identité visuelle de `simulateurs.sinvestir.fr`
   (couleurs, typo, composants, esprit). → voir [DESIGN-TOKENS.md](./DESIGN-TOKENS.md).
3. **Simulateur autonome et intégrable**, pensé pour :
   - prendre la place du simulateur actuel dans `simulateurs.sinvestir.fr` ;
   - *(bonus)* être affiché en aperçu intégré (embedding) depuis `sinvestir.fr`.
   - Pas besoin d'intégrer réellement : montrer que le composant est **réutilisable, embarquable, peu de dépendances**.
4. **Responsive** — desktop ET mobile propres.
5. **Code propre et lisible** — structure claire, nommage cohérent, **README minimal**
   (comment lancer, partis pris, etc.).

## 🛠️ Stack & compatibilité

- **Stack libre** pour le test.
- Stack interne S'investir (à viser pour la compatibilité) :
  **Next.js · Supabase · Vercel · n8n · Claude Code**
  (outils : HubSpot, WooCommerce, Google Sheets).
- Si choix technique différent → **le justifier brièvement dans le README**.
  C'est un **signal important** : ils cherchent quelqu'un qui sait choisir ET expliquer ses choix.

> ⚠️ Note : le site cible `simulateurs.sinvestir.fr` est en **Nuxt (Vue)**, mais leur stack
> *interne* annoncée est **Next.js**. → Privilégier **Next.js** (compatibilité infra) tout en
> reproduisant fidèlement le rendu visuel. À justifier dans le README.

## 💡 Bonus — regard de partenaire

Après avoir exploré leurs outils : quelles **améliorations** ou **développements** proposer ?
Quelques lignes (à mettre dans le formulaire de rendu). Ils cherchent un partenaire qui **challenge**.

## 🧭 Critères d'évaluation

- Démo fonctionnelle (résultat concret, manipulable).
- Fidélité au design de leurs simulateurs.
- Qualité & intégrabilité du code (compatibilité stack, ou choix justifié).
- Pertinence des suggestions d'amélioration.

## 📦 Format du rendu (formulaire Tally)

- Lien de la **démo en ligne** (Vercel/Netlify — cliquable et fonctionnel).
- Lien du **repo Git** (public ou accès lecture).
- **Partis pris techniques** & **suggestions d'amélioration**.
- *(Bonus)* **Vidéo Loom** (5 min max) de présentation.

## 📅 Deadline

> **Mercredi 1er juillet 2026, 23h59.**

*(L'email disait « mardi 1er juillet » — le 1er juillet 2026 est un mercredi ; la page Notion fait foi.)*

## ❓ Question sur le test

Répondre directement à l'email reçu (Florian — `florian@sinvestir.fr`).
