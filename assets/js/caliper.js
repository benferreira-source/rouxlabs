/* ============================================================
   ROUX LABS — Caliper Cursor
   --------------------------------------------------------------
   Custom-cursor mode that turns the visitor's pointer into a
   precision digital caliper the moment it enters a product
   photo on the FlexPort PDP. Says everything in one gesture —
   patented geometry, engineered by an installer, R&D company
   that sells the actual numbers.

   How it reads:
     · hover a photo → cursor disappears, two orange tick-marks
       track the pointer with a live "0.0 mm / 0.00 in" badge
     · press → first jaw locks at that point
     · drag → second jaw follows the cursor, hairline between
       them updates the readout in real time
     · release → measurement locks in place (faded, still visible)
     · click again → previous measurement clears, new measurement
       begins
     · leave the photo or press Escape → all measurements clear
       and the OS cursor returns

   Calibration:
     Each calipered image carries data-mm-per-px="<float>". The
     full FlexPort panel is 482.6 mm × 44.45 mm (standard 1U).
     For the product photos (1500 px wide, panel framed at ~70%
     of frame), we use ~0.34 mm/px. Specific images can override.

   Touch: the caliper is a pointer-device delight only. On touch /
   coarse-pointer devices it never engages, so a swipe that begins
   on the product photo scrolls the page normally.

   Scope: wires onto the main hero photo only — never the small
   swatch thumbnails, cart-drawer rows, or checkout cards (all of
   which also carry data-caliper via productSvg).

   ~150 lines vanilla JS. No deps. Idempotent.
   ============================================================ */
