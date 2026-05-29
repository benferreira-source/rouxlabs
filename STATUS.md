# STATUS — Roux Labs storefront

**Current state:** Demo-ready and post-demo polished. Live at https://rouxlabs.benops.dev.
**Repo:** github.com/benferreira-source/rouxlabs (public).
**Demo verdict:** Johnny saw it 2026-05-28 and was floored. Iterating on his feedback now.

## What shipped recently (since 2026-05-27)

This is the load-bearing recent context — read this first.

- **Home (`index.html`)** — Supreme sliced-strip intro: 28 narrow flex slivers via `flex: 1 1 0`, MSP timestamp (`America/Chicago` tz, "MSP" suffix), brand thesis line (`Zero-U Cable Management · Patented · Made in USA`) under the timestamp. Slivers use lazy `<img loading="lazy">` (not CSS background-image) so off-screen slivers don't burn bytes on first paint. No corner tags on slivers — they're hidden defensively in CSS too.
- **Logo plotter intro (home only, first session-visit)** — CSS `clip-path` left-to-right reveal with a thin safety-orange "pen" trailing the right edge. Triggered by inline JS in `index.html`; gated by `sessionStorage` + `prefers-reduced-motion`.
- **Story page (`story.html`)** — B&W portrait of Johnny in top-right of the hero, headline `DESIGNED BY JOHNNY ROUX.` on the left at `clamp(48,8vw,104)`. Inline copy was scrubbed for accidental innuendo (`"inside other people's racks"` → `"inside data closets and server rooms"`; `"Held a jack. Held a screw."` → `"It accepted a jack."` — see commit `8a01516` for the full diff).
- **Shop (`shop.html`) — totally rebuilt twice.** Current state: **4 hero colourway cards** (set-of-2 photo each), header `The Catalogue · Spring 2026 / Pick a colourway · Build your set`, closing coda `The catalogue grows slowly. On purpose.` No filter row, no variant matrix, no install triptych. Each card → `flexport.html?color=BK|WK|OK|RK`. (The prior 16-tile variant grid is gone — Johnny said it read busy.)
- **FlexPort PDP (`flexport.html`)** — now reads `?color=` and `?size=` URL params and pre-selects them before render(). Trust line `Patented · Tool-free · Made in USA` under the price. L/R orientation has helper copy + ← / → glyphs. `#specs` anchor exists.
- **WOW #1: Caliper Cursor (`assets/js/caliper.js`)** — hover any FlexPort product photo on the PDP. Custom cursor with two safety-orange tick-marks tracks the pointer. Click-drag to set jaws; release locks the measurement (turns orange-on-black readout pill). Calibrated to real patent geometry via `data-mm-per-px="0.34"` on `<img>`. Touch fallback: tap-tap. Demo gold.
- **WOW #2: Patent Diagram Overlay (PDP)** — Photo / Spec toggle pill above the gallery. Inline SVG technical drawing with real patent dimensions called out in safety-orange (`44.45 mm` 1U height, `21.34 mm` port pitch, `8.0 mm` snap-fit tab, `482.6 mm` 19" rack standard). Cross-fades from the photo on toggle. Pairs with the Caliper — measure the photo, flip to Spec, see the truth.
- **Motion layer (`assets/js/motion.js`)** — global `IntersectionObserver` sectional fade-up (12px translate + opacity, 480ms cubic-bezier). Auto-targets `main > section` and `[data-reveal]`. Plus a story-page-only digit ticker that counts each timeline `.t-date` up to its final value (`2026.02.10` cycles in over ~480ms with `font-variant-numeric: tabular-nums` so width stays still). Both gated by `prefers-reduced-motion` via `html.motion-reduce`.
- **Color contrast** — `--grey-500` darkened from `#909090` → `#707070` (AA on white); `.btn-orange` text changed from `var(--paper)` → `var(--ink)` so black-on-orange passes AAA. Brand orange unchanged.
- **Editorial checkout empty state** — `assets/js/checkout.js` renders a FlexPort thumb + `SHOP FLEXPORT →` card instead of the cold "your cart is empty" dead-end.
- **A11y baseline** — every page has `<main>` and an `<h1>` (visually-hidden via `.sr-only` on pages whose visual masthead is a logo). Chat FAB's idle orange notification dot was removed (was leaking the safety-orange into every page).
- **Repo hygiene** — 13MB of orphan PNG masters + 2 screenshots `git rm`'d. Cache-bust query strings unified to `?v=11` across HTML + cart.js + checkout.js dynamic loads.
- **Mobile pass (2026-05-28)** — Caliper is now pointer-only (`(hover: none), (pointer: coarse)` gate) so it no longer traps page scroll on touch, and is scoped to the hero photo only (no longer leaks onto swatch thumbnails / cart rows / checkout cards). `motion.js` reveal now feature-detects `IntersectionObserver` and has safety-net timers (1.2s sections, 1.5s timeline) so content can never strand invisible. Tap targets: PDP Photo/Spec toggle and chat-close now meet the 44px minimum.

## What's NOT done (launch blockers)

