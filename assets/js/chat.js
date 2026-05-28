/* ============================================================
   ROUX LABS — Support Chat Widget (demo)
   --------------------------------------------------------------
   Floating support widget injected on every page. Visual demo
   of the AI Support agent — canned conversation flow only, no
   network calls. Designed to mirror Supreme's flat monochrome
   aesthetic: sharp edges, mono accents, single orange touch on
   the send button.
   ============================================================ */
(function(){
    "use strict";

    var CANNED = [
        {
            id: "install",
            chip: "Install FlexPort",
            ask: "How do I install FlexPort?",
            reply: "Tool-free. FlexPort snaps onto a standard 19″ rack rail using existing rack-screw holes (M6). Each unit takes about 30 seconds to mount. Cables seat into individual saddles that hold them at a controlled angle. Want a written step-by-step or just the install video?"
        },
        {
            id: "shipping",
            chip: "Shipping speed",
            ask: "How fast do you ship?",
            reply: "Orders ship within 3 business days. USPS Priority is $9.95 and arrives in 2–3 business days. Free shipping on orders over $150. Need it sooner? Drop a line to support@rouxlabs.com and we'll work something out."
        },
        {
            id: "sizing",
            chip: "Sizing & specs",
            ask: "What are FlexPort's dimensions?",
            reply: "FlexPort is 1RU tall (1.75″) and 4″ deep — fits any standard 19″ rack and cabinets with closing doors. Each unit holds up to four keystone-style ports. Glass-filled nylon, Cat5e / Cat6 / Cat6A compatible."
        },
        {
            id: "colors",
            chip: "Color options",
            ask: "What colors are available?",
            reply: "Four colorways: Black, White, Orange, Red. Pick the one that matches your run, or mix-and-match for a coded rack."
        },
        {
            id: "order",
            chip: "Track an order",
            ask: "Where's my order?",
            reply: "Drop your order number (starts with RL-) and I'll pull it up. If you don't have it handy, the confirmation email has it in the subject — or email support@rouxlabs.com and a human will follow up within one business day."
        }
    ];

    var FALLBACK = "Got it — I'm pulling that up. For anything urgent or order-specific, email support@rouxlabs.com or use the contact form on the Support page. A human will follow up within one business day.";

    var WIDGET_HTML = ''
      + '<button class="chat-fab" data-chat-open aria-label="Open support chat">'
      +   '<svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22">'
      +     '<path fill="currentColor" d="M3 4h18v12H7l-4 4V4zm2 2v12.17L6.17 17H19V6H5z"/>'
      +     '<circle cx="9" cy="11" r="1.1" fill="currentColor"/>'
      +     '<circle cx="12" cy="11" r="1.1" fill="currentColor"/>'
      +     '<circle cx="15" cy="11" r="1.1" fill="currentColor"/>'
      +   '</svg>'
      + '</button>'
      + '<aside class="chat-panel" data-chat-panel role="dialog" aria-label="Roux Support" aria-hidden="true">'
      +   '<header class="chat-head">'
      +     '<div class="chat-head-meta">'
      +       '<span class="chat-status" aria-hidden="true"></span>'
      +       '<div class="chat-head-text">'
      +         '<div class="chat-title">ROUX</div>'
      +         '<div class="chat-sub">install desk · trained on the patent</div>'
      +       '</div>'
      +     '</div>'
      +     '<button class="chat-close" data-chat-close aria-label="Close support chat">×</button>'
      +   '</header>'
      +   '<div class="chat-body" data-chat-body>'
      +     '<div class="chat-msg chat-msg-bot">'
      +       '<div class="chat-bubble">'
      +         'Hey — Roux here.'
      +       '</div>'
      +       '<div class="chat-meta">roux · now</div>'
      +     '</div>'
      +     '<div class="chat-msg chat-msg-bot">'
      +       '<div class="chat-bubble">'
      +         'Your real-time install desk — trained on the FlexPort patent, every spec, and every install Datastrait has shipped. I read every Cat6A bend-radius chart so you don’t have to. Ask me anything — install, sizing, colors, shipping, returns, or an order.'
      +       '</div>'
      +       '<div class="chat-meta">roux · now</div>'
      +     '</div>'
      +     '<div class="chat-chips" data-chat-chips></div>'
      +   '</div>'
      +   '<form class="chat-input" data-chat-form>'
      +     '<input type="text" class="chat-text" data-chat-text placeholder="Type a message…" autocomplete="off" aria-label="Message">'
      +     '<button type="submit" class="chat-send" aria-label="Send">'
      +       '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>'
      +     '</button>'
      +   '</form>'
      +   '<div class="chat-foot mono">roux · install desk · demo mode</div>'
      + '</aside>';

    function build(){
        if (document.querySelector("[data-chat-panel]")) return;
        var host = document.createElement("div");
        host.className = "chat-root";
        host.innerHTML = WIDGET_HTML;
        document.body.appendChild(host);

        var panel = host.querySelector("[data-chat-panel]");
        var body  = host.querySelector("[data-chat-body]");
        var chips = host.querySelector("[data-chat-chips]");
        var form  = host.querySelector("[data-chat-form]");
        var text  = host.querySelector("[data-chat-text]");
        var fab   = host.querySelector("[data-chat-open]");

        function fmtNow(){
            var d = new Date();
            return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).toLowerCase();
        }
        function scrollDown(){
            body.scrollTop = body.scrollHeight;
        }
        function open(){
            panel.classList.add("is-open");
            panel.setAttribute("aria-hidden", "false");
            fab.classList.add("is-hidden");
            setTimeout(function(){ text && text.focus(); }, 220);
        }
        function close(){
            panel.classList.remove("is-open");
            panel.setAttribute("aria-hidden", "true");
            fab.classList.remove("is-hidden");
        }

        function renderChips(items){
            chips.innerHTML = items.map(function(c){
                return '<button class="chat-chip" data-chip-id="' + c.id + '">' + c.chip + '</button>';
            }).join("");
        }
        renderChips(CANNED);

        function addMsg(kind, txt){
            var who = kind === "user" ? "you" : "roux";
            var html = ''
              + '<div class="chat-msg chat-msg-' + kind + '">'
              +   '<div class="chat-bubble">' + escapeHtml(txt) + '</div>'
              +   '<div class="chat-meta">' + who + ' · ' + fmtNow() + '</div>'
              + '</div>';
            body.insertAdjacentHTML("beforeend", html);
            scrollDown();
        }
        function addTyping(){
            var html = ''
              + '<div class="chat-msg chat-msg-bot chat-msg-typing" data-typing>'
              +   '<div class="chat-bubble chat-bubble-typing">'
              +     '<span class="d"></span><span class="d"></span><span class="d"></span>'
              +   '</div>'
              + '</div>';
            body.insertAdjacentHTML("beforeend", html);
            scrollDown();
        }
        function removeTyping(){
            var t = body.querySelector("[data-typing]");
            if (t) t.parentNode.removeChild(t);
        }

        function escapeHtml(s){
            return String(s).replace(/[&<>"']/g, function(c){
                return ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[c];
            });
        }

        function respond(userText, replyText){
            addMsg("user", userText);
            // Remove the suggestion chips once the conversation gets going.
            if (chips && chips.parentNode) chips.style.display = "none";
            addTyping();
            var delay = 700 + Math.random() * 600;
            setTimeout(function(){
                removeTyping();
                addMsg("bot", replyText);
            }, delay);
        }

        host.addEventListener("click", function(e){
            if (e.target.closest("[data-chat-open]")){ open(); return; }
            if (e.target.closest("[data-chat-close]")){ close(); return; }
            var chip = e.target.closest("[data-chip-id]");
            if (chip){
                var id = chip.getAttribute("data-chip-id");
                var match = CANNED.find(function(c){ return c.id === id; });
                if (match) respond(match.ask, match.reply);
                return;
            }
        });

        form.addEventListener("submit", function(e){
            e.preventDefault();
            var msg = text.value.trim();
            if (!msg) return;
            text.value = "";
            // Lightweight keyword routing so free-text feels responsive.
            var lower = msg.toLowerCase();
            var matched = CANNED.find(function(c){
                return lower.indexOf(c.id) > -1
                    || (c.id === "install"  && /(install|mount|screw|rail|setup)/.test(lower))
                    || (c.id === "shipping" && /(ship|delivery|arrive|usps|free)/.test(lower))
                    || (c.id === "sizing"   && /(size|dimens|spec|how big|fit|ru|inch)/.test(lower))
                    || (c.id === "colors"   && /(color|colour|black|white|orange|red)/.test(lower))
                    || (c.id === "order"    && /(order|track|where|status|refund|return)/.test(lower));
            });
            respond(msg, matched ? matched.reply : FALLBACK);
        });

        // Esc closes when open
        document.addEventListener("keydown", function(e){
            if (e.key === "Escape" && panel.classList.contains("is-open")) close();
        });
    }

    if (document.readyState === "loading"){
        document.addEventListener("DOMContentLoaded", build);
    } else {
        build();
    }
})();
