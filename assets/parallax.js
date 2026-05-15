/* Velara — parallax / scale-down on scroll
   Most reveals are handled in reveal.js. This file adds a continuous
   scroll-based scale on .parallax-img for a longer cinematic effect than
   a one-shot reveal. */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  const elements = new Set();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          elements.add(entry.target);
        } else {
          elements.delete(entry.target);
        }
      });
    },
    { threshold: [0, 0.1, 0.5, 1], rootMargin: '0px' }
  );

  document.querySelectorAll('.parallax-img').forEach((el) => observer.observe(el));

  let raf = 0;
  const tick = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // Progress: 0 when element bottom touches viewport top, 1 when fully passed
      const progress = Math.max(0, Math.min(1, 1 - rect.top / vh));
      // Scale: 1.15 -> 1.0 as the element scrolls through the viewport
      const scale = 1.15 - progress * 0.15;
      el.style.transform = `scale(${scale.toFixed(3)})`;
    });
    raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);
})();