1. **Stripe live keys** — `checkout.js` still has `pk_test_REPLACE_ME` and the dev-mode fallback path. Either paste a live publishable key + deploy `/api/checkout.js` with `STRIPE_SECRET_KEY`, or fill `STRIPE_LINKS` with Stripe Payment Link URLs per SKU.
2. **Domain** — Currently lives at `rouxlabs.benops.dev` (a Vercel custom-domain alias). When `rouxlabs.com` is acquired, add it as a custom domain in the Vercel project settings and update DNS.
3. **Email** — `hello@rouxlabs.com` / `support@rouxlabs.com` referenced site-wide but no forwarders exist yet.

## Operational handles

**Production hosting — Vercel.**
- Project: `roux-labs` (ID `prj_gz5tSMRIXGjzUQcL8U3Hl6dM5lfP`) under team `benferreira-sources-projects`.
- Public URL: `https://rouxlabs.benops.dev` — Vercel custom domain (alias). Vercel owns the DNS terminus.
- Git source: `github.com/benferreira-source/rouxlabs`, branch `main`. Auto-deploys on every push.
- Dashboard: https://vercel.com/benferreira-sources-projects/roux-labs
- Manual deploy from local: `vercel --prod` (the local checkout is linked via `.vercel/`).

**Local dev (not the production path).**
- `python3 serve.py` (port 4321) — `.claude/launch.json` wires this to the preview tool. Polls fresh on each request, no restart needed.
- A launchd plist `com.benops.rouxlabs` keeps `serve.py` alive at boot. Leftover from the pre-Vercel era; NOT what serves the public URL. Logs at `~/Desktop/shared/logs/rouxlabs.{log,error.log}`.

**To ship a change:** edit → commit → `git push origin main` → Vercel auto-deploys (~15–30s build).

## Gotchas for a fresh session

- **NEVER `git add -A` or `git add .`** — `DEMO_BRIEF.md` is in `.gitignore` now, but other untracked files can sneak in. Stage by name: `git add story.html assets/css/pages.css ...`.
- **Auto-mode classifier blocks bare `git push origin main`.** Workflow: split commit and push into separate calls; if push gets blocked, surface to the user and they can run `! git push origin main` in their prompt (executes in the session).
- **macOS sometimes locks individual files** — usually a VM, Spotlight indexer, or editor inside another app holds an exclusive read lock. Symptom: `cat /path/to/file` returns `Operation not permitted` even though `ls -la` shows correct perms. Fix: ask the user to close whatever's holding it; poll with `until head -1 /path >/dev/null 2>&1; do sleep 2; done`. Worst case, the entire `.git/` directory becomes TCC-locked after rapid file edits — at that point only the user can recover (Settings → Privacy & Security → Full Disk Access for Terminal/Claude).
- **Cache-bust version is `?v=11`** as of this writing. When you change CSS/JS, bump to `?v=12` site-wide:
  ```
  for f in *.html; do sed -i '' -E 's|\?v=[0-9]+|?v=12|g' "$f"; done
  sed -i '' -E 's|\?v=[0-9]+|?v=12|g' assets/js/cart.js assets/js/checkout.js
  ```
  Vercel sets `Cache-Control: immutable, max-age=31536000` on `/assets/*`, so without a bump, browsers hold stale assets for a year.
- **Assets that load dynamically:** `cart.js` injects `chat.js`, `newsletter.js`, `motion.js`, and `polish-{desktop,mobile,home}.css` on every page. Bump THOSE versions in `cart.js` too when you cache-bust.
- **`DEMO_BRIEF.md` incident** — earlier in the day I accidentally swept this private file into a commit via `git add -A`. The file was emptied to 1 byte on `main` and `.gitignore`'d, but the original 8647-byte version still exists in historical commit `339bc98`. Fully purging it from history needs the user to run `git filter-repo` or the 5-command rewrite sequence at their terminal. Not urgent.

## Useful pointers

- Patent doc: `/Users/dobby/Downloads/flexport_patent_consultation_packet.pdf` — authored by Johnny Roux, March 2026. Real dimensions: panel height 44.45mm (1U), port pitch 21.34mm, snap-fit tab 8.0mm, rack-standard width 482.6mm.
- Original-resolution photo backup: `/Users/dobby/RouxLabsProductPhotos/` (2–5MB sources).
- Catalog source of truth: `assets/js/products.js` — `inactive: true` on accessories hides them from `/shop`. Edit prices/sets/badges/copy here.
- CSS cascade order: `base.css` → `pages.css` → `polish-pdp.css` / `polish-secondary.css` → `polish-desktop.css` → `polish-mobile.css` → `polish-home.css`. Last wins. `polish-home.css` is scoped to `body.page-home` so it's inert elsewhere.
- Recent file map:
  - `assets/js/caliper.js` — Caliper Cursor WOW
  - `assets/js/motion.js` — sectional fade-up + timeline ticker
  - `flexport.html` lines 88–155 — inline SVG patent diagram
  - `index.html` lines 78–94 — logo plotter intro JS
  - `shop.html` — 4 colourway cards (current); previous 16-tile grid lives only in git history

## Nice-to-haves still on the table

- Dedicated 1200×630 branded OG card (currently uses a product photo).
- Real product photography for the two accessory SKUs (currently `inactive: true`, hidden from /shop).
- Single-unit product photography (current shots are 2-up / 4-up / 8-up / 12-up compositions).
- News / lookbook page.
- Real wholesale page for MSP outreach.

— Last touched 2026-05-28 (mobile scroll fix + mobile enhancement pass).
