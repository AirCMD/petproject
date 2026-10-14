/* ========== THEME ========== */
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('malyuvachka-theme', theme);
}

const savedTheme = localStorage.getItem('malyuvachka-theme') ||
  (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(next);
  setTimeout(updateDoodleColor, 50);
});

/* ========== MOBILE MENU ========== */
const burger = document.getElementById('burger');
const hudBar = document.querySelector('.hud-bar');

burger.addEventListener('click', () => {
  hudBar.classList.toggle('open');
});

document.querySelectorAll('.hud-link').forEach(link => {
  link.addEventListener('click', () => hudBar.classList.remove('open'));
});

/* ========== SEARCH ========== */
const searchToggle = document.getElementById('search-toggle');
const searchPanel = document.getElementById('search-panel');
const searchClose = document.getElementById('search-close');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

const searchable = [];

function collectSearchable() {
  searchable.length = 0;
  document.querySelectorAll('[data-search]').forEach(el => {
    const text = (el.querySelector('h3')?.textContent || '') + ' ' +
                 (el.querySelector('p')?.textContent || '') + ' ' +
                 (el.dataset.search || '');
    searchable.push({
      el,
      text: text.toLowerCase(),
      title: el.querySelector('h3')?.textContent || 'ITEM'
    });
  });
}

function openSearch() {
  searchPanel.classList.add('open');
  searchInput.focus();
}

function closeSearch() {
  searchPanel.classList.remove('open');
  searchResults.innerHTML = '';
  searchInput.value = '';
}

searchToggle.addEventListener('click', () => {
  if (searchPanel.classList.contains('open')) closeSearch();
  else openSearch();
});

if (searchClose) searchClose.addEventListener('click', closeSearch);

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  searchResults.innerHTML = '';
  if (q.length < 2) return;

  const matches = searchable.filter(item => item.text.includes(q)).slice(0, 8);
  matches.forEach(item => {
    const div = document.createElement('div');
    div.className = 'search-result';
    const regex = new RegExp(`(${q})`, 'gi');
    div.innerHTML = item.title.replace(regex, '<mark>$1</mark>');
    div.addEventListener('click', () => {
      item.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      closeSearch();
      item.el.style.outline = '2px solid var(--neon)';
      setTimeout(() => item.el.style.outline = '', 1500);
    });
    searchResults.appendChild(div);
  });

  if (matches.length === 0) {
    searchResults.innerHTML = '<div class="search-result">NO RESULTS FOUND</div>';
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSearch();
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openSearch();
  }
});

/* ========== DOODLE CANVAS ========== */
const doodle = document.getElementById('doodle-canvas');
const dCtx = doodle.getContext('2d');
let drawing = false;
let lastX = 0, lastY = 0;

function resizeDoodle() {
  const ratio = window.devicePixelRatio || 1;
  const rect = doodle.getBoundingClientRect();
  doodle.width = rect.width * ratio;
  doodle.height = rect.height * ratio;
  dCtx.scale(ratio, ratio);
  dCtx.lineCap = 'round';
  dCtx.lineJoin = 'round';
  dCtx.lineWidth = 2.5;
  updateDoodleColor();
}

function updateDoodleColor() {
  const isDark = html.getAttribute('data-theme') === 'dark';
  dCtx.strokeStyle = isDark ? '#00f0ff' : '#0066ff';
}

function getPos(e) {
  const rect = doodle.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return { x: clientX - rect.left, y: clientY - rect.top };
}

function startDraw(e) {
  e.preventDefault();
  drawing = true;
  const pos = getPos(e);
  lastX = pos.x;
  lastY = pos.y;
}

function draw(e) {
  if (!drawing) return;
  e.preventDefault();
  const pos = getPos(e);
  dCtx.beginPath();
  dCtx.moveTo(lastX, lastY);
  dCtx.lineTo(pos.x, pos.y);
  dCtx.stroke();
  lastX = pos.x;
  lastY = pos.y;
}

function stopDraw() { drawing = false; }

doodle.addEventListener('mousedown', startDraw);
doodle.addEventListener('mousemove', draw);
doodle.addEventListener('mouseup', stopDraw);
doodle.addEventListener('mouseleave', stopDraw);
doodle.addEventListener('touchstart', startDraw, { passive: false });
doodle.addEventListener('touchmove', draw, { passive: false });
doodle.addEventListener('touchend', stopDraw);

window.addEventListener('resize', resizeDoodle);

