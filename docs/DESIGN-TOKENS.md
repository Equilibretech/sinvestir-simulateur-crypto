# Charte graphique — `simulateurs.sinvestir.fr`

> Extraite du CSS de production (`/_nuxt/entry.*.css`) le 18 juin 2026.
> Le site cible est une app **Nuxt (Vue) + Tailwind v4 (tokens OKLCH)**, thème **sombre fintech**.

## Logo
- Logo **doré** (`Logo_Sinvestir_Gold.png`) — confirmé comme icône sur la page Notion de consignes.
  Cohérent avec l'accent or `#f8d047`. À récupérer pour le header du simulateur.

## Typographie
- **Police principale : `Lexend`** (Google Fonts), fallback `BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif`.
- Graisses utilisées : 300 / 400 / 500 / 600 / 700.

## Couleurs (par fréquence d'usage dans le CSS)

### Marque
| Token | Hex | Usage |
|-------|-----|-------|
| **Bleu primaire** | `#1098f7` | couleur d'accent principale, CTA, focus ring (`--color-ring: 16 152 247`) |
| **Or / jaune accent** | `#f8d047` | accent secondaire, highlights |
| Bleu profond | `#0049c6` | variantes / dégradés |
| Bleu clair | `#7899ce` | éléments secondaires |
| Bleu nuit | `#00173f` | surfaces élevées (`--color-surface-elevated: 0 23 63`) |

### Surfaces (thème sombre)
| Token | Hex (approx) | Source |
|-------|------|--------|
| `--color-surface` | `#080c16` | fond principal (`8 12 22`) |
| `--color-surface-soft` | `#0f172a` | cartes (`15 23 42`) |
| `--color-surface-elevated` | `#00173f` | éléments en relief (`0 23 63`) |
| autres fonds sombres | `#0a0f1a`, `#071a35` | |

### Texte
| Token | Hex | Source |
|-------|-----|--------|
| Texte principal | `#ffffff` | `--color-text: 255 255 255` |
| Texte atténué | `#9ca3af` | `--color-text-muted: 156 163 175` |
| Gris bordures | `#6b7280`, `#d1d5db` | |

### Sémantique (gains/pertes — clé pour un simulateur financier)
| Sens | Hex |
|------|-----|
| **Gain / positif (vert)** | `#11d05a` |
| **Perte / négatif (rouge)** | `#ff0500` / `#fb2c36` |
| Avertissement (or) | `#f8d047` / `#ffea8f` |

## Autres tokens
- `--border-radius: 8px`
- `--default-transition-duration: .15s`, easing `cubic-bezier(.4,0,.2,1)`
- Effets `backdrop-blur` (cartes "glass") : `--blur: 12px`, `--blur-xl: 24px`, etc.
- Widget de formulaire : **Tally** (`tally.so/widgets/embed.js`) déjà chargé sur le site.

## Catalogue de simulateurs existants (pour cohérence)
D'après les meta : intérêts composés, impact de l'inflation, crédit immobilier,
comparateurs PEA / assurance-vie / SCPI. → Le simulateur crypto doit s'insérer dans cette famille.

## À faire pour reproduire fidèlement
- [ ] Importer **Lexend** (next/font).
- [ ] Définir les tokens ci-dessus en variables CSS / config Tailwind.
- [ ] Thème **sombre** par défaut, cartes "glass" (fond `surface-soft` + blur + radius 8px).
- [ ] Accent **bleu `#1098f7`**, gains en **vert `#11d05a`**, pertes en **rouge `#ff0500`**.
- [ ] Récupérer le **favicon/logo** et les composants (header, boutons, inputs) en s'inspirant du site.
