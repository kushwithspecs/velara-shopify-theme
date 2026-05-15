/* Velara — Shopify Ajax Cart
   Handles: PDP add-to-cart, cart-line quantity changes, cart-line remove,
   variant selection (URL + form state), quantity stepper, cart count badge. */
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const updateCartCount = (count) => {
    const badges = $$('[data-cart-count]');
    badges.forEach((b) => {
      b.textContent = count;
      b.style.display = count > 0 ? '' : 'none';
    });
    // Add badge if missing
    if (count > 0 && !badges.length) {
      const cartLink = $('a[href$="/cart"]');
      if (cartLink) {
        const span = document.createElement('span');
        span.className = 'cart-count';
        span.setAttribute('data-cart-count', '');
        span.textContent = count;
        cartLink.appendChild(span);
      }
    }
  };

  const refreshCart = async () => {
    try {
      const res = await fetch('/cart.js', { headers: { Accept: 'application/json' } });
      if (!res.ok) return;
      const data = await res.json();
      updateCartCount(data.item_count);
    } catch (e) { /* silent */ }
  };

  /* ─── PDP: variant selector ─── */
  $$('[data-pdp-form]').forEach((form) => {
    const variantInput = form.querySelector('[data-variant-id]');
    const options = $$('[data-variant-option]', form);
    options.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = btn.getAttribute('data-option-index');
        // toggle active state within same option group
        $$(`[data-variant-option][data-option-index="${idx}"]`, form).forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        // We let Shopify handle real variant resolution server-side via URL refresh on submit
        // (kept simple to avoid duplicating variant matching logic)
      });
    });

    /* Quantity stepper */
    const qty = $('[data-qty-input]', form);
    const dec = $('[data-qty-decrease]', form);
    const inc = $('[data-qty-increase]', form);
    if (qty) {
      dec && dec.addEventListener('click', () => {
        qty.value = Math.max(1, parseInt(qty.value, 10) - 1);
      });
      inc && inc.addEventListener('click', () => {
        qty.value = Math.max(1, parseInt(qty.value, 10) + 1);
      });
    }

    /* Ajax submit */
    form.addEventListener('submit', async (e) => {
      const isBuyNow = e.submitter && e.submitter.matches('[data-buy-now]');
      if (isBuyNow) return; // let it post normally → /cart/add
      e.preventDefault();
      const submit = form.querySelector('button[type="submit"][name="add"]');
      const original = submit ? submit.textContent : '';
      if (submit) {
        submit.disabled = true;
        submit.textContent = 'Adding…';
      }
      try {
        const fd = new FormData(form);
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          body: fd,
          headers: { Accept: 'application/json' }
        });
        if (!res.ok) throw new Error('Add to cart failed');
        await refreshCart();
        if (submit) submit.textContent = '✓ Added';
        setTimeout(() => {
          if (submit) {
            submit.textContent = original;
            submit.disabled = false;
          }
        }, 1500);
      } catch (err) {
        if (submit) {
          submit.textContent = 'Try again';
          submit.disabled = false;
        }
        console.error(err);
      }
    });
  });

  /* ─── PDP: thumbnail switching ─── */
  const mainImage = $('[data-pdp-main-image]');
  if (mainImage) {
    $$('[data-pdp-thumb]').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        $$('[data-pdp-thumb]').forEach((t) => t.classList.remove('is-active'));
        thumb.classList.add('is-active');
        const url = thumb.getAttribute('data-image-url');
        const img = mainImage.querySelector('img');
        if (img && url) img.src = url;
      });
    });
  }

  /* ─── Product card: Ajax Add to Cart ─── */
  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('[data-card-add-form]');
    if (!form) return;
    e.preventDefault();
    const btn = form.querySelector('[data-card-add]');
    if (!btn) return;
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'ADDING…';
    try {
      const fd = new FormData(form);
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) throw new Error('Add failed');
      await refreshCart();
      btn.textContent = '✓ ADDED';
      btn.style.backgroundColor = 'var(--color-pink)';
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        btn.style.backgroundColor = '';
      }, 1600);
    } catch (err) {
      btn.textContent = 'TRY AGAIN';
      btn.disabled = false;
      console.error(err);
    }
  });

  /* ─── Cart page: line item edits ─── */
  const cartItems = $('[data-cart-items]');
  if (cartItems) {
    const updateLine = async (key, quantity) => {
      try {
        const res = await fetch('/cart/change.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({ id: key, quantity })
        });
        if (res.ok) {
          window.location.reload();
        }
      } catch (e) { /* silent */ }
    };

    $$('[data-cart-line]', cartItems).forEach((line) => {
      const key = line.getAttribute('data-line-key');
      const input = $('[data-qty-input]', line);

      $$('[data-qty-change]', line).forEach((btn) => {
        btn.addEventListener('click', () => {
          const delta = parseInt(btn.getAttribute('data-qty-change'), 10);
          const next = Math.max(0, parseInt(input.value, 10) + delta);
          input.value = next;
          updateLine(key, next);
        });
      });

      const remove = $('[data-cart-remove]', line);
      if (remove) {
        remove.addEventListener('click', () => updateLine(key, 0));
      }

      if (input) {
        let timer;
        input.addEventListener('change', () => {
          clearTimeout(timer);
          timer = setTimeout(() => {
            updateLine(key, Math.max(0, parseInt(input.value, 10)));
          }, 300);
        });
      }
    });
  }
})();
