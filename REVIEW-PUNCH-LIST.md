# Roux Labs Website — Review & Punch List

End-to-end review completed May 10, 2026. Summary of what was found, what was fixed, and what still needs Johnny's input before launch.

---

## Bugs Fixed

### 1. Cart drawer showed wrong colorway SVG
**Where:** `assets/js/cart.js` → `renderCart()`
**Problem:** Cart items store color as a label ("Orange", "White") but `productSvg()` expects keys ("OK", "WK"). Every cart item rendered as black regardless of actual color.
**Fix:** Added `mapColorLabelToKey()` helper and applied it in the drawer render. Cart now shows correct colorway thumbnails.

### 2. No mobile navigation
**Where:** Header (injected by `cart.js`)
**Problem:** Desktop nav was `hide-mobile` with no hamburger/fallback. Mobile users had no way to reach Shop, FlexPort, Grey Space, or Support from the header — only the footer links worked.
**Fix:** Added a hamburger button (`.menu-btn`, visible on mobile only) and a collapsible `.mobile-nav` panel below the header bar. CSS added to `base.css`, toggle handler added to `cart.js`.

### 3. product.html didn't update page title
**Where:** `product.html` inline script
**Problem:** Browser tab always showed "Product · Roux Labs" regardless of which product was loaded.
**Fix:** Added `document.title = PRODUCT.name + " · Roux Labs"` on product load.

### 4. Missing aria-labels on product.html qty buttons
**Where:** `product.html` — decrease/increase buttons
**Fix:** Added `aria-label="Decrease"` and `aria-label="Increase"` to match `flexport.html`.

### 5. Stripe checkout offered free shipping to everyone
**Where:** `api/checkout.js` — `shipping_options`
**Problem:** Both "USPS Priority ($9.95)" and "Free Shipping (orders $150+)" were always shown, letting users select free shipping even on small orders.
**Fix:** Shipping options are now computed from cart subtotal. Free shipping only appears when subtotal ≥ $150.

### 6. SKU prefix was always "FP" for every product
**Where:** `assets/js/products.js` → `makeSku()`
**Problem:** Accessories (straps, label packs) got FlexPort SKU prefixes: `FP-BK-25` instead of something distinct.
**Fix:** Added a `prefixMap` — FlexPort → FP, Roux Strap → RS, Label Pack → LP, fallback → RL.

### 7. Install image was overridden by gradient
**Where:** `index.html` inline script
**Problem:** JS unconditionally replaced the install section's background image (a real JPG) with a gradient, even though the photo was present in `assets/img/`.
**Fix:** Now only applies the gradient fallback if no `background-image` is already set in the HTML.

### 8. Missing meta description on shop.html
**Where:** `shop.html` `<head>`
**Fix:** Added `<meta name="description">` tag.

### 9. Placeholder text cleaned up
**Where:** `flexport.html`, `support.html`, `checkout.html`
**Problem:** Dev-facing notes like "until backend mail is wired" and "Test mode" card-number callout were visible to end users.
**Fix:** Reworded where possible, tagged all dev-only elements with `data-dev-note` and `<!-- TODO: Remove before launch -->` comments so they're easy to find and strip.

---

## Still Outstanding — Needs Johnny

### Before launch (blocking)

1. **Real product photos.** Every product image is an SVG placeholder. Drop final cutouts into `assets/img/` and update `productSvg()` in `cart.js` (the only function rendering placeholders). Three shots per colorway is enough: hero, detail, on-rack context.

2. **Stripe keys.** `pk_test_REPLACE_ME` in `assets/js/checkout.js` and `STRIPE_SECRET_KEY` env var on the deploy host. README has full instructions for both the Payment Link path (5 minutes) and the serverless function path.

3. **Remove `data-dev-note` elements.** Search the HTML files for `data-dev-note` and delete those elements before launch. They're clearly commented with `<!-- TODO: Remove before launch -->`.

4. **Remove "Test Mode" from checkout subtitle.** `checkout.html` line 21: change `Stripe-secured · Test Mode` to just `Stripe-secured`.

5. **Domain and email.** Register/point `rouxlabs.com`. Set up `hello@` and `support@` forwarders. The site references both throughout the footer and support page.

### After launch (non-blocking)

6. **Contact form backend.** The support form currently falls back to `mailto:`. Wire it to Formspree, Resend, or a serverless function for a better UX.

7. **Open Graph images.** Add `<meta property="og:image">` with a 1200×630 social card to each page once product photography exists.

8. **Analytics.** Add Plausible or Fathom snippet to `buildHeader()` in `cart.js` so it loads on every page.

9. **Stripe Tax.** Set `STRIPE_TAX_ENABLED=true` in the deploy environment. Near-zero cost, removes multi-state tax complexity.

10. **Pre-order / out-of-stock logic.** The `disabled` class exists on variant chips in CSS but nothing in `products.js` drives it. Add an `available: false` flag per colorway when needed — one-liner wiring.

11. **Favicon.** No `<link rel="icon">` on any page. Add a favicon from the brand mark.

12. **Cleanup unused images.** `assets/img/` has screenshot PNGs and duplicate PNG originals of the JPGs. Delete via Finder — the site only loads the `.jpg` versions.

---

## Architecture & Code Quality Notes

**What's solid:**
- Single source of truth for products (`products.js`) — clean, easy to extend.
- Cart persists across pages via localStorage. Add/update/remove all work correctly.
- Cross-page nav is consistent — all links work, footer links are correct, breadcrumbs on flexport.html are accurate.
- Stripe integration is well-structured with three fallback paths (serverless → Payment Links → dev alert).
- CSS is responsive at all major breakpoints. Grid layouts collapse cleanly on mobile.
- Configurator logic (color + L/R + set size + qty) is correct. SKU generation matches the convention.
- `vercel.json` is properly configured with clean URLs, caching headers, and API rewrites.
- No JS framework dependencies — the whole site is vanilla HTML/CSS/JS. Easy to hand off.

**What could be improved later:**
- The `cleanUrls: true` in `vercel.json` means all internal `.html` links will trigger a 301 redirect on Vercel. Works fine but adds a tiny redirect hop. Could strip `.html` from internal links for slightly faster navigation.
- No service worker or offline support. Not needed for v1 but worth considering.
- The ticker animation duplicates its content for seamless looping — works but could use CSS-only duplication via `animation-iteration-count: infinite`.

---

## README.md & NOTES-FOR-JOHNNY.md

Both documents are accurate and well-written. A few minor notes:

- README credits section mentions "Built by Ben (with Claude assistance)" — confirm Johnny is OK with this before launch.
- NOTES-FOR-JOHNNY lists 6 pages but there are actually 8 files (also `success.html` and `product.html`) — minor, since those are functional pages rather than top-level destinations.
- The "Going live in three steps" section in README is clear and actionable. No corrections needed.

---

*Review by Claude, May 10, 2026*
