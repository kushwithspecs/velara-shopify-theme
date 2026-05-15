/* Velara — scroll-triggered count-up next to the gallery "Purity" word */
(function () {
  'use strict';

  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  if (!('IntersectionObserver' in window)) {
    counters.forEach((el) => {
      el.textContent = el.getAttribute('data-counter-target') || '1';
    });
    return;
  }

  const animate = (el, target, duration = 1200) => {
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = String(target);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-counter-target'), 10) || 1;
          animate(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
})();
