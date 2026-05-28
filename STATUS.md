# STATUS — Roux Labs storefront

**Current state:** Demo-ready. Live at https://rouxlabs.benops.dev.
**Repo:** github.com/benferreira-source/rouxlabs (public).

## What's done

- Supreme-faithful visual system: pure white + pure black + one safety-orange accent, Helvetica neo-grotesque, lowercase nav, hairline borders, sharp edges
- Home page intro splash with the giant centered Roux Labs wordmark
- Full FlexPort PDP: 4 colorways × 4 set sizes × Left/Right orientation, with `transform: scaleX(-1)` photo flip on Right (per patent)
- 16 product photos optimized (1500px / ~200KB each, down from 5MB)
- Shop, About (Grey Space), Support, Checkout, Success, 404 — all Supreme-styled
- AI Support Chat widget (demo, canned routing) — floating bottom-right, every page
- Newsletter capture modal (demo, localStorage) — Supreme-style sparse panel
- OG + Twitter Card meta on all 9 pages → social link previews
- JSON-LD Product/ItemList schema → Google rich snippets
- `sitemap.xml` + `robots.txt`
- Mac high-res polish (`polish-desktop.css`) — 1440/1600/2200/2800 breakpoints, 6-col tile grid at ≥1800
- iPhone polish (`polish-mobile.css`) — Apple HIG 44×44 touch targets, safe-area-inset support, sticky cart drawer head
- Cart drawer with empty-state, disabled checkout when empty
- Cart count badge hides when 0

## What's NOT done (launch blockers)

1. **Stripe live keys** — `checkout.js` still has `pk_test_REPLACE_ME`. Either paste a live key + deploy `/api/checkout.js` with `STRIPE_SECRET_KEY`, or fill `STRIPE_LINKS` with Stripe Payment Link URLs per SKU.
2. **Domain** — Currently lives at `rouxlabs.benops.dev`. When the real `rouxlabs.com` is acquired, point DNS at the same Cloudflare tunnel and add the ingress rule.
3. **Email** — `hello@rouxlabs.com` / `support@rouxlabs.com` referenced site-wide but no forwarders exist yet.

## Operational handles

- Local dev: `python3 serve.py` (port 4321) — `.claude/launch.json` already wires this to the preview tool.
- Production server: launchd plist `com.benops.rouxlabs` at `~/Library/LaunchAgents/`. Logs at `~/Desktop/shared/logs/rouxlabs.{log,error.log}`.
- Restart: `launchctl unload ~/Library/LaunchAgents/com.benops.rouxlabs.plist && launchctl load ~/Library/LaunchAgents/com.benops.rouxlabs.plist`
- Repo follows main; pushes deploy nothing automatically (the site is served straight off disk by `serve.py`). To make a change live: edit + save → Cloudflare cache may take a moment to refresh.

## Useful pointers

- Patent doc: `/Users/dobby/Downloads/flexport_patent_consultation_packet.pdf` — authored by Johnny Roux, March 2026.
- Original-resolution photo backup: `/Users/dobby/RouxLabsProductPhotos/` (2–5MB sources).
- Catalog source of truth: `assets/js/products.js` — edit prices, set sizes, badges, copy here.
- All visual rules cascade in this order: `base.css` → `pages.css` → `polish-pdp.css` / `polish-secondary.css` → `polish-desktop.css` → `polish-mobile.css`. Last wins.

## Nice-to-haves still on the table

- Dedicated 1200×630 branded OG card (currently uses a product photo).
- Real product photography for the two accessory SKUs (Roux Hook & Loop Straps, Cable ID Label Pack) — they still render placeholder SVG silhouettes on the home grid.
- Single-unit product photography (current shots are 2-up / 4-up / 8-up / 12-up compositions).
- News / lookbook page (Supreme has these).
- Real wholesale page when ready for MSP outreach.

— Last touched 2026-05-26.
