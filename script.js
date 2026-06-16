/* ============================================================
   Atrey Iyer — personal site interactions
   Plain vanilla JS, no dependencies. Works on GitHub Pages.
   ============================================================ */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- theme toggle (persisted) ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  /* ---------- nav: scroll shadow + progress bar + back-to-top ---------- */
  const navbar = document.getElementById('navbar');
  const progress = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');

  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 20);
    backToTop.classList.toggle('show', y > 600);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' })
  );

  /* ---------- hamburger menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    })
  );

  /* ---------- scrollspy: highlight active nav link ---------- */
  const navItems = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navItems
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id;
          navItems.forEach(a =>
            a.classList.toggle('active', a.getAttribute('href') === '#' + id)
          );
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach(s => spy.observe(s));

  /* ---------- typewriter (rotating roles) ---------- */
  const roles = [
    'an engineer.',
    'a mathematical modeler.',
    'a builder.',
    'a researcher.',
    'a competitive diver.',
    'a math tutor.'
    /* ✏️ EDIT: add / change these roles freely */
  ];
  const tw = document.getElementById('typewriter');
  if (tw && !prefersReduced) {
    let r = 0, c = 0, deleting = false;
    (function type() {
      const word = roles[r];
      c += deleting ? -1 : 1;
      tw.textContent = word.slice(0, c);
      let delay = deleting ? 45 : 90;
      if (!deleting && c === word.length) { delay = 1500; deleting = true; }
      else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 350; }
      setTimeout(type, delay);
    })();
  } else if (tw) {
    tw.textContent = roles[0];
  }

  /* ---------- animated stat counters ---------- */
  const stats = Array.from(document.querySelectorAll('.stat'));
  const statObs = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        statObs.unobserve(el);
        const target = parseInt(el.dataset.target, 10);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const out = el.querySelector('.stat-num');
        if (prefersReduced) { out.textContent = prefix + target.toLocaleString() + suffix; return; }
        const dur = 1400;
        const start = performance.now();
        (function tick(now) {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          out.textContent = prefix + Math.round(target * eased).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      });
    },
    { threshold: 0.4 }
  );
  stats.forEach(s => statObs.observe(s));

  /* ---------- interest filtering ---------- */
  const filterBar = document.getElementById('interest-filters');
  if (filterBar) {
    const cards = Array.from(document.querySelectorAll('#interests-grid .interest-card'));
    filterBar.addEventListener('click', e => {
      const btn = e.target.closest('.chip');
      if (!btn) return;
      filterBar.querySelectorAll('.chip').forEach(c => c.classList.remove('chip--active'));
      btn.classList.add('chip--active');
      const f = btn.dataset.filter;
      cards.forEach(card => {
        const tags = card.dataset.tags || '';
        const show = f === 'all' || tags.includes(f) || tags.includes('all');
        card.classList.toggle('hide', !show);
      });
    });
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll(
    '.interest-card, .timeline-item, .beyond-card, .fact-card, .about-text, .about-aside, .tool-group, .stat'
  );
  revealEls.forEach(el => el.classList.add('reveal'));
  const revObs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
    }),
    { threshold: 0.12 }
  );
  revealEls.forEach(el => revObs.observe(el));

  /* ---------- cursor glow (fine pointers only) ---------- */
  const glow = document.getElementById('cursor-glow');
  if (window.matchMedia('(pointer: fine)').matches && !prefersReduced) {
    window.addEventListener('mousemove', e => {
      glow.style.opacity = '1';
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }, { passive: true });
    document.addEventListener('mouseleave', () => (glow.style.opacity = '0'));
  }

  /* ---------- hero particle constellation ---------- */
  const canvas = document.getElementById('hero-canvas');
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext('2d');
    let w, h, particles, raf;
    const COUNT = 56, MAX_DIST = 130;

    function accent() {
      return getComputedStyle(root).getPropertyValue('--accent').trim() || '#7c6af7';
    }
    function resize() {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    function init() {
      resize();
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4 * devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.4 * devicePixelRatio,
        r: (Math.random() * 1.6 + 0.6) * devicePixelRatio
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      const col = accent();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = col; ctx.globalAlpha = 0.7; ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          const max = MAX_DIST * devicePixelRatio;
          if (dist < max) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = col; ctx.globalAlpha = (1 - dist / max) * 0.18;
            ctx.lineWidth = devicePixelRatio; ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }
    init();
    draw();
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(init, 200); });
    // pause when hero is off-screen to save battery
    new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { if (!raf) draw(); }
      else { cancelAnimationFrame(raf); raf = null; }
    })).observe(canvas);
  }

  /* ---------- konami easter egg ---------- */
  const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  // shortened trigger: up up down down
  const shortSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown'];
  let buf = [];
  window.addEventListener('keydown', e => {
    buf.push(e.key);
    buf = buf.slice(-shortSeq.length);
    if (shortSeq.every((k, i) => k === buf[i])) {
      document.body.animate(
        [{ filter: 'hue-rotate(0deg)' }, { filter: 'hue-rotate(360deg)' }],
        { duration: 1600, iterations: 1 }
      );
      buf = [];
    }
  });
})();
