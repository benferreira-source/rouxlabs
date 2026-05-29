/* ============================================================
   ROUX LABS — Motion / reveal layer
   --------------------------------------------------------------
   Two engineering-flavoured motion effects, both gated on
   prefers-reduced-motion so accessibility users get the same
   content statically.

   1. Sectional fade-up
      Any element tagged data-reveal or any <section> child of
      <main> on a content page fades up 12px on viewport entry.
      Triggers once. Never re-fires.

   2. Timeline ticker
      The R&D timeline on /story.html: each <li>'s date counter
      "types" digit-by-digit when the row enters the viewport.
      Like a CAD revision log materialising. The body content
      uses the same fade-up so the date arrival reads as the
      'official' moment.

   ============================================================ */
(function(){
    "use strict";
    if (window.__rouxMotion) return;
    window.__rouxMotion = true;

    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced){
        // Reveal everything immediately; skip the ticker entirely.
        document.documentElement.classList.add("motion-reduce");
        return;
    }

    /* ----- 1. Sectional fade-up ------------------------------ */
    var revealTargets = [];

    // Auto-target: every <section> child of <main>. Plus any
    // explicit data-reveal element. (We do NOT auto-target
    // .home-strip — its slivers animate via their own hover.)
    document.querySelectorAll("main > section").forEach(function(el){ revealTargets.push(el); });
    document.querySelectorAll("[data-reveal]").forEach(function(el){
        if (revealTargets.indexOf(el) === -1) revealTargets.push(el);
    });

    function revealAll(){
        revealTargets.forEach(function(el){ el.classList.add("reveal-in"); });
    }

    // No IntersectionObserver (old browser) → never hide; show everything.
    if (!("IntersectionObserver" in window)){
        revealAll();
    } else {
        // Prepare initial state via a class — CSS handles transition.
        revealTargets.forEach(function(el){ el.classList.add("reveal-pending"); });

        var revealObs = new IntersectionObserver(function(entries){
            entries.forEach(function(entry){
                if (!entry.isIntersecting) return;
                entry.target.classList.add("reveal-in");
                revealObs.unobserve(entry.target);
            });
        }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

        revealTargets.forEach(function(el){ revealObs.observe(el); });

        // Safety net: content must never get stranded invisible. If the
        // observer hasn't revealed an element within 1.2s (callback never
        // fired, transition stalled in a backgrounded tab, etc.), force it.
        setTimeout(revealAll, 1200);
    }

    /* ----- 2. Timeline date ticker --------------------------
       For each timeline <li>: when it intersects the viewport,
       count its t-date digits up from 0 → final in ~480ms. The
       leading "2026." is constant so we only animate MM and DD.
    */
    var timeline = document.querySelector(".timeline");
    if (!timeline || !("IntersectionObserver" in window)) return;

    var rows = timeline.querySelectorAll("li");
    rows.forEach(function(li){
        var dateEl = li.querySelector(".t-date");
        if (!dateEl || dateEl.dataset.tickerWired) return;
        dateEl.dataset.tickerWired = "1";
        dateEl.dataset.tickerFinal = dateEl.textContent.trim();
        // Pre-stamp the "loading" placeholder so the row's height
        // doesn't jump when the ticker fires.
        dateEl.textContent = dateEl.dataset.tickerFinal.replace(/\d/g, "0");
        dateEl.classList.add("t-date-ticker");
        li.classList.add("reveal-pending");
    });

    function tick(el){
        var finalStr = el.dataset.tickerFinal;
        var dur = 480; // ms total
        var fps = 60;
        var frames = Math.round(dur / (1000 / fps));
        var start = performance.now();
        function frame(now){
            var t = Math.min(1, (now - start) / dur);
            // Ease-out cubic for the count.
            var eased = 1 - Math.pow(1 - t, 3);
            var chars = finalStr.split("").map(function(c){
                if (!/\d/.test(c)) return c;
                if (t >= 1) return c;
                // Cycle 0–9 weighted by easing, settle to final.
                var n = Math.floor(eased * parseInt(c, 10) + (1 - eased) * (Math.random() * 9));
                return String(Math.max(0, Math.min(9, n)));
            });
            el.textContent = chars.join("");
            if (t < 1) requestAnimationFrame(frame);
            else el.textContent = finalStr;
        }
        requestAnimationFrame(frame);
    }

    var tickerObs = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
            if (!entry.isIntersecting) return;
            var li = entry.target;
            li.classList.add("reveal-in");
            var dateEl = li.querySelector(".t-date-ticker");
            if (dateEl){
                // Slight stagger so each row's tick is its own moment.
                setTimeout(function(){ tick(dateEl); }, 80);
            }
            tickerObs.unobserve(li);
        });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.2 });
    rows.forEach(function(li){ tickerObs.observe(li); });

    // Safety net for timeline rows (mirror of the section reveal above).
    setTimeout(function(){
        rows.forEach(function(li){
            if (li.classList.contains("reveal-in")) return;
            li.classList.add("reveal-in");
            var dateEl = li.querySelector(".t-date-ticker");
            if (dateEl) dateEl.textContent = dateEl.dataset.tickerFinal;
        });
    }, 1500);
})();
