# Roux Labs Website — MVP

E-commerce site for **Roux Labs LLC**. FlexPort and accessories.
Patent-pending zero-U cable management, sold direct-to-end-user.

---

## What's in this folder

```
index.html        Landing page (Supreme/Pit Viper-inspired hero)
flexport.html     FlexPort product page — with Left/Right + colorway + set selectors
shop.html         All products, filterable by category
product.html      Generic product detail (used for accessories)
about.html        "Grey Space" brand story + R&D timeline + patent stamp
support.html      FAQ + contact form (mailto for now)
checkout.html     Cart review + Stripe handoff
success.html      Order confirmed page
api/checkout.js   Serverless function — creates a Stripe Checkout Session
assets/css/       Two stylesheets: base.css (design system), pages.css (page-specific)
assets/js/        products.js (catalog), cart.js (header/footer/cart), checkout.js (Stripe)
assets/img/       Install photos from Johnny (resized/optimized)
package.json      Tiny — just declares the Stripe dep for the serverless fn
vercel.json       One-click Vercel deploy config
```

## Run locally

No build step. Two ways:

```bash
# 1. Python (no install required)
cd "Roux Labs Website"
python3 -m http.server 4321
# open http://localhost:4321

# 2. npx http-server with live cache disabled
cd "Roux Labs Website"
npx http-server -p 4321 -c-1
```

Open `http://localhost:4321/index.html` and click around. The
cart is real (localStorage). Checkout will pop the dev-mode alert
until Stripe is wired (one config line — see below).

---

## Going live in three steps

### 1. Real product photos

Drop final product cutouts into `assets/img/` with names like
`flexport-black-04.jpg`, `flexport-white-04.jpg`, etc., then
update `assets/js/products.js` to reference them in place of the
generated SVG renders. Look for `productSvg()` in `cart.js` — that
is the only function rendering placeholder graphics.

### 2. Stripe Checkout — pick a path

**Easiest path (5 minutes, no backend):**
1. Stripe Dashboard → Payment Links → create one Payment Link per SKU
2. Open `assets/js/checkout.js` and paste each link into `STRIPE_LINKS`:
   ```js
   const STRIPE_LINKS = {
       "FP-BK-04-L": "https://buy.stripe.com/test_...",
       "FP-BK-04-R": "https://buy.stripe.com/test_...",
       // ...
   };
   ```
3. Done. Cart will redirect to the matching Payment Link.

Caveat: Payment Links are one-product-at-a-time. Multi-item carts
need the backend path below.

**Proper path (multi-item carts, full Stripe Checkout):**
1. Deploy this folder to Vercel: `vercel deploy` (or `vercel link`
   if the project already exists)
2. In the Vercel dashboard, set environment variable
   `STRIPE_SECRET_KEY = sk_test_...` (or `sk_live_...` when live)
3. Optional: `STRIPE_TAX_ENABLED=true` if Stripe Tax is enabled
4. Open `assets/js/checkout.js`, replace
   `STRIPE_PUBLISHABLE_KEY = "pk_test_REPLACE_ME"` with the real
   publishable key
5. Push. Done.

The Checkout Session is created in `api/checkout.js`. It sends
SKU + variant detail to Stripe in metadata, so Johnny's Stripe
dashboard will show exactly what was ordered.

### 3. Order notifications

Stripe sends a customer confirmation email automatically when an
order completes. To get a notification to **Johnny** every time:

- Stripe Dashboard → Developers → Webhooks → Add endpoint
- URL: `https://your-site.com/api/order-webhook` (you'd add a
  matching `api/order-webhook.js` — keep it tiny, just forward
  to email via Resend or SendGrid)
- Event: `checkout.session.completed`

Until that exists, Johnny gets the built-in Stripe email + sees
the order in his Stripe dashboard.

---

## Adding products

Everything is driven by `assets/js/products.js`. To add a new SKU
group, copy the object structure of `roux-strap` or the FlexPort
entry. Notes:

- Set `category` to `"flexport"` or `"accessories"` (or add a new one)
- `colors[]` drives the colorway chips
- `orientations[]` drives the L/R selector — set to `null` if not applicable
- `sets[]` drives the set-size chips
- `defaults` picks what's selected on page load
- `specs[]` is rendered as the bottom-of-page spec table
- `copy.lead`, `copy.install`, `copy.features` drive the marketing copy

The site picks all products up automatically — no need to touch
HTML.

---

## Design system

CSS variables live at the top of `assets/css/base.css`. Anything
you'd want to brand-tune is in `:root`:

- `--ink` / `--paper` / `--bone` — monochrome base
- `--grey-500` — "grey space" — the brand's signature grey
- `--rl-orange` — the signature accent. Used for CTAs, hover
  states, the orange strip, and the patent-pending badge
- `--pc-*` — product colorway swatches
- `--f-display` / `--f-body` / `--f-mono` — three-font system
  (Archivo Black / Inter / JetBrains Mono — all from Google Fonts)

## Best-practice notes for Johnny

A few things worth doing before going live, in priority order:

1. **Real product photography.** The SVG renders are placeholder.
   Three shots per colorway is enough: hero (3/4 angle on white),
   detail (texture + embossed logo), context (on a live rack).
2. **Stripe Tax.** Enable it. ~$0 monthly cost, removes any tax
   headaches across states. Toggle `STRIPE_TAX_ENABLED=true`.
3. **Shipping zones.** USPS Priority is set as the default rate.
   Add UPS Ground for sets of 12+ if box-weight bumps up.
4. **Email capture.** I left the contact form as `mailto:` for
   speed — wire it to a real form service (Formspree, Resend) or
   into the same serverless layer when there's time.
5. **Domain.** Register `rouxlabs.com` if not taken. The email
   addresses in the footer assume it.
6. **Analytics.** Add Plausible or Fathom (privacy-friendly, no
   cookie banner needed). Drop the snippet in `cart.js` →
   `buildHeader` so it loads on every page.
7. **Open Graph image.** Add `<meta property="og:image">` and a
   1200×630 social card to the head of each page once the
   product photography is in.
8. **L/R inventory.** Track Left and Right SKUs separately in
   Stripe (or wherever inventory lives). The cart already passes
   them as distinct SKUs (`FP-BK-04-L` vs `FP-BK-04-R`).
9. **Pre-order language.** If a colorway is back-ordered, set its
   `available: false` in `products.js` (todo: I haven't wired the
   `disabled` class on variant chips to read from product data —
   easy one-liner when you're ready).
10. **Accessibility.** Headings, contrast, and focus states are
    solid. Run Lighthouse in Chrome once before launch — aim for
    >90 on everything.

## File deletion note

A few unused PNG copies (`Screenshot_2026-05-10_at_*.png`,
plus 4MB PNG originals next to their JPG counterparts) live in
`assets/img/`. They're hardlinks to the source folder and harmless,
but you can delete them via Finder when convenient — the site
only loads the `.jpg` versions.

---

## Credits

Built by Ben (with Claude assistance) for Johnny Roux / Roux Labs LLC,
in advance of the FlexPort patent application.
Designed for installers who care.
