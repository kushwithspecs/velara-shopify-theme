/* Velara — 3D book card tilt on cursor */
(function () {
  'use strict';

  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const MAX_TILT = 10; // degrees

  document.querySelectorAll('[data-3d-card]').forEach((card) => {
    let frame = 0;
    let tx = 0;
    let ty = 0;
    let targetTx = 0;
    let targetTy = 0;

    const apply = () => {
      tx += (targetTx - tx) * 0.15;
      ty += (targetTy - ty) * 0.15;
      card.style.transform = `rotateX(${ty.toFixed(2)}deg) rotateY(${tx.toFixed(2)}deg)`;
      if (Math.abs(targetTx - tx) > 0.05 || Math.abs(targetTy - ty) > 0.05) {
        frame = requestAnimationFrame(apply);
      } else {
        frame = 0;
      }
    };

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetTx = x * MAX_TILT * 2;
      targetTy = -y * MAX_TILT * 2;
      if (!frame) frame = requestAnimationFrame(apply);
    });

    card.addEventListener('mouseleave', () => {
      targetTx = 0;
      targetTy = 0;
      if (!frame) frame = requestAnimationFrame(apply);
    });
  });
})();
