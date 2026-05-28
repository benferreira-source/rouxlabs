# BRIEF — Rebuild the home page as Supreme's "sliced strip" intro

**Status:** Spec'd and started in the previous session, then handed off here to be built fresh. The live `index.html` is currently the 4-column tile grid (last committed state, working). Your job is to replace it with the layout described below.

**Live site URL:** https://rouxlabs.benops.dev — served straight off disk by `serve.py`, so edits go live immediately (Cloudflare cache permitting).

---

## What we're copying

Supreme.com's current homepage. The user attached a screenshot of `us.supreme.com/pages/shop` showing:

1. Centered red "Supreme" wordmark at the top of a mostly-empty white page
2. A small mono caps timestamp directly under the logo: `05/27/2026 09:46pm NYC`
3. A wide horizontal strip of **vertical sliced product photos** — each slice is a tall narrow column showing a piece of a product photo, with a small `new` tag in the corner of select slices, arranged edge-to-edge like a film reel. Each slice is a clickable link to that product.
4. A small mono link row at the bottom of the strip: left side `shop · view all`, right side `spring/summer 2026 preview · lookbook · news`.

User direction (verbatim): *"Let's chop up product images, any and all images, data racks, and whatever else you deem appropriate into the array, and also make sure the Roux Labs logo is centered like the supreme.com one i screenshot."*

---

## Roux Labs implementation spec

### Layout (top to bottom)
1. **Tight centered logo** — `assets/img/logo-roux.png`, ~80–120px tall. Same vertical posture as Supreme's red box but with our swoosh wordmark.
2. **Live timestamp** in mono caps directly under the logo. Format: `MM/DD/YYYY HH:MMam/pm NYC`. Render in `America/New_York` via `Intl.DateTimeFormat`, stamped on page load (don't tick — that's distracting).
3. **Generous vertical whitespace** between the logo block and the strip.
4. **Horizontal sliced strip** — ~16 tall narrow slices, edge-to-edge across the viewport width. Each slice: ~50–80px wide, ~400–500px tall, `aspect-ratio` something like `1 / 6`. Background image is a real photo with `object-fit: cover` and a custom `object-position` so each slice frames a different focal point — even when two slices share the same source image. Small `new` (or `rack`, `install`) tag in the top-right corner of select slices.
5. **Small mono link row** below the strip. Lowercase, bullet-separated. Left: `shop · view all`. Right: `flexport zero-u · grey space · support` (skip Supreme's `lookbook / news` — we don't have those pages yet).

### Slice content (the "array")

You have these images to work with:
- 16 FlexPort photos: `assets/img/products/flexport-{bk,wk,ok,rk}-{02,04,08,12}.jpg`
- `assets/img/install-rack-closeup.jpg`
- `assets/img/install-rack-full.jpg`
- `assets/img/install-flexport-detail.jpg`

Mix them. Repeat source images across multiple slices with different `object-position` values so each slice reads as its own crop. Aim for variety: dense FlexPort sets (set-of-12 photos are great — lots of repeated panels per frame), single colorway shots, and rack-context shots for editorial breathing room.

Each slice links somewhere:
- FlexPort colorway slices → `flexport.html?color={KEY}`
- Rack context slices → `flexport.html` or `about.html`
- Install detail → `flexport.html`

### Important constraints

- **Keep the existing global header.** `cart.js`'s `buildHeader()` already detects the home page (`isHome` branch) and renders the giant centered logo intro. **Replace that home-branch layout** so it renders just a tiny utility row (cart + hamburger in the corner) — the big centered logo now lives in `index.html`'s body, NOT in the header. Don't break non-home pages: the `!isHome` branch must stay as-is (compact left-aligned logo header).
- **Keep all global elements:** site-footer (single Supreme utility row, auto-injected by cart.js), chat widget (auto-loaded), newsletter modal (auto-loaded).
- **Don't touch other pages.** Only `index.html` + the home branch in `cart.js` + new CSS for the home-strip / home-intro / home-slice classes.
- **CSS scoping:** all new rules go under `body.page-home` selectors. Append to `pages.css` under a clearly-labeled section, or create a new `polish-home.css` and load it via cart.js (mirror the desktop/mobile pattern).
- **Mobile:** the strip should be horizontally scrollable on phones with `overflow-x: auto` + `scroll-snap-type: x mandatory`. Hide the scrollbar visually but keep momentum scroll. Slices stay tall but can shrink to ~50px wide.

---

## Drafted starting point (use or rewrite)

The previous session drafted this `index.html` body before handing off. Reuse what's useful, or rebuild from scratch — your call.

