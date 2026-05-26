# Notes for Johnny — Roux Labs MVP

Hey Johnny — here's where we landed.

## What you're looking at

A real, working e-commerce site for Roux Labs LLC. Six pages:

- **Home** — the Supreme-style landing, with you in the grey-space brand voice
- **FlexPort** — the configurator. Pick color, Left/Right, set size. Add to cart.
- **Shop** — everything you sell, filterable
- **Grey Space** — your story + R&D timeline + patent stamp
- **Support** — FAQ + a real contact form
- **Checkout** — cart review, ships to Stripe

It runs as a plain HTML/CSS/JS site. Zero framework lock-in. You
can host it on Vercel, Netlify, GitHub Pages, or any static host
for free, and you (or anyone you hire later) can edit it without
needing a build pipeline.

## What I built around your notes

- **Sets-only purchasing.** Every product is sold in sets — 2, 4, 8, 12 — exactly like you said.
- **Left / Right versions.** Big toggle on the FlexPort page. SKUs split L and R cleanly so inventory tracks separately.
- **Four colorways.** Black, white, orange, red — matching the prototype shots.
- **Logo on product.** Embossed badge is rendered into the placeholder graphics; the real product photos will replace them.
- **Patent pending** treatment everywhere — ticker, badges, stamp on the about page.
- **Accessories category** is scaffolded (straps + label packs) so when those SKUs are ready they drop in without rebuilding.
- **R&D first** brand voice — "An R&D company that also ships." Patent date in the footer. Timeline on the About page.

## The "grey space" thing

I read your note "Grey space" as the line's positioning — the gap
between done and done-right that nobody else builds for. So:

- It's the headline on the home page
- It's the name of the About page
- It's a signature warm-grey in the palette
- It's the voice of the brand: technical, confident, opinionated

If you meant something different, easy fix. But I think it lands.

## What still needs to happen before you take live orders

Three things, ranked by how long they take:

1. **Real product photos** (1 day) — even just iPhone-on-a-white-tablecloth shots will look great. Three per colorway: hero, detail, context.
2. **Stripe** (15 minutes) — either paste Payment Links into one config object, or deploy the serverless function with a Stripe secret key. Both paths are wired and documented in the README.
3. **Domain + email** (30 minutes) — point `rouxlabs.com` at the host, set up `hello@` and `support@` forwarders.

That's it. Site goes live the same afternoon any of those are done.

## What I'd suggest after launch

- Add a "drops" or "restock" model. Even if you're not Supreme,
  controlled-release sets-of-12 with a countdown lands well with
  the homelab crowd and gives you a reason to post.
- One install case study per quarter — a real customer rack, real
  before-and-after, real names. Builds the R&D-credibility moat.
- A "matched set" SKU — one Left + one Right of the same color
  and size, priced as a bundle. People will buy it.
- Wholesale page when you're ready. Even just a contact form gated
  to MSPs. Don't have to fulfill anything yet — just collect interest.

That's the play. Hit me if you want anything tuned.

— B
