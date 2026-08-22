/* ============================================================
   ROUX LABS · SERVICE PAUSE OVERLAY
   Injected on every page load. Full-screen, non-dismissable.
   Presented as a system notice, not a demand for payment.
   Contact routes to Lead by Design Labs.
   Added 2026-08-22.
   ============================================================ */
(function () {
  if (window.__rouxPaywallInjected) return;
  window.__rouxPaywallInjected = true;

  var css = ''
    + '#roux-paywall{'
    +   'position:fixed;inset:0;z-index:2147483647;'
    +   'background:#f6f5f2;color:#0a0a0a;'
    +   'display:flex;flex-direction:column;align-items:center;justify-content:center;'
    +   'padding:24px;box-sizing:border-box;'
    +   'font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;'
    +   '-webkit-font-smoothing:antialiased;'
    +   'overflow:auto;'
    + '}'
    + '#roux-paywall .rp-inner{max-width:640px;width:100%;text-align:center}'
    + '#roux-paywall .rp-mono{'
    +   'font-family:"JetBrains Mono",ui-monospace,Menlo,Consolas,monospace;'
    +   'font-size:11px;letter-spacing:.18em;text-transform:uppercase;'
    +   'color:#0a0a0a;opacity:.72;'
    + '}'
    + '#roux-paywall .rp-status{margin-bottom:32px}'
    + '#roux-paywall .rp-status .dot{'
    +   'display:inline-block;width:6px;height:6px;border-radius:50%;'
    +   'background:#c73a00;margin-right:8px;vertical-align:middle;'
    +   'animation:rp-pulse 1.6s ease-in-out infinite;'
    + '}'
    + '@keyframes rp-pulse{0%,100%{opacity:1}50%{opacity:.35}}'
    + '#roux-paywall h1{'
    +   'font-family:"Archivo Black","Inter",sans-serif;font-weight:900;'
    +   'font-size:clamp(28px,4.4vw,44px);line-height:1.08;letter-spacing:-.01em;'
    +   'margin:0 0 20px;color:#0a0a0a;'
    + '}'
    + '#roux-paywall p.rp-body{'
    +   'font-size:16px;line-height:1.55;color:#232323;'
    +   'margin:0 0 12px;max-width:520px;margin-left:auto;margin-right:auto;'
    + '}'
    + '#roux-paywall p.rp-body.small{font-size:14px;color:#4a4a4a;margin-top:8px}'
    + '#roux-paywall .rp-cta{'
    +   'margin-top:32px;display:inline-flex;align-items:center;gap:10px;'
    +   'padding:14px 22px;background:#0a0a0a;color:#f6f5f2;'
    +   'text-decoration:none;font-family:"JetBrains Mono",monospace;'
    +   'font-size:12px;letter-spacing:.18em;text-transform:uppercase;'
    +   'border:1px solid #0a0a0a;transition:opacity .15s ease;'
    + '}'
    + '#roux-paywall .rp-cta:hover{opacity:.82}'
    + '#roux-paywall .rp-cta .arrow{display:inline-block;transform:translateY(-1px)}'
    + '#roux-paywall .rp-meta{'
    +   'margin-top:56px;display:flex;flex-direction:column;gap:6px;align-items:center;'
    + '}'
    + '#roux-paywall .rp-meta .rp-line{'
    +   'font-family:"JetBrains Mono",monospace;font-size:10px;letter-spacing:.2em;'
    +   'text-transform:uppercase;color:#0a0a0a;opacity:.55;'
    + '}'
    + '#roux-paywall .rp-hr{'
    +   'width:32px;height:1px;background:#0a0a0a;opacity:.3;margin:24px auto;'
    + '}'
    + '#roux-paywall a{color:inherit}'
    + '@media (max-width:520px){'
    +   '#roux-paywall{padding:20px}'
    +   '#roux-paywall h1{font-size:26px}'
    +   '#roux-paywall p.rp-body{font-size:15px}'
    + '}'
    + 'html.rp-lock,body.rp-lock{overflow:hidden!important;height:100%!important}';

  var style = document.createElement('style');
  style.setAttribute('data-rp', 'style');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  var host = document.createElement('div');
  host.id = 'roux-paywall';
  host.setAttribute('role', 'dialog');
  host.setAttribute('aria-modal', 'true');
  host.setAttribute('aria-labelledby', 'roux-paywall-title');

  host.innerHTML = ''
    + '<div class="rp-inner">'
    +   '<div class="rp-status rp-mono"><span class="dot" aria-hidden="true"></span>SERVICE PAUSED</div>'
    +   '<h1 id="roux-paywall-title">Site bandwidth support paused.</h1>'
    +   '<p class="rp-body">Hosting and CDN traffic for rouxlabs.benops.dev is currently paused. We\'ll have things back up quickly — just reach out.</p>'
    +   '<a class="rp-cta" href="mailto:ben@benops.dev?subject=Roux%20Labs%20site&body=Hey%20Ben%2C%0A%0ACan%20you%20get%20rouxlabs.benops.dev%20back%20online%3F%0A%0AThanks%2C%0AJohnny">'
    +     'Contact Lead by Design Labs '
    +     '<span class="arrow" aria-hidden="true">→</span>'
    +   '</a>'
    +   '<div class="rp-hr"></div>'
    +   '<div class="rp-meta">'
    +     '<div class="rp-line">rouxlabs.benops.dev</div>'
    +     '<div class="rp-line">' + new Date().toISOString().slice(0,10).replace(/-/g,'.') + ' · service pause active</div>'
    +   '</div>'
    + '</div>';

  function mount() {
    document.documentElement.classList.add('rp-lock');
    if (document.body) {
      document.body.classList.add('rp-lock');
      document.body.appendChild(host);
    } else {
      // extremely early load: wait for body
      var i = setInterval(function () {
        if (document.body) {
          clearInterval(i);
          document.body.classList.add('rp-lock');
          document.body.appendChild(host);
        }
      }, 20);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