(function(){
    "use strict";
    if (window.__rouxCaliper) return;
    window.__rouxCaliper = true;

    // Coarse-pointer / touch devices never engage the caliper —
    // hijacking touch on the product photo would trap page scroll.
    // The precision-cursor metaphor is a mouse/trackpad delight.
    var COARSE = window.matchMedia &&
        window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (COARSE) return;

    // Selector for elements that participate in caliper mode.
    var SEL = "[data-caliper]";
    var DEFAULT_MM_PER_PX = 0.34;
    var TICK_LEN = 18;          // length of the orange tick crossbar (px)

    /* ----- DOM overlay (single per page) -------------------- */
    var overlay = document.createElement("div");
    overlay.className = "caliper-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML =
        '<svg class="caliper-svg" xmlns="http://www.w3.org/2000/svg">' +
          '<line class="caliper-bar" x1="0" y1="0" x2="0" y2="0" />' +
          '<line class="caliper-tick caliper-tick-a" x1="0" y1="0" x2="0" y2="0" />' +
          '<line class="caliper-tick caliper-tick-b" x1="0" y1="0" x2="0" y2="0" />' +
        '</svg>' +
        '<div class="caliper-readout mono"><span class="caliper-mm">0.0 mm</span><span class="caliper-in">0.00 in</span></div>' +
        '<div class="caliper-hint mono">click · drag · measure</div>';
    document.body.appendChild(overlay);

    var svg     = overlay.querySelector(".caliper-svg");
    var bar     = overlay.querySelector(".caliper-bar");
    var tickA   = overlay.querySelector(".caliper-tick-a");
    var tickB   = overlay.querySelector(".caliper-tick-b");
    var readout = overlay.querySelector(".caliper-readout");
    var mmEl    = overlay.querySelector(".caliper-mm");
    var inEl    = overlay.querySelector(".caliper-in");
    var hint    = overlay.querySelector(".caliper-hint");

    /* ----- State -------------------------------------------- */
    var activeEl = null;        // the photo currently under caliper
    var jawA = null;            // {x,y} in client-space; null = none placed
    var jawB = null;            // null = cursor-tracking; obj = locked
    var dragging = false;
    var mmPerPx = DEFAULT_MM_PER_PX;
    var locked = false;         // measurement frozen after a complete drag
    var hintTimer = null;

    function showOverlay(el){
        activeEl = el;
        mmPerPx = parseFloat(el.getAttribute("data-mm-per-px")) || DEFAULT_MM_PER_PX;
        overlay.classList.add("on");
        document.documentElement.classList.add("caliper-active");
        clearTimeout(hintTimer);
        hint.classList.add("show");
        hintTimer = setTimeout(function(){ hint.classList.remove("show"); }, 2200);
    }
    function hideOverlay(){
        activeEl = null;
        jawA = null;
        jawB = null;
        dragging = false;
        locked = false;
        overlay.classList.remove("on", "measuring", "locked");
        document.documentElement.classList.remove("caliper-active");
        hint.classList.remove("show");
    }
    function clearMeasurement(){
        jawA = null;
        jawB = null;
        dragging = false;
        locked = false;
        overlay.classList.remove("measuring", "locked");
    }

    /* ----- Geometry ----------------------------------------- */
    function distancePx(a, b){
        var dx = b.x - a.x, dy = b.y - a.y;
        return Math.sqrt(dx*dx + dy*dy);
    }
    function setLine(line, a, b){
        line.setAttribute("x1", a.x); line.setAttribute("y1", a.y);
        line.setAttribute("x2", b.x); line.setAttribute("y2", b.y);
    }
    /* Tick crossbars sit perpendicular to the measurement line. */
    function perpTick(line, center, dirNorm){
        var px = -dirNorm.y, py = dirNorm.x;
        setLine(line,
            { x: center.x + px * TICK_LEN / 2, y: center.y + py * TICK_LEN / 2 },
            { x: center.x - px * TICK_LEN / 2, y: center.y - py * TICK_LEN / 2 }
        );
    }
    function render(){
        // Sync SVG viewport to overlay (full window).
        svg.setAttribute("viewBox", "0 0 " + window.innerWidth + " " + window.innerHeight);

        if (!jawA) return;
        var a = jawA;
        var b = jawB || jawA;
        setLine(bar, a, b);

        // Direction unit vector for perpendicular tick marks. If both jaws
        // coincide use a horizontal default so the tick still draws.
        var dx = b.x - a.x, dy = b.y - a.y;
        var len = Math.sqrt(dx*dx + dy*dy) || 1;
        var dir = { x: dx/len, y: dy/len };
        perpTick(tickA, a, dir);
        perpTick(tickB, b, dir);

        // Live readout.
        var px = distancePx(a, b);
        var mm = px * mmPerPx;
        var inches = mm / 25.4;
        mmEl.textContent = mm.toFixed(1) + " mm";
        inEl.textContent = inches.toFixed(2) + " in";

        // Readout follows the midpoint of the measurement.
        var mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        readout.style.transform = "translate(" + (mid.x + 14) + "px, " + (mid.y - 28) + "px)";
        readout.classList.add("on");
    }

    /* ----- Event wiring ------------------------------------- */
    function clientPos(ev){
        if (ev.touches && ev.touches[0]) return { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
        if (ev.changedTouches && ev.changedTouches[0]) return { x: ev.changedTouches[0].clientX, y: ev.changedTouches[0].clientY };
        return { x: ev.clientX, y: ev.clientY };
    }
    function onMove(ev){
        if (!activeEl) return;
        var pos = clientPos(ev);
        if (!jawA){
            // Pre-measurement: show a single tick following the cursor as a
            // hint of what'll happen on press.
            setLine(bar, pos, pos);
            perpTick(tickA, pos, { x: 1, y: 0 });
            perpTick(tickB, pos, { x: 1, y: 0 });
            readout.classList.remove("on");
            return;
        }
        if (locked) return;
        jawB = pos;
        render();
    }
    function onDown(ev){
        if (!activeEl) return;
        ev.preventDefault();
        var pos = clientPos(ev);
        if (locked){ clearMeasurement(); }
        jawA = pos;
        jawB = pos;
        dragging = true;
        overlay.classList.add("measuring");
        overlay.classList.remove("locked");
        render();
    }
    function onUp(ev){
        if (!activeEl || !dragging) return;
        dragging = false;
        // If the user just tapped (no real drag), keep cursor-tracking
        // for one more move-up to make the experience touch-friendly.
        if (distancePx(jawA, jawB) < 3) return;
        locked = true;
        overlay.classList.add("locked");
        overlay.classList.remove("measuring");
        render();
    }
    function onEnter(ev){ showOverlay(ev.currentTarget); }
    function onLeave(){ hideOverlay(); }
    function onKey(ev){ if (ev.key === "Escape") hideOverlay(); }
    function onResize(){ if (activeEl) render(); }

    /* ----- Wire to every [data-caliper] element ------------- */
    function wire(){
        document.querySelectorAll(SEL).forEach(function(el){
            if (el.__caliperWired) return;
            // Only the main hero photo participates. productSvg() stamps
            // data-caliper on every image it renders (swatch thumbnails,
            // cart rows, checkout cards) — skip those so the overlay never
            // hijacks a small clickable control.
            if (el.closest(".thumb, .pdp-thumbs, .cart-row, .drawer-panel")) return;
            el.__caliperWired = true;
            el.addEventListener("mouseenter", onEnter);
            el.addEventListener("mouseleave", onLeave);
            el.addEventListener("mousemove", onMove);
            el.addEventListener("mousedown", onDown);
        });
    }
    document.addEventListener("mouseup", onUp);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);

    /* Run once now and again after the PDP renders its gallery. */
    function rewire(){ wire(); }
    if (document.readyState === "loading"){
        document.addEventListener("DOMContentLoaded", rewire);
    } else {
        rewire();
    }
    // The PDP rebuilds its hero on color/size change. Watch for that.
    var observer = new MutationObserver(function(){ rewire(); });
    document.addEventListener("DOMContentLoaded", function(){
        var gallery = document.querySelector(".pdp-gallery");
        if (gallery) observer.observe(gallery, { childList: true, subtree: true });
    });
})();
