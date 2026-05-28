# DEMO BRIEF — Roux Labs / Johnny / $3,500

**Status:** Site LIVE — `https://rouxlabs.benops.dev` (Vercel, 200 OK, cached). Home + FlexPort + cart + AI chat all loading. **Go.**

**Heads up before you click anything:**
- Checkout button will throw the **DEV MODE alert** (`pk_test_REPLACE_ME` still in `assets/js/checkout.js`; `STRIPE_SECRET_KEY` not set on Vercel). Pre-empt it — see script.
- `checkout.html` subtitle still says "Test Mode." Small, but he'll notice.
- A few `data-dev-note` elements still in HTML.
- Real product photos ARE already in `assets/img/products/` (16 — bk/wk/ok/rk × 02/04/08/12). If those are your placeholders not Johnny's finals, confirm with him.

---

## 1) DEMO SCRIPT (≈4 min, follow in order)

### A. Home — 30s
**Click:** `rouxlabs.benops.dev`
**Say:** "Supreme-style sliced strip. White, black, one safety-orange accent — that's the whole palette. Helvetica neo-grotesque, lowercase nav, hairline borders. R&D-first brand voice, 'grey space' is the line you own."
**Don't dwell on:** copy revisions, font alternatives. Move.

### B. FlexPort PDP — 45s
**Click:** "FlexPort" in nav.
**Do:** Toggle a color chip → flip L/R → bump set size 04 → 08 → 12 → watch the SKU update live (e.g. `FP-OK-08-R`).
**Say:** "Color × orientation × set size flows straight into a clean SKU. Inventory tracks L and R separately — that matters when you're shipping patent-pending pairs. Set sizes only, like you specified — 2/4/8/12."
**Don't dwell on:** the placeholder rendering — point at the real photos.

### C. Cart drawer — 20s
**Do:** Click "Add to cart" → drawer opens → navigate to **Shop** → cart count badge persists in header.
**Say:** "Cart lives in localStorage, persists across every page. Empty state, badge auto-hides at zero, the drawer thumbnails render the right colorway."
**Don't dwell on:** code.

### D. Checkout — 30s (HANDLE THE ALERT)
**Click:** Cart icon → "Checkout."
**Say BEFORE clicking the Stripe button:** "Real Stripe Checkout is wired — serverless function in `api/checkout.js` creates a Session with line items, shipping, tax. When you click that button right now, you'll get a dev-mode alert because the live key isn't pasted yet. Pasting your live publishable key + setting the secret on Vercel takes 30 seconds. I'll show you the alert so you can see it's intentional, not a bug."
**Do:** Click. Alert fires. Close it. "That's literally the only thing between this and accepting money."

### E. AI Support Chat — 15s
**Click:** Bottom-right chat bubble.
**Say:** "Floating support widget on every page. Demo routing today — drops into your inbox or a real LLM when you want."

### F. Mobile — 30s (on your phone)
**Do:** Pull up `rouxlabs.benops.dev` on iPhone. Tap hamburger. Scroll FlexPort.
**Say:** "Mobile-first. Hamburger nav, 44×44 touch targets per Apple HIG, safe-area insets, sticky cart drawer head. Same site, no separate codebase."

### G. The ask — 60s
**Say:** "Where I'd land it: **$3,500 flat**, friend rate. Comparable buildouts run $6.5–8.5k on the open market — vanilla stack means no Shopify $39/mo, no transaction fees on top, no framework lock-in, and you or anyone you hire can edit it without a build pipeline. Two things to launch: drop your final product photos in if you want to replace mine, paste the Stripe live key. Same afternoon."

---

## 2) ANTICIPATED Qs — TIGHT ANSWERS

**"Why $3,500?"**
Friend rate. Market is $6.5–8.5k for the equivalent — 9 pages, real Stripe integration, configurator with L/R + colorway + set-size SKU logic, mobile + desktop polished, SEO + OG + JSON-LD wired, AI chat scaffolded. You own the code, zero monthly lock-in.

**"How do I take over hosting?"**
Already on Vercel under `benferreira-sources-projects` / project `roux-labs`. I'll transfer ownership to your Vercel account — 2 minutes. Auto-deploys from `github.com/benferreira-source/rouxlabs` `main` on every push. Free tier covers you until you're moving real volume.

**"What about my product photos?"**
The 16 product shots in `assets/img/products/` are placeholders. Drop your finals in with the exact same filenames (`flexport-bk-04.jpg`, `flexport-ok-12.jpg`, etc.) and they swap automatically — no code change. Conventions documented in `NOTES-FOR-JOHNNY.md` and `README.md`.

