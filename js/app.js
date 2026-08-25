/* ========== WELDPRO v2 — Global JS ========== */

// === SVG Sprite Gradients ===
const svgDefs = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <linearGradient id="g-primary" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FF5722"/><stop offset="100%" stop-color="#FFC107"/></linearGradient>
    <linearGradient id="g-blue" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#2196F3"/><stop offset="100%" stop-color="#00BCD4"/></linearGradient>
    <linearGradient id="g-green" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#4CAF50"/><stop offset="100%" stop-color="#8BC34A"/></linearGradient>
    <linearGradient id="g-purple" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#9C27B0"/><stop offset="100%" stop-color="#E91E63"/></linearGradient>
    <linearGradient id="g-amber" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FF9800"/><stop offset="100%" stop-color="#FFC107"/></linearGradient>
  </defs>
</svg>`;

// === Loader ===
window.addEventListener('load', () => setTimeout(() => {
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('hidden');
}, 1600));

// === Sparks ===
function initSparks() {
  const sparks = document.getElementById('sparks');
  if (!sparks) return;
  for (let i = 0; i < 40; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    s.style.left = Math.random() * 100 + '%';
    s.style.width = s.style.height = (Math.random() * 4 + 2) + 'px';
    s.style.background = Math.random() > 0.5 ? '#FF5722' : '#FFC107';
    s.style.animationDuration = (Math.random() * 8 + 6) + 's';
    s.style.animationDelay = (Math.random() * 8) + 's';
    s.style.boxShadow = '0 0 10px ' + s.style.background;
    sparks.appendChild(s);
  }
}

// === Welding scene particles ===
function initWeldingScene() {
  const scene = document.getElementById('weldScene');
  if (!scene) return;
  const ox = 76, oy = 70;
  for (let i = 0; i < 22; i++) {
    const sp = document.createElement('div');
    sp.className = 'weld-spark';
    sp.style.left = ox + (Math.random() * 2 - 1) + '%';
    sp.style.top = oy + '%';
    const ang = Math.random() * Math.PI * 2;
    const dist = Math.random() * 120 + 30;
    sp.style.setProperty('--sx', (Math.cos(ang) * dist) + 'px');
    sp.style.setProperty('--sy', (Math.sin(ang) * dist) + 'px');
    sp.style.animationDelay = (Math.random() * 1.4) + 's';
    sp.style.animationDuration = (Math.random() * 0.8 + 1) + 's';
    scene.appendChild(sp);
  }
  for (let i = 0; i < 10; i++) {
    const d = document.createElement('div');
    d.className = 'weld-drop';
    d.style.left = (ox + Math.random() * 3 - 1.5) + '%';
    d.style.top = oy + '%';
    d.style.setProperty('--dx', (Math.random() * 40 - 20) + 'px');
    d.style.setProperty('--dy', (Math.random() * 200 + 150) + 'px');
    d.style.animationDelay = (Math.random() * 1.6) + 's';
    d.style.animationDuration = (Math.random() * 0.8 + 1.2) + 's';
    scene.appendChild(d);
  }
  const amb = document.createElement('div');
  amb.className = 'weld-ambient';
  scene.appendChild(amb);
  for (let i = 0; i < 15; i++) {
    const p = document.createElement('div');
    p.className = 'weld-particle';
    p.style.left = (ox + Math.random() * 10 - 5) + '%';
    p.style.top = (oy + Math.random() * 10 - 5) + '%';
    p.style.animationDelay = (Math.random() * 2) + 's';
    scene.appendChild(p);
  }
}

// === Navbar scroll ===
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const scrollTop = document.getElementById('scrollTop');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    if (scrollTop) scrollTop.classList.toggle('visible', window.scrollY > 300);
  });
}

// === Burger ===
function toggleBurger() {
  document.getElementById('burger').classList.toggle('active');
  document.getElementById('navLinks').classList.toggle('open');
}

// === Theme ===
function toggleTheme() {
  const light = document.body.classList.toggle('light');
  localStorage.setItem('weldpro_theme', light ? 'light' : 'dark');
}
if (localStorage.getItem('weldpro_theme') === 'light') document.body.classList.add('light');

// === Animated counters ===
function animateCounters() {
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    if (el.dataset.done) return;
    const target = parseInt(el.dataset.count);
    const dur = 1500;
    const start = performance.now();
    function frame(t) {
      const p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(target * p);
      if (p < 1) requestAnimationFrame(frame);
      else { el.textContent = target; el.dataset.done = '1'; }
    }
    requestAnimationFrame(frame);
  });
}

// === Reveal on scroll ===
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        animateCounters();
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// === Modal ===
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// === Scroll top ===
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === Share ===
function share(type) {
  const url = encodeURIComponent(location.href);
  let link;
  if (type === 'vk') link = 'https://vk.com/share.php?url=' + url;
  else if (type === 'tg') link = 'https://t.me/share/url?url=' + url;
  else if (type === 'wa') link = 'https://wa.me/?text=' + encodeURIComponent('WELDPRO — сварочные решения ') + url;
  window.open(link, '_blank');
}

// === Export PDF / Excel ===
function exportToPDF(title, contentId) {
  const content = document.getElementById(contentId);
  if (!content) return;
  const win = window.open('', '_blank');
  win.document.write(`
    <html><head><meta charset="UTF-8"><title>${title}</title>
    <style>body{font-family:Arial,sans-serif;padding:40px;color:#333;line-height:1.6}
    h1{color:#FF5722} h2{color:#333;margin-top:30px}
    table{width:100%;border-collapse:collapse;margin-top:15px}
    th,td{border:1px solid #ddd;padding:10px;text-align:left}
    th{background:#f5f5f5}</style></head>
    <body><h1>${title}</h1>${content.innerHTML}</body></html>
  `);
  win.document.close();
  setTimeout(() => win.print(), 500);
}

function exportToExcel(title, contentId) {
  const content = document.getElementById(contentId);
  if (!content) return;
  let html = `<table><thead><tr><th>${title}</th></tr></thead><tbody>`;
  const rows = content.querySelectorAll('.result-row');
  rows.forEach(r => {
    const label = r.querySelector('.result-label')?.textContent || '';
    const val = r.querySelector('.result-val')?.textContent || '';
    html += `<tr><td>${label}</td><td>${val}</td></tr>`;
  });
  html += '</tbody></table>';
  const blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = title.replace(/\s+/g, '_') + '.xls';
  a.click();
}

// === Auth ===
function initAuth() {
  const user = JSON.parse(localStorage.getItem('weldpro_user') || 'null');
  if (user) {
    document.querySelectorAll('.auth-guest').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.auth-user').forEach(el => el.style.display = 'block');
    document.querySelectorAll('.account-name-display').forEach(el => el.textContent = user.name || user.email);
  } else {
    document.querySelectorAll('.auth-guest').forEach(el => el.style.display = 'block');
    document.querySelectorAll('.auth-user').forEach(el => el.style.display = 'none');
  }
}

function login(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const user = { email, name: email.split('@')[0], synced: true };
  localStorage.setItem('weldpro_user', JSON.stringify(user));
  location.reload();
}

function register(e) {
  e.preventDefault();
  const email = document.getElementById('regEmail').value;
  const name = document.getElementById('regName').value;
  const user = { email, name, synced: true };
  localStorage.setItem('weldpro_user', JSON.stringify(user));
  location.reload();
}

function logout() {
  localStorage.removeItem('weldpro_user');
  location.reload();
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  document.querySelector(`.auth-tab[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(tab + 'Form').classList.add('active');
}

// === Init ===
document.addEventListener('DOMContentLoaded', () => {
  document.body.insertAdjacentHTML('afterbegin', svgDefs);
  initSparks();
  initWeldingScene();
  initNavbar();
  initReveal();
  initAuth();
});
