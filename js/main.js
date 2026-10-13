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
});

/* ========== MOBILE MENU ========== */
const burger = document.getElementById('burger');
const nav = document.querySelector('.nav');

burger.addEventListener('click', () => {
  nav.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

/* ========== SEARCH ========== */
const searchToggle = document.getElementById('search-toggle');
const searchPanel = document.getElementById('search-panel');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

const searchable = [];

function collectSearchable() {
  document.querySelectorAll('[data-search]').forEach(el => {
    const text = (el.querySelector('h3')?.textContent || '') + ' ' +
                 (el.querySelector('p')?.textContent || '') + ' ' +
                 (el.dataset.search || '');
    searchable.push({
      el,
      text: text.toLowerCase(),
      title: el.querySelector('h3')?.textContent || 'Елемент',
      section: el.closest('section')?.id || ''
    });
  });
}

searchToggle.addEventListener('click', () => {
  searchPanel.classList.toggle('open');
  if (searchPanel.classList.contains('open')) {
    searchInput.focus();
  } else {
    searchResults.innerHTML = '';
    searchInput.value = '';
  }
});

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
      searchPanel.classList.remove('open');
      searchInput.value = '';
      searchResults.innerHTML = '';
      item.el.style.outline = '2px solid var(--accent)';
      setTimeout(() => item.el.style.outline = '', 1500);
    });
    searchResults.appendChild(div);
  });

  if (matches.length === 0) {
    searchResults.innerHTML = '<div class="search-result">Нічого не знайдено</div>';
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
  dCtx.strokeStyle = isDark ? '#e8eaf0' : '#1a1c23';
}

function getPos(e) {
  const rect = doodle.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
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

function stopDraw() {
  drawing = false;
}

doodle.addEventListener('mousedown', startDraw);
doodle.addEventListener('mousemove', draw);
doodle.addEventListener('mouseup', stopDraw);
doodle.addEventListener('mouseleave', stopDraw);
doodle.addEventListener('touchstart', startDraw, { passive: false });
doodle.addEventListener('touchmove', draw, { passive: false });
doodle.addEventListener('touchend', stopDraw);

window.addEventListener('resize', resizeDoodle);
themeToggle.addEventListener('click', () => setTimeout(updateDoodleColor, 50));

/* ========== SHOP DATA & RENDER ========== */
const shopItems = [
  {
    id: 1,
    title: 'Organic Brushes Pack',
    desc: '24 природні пензлі: акварель, вугілля, суха пастель. Повна підтримка тиску.',
    category: 'brushes',
    size: '18 MB',
    downloads: '4.2k',
    hue: 200,
    label: 'Brushes'
  },
  {
    id: 2,
    title: 'Paper Textures Vol.1',
    desc: '12 високоякісних текстур паперу: крафт, акварельний, газетний, лляний.',
    category: 'textures',
    size: '42 MB',
    downloads: '3.1k',
    hue: 30,
    label: 'Textures'
  },
  {
    id: 3,
    title: 'Comic Panel Templates',
    desc: 'Готові шаблони комікс-сторінок з різними розкладками панелей.',
    category: 'templates',
    size: '8 MB',
    downloads: '2.8k',
    hue: 340,
    label: 'Templates'
  },
  {
    id: 4,
    title: 'Ink & Line Set',
    desc: 'Пензлі для лінійної графіки, туш, перо, рапідограф. Ідеально для ілюстрацій.',
    category: 'brushes',
    size: '11 MB',
    downloads: '5.6k',
    hue: 260,
    label: 'Brushes'
  },
  {
    id: 5,
    title: 'Grain & Noise Pack',
    desc: 'Текстури шуму, плівки, зерна. Додай атмосферу будь-якому малюнку.',
    category: 'textures',
    size: '27 MB',
    downloads: '1.9k',
    hue: 160,
    label: 'Textures'
  },
  {
    id: 6,
    title: 'Storyboard Kit',
    desc: 'Шаблони для розкадрування: 16:9, 4:3, вертикальні формати.',
    category: 'templates',
    size: '5 MB',
    downloads: '3.4k',
    hue: 50,
    label: 'Templates'
  },
  {
    id: 7,
    title: 'Watercolor Dreams',
    desc: 'М\'які акварельні пензлі з реалістичним розтіканням пігменту.',
    category: 'brushes',
    size: '22 MB',
    downloads: '6.1k',
    hue: 320,
    label: 'Brushes'
  },
  {
    id: 8,
    title: 'Urban Sketch Stamps',
    desc: 'Штампи архітектурних елементів, дерев, людей для швидких скетчів.',
    category: 'templates',
    size: '15 MB',
    downloads: '2.2k',
    hue: 10,
    label: 'Stamps'
  }
];

const shopGrid = document.getElementById('shop-grid');

function renderShop(filter = 'all') {
  shopGrid.innerHTML = '';
  const items = filter === 'all' ? shopItems : shopItems.filter(i => i.category === filter);

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'shop-card';
    card.dataset.search = `${item.title} ${item.desc} ${item.category}`;
    card.innerHTML = `
      <div class="shop-preview" style="--hue: ${item.hue}" data-label="${item.label}"></div>
      <div class="shop-body">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <div class="shop-meta">
          <span>${item.size}</span>
          <span>↓ ${item.downloads}</span>
        </div>
        <a href="#" class="btn btn-primary btn-sm" onclick="event.preventDefault(); alert('Завантаження: ${item.title}\\n(У реальному проєкті тут буде файл з GitHub Releases)')">
          Завантажити
        </a>
      </div>
    `;
    shopGrid.appendChild(card);
  });

  // re-collect searchable after render
  collectSearchable();
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderShop(btn.dataset.filter);
  });
});

/* ========== INK PARTICLES ========== */
const inkCanvas = document.getElementById('ink-canvas');
const iCtx = inkCanvas.getContext('2d');
let particles = [];
let w, h;

function resizeInk() {
  w = inkCanvas.width = window.innerWidth;
  h = inkCanvas.height = window.innerHeight;
}

function createParticle() {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.8 + 0.4,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.35 + 0.05
  };
}

function initParticles() {
  particles = [];
  const count = Math.min(60, Math.floor((w * h) / 18000));
  for (let i = 0; i < count; i++) particles.push(createParticle());
}

function drawParticles() {
  iCtx.clearRect(0, 0, w, h);
  const isDark = html.getAttribute('data-theme') === 'dark';
  const color = isDark ? '124, 156, 255' : '61, 90, 254';

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;

    iCtx.beginPath();
    iCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    iCtx.fillStyle = `rgba(${color}, ${p.alpha})`;
    iCtx.fill();
  });

  requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', () => {
  resizeInk();
  initParticles();
});

/* ========== INIT ========== */
window.addEventListener('load', () => {
  resizeDoodle();
  resizeInk();
  initParticles();
  drawParticles();
  renderShop();
  collectSearchable();
});
