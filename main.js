/**
 * Partner's Pub and Grill — main.js
 * ES module. No build step required.
 */

// ── Loader ──────────────────────────────────────────────────
const loader = document.getElementById('loader');
if (loader) {
  // Total: badge fade 0.4s + hold 0.6s + bar sweep 1s = 1.4s max
  setTimeout(() => {
    loader.classList.add('fade-out');
    setTimeout(() => { loader.remove(); }, 400);
  }, 1400);
}

// ── Nav scroll state ─────────────────────────────────────────
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });

// ── Hamburger menu ───────────────────────────────────────────
const burger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
let menuOpen = false;

burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  burger.classList.toggle('open', menuOpen);
  navLinks.classList.toggle('is-open', menuOpen);
  burger.setAttribute('aria-expanded', menuOpen);
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    burger.classList.remove('open');
    navLinks.classList.remove('is-open');
    burger.setAttribute('aria-expanded', false);
  });
});

// ── Hero parallax (0.3x rate) ────────────────────────────────
const heroBg = document.querySelector('.hero__bg');
if (heroBg) {
  const parallaxHero = () => {
    const scrolled = window.scrollY;
    heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
  };
  window.addEventListener('scroll', parallaxHero, { passive: true });
}

// ── Scroll-rise IntersectionObserver ─────────────────────────
const riseEls = document.querySelectorAll('.rise');
const riseObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      riseObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
riseEls.forEach(el => riseObserver.observe(el));

// ── Stats counter ────────────────────────────────────────────
const statNums = document.querySelectorAll('.stat__num[data-count]');
let statsDone = false;

const countUp = (el) => {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const decimal = el.dataset.decimal || '';
  const raw = el.dataset.raw || null;

  if (raw) return; // "Est. 1977" -- static, no count-up

  const duration = 1000;
  const startTime = performance.now();

  const step = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);
    el.textContent = value + decimal + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const statsSection = document.querySelector('.stats');
const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !statsDone) {
    statsDone = true;
    statNums.forEach(el => countUp(el));
    statsObserver.disconnect();
  }
}, { threshold: 0.4 });
if (statsSection) statsObserver.observe(statsSection);

// ── Weekly Specials tabs / accordion ─────────────────────────
const tabs = document.querySelectorAll('.specials__tab');
const panels = document.querySelectorAll('.specials__panel');
const accordionToggle = document.getElementById('accordionToggle');
const accordionDayLabel = document.getElementById('accordionDayLabel');
const specialsPanels = document.getElementById('specialsPanels');

const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const today = new Date().getDay(); // 0 = Sunday

const setActiveDay = (dayIndex) => {
  tabs.forEach(t => {
    const active = parseInt(t.dataset.day, 10) === dayIndex;
    t.setAttribute('aria-selected', active);
  });
  panels.forEach(p => {
    p.classList.toggle('is-active', parseInt(p.dataset.day, 10) === dayIndex);
  });
  if (accordionDayLabel) accordionDayLabel.textContent = dayNames[dayIndex] + "'s Specials";
};

// Set today as default
setActiveDay(today);

// Tab click handler
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    setActiveDay(parseInt(tab.dataset.day, 10));
  });
});

// Mobile accordion toggle
if (accordionToggle && specialsPanels) {
  let panelsOpen = true;
  accordionToggle.addEventListener('click', () => {
    panelsOpen = !panelsOpen;
    accordionToggle.setAttribute('aria-expanded', panelsOpen);
    specialsPanels.style.display = panelsOpen ? '' : 'none';
  });
}

// ── Full menu toggle ─────────────────────────────────────────
const menuToggleBtn = document.getElementById('menuToggleBtn');
const fullMenu = document.getElementById('fullMenu');
if (menuToggleBtn && fullMenu) {
  menuToggleBtn.addEventListener('click', () => {
    const isHidden = fullMenu.hasAttribute('hidden');
    if (isHidden) {
      fullMenu.removeAttribute('hidden');
      menuToggleBtn.textContent = 'Hide Full Menu';
      menuToggleBtn.setAttribute('aria-expanded', true);
    } else {
      fullMenu.setAttribute('hidden', '');
      menuToggleBtn.textContent = 'See the Full Menu';
      menuToggleBtn.setAttribute('aria-expanded', false);
    }
  });
}
