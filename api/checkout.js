/* ============================================================
   ROUX LABS — /api/checkout
   --------------------------------------------------------------
   Serverless function for Vercel / Netlify Functions / Cloudflare.
   Takes a cart, creates a Stripe Checkout Session, returns URL.

   Required env var:
     STRIPE_SECRET_KEY = sk_test_...   (or sk_live_... when ready)

   Optional env vars:
     PUBLIC_BASE_URL = https://rouxlabs.com   (defaults to req origin)
     STRIPE_TAX_ENABLED = "true"

   To deploy on Vercel:
     1. `npm i stripe`
     2. Commit this folder, push, vercel link, vercel deploy
     3. Set STRIPE_SECRET_KEY in the Vercel dashboard
   ============================================================ */

const Stripe = require("stripe");

module.exports = async function handler(req, res){
    if (req.method !== "POST"){
        res.statusCode = 405;
        res.end("Method not allowed");
        return;
    }

    const key = process.env.STRIPE_SECRET_KEY;
    if (!key){
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "STRIPE_SECRET_KEY not configured" }));
        return;
    }

    const stripe = Stripe(key);

    let body = req.body;
    if (typeof body === "string"){
        try { body = JSON.parse(body); } catch (e){ body = {}; }
    }
    const items = (body && body.items) || [];
    if (!Array.isArray(items) || items.length === 0){
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "No items in cart" }));
        return;
    }

    const origin = process.env.PUBLIC_BASE_URL
        || ((req.headers["x-forwarded-proto"] || "https") + "://" + req.headers.host);

    try {
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: items.map(function(it){
                const desc = [
                    it.color ? "Color: " + it.color : null,
                    it.orientation ? "Side: " + it.orientation : null,
                    it.setSize ? "Set of " + it.setSize : null
                ].filter(Boolean).join(" · ");
                return {
                    quantity: it.qty,
                    price_data: {
                        currency: "usd",
                        unit_amount: Math.round(it.price * 100),
                        product_data: {
                            name: it.name,
                            description: desc || undefined,
                            metadata: { sku: it.sku, product_id: it.productId }
                        }
                    }
                };
            }),
            shipping_address_collection: { allowed_countries: ["US"] },
            shipping_options: (function(){
                var subtotal = items.reduce(function(s, i){ return s + Math.round(i.price * 100) * i.qty; }, 0);
                var opts = [
                    { shipping_rate_data: { type: "fixed_amount", fixed_amount: { amount: 995, currency: "usd" }, display_name: "USPS Priority (2-3 days)" } }
                ];
                if (subtotal >= 15000){
                    opts.unshift({ shipping_rate_data: { type: "fixed_amount", fixed_amount: { amount: 0, currency: "usd" }, display_name: "Free Shipping" } });
                }
                return opts;
            })(),
            automatic_tax: { enabled: process.env.STRIPE_TAX_ENABLED === "true" },
            success_url: origin + "/success.html?status=ok&session={CHECKOUT_SESSION_ID}",
            cancel_url:  origin + "/checkout.html?status=canceled",
            metadata: {
                cart_skus: items.map(function(i){ return i.sku + "x" + i.qty; }).join(", ")
            }
        });

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ url: session.url }));
    } catch (err){
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: err.message }));
    }
};