```html
<header class="site-header" data-roux-header></header>

<section class="home-intro">
  <a class="home-intro-brand" href="index.html" aria-label="Roux Labs">
    <img src="assets/img/logo-roux.png" alt="Roux Labs">
  </a>
  <div class="home-intro-stamp mono" data-home-timestamp></div>
</section>

<nav class="home-strip" data-home-strip aria-label="Featured"></nav>

<nav class="home-strip-links mono" aria-label="Browse">
  <div class="left">
    <a href="shop.html">shop</a>
    <span class="sep">·</span>
    <a href="shop.html">view all</a>
  </div>
  <div class="right">
    <a href="flexport.html">flexport zero-u</a>
    <span class="sep">·</span>
    <a href="about.html">grey space</a>
    <span class="sep">·</span>
    <a href="support.html">support</a>
  </div>
</nav>

<footer class="site-footer" data-roux-footer></footer>
```

And the slice JS scaffold:

```js
var SLICES = [
  { src: "assets/img/products/flexport-bk-12.jpg", pos: "20% 50%", href: "flexport.html?color=BK", tag: "new" },
  { src: "assets/img/products/flexport-bk-12.jpg", pos: "70% 50%", href: "flexport.html?color=BK", tag: "new" },
  { src: "assets/img/products/flexport-rk-04.jpg", pos: "30% 50%", href: "flexport.html?color=RK", tag: "new" },
  { src: "assets/img/install-rack-closeup.jpg",    pos: "50% 50%", href: "flexport.html",         tag: "rack" },
  { src: "assets/img/products/flexport-wk-04.jpg", pos: "25% 50%", href: "flexport.html?color=WK", tag: "new" },
  { src: "assets/img/products/flexport-wk-04.jpg", pos: "75% 50%", href: "flexport.html?color=WK" },
  { src: "assets/img/install-flexport-detail.jpg", pos: "30% 50%", href: "flexport.html",         tag: "install" },
  { src: "assets/img/install-flexport-detail.jpg", pos: "70% 50%", href: "flexport.html" },
  { src: "assets/img/products/flexport-ok-12.jpg", pos: "20% 50%", href: "flexport.html?color=OK", tag: "new" },
  { src: "assets/img/products/flexport-ok-12.jpg", pos: "65% 50%", href: "flexport.html?color=OK" },
  { src: "assets/img/install-rack-full.jpg",       pos: "30% 50%", href: "about.html",            tag: "rack" },
  { src: "assets/img/install-rack-full.jpg",       pos: "55% 50%", href: "about.html" },
  { src: "assets/img/install-rack-full.jpg",       pos: "78% 50%", href: "about.html" },
  { src: "assets/img/products/flexport-rk-12.jpg", pos: "40% 50%", href: "flexport.html?color=RK", tag: "new" },
  { src: "assets/img/products/flexport-bk-04.jpg", pos: "50% 50%", href: "flexport.html?color=BK" },
  { src: "assets/img/install-rack-closeup.jpg",    pos: "75% 50%", href: "flexport.html",         tag: "install" }
];

strip.innerHTML = SLICES.map(function(s){
    var bg = "background-image:url('" + s.src + "');background-position:" + s.pos + ";";
    var tag = s.tag ? '<span class="home-slice-tag mono">' + s.tag + '</span>' : '';
    return '<a class="home-slice" href="' + s.href + '">'
         +   '<div class="home-slice-img" style="' + bg + '"></div>'
         +   tag
         + '</a>';
}).join("");
```

The timestamp JS (already proven on the desktop preview):

```js
var parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: true
}).formatToParts(new Date());
function p(t){ var x = parts.find(function(o){ return o.type === t; }); return x ? x.value : ""; }
el.textContent = p("month") + "/" + p("day") + "/" + p("year")
    + " " + p("hour") + ":" + p("minute") + (p("dayPeriod") || "").toLowerCase() + " NYC";
```

---

## Deliverable checklist

- [ ] `index.html` body matches the Supreme intro layout
- [ ] `cart.js` `buildHeader()` home branch renders a minimal corner-only utility (no giant centered logo — that lives in the body now)
- [ ] New CSS section (in `pages.css` or a fresh `polish-home.css`) styles `.home-intro`, `.home-strip`, `.home-slice`, `.home-strip-links`
- [ ] Live NYC timestamp renders correctly under the logo
- [ ] ~16 slices render, edge-to-edge, with varied crops; each clickable
- [ ] Mobile: strip horizontal-scrolls smoothly
- [ ] Visual verification at desktop (1280, 2560) and iPhone (390) widths
- [ ] Commit with a clear message, push to `origin/main`

---

## Don't

- Don't put back "Patent Pending" anywhere
- Don't restore the patent color-coding key (red/orange/white/black mapping) on FlexPort PDP
- Don't rename product photo filenames — `cart.js`'s `flexportImgPath()` references them exactly
- Don't break non-home pages — only touch `cart.js`'s home branch