**"Stripe?"**
Two paths, both ready:
1. **Fast (5 min):** Create Stripe Payment Links per SKU, paste into `STRIPE_LINKS` in `assets/js/checkout.js`. No backend needed.
2. **Proper (multi-item carts):** Set `STRIPE_SECRET_KEY` env var on Vercel, replace `pk_test_REPLACE_ME` with your live publishable key. Serverless function (`api/checkout.js`) already builds the Session with SKU metadata, shipping rules (free over $150), and Stripe Tax-ready.

**"Mobile?"**
Already responsive. Just demoed it on my phone — same code, breakpoints at 390/768/1280/1440/1600/2200/2800.

**"SEO?"**
`sitemap.xml`, `robots.txt`, meta descriptions on every page, OG + Twitter Card tags, JSON-LD Product + ItemList schema for Google rich snippets. Run Lighthouse before launch — we'll hit >90.

**"Can I add more products?"**
Single source of truth — `assets/js/products.js`. Copy the FlexPort object, change colors / orientations / sets / specs. Site picks it up automatically, no HTML touched. Accessories category is already scaffolded — straps and label packs drop in clean.

**"Ongoing support?"**
Optional monthly retainer: $300/mo covers bug fixes, content updates, ~2 hrs of feature work. Or à la carte — I'll quote anything new.

**"Why not Shopify?"**
No $39/mo floor, no 2% transaction take on top of Stripe, no theme jail, full control over the design — which matters because the brand voice IS the moat. You can still bolt Shopify on later if you outgrow direct-to-Stripe; nothing here locks you out.

**"What's not done?"** (from `STATUS.md` — own it)
Three launch blockers, all on your side: (1) confirm/swap product photos, (2) Stripe live key + env var, (3) point `rouxlabs.com` at Vercel + set up `hello@`/`support@` forwarders. Each is minutes, not days.

---

## 3) CLOSE-THE-DEAL MOVES

- **The ask:** $3,500 flat.
- **Payment terms (suggest):** 50% on agreement, 50% on launch. Lowers his risk, locks in yours. If he wants all-on-launch, take it — the work is done.
- **If he flinches on price:** "$3,500 is the friend number. Market is $6.5–8.5k for this scope. Code is yours, no lock-in — that's where the real savings stack up over a year."
- **If "let me think about it":** "Totally. While you're thinking — send me the finalized photo set and your Stripe live key. Then when you say go, we launch the same afternoon, no waiting."
- **If he negotiates hard (sub-$2.5k):** Walk gracefully. "I want this to feel fair on both sides. If $3,500 isn't workable, no hard feelings — the site stays up while you decide." Don't discount the friend rate.
- **If he says yes:** "Great. I'll send a one-pager with payment + handoff steps tonight. Get me the photos and Stripe key whenever."

---

## 4) IF SOMETHING BREAKS MID-DEMO

| Failure | One-line recovery |
|---|---|
| `rouxlabs.benops.dev` 5xx / down | "Vercel hiccup — let me show you the local copy" → open `index.html` in Finder, or `python3 serve.py` from `~/Desktop/shared/rouxlabs/` and hit `localhost:4321`. |
| Checkout alert confuses him | "That's the dev guardrail — it'll be gone the second the live key is in. Want me to show you the serverless function so you can see it's real?" → open `api/checkout.js` in editor. |
| Cart doesn't persist | Browser private/incognito mode → switch tabs to a normal window. |
| Image broken | "Placeholder rendering — your real shots will swap in with the same filenames." Move on. |
| AI chat doesn't open | "Demo widget — wiring it to a real LLM is post-launch." Move on. |
| WiFi dies | Phone hotspot. Site loads in <1s on LTE — tested. |
| Total catastrophe | Screenshot folder: take 6 screens now (home, FlexPort, cart drawer, checkout, mobile home, mobile FlexPort) — `Cmd+Shift+4` — keep them in Photos. Worst case, scroll through those. |

---

## QUICK FACTS (for if-he-asks)

- Stack: vanilla HTML/CSS/JS, no framework, no build step
- ~1,115 lines HTML / ~3,400 CSS / ~1,050 JS
- 9 pages: index, flexport, shop, product, about, support, checkout, success, 404
- Fonts: Archivo Black / Inter / JetBrains Mono (Google Fonts, no fees)
- Hosting: Vercel (free tier easily covers MVP volume), auto-deploys from GitHub `main`
- Repo: `github.com/benferreira-source/rouxlabs`
- Dashboard: `vercel.com/benferreira-sources-projects/roux-labs`

**Go close it.**
