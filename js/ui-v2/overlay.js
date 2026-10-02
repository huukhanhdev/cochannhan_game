// Overlay + focus helpers for the V2 prototype. Pause reasons stack; closing journal does not clear combat pause.
(function (root) {
  const stack = [];

  function top() {
    return stack[stack.length - 1] || null;
  }

  function open(id, reason) {
    if (stack.some((x) => x.id === id)) return;
    while (stack.length) closeTop();
    stack.push({ id, reason, opener: document.activeElement });
    render();
  }

  function close(id) {
    const idx = id ? stack.findIndex((x) => x.id === id) : stack.length - 1;
    if (idx < 0) return;
    const [item] = stack.splice(idx, 1);
    render();
    if (item.opener && typeof item.opener.focus === 'function') item.opener.focus();
  }

  function closeTop() {
    close();
  }

  function reasons() {
    return stack.map((x) => x.reason).filter(Boolean);
  }

  function render() {
    document.querySelectorAll('[data-overlay]').forEach((el) => {
      const on = stack.some((x) => x.id === el.getAttribute('data-overlay'));
      el.classList.toggle('is-open', on);
      el.hidden = !on;
      if (on) {
        const closeBtn = el.querySelector('[data-overlay-close]');
        if (closeBtn) closeBtn.focus();
      }
    });
    const hud = document.getElementById('pauseReasons');
    if (hud) hud.textContent = reasons().join(' · ') || 'không pause';
  }

  function bind() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (!stack.length) return;
      e.preventDefault();
      closeTop();
    });
  }

  root.UI_V2_OVERLAY = { open, close, closeTop, reasons, bind, render };
})(window);
