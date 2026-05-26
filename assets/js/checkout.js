/* ============================================================
   ROUX LABS — Checkout
   --------------------------------------------------------------
   Two paths, both real:

   1) DEFAULT (works today, zero backend):
      Posts cart to the small serverless function at /api/checkout
      which creates a Stripe Checkout session with line items and
      returns a redirect URL. The function lives in /api/checkout.js
      and runs on Vercel/Netlify/etc.

   2) FALLBACK (works without the backend):
      If /api/checkout isn't deployed yet, we fall back to opening
      a Stripe Payment Link configured per SKU in STRIPE_LINKS
      below. Johnny can paste in his test/live Payment Link URLs
      and have a working checkout in literally five minutes.
   ============================================================ */

(function(){
    "use strict";

    /* ---- Configuration ------------------------------------- */
    // Roux Labs Stripe publishable key (TEST). Replace with live
    // key when going live.
    const STRIPE_PUBLISHABLE_KEY = "pk_test_REPLACE_ME";

    // Optional fallback: Stripe Payment Link URLs keyed by SKU.
    // Create them in the Stripe dashboard, paste in here. Each
    // link encodes its own price/qty so you don't need a backend.
    const STRIPE_LINKS = {
        // "FP-BK-04-L": "https://buy.stripe.com/test_xxx"
    };

    const items = (window.ROUX.cart.get)();
    const itemsEl = document.querySelector("[data-checkout-items]");
    const totalsEl = document.querySelector("[data-checkout-totals]");
    const goBtn = document.querySelector("[data-checkout-go]");

    function render(){
        if (items.length === 0){
            itemsEl.innerHTML = '<div class="callout"><h2 class="h-md">YOUR CART IS EMPTY.</h2><p style="color:var(--grey-700)">Head back to the shop to add a set.</p><a href="shop.html" class="btn mt-4">Shop →</a></div>';
            totalsEl.innerHTML = '';
            goBtn.style.display = 'none';
            return;
        }
        itemsEl.innerHTML = items.map(function(it){
            const desc = [
                it.color ? "Color: " + it.color : null,
                it.orientation ? "Side: " + it.orientation : null,
                it.setSize ? "Set of " + it.setSize : null
            ].filter(Boolean).join(" · ");
            return `
              <div class="cart-row" style="grid-template-columns: 80px 1fr auto">
                <div class="thumb" style="width:80px;height:80px">${window.ROUX.productSvg(it.productId, mapColorToKey(it.color), it.setSize)}</div>
                <div class="meta">
                  <div class="name" style="font-size:16px">${it.name}</div>
                  <div class="sub">${desc}</div>
                  <div class="mono mt-2" style="font-size:11px;letter-spacing:.12em;color:var(--grey-500)">SKU ${it.sku}</div>
                </div>
                <div>
                  <div class="price">${window.ROUX.formatPrice(it.price * it.qty)}</div>
                  <div class="mono" style="font-size:11px;letter-spacing:.12em;color:var(--grey-500);text-align:right">× ${it.qty}</div>
                </div>
              </div>
            `;
        }).join("");

        const subtotal = items.reduce(function(s, it){ return s + it.price * it.qty; }, 0);
        const shipping = subtotal >= 150 ? 0 : 9.95;
        const tax = +(subtotal * 0.07).toFixed(2);
        const grand = +(subtotal + shipping + tax).toFixed(2);

        totalsEl.innerHTML = `
            <div class="line"><span>Subtotal</span><span>${window.ROUX.formatPrice(subtotal)}</span></div>
            <div class="line"><span>Shipping</span><span>${shipping === 0 ? 'Free' : window.ROUX.formatPrice(shipping)}</span></div>
            <div class="line"><span>Tax (est.)</span><span>${window.ROUX.formatPrice(tax)}</span></div>
            <div class="line grand"><span>Total</span><span>${window.ROUX.formatPrice(grand)}</span></div>
        `;
    }

    function mapColorToKey(label){
        return { Black: "BK", White: "WK", Orange: "OK", Red: "RK", Mixed: "MX" }[label] || "BK";
    }

    /* ---- Checkout flow ------------------------------------- */
    goBtn.addEventListener("click", async function(){
        const items = window.ROUX.cart.get();
        if (items.length === 0) return;

        goBtn.disabled = true;
        goBtn.textContent = "Opening Stripe...";

        // Path 1: serverless function
        try {
            const r = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: items })
            });
            if (r.ok){
                const data = await r.json();
                if (data.url){ location.href = data.url; return; }
            }
        } catch (e){ /* fall through */ }

        // Path 2: payment link fallback
        const first = items[0];
        if (STRIPE_LINKS[first.sku]){
            location.href = STRIPE_LINKS[first.sku];
            return;
        }

        // Path 3: dev mode — go to a faux success
        alert(
            "DEV MODE — backend not yet wired.\n\n" +
            "To take real payments:\n" +
            "  1. Deploy /api/checkout.js to Vercel or Netlify\n" +
            "  2. Set STRIPE_SECRET_KEY env var\n" +
            "  3. Replace pk_test_REPLACE_ME in checkout.js\n\n" +
            "OR for fastest path:\n" +
            "  Create a Stripe Payment Link per SKU and paste\n" +
            "  the URLs into STRIPE_LINKS in checkout.js."
        );
        location.href = "success.html?demo=1";
    });

    render();
})();
