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
2. **Domain** — Currently lives at `rouxlabs.benops.dev` (a Vercel custom-domain alias on the `roux-labs` project). When the real `rouxlabs.com` is acquired, add it as a custom domain in the Vercel project settings and update DNS to point at Vercel.
3. **Email** — `hello@rouxlabs.com` / `support@rouxlabs.com` referenced site-wide but no forwarders exist yet.

## Operational handles

**Production hosting — Vercel.**
- Project: `roux-labs` (ID `prj_gz5tSMRIXGjzUQcL8U3Hl6dM5lfP`) under team `benferreira-sources-projects`.
- Public URL: `https://rouxlabs.benops.dev` — Vercel custom domain (alias). The Vercel project owns the DNS terminus, not the Cloudflare tunnel.
- Git source: `github.com/benferreira-source/rouxlabs`, branch `main`. Auto-deploys on every push.
- Dashboard: https://vercel.com/benferreira-sources-projects/roux-labs
- Manual deploy from local: `vercel --prod` (the local checkout is linked via `.vercel/`).

**Local dev (not part of the production path).**
- `python3 serve.py` (port 4321) — `.claude/launch.json` wires this to the preview tool for fast iteration before pushing.
- A launchd plist `com.benops.rouxlabs` at `~/Library/LaunchAgents/` keeps `serve.py` alive at boot. This is a leftover from the pre-Vercel era and is NOT what serves `rouxlabs.benops.dev`. Logs at `~/Desktop/shared/logs/rouxlabs.{log,error.log}`. Safe to keep around for local previewing; safe to disable if you don't want it running.
- Restart serve.py if needed: `launchctl unload ~/Library/LaunchAgents/com.benops.rouxlabs.plist && launchctl load ~/Library/LaunchAgents/com.benops.rouxlabs.plist`.

**To ship a change:** edit → commit → `git push origin main` → Vercel auto-deploys (typically <30s build).

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

— Last touched 2026-05-27.
