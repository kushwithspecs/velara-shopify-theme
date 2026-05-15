/* Velara — Mobile / tablet nav toggle */
(function () {
  'use strict';

  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const overlay = document.querySelector('[data-overlay-menu]');
  if (!header || !toggle || !overlay) return;

  const closeMenu = () => {
    header.classList.remove('is-open');
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    header.classList.add('is-open');
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  toggle.addEventListener('click', () => {
    if (header.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  });

  // Close when a link is clicked
  overlay.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close if window resizes to desktop
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 1200 && header.classList.contains('is-open')) {
        closeMenu();
      }
    }, 150);
  });
})();
