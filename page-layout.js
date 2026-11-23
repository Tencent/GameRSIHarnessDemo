'use strict';
(() => {
  const tabs = [...document.querySelectorAll('[data-action-panel]')];
  const panels = [...document.querySelectorAll('.action-section-panel')];
  function select(name, focus = false) {
    const target = document.getElementById(`action-panel-${name}`);
    if (!target) return;
    document.dispatchEvent(new CustomEvent('gamepilot:focus-demo', { detail: 'section-navigation' }));
    document.querySelectorAll('#demos video').forEach(video => video.pause());
    panels.forEach(panel => { panel.hidden = panel !== target; });
    tabs.forEach(tab => {
      const active = tab.dataset.actionPanel === name;
      tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab.dataset.actionPanel));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault(); select(tabs[next].dataset.actionPanel, true);
    });
  });
  function revealHash() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    if (!id) return;
    const target = document.getElementById(id);
    const panel = target?.closest('.action-section-panel');
    if (!panel) return;
    select(panel.id.replace('action-panel-', ''));
    const disclosure = target.closest('details');
    if (disclosure) disclosure.open = true;
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: 'instant' }));
  }
  window.addEventListener('hashchange', revealHash);
  revealHash();
})();
