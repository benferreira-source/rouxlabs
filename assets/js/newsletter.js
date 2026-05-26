/* ============================================================
   ROUX LABS — Newsletter Modal (demo)
   --------------------------------------------------------------
   Supreme-style mailing list capture. Self-injecting modal that
   opens when any [data-newsletter-open] element is clicked.
   Pure white panel, hairline 1px black border, centered on the
   viewport with a dimmed backdrop. After submit it replaces the
   form with a small "You're in." confirmation; the email is
   stashed in localStorage so re-opening the modal short-circuits
   to the confirmation state. No network calls — demo only.
   ============================================================ */
(function(){
    "use strict";

    var STORAGE_KEY = "roux:newsletter:email";

    var MODAL_HTML = ''
      + '<div class="nl-backdrop" data-newsletter-close></div>'
      + '<div class="nl-panel" role="dialog" aria-modal="true" aria-labelledby="nl-title" aria-label="Mailing list">'
      +   '<button class="nl-close" data-newsletter-close aria-label="Close mailing list">×</button>'
      +   '<div class="nl-body" data-newsletter-body></div>'
      + '</div>';

    var FORM_HTML = ''
      + '<div class="nl-eyebrow mono">MAILING LIST</div>'
      + '<h2 class="nl-title" id="nl-title">Get the next drop.</h2>'
      + '<p class="nl-sub">FlexPort v2, lookbook drops, and quiet product updates. Once a month, no fluff.</p>'
      + '<form class="nl-form" data-newsletter-form novalidate>'
      +   '<label class="nl-field">'
      +     '<span class="nl-label mono">EMAIL</span>'
      +     '<input type="email" class="nl-input" data-newsletter-input name="email" autocomplete="email" placeholder="you@domain.com" required>'
      +   '</label>'
      +   '<div class="nl-error mono" data-newsletter-error aria-live="polite"></div>'
      +   '<button type="submit" class="nl-submit">Subscribe →</button>'
      + '</form>'
      + '<div class="nl-foot mono">no spam · unsubscribe anytime</div>';

    function confirmationHtml(email){
        var safe = escapeHtml(email || "");
        return ''
          + '<div class="nl-eyebrow mono">MAILING LIST</div>'
          + '<h2 class="nl-title" id="nl-title">You’re in.</h2>'
          + '<p class="nl-sub">We’ll send the next drop to <strong>' + safe + '</strong>. Keep an eye on your inbox.</p>'
          + '<a href="#" class="nl-close-link mono" data-newsletter-close>Close</a>';
    }

    function escapeHtml(s){
        return String(s).replace(/[&<>"']/g, function(c){
            return ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[c];
        });
    }

    function validEmail(v){
        return /\S+@\S+\.\S+/.test(String(v || "").trim());
    }

    function storedEmail(){
        try { return localStorage.getItem(STORAGE_KEY) || ""; }
        catch (e){ return ""; }
    }

    function storeEmail(v){
        try { localStorage.setItem(STORAGE_KEY, v); }
        catch (e){ /* no-op */ }
    }

    function build(){
        if (document.querySelector("[data-newsletter-modal]")) return;

        var modal = document.createElement("div");
        modal.className = "nl-modal";
        modal.setAttribute("data-newsletter-modal", "");
        modal.setAttribute("aria-hidden", "true");
        modal.innerHTML = MODAL_HTML;
        document.body.appendChild(modal);

        var body = modal.querySelector("[data-newsletter-body]");

        function renderForm(){
            body.innerHTML = FORM_HTML;
        }
        function renderConfirmation(email){
            body.innerHTML = confirmationHtml(email);
        }

        function open(){
            var existing = storedEmail();
            if (existing && validEmail(existing)) renderConfirmation(existing);
            else renderForm();
            modal.classList.add("is-open");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("nl-modal-open");
            setTimeout(function(){
                var input = modal.querySelector("[data-newsletter-input]");
                if (input) input.focus();
            }, 80);
        }
        function close(){
            modal.classList.remove("is-open");
            modal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("nl-modal-open");
        }

        function showError(msg){
            var err = modal.querySelector("[data-newsletter-error]");
            var input = modal.querySelector("[data-newsletter-input]");
            if (err) err.textContent = msg;
            if (input){
                input.classList.remove("is-shake");
                /* Force reflow so the animation can replay on repeated invalid submits. */
                void input.offsetWidth;
                input.classList.add("is-shake");
                input.setAttribute("aria-invalid", "true");
                input.focus();
            }
        }

        function handleSubmit(e){
            e.preventDefault();
            var input = modal.querySelector("[data-newsletter-input]");
            var err   = modal.querySelector("[data-newsletter-error]");
            if (err) err.textContent = "";
            var value = (input && input.value || "").trim();
            if (!value){
                showError("Please enter an email address.");
                return;
            }
            if (!validEmail(value)){
                showError("That doesn’t look like a valid email.");
                return;
            }
            storeEmail(value);
            renderConfirmation(value);
        }

        /* Open triggers anywhere in the document. */
        document.addEventListener("click", function(e){
            var trigger = e.target.closest("[data-newsletter-open]");
            if (trigger){
                e.preventDefault();
                open();
                return;
            }
        });

        /* Backdrop, X, and "Close" link inside confirmation state. */
        modal.addEventListener("click", function(e){
            if (e.target.closest("[data-newsletter-close]")){
                e.preventDefault();
                close();
                return;
            }
        });

        /* Submit handler is delegated since the form is re-rendered. */
        modal.addEventListener("submit", function(e){
            if (e.target && e.target.matches("[data-newsletter-form]")){
                handleSubmit(e);
            }
        });

        /* Esc closes when open. */
        document.addEventListener("keydown", function(e){
            if (e.key === "Escape" && modal.classList.contains("is-open")) close();
        });
    }

    if (document.readyState === "loading"){
        document.addEventListener("DOMContentLoaded", build);
    } else {
        build();
    }
})();
