/* Velara — ticker
   The CSS marquee is the workhorse; this script just ensures the track is
   wide enough to loop seamlessly. The Liquid template already renders the
   item group twice, so we don't usually need to clone — but if the second
   group is missing or shorter than the viewport, we duplicate. */
(function () {
  'use strict';

  document.querySelectorAll('.ticker').forEach((ticker) => {
    const track = ticker.querySelector('.ticker__track');
    if (!track) return;

    const ensureFill = () => {
      const groups = track.querySelectorAll('.ticker__group');
      if (!groups.length) return;
      let trackWidth = track.scrollWidth;
      const viewport = ticker.clientWidth;
      while (trackWidth < viewport * 2 && groups.length < 6) {
        const clone = groups[0].cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
        trackWidth = track.scrollWidth;
      }
    };

    ensureFill();
    window.addEventListener('resize', () => {
      requestAnimationFrame(ensureFill);
    });
  });
})();