/* ========== INVENTORY / SHOP ========== */
const shopItems = [
  { id:1, title:'БАЗОВІ ПЕНЗЛІ', desc:'Круглі тверді/м\'які, олівець, гумка. Підтримка натиску й тонких розмірів 0,1–0,9 px.', category:'brushes', size:'вбудовано', downloads:'core', hue:180, icon:'🖌️', rarity:'legendary' },
  { id:2, title:'ШТАМПИ · ВІДСТАНЬ', desc:'Параметр «Відстань відбитків» для окремих штампів (100–200 %+). Зберігається в .miymbrushes.', category:'brushes', size:'вбудовано', downloads:'2.128', hue:200, icon:'🔖', rarity:'epic' },
  { id:3, title:'ШТАМПИ · РОЗКИД', desc:'Розкид відбитків від траєкторії + випадковий поворот. Для різноманітних штрихів і текстур.', category:'brushes', size:'вбудовано', downloads:'2.128', hue:320, icon:'✨', rarity:'epic' },
  { id:4, title:'НАБІР .MIYMBRUSHES', desc:'Формат власних пензлів Малювачки. Імпорт/експорт наборів з параметрами форми.', category:'brushes', size:'—', downloads:'format', hue:260, icon:'📦', rarity:'rare' },
  { id:5, title:'ПРИКЛАД КОМІКСУ', desc:'Багатосторінковий .miym з панелями. Експорт у PDF прямо з програми.', category:'templates', size:'приклад', downloads:'demo', hue:40, icon:'📰', rarity:'rare' },
  { id:6, title:'ПРИКЛАД РІГУ', desc:'Персонаж із суглобами на шарах. Ключові пози + «Переходи…» для плавного руху.', category:'templates', size:'приклад', downloads:'demo', hue:140, icon:'🦴', rarity:'legendary' },
  { id:7, title:'PSD ТЕСТОВИЙ', desc:'RGB 8-bit зі шарами й папкою — перевірка імпорту/експорту PSD.', category:'templates', size:'приклад', downloads:'demo', hue:20, icon:'💾', rarity:'rare' },
  { id:8, title:'ДОКУМЕНТАЦІЯ 2.128', desc:'Текстові гайди зі збірки: пензлі, анімація, штампи, PSD, вікна малюнків.', category:'textures', size:'txt', downloads:'bundle', hue:90, icon:'📜', rarity:'epic' }
];

const shopGrid = document.getElementById('shop-grid');

function renderShop(filter = 'all') {
  shopGrid.innerHTML = '';
  const items = filter === 'all' ? shopItems : shopItems.filter(i => i.category === filter);

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'inv-card';
    card.dataset.search = `${item.title} ${item.desc} ${item.category}`;
    card.innerHTML = `
      <span class="inv-rarity ${item.rarity}">${item.rarity.toUpperCase()}</span>
      <div class="inv-preview" style="--hue:${item.hue}" data-icon="${item.icon}"></div>
      <div class="inv-body">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <div class="inv-meta">
          <span>${item.size}</span>
          <span>↓ ${item.downloads}</span>
        </div>
        <a href="#" class="inv-download" onclick="event.preventDefault();alert('DOWNLOAD: ${item.title}\\n(Connect to GitHub Releases)')">
          ↓ EQUIP / DOWNLOAD
        </a>
      </div>
    `;
    shopGrid.appendChild(card);
  });
  collectSearchable();
}

document.querySelectorAll('.filter-chip').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderShop(btn.dataset.filter);
  });
});

/* ========== STARFIELD ========== */
const starCanvas = document.getElementById('starfield');
const sCtx = starCanvas.getContext('2d');
let stars = [];
let sw, sh;

function resizeStars() {
  sw = starCanvas.width = window.innerWidth;
  sh = starCanvas.height = window.innerHeight;
}

function initStars() {
  stars = [];
  const count = Math.min(80, Math.floor((sw * sh) / 14000));
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * sw,
      y: Math.random() * sh,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.4 + 0.1,
      alpha: Math.random() * 0.5 + 0.1
    });
  }
}

function drawStars() {
  sCtx.clearRect(0, 0, sw, sh);
  const isDark = html.getAttribute('data-theme') === 'dark';
  const color = isDark ? '0, 240, 255' : '0, 102, 255';

  stars.forEach(s => {
    s.y += s.speed;
    if (s.y > sh) { s.y = 0; s.x = Math.random() * sw; }
    sCtx.beginPath();
    sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    sCtx.fillStyle = `rgba(${color}, ${s.alpha})`;
    sCtx.fill();
  });
  requestAnimationFrame(drawStars);
}

window.addEventListener('resize', () => {
  resizeStars();
  initStars();
});

/* ========== ACTIVE NAV ON SCROLL ========== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.hud-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

/* ========== INIT ========== */
window.addEventListener('load', () => {
  resizeDoodle();
  resizeStars();
  initStars();
  drawStars();
  renderShop();
  collectSearchable();
});
