/* Velara — generic scroll-reveal observer
   Adds .is-visible to elements with .reveal or .parallax-img when they
   enter the viewport. Used for fade-up reveals and scale-down parallax. */
(function () {
  'use strict';

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal, .parallax-img').forEach((el) =>
      el.classList.add('is-visible')
    );
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
  );

  document.querySelectorAll('.reveal, .parallax-img').forEach((el) =>
    observer.observe(el)
  );
})();
