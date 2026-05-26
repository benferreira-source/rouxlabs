/* ============================================================
   ROUX LABS — Product catalog
   --------------------------------------------------------------
   Edit prices, set sizes, and SKUs here. Everything in the site
   pulls from this single source of truth (cards, PDP, cart).
   --------------------------------------------------------------
   SKU convention (from Johnny's file naming):
       FP-{COLOR}-{SETSIZE}-{ORIENTATION}
       e.g. FP-BK-04-L  = FlexPort, Black, Set of 4, Left
   ============================================================ */

window.ROUX_PRODUCTS = [
    {
        id: "flexport-zero-u",
        category: "flexport",
        name: "FlexPort Zero U Panel",
        tagline: "Patented zero-U cable management. Off-rail organization that doesn't eat your rack space.",
        priceFrom: 39.95,
        badges: ["Cat6A Compatible"],
        colors: [
            { key: "BK", label: "Black", swatchClass: "black" },
            { key: "WK", label: "White", swatchClass: "white" },
            { key: "OK", label: "Orange", swatchClass: "orange" },
            { key: "RK", label: "Red",   swatchClass: "red"   }
        ],
        orientations: [
            { key: "L", label: "Left",  sub: "Cables exit left of rack" },
            { key: "R", label: "Right", sub: "Cables exit right of rack" }
        ],
        sets: [
            { size: 2,  price: 39.95 },
            { size: 4,  price: 69.95 },
            { size: 8,  price: 129.95 },
            { size: 12, price: 179.95 }
        ],
        defaults: { color: "BK", orientation: "L", set: 4 },
        specs: [
            ["Material",      "Glass-filled nylon"],
            ["Compatibility", "Cat5e / Cat6 / Cat6A patch cables"],
            ["Mount",         "Snap-fit, no tools"],
            ["Rack Format",   "Zero-U (off-rail)"],
            ["Cable Capacity","Up to 12 per unit"],
            ["Marking",       "Roux Labs logo embossed"],
            ["Country",       "Made in the USA"]
        ],
        copy: {
            lead: "FlexPort is a zero-U, snap-fit cable management frame that holds patch cables at a controlled angle off the side of the rack. Engineered for installers who care what their work looks like a year from now.",
            install: "FlexPort mounts to the vertical rail of any standard 19″ rack — no screws, no tools, no zip ties. Cables seat into individual saddles that maintain bend radius and label visibility. Sold in sets so a full rack stays consistent.",
            features: [
                { num: "01", title: "Patented Geometry", body: "Holds Cat6A patch cables at a controlled 32° exit angle. Bend radius maintained. Labels stay readable." },
                { num: "02", title: "Snap-Fit Mount",    body: "Zero-tool install on any 19″ rail. Add or remove a unit in seconds without disturbing neighbors." },
                { num: "03", title: "Choose Your Side",  body: "Left and Right versions. Build mixed sets or run a uniform side. Symmetrical installs the right way." },
                { num: "04", title: "Built To Be Seen",  body: "Four colorways. Logo embossed. A racked install that won't get hidden behind a door anymore." }
            ]
        }
    },

    /* ----- Accessories (placeholder SKUs — drop in real ones) -- */
    {
        id: "roux-strap",
        category: "accessories",
        name: "Roux Hook & Loop Straps",
        tagline: "Reusable, low-profile cable straps. 25-pack.",
        priceFrom: 14.95,
        badges: ["25-Pack"],
        colors: [
            { key: "BK", label: "Black", swatchClass: "black" },
            { key: "OK", label: "Orange", swatchClass: "orange" }
        ],
        orientations: null,
        sets: [
            { size: 25, price: 14.95 },
            { size: 100, price: 49.95 }
        ],
        defaults: { color: "BK", orientation: null, set: 25 },
        specs: [
            ["Material",      "Hook & loop nylon"],
            ["Width",         "1/2 in (12 mm)"],
            ["Length",        "8 in (203 mm)"],
            ["Color",         "Black / Orange"],
            ["Reusable",      "Yes"]
        ],
        copy: {
            lead: "Low-profile hook-and-loop straps in Roux Labs branding. Designed to pair with FlexPort but at home anywhere in the rack.",
            install: "",
            features: []
        }
    },

    {
        id: "label-pack",
        category: "accessories",
        name: "Cable ID Label Pack",
        tagline: "Pre-printed, color-matched cable labels. 50 per pack.",
        priceFrom: 9.95,
        badges: ["50-Pack"],
        colors: [
            { key: "MX", label: "Mixed", swatchClass: "orange" }
        ],
        orientations: null,
        sets: [
            { size: 50, price: 9.95 }
        ],
        defaults: { color: "MX", orientation: null, set: 50 },
        specs: [
            ["Material",      "Vinyl, self-laminating"],
            ["Print",         "Pre-printed numeric 01–50"],
            ["Color-coded",   "Yes, by run"]
        ],
        copy: {
            lead: "Self-laminating vinyl cable labels, pre-printed and color-coded. Pairs cleanly with FlexPort install runs.",
            install: "",
            features: []
        }
    }
];

/* Helpers ----------------------------------------------------- */
window.ROUX = window.ROUX || {};

window.ROUX.findProduct = function(id){
    return window.ROUX_PRODUCTS.find(function(p){ return p.id === id; });
};

window.ROUX.formatPrice = function(n){
    return "$" + n.toFixed(2);
};

window.ROUX.makeSku = function(productId, color, orientation, setSize){
    var prefixMap = {
        "flexport-zero-u": "FP",
        "roux-strap": "RS",
        "label-pack": "LP"
    };
    const parts = [prefixMap[productId] || "RL"];
    if (color) parts.push(color);
    if (setSize) parts.push(String(setSize).padStart(2, "0"));
    if (orientation) parts.push(orientation);
    return parts.join("-");
};
