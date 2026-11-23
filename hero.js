'use strict';
(() => {
  const header = document.getElementById('top');
  const video = document.getElementById('hero-video');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection?.saveData);
  let inView = false, playbackBlocked = false, desired = false, request = 0;
  video.muted = true; video.defaultMuted = true;
  async function sync() {
    const token = ++request;
    desired = inView && !document.hidden && !playbackBlocked && !reduced.matches && !saveData;
    if (!desired) { video.pause(); return; }
    if (!video.getAttribute('src')) video.src = video.dataset.src;
    try {
      await video.play();
      if (token !== request) { if (!desired) video.pause(); return; }
      header.classList.add('hero-video-ready');
    } catch {
      if (token !== request) return;
      desired = false; playbackBlocked = true;
    }
  }
  video.addEventListener('playing', () => header.classList.add('hero-video-ready'));
  video.addEventListener('error', () => { request++; desired = false; header.classList.remove('hero-video-ready'); });
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting && entries[0].intersectionRatio > .1;
      sync();
    }, { threshold: [0, .1, .3, 1] });
    observer.observe(header);
  } else { inView = true; sync(); }
  const navTone = () => document.documentElement.classList.toggle('hero-at-top', window.scrollY < 32);
  window.addEventListener('scroll', navTone, { passive: true });
  window.addEventListener('pageshow', () => { navTone(); sync(); });
  window.addEventListener('pagehide', () => { request++; desired = false; video.pause(); });
  navTone();
})();
