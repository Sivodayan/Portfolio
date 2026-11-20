/**
 * Sujeevakumar Sivodayan — Interactions & Utilities
 * High-craft tactile elements:
 * - Real-time Moratuwa local clock
 * - Physics-draggable craft badges
 * - 3D card tilt with specular sheen
 * - Interactive inline architecture drawers
 * - Magnetic action buttons
 * - One-click clipboard copy
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroAsciiStream();
  initThemeToggle();
  initCopyActions();
  initLiveClock();
  initDraggableBadges();
  init3DCardTilt();
  initProjectDrawers();
  initMagneticButtons();
});

/* --- 1. Theme Toggle --- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('sivodayan-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'dark');

  document.documentElement.setAttribute('data-theme', initialTheme);
  updateButtonLabel(initialTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme');
      const next = active === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('sivodayan-theme', next);
      updateButtonLabel(next);
      showToast(`Switched to ${next} mode`);
    });
  }

  function updateButtonLabel(theme) {
    if (!toggleBtn) return;
    toggleBtn.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  }
}

/* --- 2. Live Moratuwa Local Clock (Asia/Colombo) --- */
function initLiveClock() {
  const clockEl = document.getElementById('live-moratuwa-clock');
  if (!clockEl) return;

  function update() {
    const opts = {
      timeZone: 'Asia/Colombo',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    clockEl.textContent = new Intl.DateTimeFormat([], opts).format(new Date());
  }
  update();
  setInterval(update, 1000);
}

/* --- 3. Interactive Draggable Craft Badges --- */
function initDraggableBadges() {
  const badges = document.querySelectorAll('.draggable-badge');

  badges.forEach(badge => {
    let isDown = false;
    let startX = 0, startY = 0;
    let origX = 0, origY = 0;

    badge.addEventListener('pointerdown', (e) => {
      isDown = true;
      badge.classList.add('dragging');
      badge.setPointerCapture(e.pointerId);

      const style = window.getComputedStyle(badge);
      const matrix = new DOMMatrixReadOnly(style.transform);
      origX = matrix.m41;
      origY = matrix.m42;

      startX = e.clientX;
      startY = e.clientY;
    });

    badge.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      badge.style.transform = `translate(${origX + dx}px, ${origY + dy}px) scale(1.06) rotate(${dx * 0.04}deg)`;
    });

    badge.addEventListener('pointerup', () => {
      if (!isDown) return;
      isDown = false;
      badge.classList.remove('dragging');
      // Gentle spring return to neutral
      badge.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      badge.style.transform = 'translate(0px, 0px)';
      setTimeout(() => {
        badge.style.transition = '';
      }, 400);
    });

    badge.addEventListener('pointercancel', () => {
      isDown = false;
      badge.classList.remove('dragging');
      badge.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* --- 4. 3D Perspective Tilt on Project Cards --- */
function init3DCardTilt() {
  const cards = document.querySelectorAll('.project-item');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle tilt angles (max ~4.5 degrees)
      const rotateX = ((y - centerY) / centerY) * -4.5;
      const rotateY = ((x - centerX) / centerX) * 4.5;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;

      // Specular sheen coordinates
      card.style.setProperty('--shine-x', `${x}px`);
      card.style.setProperty('--shine-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* --- 5. Project Inline Architecture Drawers --- */
function initProjectDrawers() {
  const toggleBtns = document.querySelectorAll('.drawer-toggle-btn');

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-drawer');
      const drawer = document.getElementById(targetId);
      if (!drawer) return;

      drawer.classList.toggle('open');
      const isOpen = drawer.classList.contains('open');

      const textSpan = btn.querySelector('.btn-text');
      if (textSpan) {
        textSpan.textContent = isOpen ? 'Hide architecture' : 'Quick architecture view';
      }
      const icon = btn.querySelector('.btn-icon');
      if (icon) {
        icon.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    });
  });
}

/* --- 6. Magnetic Action Buttons --- */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.action-link, .copy-pill');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // Subtle magnetic pull
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
      btn.style.transition = 'transform 0.25s ease';
      setTimeout(() => {
        btn.style.transition = '';
      }, 250);
    });
  });
}

/* --- 7. One-Click Copy & Toast --- */
function initCopyActions() {
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const val = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'Copied to clipboard';
      if (!val) return;

      navigator.clipboard.writeText(val).then(() => {
        showToast(label);
        pulseElement(btn);
      }).catch(() => {
        const input = document.createElement('input');
        input.value = val;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast(label);
        pulseElement(btn);
      });
    });
  });
}

function pulseElement(el) {
  const orig = el.style.borderColor;
  el.style.borderColor = 'var(--emerald)';
  setTimeout(() => {
    el.style.borderColor = orig;
  }, 1000);
}

function showToast(msg) {
  let toast = document.getElementById('minimal-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'minimal-toast';
    toast.className = 'minimal-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('visible');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 2200);
}

/* --- 8. React Bits Pro ASCII Stream Engine --- */
function initHeroAsciiStream() {
  const container = document.getElementById('ascii-stream-hero');
  if (!container || typeof AsciiStream !== 'function') return;

  try {
    AsciiStream(container, {
      colors: ["#44f0ff", "#ff087b"],
      text: "dev sivodayan @cse",
      pulse: 1.1500000000000001,
      flare: 0.5,
      burst: 0.9,
      backgroundColor: "#06070a"
    });
  } catch (err) {
    console.error('Failed to initialize AsciiStream:', err);
  }
}
