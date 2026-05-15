# Velara — Shopify Theme

Premium skincare Shopify Online Store 2.0 theme. Editorial layout, animated hero canvas, infinite ticker, parallax category grid, 3D product cards, oversized footer brand watermark.

## Quick Start

```bash
# 1. Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# 2. Authenticate
shopify auth login --store=velara.myshopify.com

# 3. Start local dev server
shopify theme dev --store=velara.myshopify.com
# Preview at http://127.0.0.1:9292
```

## Deployment

This repo is connected to Shopify via the **GitHub integration** (Online Store → Themes → Add theme → Connect from GitHub). Every push to `main` auto-deploys.

**Branching:**

```
main         → Live production theme (protected, auto-deploys)
staging      → Shopify preview theme
phase/*      → Feature branches (PR into staging)
```

## Structure

| Folder | Purpose |
|---|---|
| `assets/` | CSS, JS, SVGs (served from Shopify CDN) |
| `config/` | Theme Customizer schema + defaults |
| `layout/` | Master HTML shell (`theme.liquid`) |
| `locales/` | Translatable strings |
| `sections/` | Reusable page sections with schema |
| `snippets/` | Liquid partials (product card, icons, etc.) |
| `templates/` | Page templates (homepage, PDP, collection, cart) |

## Product metafields (Shopify Admin → Settings → Custom data → Products)

The product card and PDP read from these metafields. Define them once, then fill per product.

| Namespace | Key | Type | Used by | Purpose |
|---|---|---|---|---|
| `custom` | `tagline` | Single line text | Card, PDP | Short benefit line under the product name (e.g. *"Brightens & smooths dullness"*) |
| `custom` | `promo_badge` | Single line text | Card | Lavender pill on the card (e.g. *"2 MINIS + FREE SHIPPING"*, *"GIFT WITH PURCHASE"*) |
| `custom` | `key_ingredients` | Multi-line text | PDP accordion | Hero ingredients + what they do |
| `custom` | `how_to_use` | Multi-line text | PDP accordion | Application instructions |
| `custom` | `inci` | Multi-line text | PDP accordion | Full INCI ingredient list |
| `custom` | `skin_concern` | List of single line text | PDP, filter | Concern tags: `Dryness`, `Acne`, `Pigmentation`, etc. |
| `custom` | `rating` | Decimal (0–5) | Card | Star rating (fallback if no reviews app) |
| `custom` | `rating_count` | Integer | Card | Number of reviews |
| `reviews` | `rating` | App-provided | Card | Auto-populated by Shopify Reviews / Judge.me / Yotpo |
| `reviews` | `rating_count` | App-provided | Card | Auto-populated by the reviews app |

**Product tags used:** `new` (yellow sticker), `best-loved` or `best-seller` (mint "♡ skin loved" sticker), `concern:dryness` / `concern:acne` / etc. (for filtering).

## Brand Tokens (CSS variables)

| Token | Value |
|---|---|
| `--color-white` | `rgb(255,255,255)` |
| `--color-black` | `rgb(0,0,0)` |
| `--color-border` | `rgb(236,236,228)` |
| `--color-accent-warm` | `rgb(72,63,54)` |
| `--color-accent-green` | `rgb(195,231,148)` |
| `--font-display` | Clash Display (via Fontshare) |
| `--font-body` | Inter (via Google Fonts) |

## Breakpoints

- Desktop: `min-width: 1200px`
- Tablet: `min-width: 810px` and `max-width: 1199.98px`
- Mobile: `max-width: 809.98px`

## Local Preview (no Shopify)

A static demo of the homepage is included at the repo root: open [`preview/index.html`](preview/index.html) in a browser to see the layout without spinning up Shopify CLI.

## License

Internal project. All rights reserved.
