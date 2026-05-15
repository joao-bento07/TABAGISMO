/* ============================================================
   APP.JS — navegação, tema, animações e interações gerais
   ============================================================ */

const nav       = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');
const themeToggle = document.getElementById('theme-toggle');

/* ---- Tema escuro/claro ---- */
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  updateThemeIcon(t);
}

function updateThemeIcon(t) {
  if (!themeToggle) return;
  themeToggle.innerHTML = t === 'dark'
    ? `<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
         <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
         <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
         <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
         <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
         <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
       </svg>`
    : `<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
         <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
       </svg>`;
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

/* ---- Nav scroll ---- */
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ---- Menu mobile ---- */
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ---- Smooth scroll para âncoras ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---- Reveal on scroll ---- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---- Count-up animation para stats ---- */
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseFloat(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    countObserver.unobserve(el);

    function step(now) {
      const pct = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      const val = target < 100 ? (eased * target).toFixed(0) : Math.floor(eased * target).toLocaleString('pt-BR');
      el.textContent = prefix + val + suffix;
      if (pct < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => countObserver.observe(el));

/* ---- Tabs — "Por que parar" ---- */
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const parent = btn.closest('.tabs-wrapper');
    if (!parent) return;
    parent.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const target = parent.querySelector(`#tab-${btn.dataset.tab}`);
    if (target) target.classList.add('active');
  });
});

/* ---- Tabs — ferramentas ---- */
document.querySelectorAll('.tool-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tool-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById(`tool-${btn.dataset.tool}`);
    if (panel) panel.classList.add('active');
  });
});

/* ---- Calculadora financeira (Por que parar > Financeiro) ---- */
function updateFinCalc() {
  const cig   = parseFloat(document.getElementById('fin-cig')?.value)   || 10;
  const price = parseFloat(document.getElementById('fin-price')?.value) || 15;
  const perCig = price / 20;
  const daily  = cig * perCig;
  const fmt = v => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = fmt(v); };
  set('fin-daily',   daily);
  set('fin-monthly', daily * 30);
  set('fin-yearly',  daily * 365);
  set('fin-5years',  daily * 365 * 5);
}

['fin-cig', 'fin-price'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', updateFinCalc);
});
updateFinCalc();

/* ---- PWA install banner ---- */
let deferredPrompt = null;
const pwaBanner = document.getElementById('pwa-install');
const pwaBtn    = document.getElementById('pwa-install-btn');
const pwaDismiss = document.getElementById('pwa-dismiss');

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  if (pwaBanner && !localStorage.getItem('pwaDismissed')) {
    setTimeout(() => pwaBanner.classList.remove('hidden'), 3000);
  }
});

if (pwaBtn) {
  pwaBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') pwaBanner.classList.add('hidden');
    deferredPrompt = null;
  });
}

if (pwaDismiss) {
  pwaDismiss.addEventListener('click', () => {
    pwaBanner.classList.add('hidden');
    localStorage.setItem('pwaDismissed', '1');
  });
}

/* ---- Service Worker ---- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
