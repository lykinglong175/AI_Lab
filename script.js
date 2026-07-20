/* ===== Navbar scroll effect ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ===== Hamburger menu ===== */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ===== Typing effect ===== */
const phrases = [
  'AI Experiments',
  'Neural Networks',
  'Intelligent Systems',
  'LLM Applications',
  'Computer Vision',
];

const typedEl = document.getElementById('typed-text');
let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;
const typeSpeed   = 80;
const deleteSpeed = 45;
const pauseAfter  = 1600;

function type() {
  const current = phrases[phraseIdx];

  if (deleting) {
    typedEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting  = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(type, 400);
      return;
    }
    setTimeout(type, deleteSpeed);
  } else {
    typedEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(type, pauseAfter);
      return;
    }
    setTimeout(type, typeSpeed);
  }
}

type();

/* ===== Neural network canvas background ===== */
(function () {
  const canvas = document.getElementById('neural-canvas');
  const ctx    = canvas.getContext('2d');

  let nodes = [];
  const NODE_COUNT   = 60;
  const MAX_DIST     = 160;
  const NODE_RADIUS  = 2.5;
  const NODE_SPEED   = 0.35;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function randomNode() {
    const angle = Math.random() * Math.PI * 2;
    return {
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: Math.cos(angle) * NODE_SPEED * (0.5 + Math.random()),
      vy: Math.sin(angle) * NODE_SPEED * (0.5 + Math.random()),
    };
  }

  function init() {
    nodes = Array.from({ length: NODE_COUNT }, randomNode);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99,102,241,${0.45 * (1 - dist / MAX_DIST)})`;
          ctx.lineWidth   = 0.8;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, NODE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#6366f1';
      ctx.fill();
    });
  }

  function update() {
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize();
  init();
  loop();
})();

/* ===== Animated counters ===== */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const step     = target / (duration / 16);
  let   current  = 0;

  const timer = setInterval(() => {
    current += step;
    const done = current >= target;
    if (done) current = target;
    el.textContent = Math.floor(current) + (done ? '+' : '');
    if (done) clearInterval(timer);
  }, 16);
}

/* ===== Scroll-reveal ===== */
const revealEls = document.querySelectorAll(
  '.skill-category, .project-card, .stat-card, .about-text, .about-visual, .contact-form, .contact-links'
);
revealEls.forEach(el => el.classList.add('reveal'));

const counterEls = document.querySelectorAll('.stat-number');
let countersStarted = false;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

// Counter observer (trigger once when stats are visible)
const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    counterEls.forEach(animateCounter);
  }
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) statsObserver.observe(statsSection);

/* ===== Project filter ===== */
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

/* ===== Contact form validation ===== */
const form       = document.getElementById('contact-form');
const submitBtn  = document.getElementById('submit-btn');
const successMsg = document.getElementById('form-success');

function validateField(id, errorId, test, message) {
  const el  = document.getElementById(id);
  const err = document.getElementById(errorId);
  if (!test(el.value.trim())) {
    el.classList.add('invalid');
    err.textContent = message;
    return false;
  }
  el.classList.remove('invalid');
  err.textContent = '';
  return true;
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const nameOk  = validateField('name',    'name-error',    v => v.length >= 2,   'Please enter your name.');
  const emailOk = validateField('email',   'email-error',   v => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(v), 'Please enter a valid email.');
  const msgOk   = validateField('message', 'message-error', v => v.length >= 10,  'Message must be at least 10 characters.');

  if (nameOk && emailOk && msgOk) {
    submitBtn.disabled     = true;
    submitBtn.textContent  = 'Sending…';

    // Simulate async submission
    setTimeout(() => {
      form.reset();
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Send Message ✉';
      successMsg.hidden     = false;
      setTimeout(() => { successMsg.hidden = true; }, 5000);
    }, 1200);
  }
});

/* ===== Footer year ===== */
document.getElementById('footer-year').textContent = new Date().getFullYear();
