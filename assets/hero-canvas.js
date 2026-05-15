/* Velara — hero floating-blob shader (playful palette) */
(function () {
  'use strict';

  const canvas = document.querySelector('[data-hero-canvas]');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let width = 0, height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  // Pastel blob palette — coral pink, butter yellow, lavender, mint
  const blobs = [
    { x: 0.20, y: 0.30, r: 0.55, color: 'rgba(255, 184, 188, 0.85)', sx:  0.00020, sy:  0.00014 },
    { x: 0.78, y: 0.22, r: 0.50, color: 'rgba(255, 220, 130, 0.75)', sx: -0.00016, sy:  0.00020 },
    { x: 0.55, y: 0.78, r: 0.50, color: 'rgba(212, 200, 245, 0.80)', sx:  0.00012, sy: -0.00018 },
    { x: 0.30, y: 0.70, r: 0.40, color: 'rgba(195, 231, 148, 0.70)', sx: -0.00018, sy: -0.00012 }
  ];

  const draw = (t) => {
    ctx.clearRect(0, 0, width, height);

    // Cream base
    ctx.fillStyle = '#FEF8F0';
    ctx.fillRect(0, 0, width, height);

    blobs.forEach((b) => {
      const x = (b.x + Math.sin(t * b.sx) * 0.10) * width;
      const y = (b.y + Math.cos(t * b.sy) * 0.10) * height;
      const r = Math.max(width, height) * b.r;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, b.color);
      g.addColorStop(1, 'rgba(254,248,240,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    });
  };

  let raf = 0, last = 0;
  const FRAME_MS = 1000 / 30;
  const loop = (t) => {
    if (document.visibilityState === 'hidden') { raf = requestAnimationFrame(loop); return; }
    if (t - last >= FRAME_MS) { last = t; draw(t); }
    raf = requestAnimationFrame(loop);
  };

  resize();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !raf) raf = requestAnimationFrame(loop);
  });
  raf = requestAnimationFrame(loop);
})();

/* Velara — footer pastel grain (one-shot static draw) */
(function () {
  'use strict';
  const canvases = document.querySelectorAll('[data-footer-canvas]');
  if (!canvases.length) return;

  canvases.forEach((canvas) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      canvas.width = w;
      canvas.height = h;
      const image = ctx.createImageData(w, h);
      const data = image.data;
      for (let i = 0; i < data.length; i += 4) {
        const n = Math.floor(Math.random() * 100);
        data[i] = n; data[i + 1] = n; data[i + 2] = n; data[i + 3] = 14;
      }
      ctx.putImageData(image, 0, 0);
    };

    render();
    let t;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(render, 200);
    });
  });
})();
