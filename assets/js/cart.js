/* ============================================================
   ROUX LABS — Cart + UI plumbing
   --------------------------------------------------------------
   Cart lives in localStorage under "roux:cart". Each item:
     { sku, productId, name, color, orientation, setSize, price, qty }
   Header/footer are also injected here so each page stays tidy.
   ============================================================ */

(function(){
    "use strict";
    window.ROUX = window.ROUX || {};

    const STORAGE_KEY = "roux:cart";

    /* ---------- Cart store ----------------------------------- */
    function loadCart(){
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e){ return []; }
    }
    function saveCart(c){
        localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
        ROUX.renderCart();
        updateCartCount();
    }
    function cartCount(){
        return loadCart().reduce(function(n, item){ return n + item.qty; }, 0);
    }
    function cartSubtotal(){
        return loadCart().reduce(function(s, item){ return s + (item.price * item.qty); }, 0);
    }

    ROUX.cart = {
        get: loadCart,
        clear: function(){ saveCart([]); },
        add: function(item){
            const cart = loadCart();
            const existing = cart.find(function(x){ return x.sku === item.sku; });
            if (existing) existing.qty += item.qty;
            else cart.push(item);
            saveCart(cart);
            openDrawer();
        },
        update: function(sku, qty){
            const cart = loadCart().map(function(x){
                if (x.sku === sku) x.qty = Math.max(0, qty);
                return x;
            }).filter(function(x){ return x.qty > 0; });
            saveCart(cart);
        },
        remove: function(sku){
            saveCart(loadCart().filter(function(x){ return x.sku !== sku; }));
        }
    };

    /* ---------- Header / Footer injection -------------------- */
    function buildHeader(){
        const header = document.querySelector("[data-roux-header]");
        if (!header) return;
        const path = (location.pathname.split("/").pop() || "index.html");
        const isHome = path === "index.html" || path === "" || path === "/";
        const nav = [
            { href: "index.html", label: "Home" },
            { href: "shop.html", label: "Shop" },
            { href: "flexport.html", label: "FlexPort" },
            { href: "about.html", label: "Grey Space" },
            { href: "story.html", label: "Story" },
            { href: "support.html", label: "Support" }
        ];
        const navLinks = nav.map(function(n){
            const active = path === n.href ? " class=\"active\"" : "";
            return '<a href="' + n.href + '"' + active + '>' + n.label + '</a>';
        }).join("");
        const utilityCorner = '<div class="header-utility">'
          + '<button class="cart-btn" data-cart-toggle aria-label="Open cart">Cart <span class="cart-count" data-cart-count>0</span></button>'
          + '<button class="menu-btn show-mobile" data-menu-toggle aria-label="Open menu"><span></span><span></span><span></span></button>'
          + '</div>';

        if (isHome){
            /* Supreme sliced-strip home: the giant logo + intro now live
               in index.html's body. Header is just a tiny corner utility
               (cart + hamburger). The mobile-nav drawer rides along so
               the hamburger still works at phone widths. */
            header.innerHTML = ''
              + utilityCorner
              + '<nav class="mobile-nav" data-mobile-nav aria-label="Mobile navigation">' + navLinks + '</nav>';
            return;
        }

        /* Non-home: compact left-aligned header. */
        header.innerHTML = ''
          + '<div class="header-bar">'
          +   '<div class="header-left">'
          +     '<a class="brand" href="index.html" aria-label="Roux Labs home">'
          +       '<img class="brand-logo" src="assets/img/logo-roux.png" alt="Roux Labs">'
          +     '</a>'
          +   '</div>'
          +   '<nav class="nav hide-mobile" aria-label="Primary">' + navLinks + '</nav>'
          +   utilityCorner
          + '</div>'
          + '<nav class="mobile-nav" data-mobile-nav aria-label="Mobile navigation">' + navLinks + '</nav>';
    }

    function buildFooter(){
        const f = document.querySelector("[data-roux-footer]");
        if (!f) return;
        const year = new Date().getFullYear();
        f.innerHTML = `
          <div class="site-footer-inner">
            <nav class="footer-links" aria-label="Footer">
              <a href="about.html">about</a><span class="sep">·</span>
              <a href="support.html">f.a.q.</a><span class="sep">·</span>
              <a href="story.html">inventor</a><span class="sep">·</span>
              <a href="flexport.html">sizing</a><span class="sep">·</span>
              <a href="support.html#contact">contact</a><span class="sep">·</span>
              <a href="about.html#patent">patent</a><span class="sep">·</span>
              <a href="#mailing-list" data-newsletter-open>mailing list</a><span class="sep">·</span>
              <a href="shop.html">shop</a><span class="sep">·</span>
              <a href="about.html#terms">terms</a><span class="sep">·</span>
              <a href="about.html#privacy">privacy</a><span class="sep">·</span>
              <a href="about.html#accessibility">accessibility</a>
            </nav>
            <div class="footer-mark">© ${year} roux labs llc · made in usa</div>
          </div>
        `;
    }

    function buildDrawer(){
        if (document.querySelector("[data-cart-drawer]")) return;
        const drawer = document.createElement("div");
        drawer.className = "drawer";
        drawer.setAttribute("data-cart-drawer", "");
        drawer.innerHTML = `
          <div class="drawer-backdrop" data-cart-close></div>
          <aside class="drawer-panel" role="dialog" aria-label="Shopping cart">
            <header class="drawer-head">
              <div style="font-family:var(--f-display);text-transform:uppercase;font-size:18px;">Cart</div>
              <button class="close-x" data-cart-close aria-label="Close cart">×</button>
            </header>
            <div class="drawer-body" data-cart-body>
              <p class="mono" style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--grey-700);">Your cart is empty</p>
            </div>
            <footer class="drawer-foot">
              <div class="flex-between" style="font-family:var(--f-mono);font-size:13px;margin-bottom:var(--s-4)">
                <span>Subtotal</span>
                <span data-cart-subtotal>$0.00</span>
              </div>
              <a href="checkout.html" class="btn btn-block">Checkout</a>
              <div class="mt-3 center mono" style="font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--grey-500);">
                Stripe-secured. Shipping calculated at checkout.
              </div>
            </footer>
          </aside>
        `;
        document.body.appendChild(drawer);
    }

    function openDrawer(){
        const d = document.querySelector("[data-cart-drawer]");
        if (d) d.classList.add("open");
    }
    function closeDrawer(){
        const d = document.querySelector("[data-cart-drawer]");
        if (d) d.classList.remove("open");
    }

    function updateCartCount(){
        var n = cartCount();
        document.querySelectorAll("[data-cart-count]").forEach(function(el){
            el.textContent = String(n);
            el.classList.toggle("is-empty", n === 0);
        });
    }

    /* ---------- Color label → key mapper ---------------------- */
    function mapColorLabelToKey(label){
        return { Black: "BK", White: "WK", Orange: "OK", Red: "RK", Mixed: "MX" }[label] || "BK";
    }

    /* ---------- Drawer rendering ----------------------------- */
    ROUX.renderCart = function(){
        const body = document.querySelector("[data-cart-body]");
        const sub  = document.querySelector("[data-cart-subtotal]");
        const checkoutLink = document.querySelector("[data-cart-drawer] a[href='checkout.html']");
        const cart = loadCart();
        if (sub) sub.textContent = ROUX.formatPrice(cartSubtotal());
        if (checkoutLink){
            checkoutLink.classList.toggle("is-disabled", cart.length === 0);
            checkoutLink.setAttribute("aria-disabled", cart.length === 0 ? "true" : "false");
        }
        if (!body) return;
        if (cart.length === 0){
            body.innerHTML = ''
              + '<div class="drawer-empty">'
              +   '<div class="drawer-empty-eyebrow mono">cart · empty</div>'
              +   '<div class="drawer-empty-title">Nothing here yet.</div>'
              +   '<p class="drawer-empty-copy">Sets of FlexPort ship within 3 business days. Free shipping over $150.</p>'
              +   '<a href="shop.html" class="btn btn-block" data-cart-close>Shop FlexPort →</a>'
              + '</div>';
            return;
        }
        body.innerHTML = cart.map(function(item){
            const desc = [
                item.color   ? "Color: " + item.color : null,
                item.orientation ? "Side: " + item.orientation : null,
                item.setSize ? "Set of " + item.setSize : null
            ].filter(Boolean).join(" · ");
            return `
              <div class="cart-row">
                <div class="thumb">${ROUX.productSvg(item.productId, mapColorLabelToKey(item.color), item.setSize)}</div>
                <div class="meta">
                  <div class="name">${item.name}</div>
                  <div class="sub">${desc}</div>
                  <div class="qty-stepper mt-2">
                    <button data-cart-dec="${item.sku}" aria-label="Decrease">−</button>
                    <span class="val">${item.qty}</span>
                    <button data-cart-inc="${item.sku}" aria-label="Increase">+</button>
                  </div>
                </div>
                <div>
                  <div class="price">${ROUX.formatPrice(item.price * item.qty)}</div>
                  <button class="mono" data-cart-remove="${item.sku}" style="background:transparent;border:0;cursor:pointer;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--grey-500);padding:4px 0;margin-top:8px;">Remove</button>
                </div>
              </div>
            `;
        }).join("");
    };

    /* ---------- Wire up clicks ------------------------------- */
    document.addEventListener("click", function(e){
        const t = e.target;
        if (t.closest("[data-menu-toggle]")){
            var mn = document.querySelector("[data-mobile-nav]");
            if (mn) mn.classList.toggle("open");
            return;
        }
        if (t.closest("[data-cart-toggle]")){ openDrawer(); return; }
        if (t.closest("[data-cart-close]")){ closeDrawer(); return; }
        const inc = t.closest("[data-cart-inc]");
        if (inc){
            const sku = inc.getAttribute("data-cart-inc");
            const c = loadCart().find(function(x){ return x.sku === sku; });
            if (c) ROUX.cart.update(sku, c.qty + 1);
            return;
        }
        const dec = t.closest("[data-cart-dec]");
        if (dec){
            const sku = dec.getAttribute("data-cart-dec");
            const c = loadCart().find(function(x){ return x.sku === sku; });
            if (c) ROUX.cart.update(sku, c.qty - 1);
            return;
        }
        const rem = t.closest("[data-cart-remove]");
        if (rem){
            ROUX.cart.remove(rem.getAttribute("data-cart-remove"));
            return;
        }
    });

    /* ---------- Boot ----------------------------------------- */
    function loadSupportChat(){
        if (document.querySelector('script[data-roux-chat]')) return;
        var s = document.createElement("script");
        s.src = "assets/js/chat.js?v=7";
        s.defer = true;
        s.setAttribute("data-roux-chat", "");
        document.body.appendChild(s);
    }

    function loadNewsletter(){
        if (document.querySelector('script[data-roux-newsletter]')) return;
        var s = document.createElement("script");
        s.src = "assets/js/newsletter.js?v=7";
        s.defer = true;
        s.setAttribute("data-roux-newsletter", "");
        document.body.appendChild(s);
    }

    function loadResponsivePolish(){
        // Inject the viewport-specific polish stylesheets on every
        // page. They live after pages.css + the page-scoped polish files
        // so their rules cascade cleanly. polish-home is scoped to
        // .page-home so it is inert on every other page.
        ["polish-desktop", "polish-mobile", "polish-home"].forEach(function(name){
            if (document.querySelector('link[data-roux-' + name + ']')) return;
            var l = document.createElement("link");
            l.rel = "stylesheet";
            l.href = "assets/css/" + name + ".css?v=7";
            l.setAttribute("data-roux-" + name, "");
            document.head.appendChild(l);
        });
    }

    document.addEventListener("DOMContentLoaded", function(){
        loadResponsivePolish();
        buildHeader();
        buildFooter();
        buildDrawer();
        ROUX.renderCart();
        updateCartCount();
        loadSupportChat();
        loadNewsletter();
    });

    /* ---------- Product image / silhouette ------------------ */
    /*
       FlexPort renders the real product photo (4 colors × 4 set sizes).
       Accessories still fall back to an SVG silhouette until real
       photography exists.
    */
    const COLOR_MAP = {
        BK: { fill: "#111111", stroke: "#000000", logo: "#ffffff" },
        WK: { fill: "#f4f1ec", stroke: "#0a0a0a", logo: "#0a0a0a" },
        OK: { fill: "#ff5a1f", stroke: "#0a0a0a", logo: "#0a0a0a" },
        RK: { fill: "#c8102e", stroke: "#0a0a0a", logo: "#ffffff" },
        MX: { fill: "#8b8b90", stroke: "#0a0a0a", logo: "#ffffff" }
    };

    const FLEXPORT_SET_SIZES = [2, 4, 8, 12];
    const FLEXPORT_DEFAULT_SET = 4;

    function flexportImgPath(colorKey, setSize){
        const key = (colorKey || "BK").toLowerCase();
        const size = FLEXPORT_SET_SIZES.indexOf(setSize) === -1 ? FLEXPORT_DEFAULT_SET : setSize;
        return "assets/img/products/flexport-" + key + "-" + String(size).padStart(2, "0") + ".jpg";
    }

    ROUX.productSvg = function(productId, colorKey, setSize){
        const c = COLOR_MAP[colorKey] || COLOR_MAP.BK;
        if (productId === "flexport-zero-u"){
            const colorName = { BK: "Black", WK: "White", OK: "Orange", RK: "Red" }[colorKey] || "Black";
            const size = FLEXPORT_SET_SIZES.indexOf(setSize) === -1 ? FLEXPORT_DEFAULT_SET : setSize;
            // data-caliper + data-mm-per-px: caliper.js attaches a digital
            // caliper cursor to this image. Calibration ~0.34 mm/px matches
            // the standard 1U FlexPort panel framed in our 1500px photos.
            return '<img src="' + flexportImgPath(colorKey, setSize)
                 + '" alt="FlexPort Zero-U Panel, ' + colorName + ', set of ' + size
                 + '" loading="lazy" width="1500" height="1500" data-caliper data-mm-per-px="0.34">';
        }
        if (productId === "roux-strap"){
            return `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <g stroke="${c.stroke}" stroke-width="2" fill="${c.fill}">
                  <rect x="30" y="60" width="180" height="32" rx="2"/>
                  <rect x="30" y="108" width="180" height="32" rx="2"/>
                  <rect x="30" y="156" width="180" height="32" rx="2"/>
                </g>
                <g fill="${c.logo}" font-family="Archivo Black, Helvetica, sans-serif" font-size="9" letter-spacing="1">
                  <text x="42" y="80">ROUX</text>
                  <text x="42" y="128">ROUX</text>
                  <text x="42" y="176">ROUX</text>
                </g>
            </svg>`;
        }
        if (productId === "label-pack"){
            return `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <g stroke="${c.stroke}" stroke-width="2">
                  <rect x="40" y="40" width="160" height="160" fill="${c.fill}"/>
                  <rect x="60" y="60" width="120" height="20" fill="#fff"/>
                  <rect x="60" y="90" width="120" height="20" fill="#fff"/>
                  <rect x="60" y="120" width="120" height="20" fill="#fff"/>
                  <rect x="60" y="150" width="120" height="20" fill="#fff"/>
                </g>
                <g fill="${c.stroke}" font-family="JetBrains Mono, monospace" font-size="10">
                  <text x="68" y="75">CABLE-01</text>
                  <text x="68" y="105">CABLE-02</text>
                  <text x="68" y="135">CABLE-03</text>
                  <text x="68" y="165">CABLE-04</text>
                </g>
            </svg>`;
        }
        // Default: FlexPort frame
        return `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g>
              <rect x="20" y="60" width="200" height="120" fill="${c.fill}" stroke="${c.stroke}" stroke-width="3"/>
              ${[0,1,2,3].map(function(i){
                  const x = 36 + i*48;
                  return `<rect x="${x}" y="78" width="36" height="84" fill="${c.stroke==='#000000'?'#000':'#000'}" opacity="0.78"/>
                          <rect x="${x+4}" y="82" width="28" height="76" fill="${c.fill}"/>`;
              }).join("")}
              <rect x="20" y="60" width="200" height="14" fill="${c.stroke}" opacity="0.92"/>
              <rect x="20" y="166" width="200" height="14" fill="${c.stroke}" opacity="0.92"/>
            </g>
            <g fill="${c.logo}" font-family="Archivo Black, Helvetica, sans-serif" letter-spacing="1">
              <text x="120" y="71" text-anchor="middle" font-size="9">ROUX&nbsp;LABS</text>
              <text x="120" y="177" text-anchor="middle" font-size="7">PAT.&nbsp;PEND.</text>
            </g>
        </svg>`;
    };
})();
