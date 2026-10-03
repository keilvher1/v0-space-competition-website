// Optional presentation only. No requests, storage, analytics or navigation interception.
export const MOTION_PRESETS = Object.freeze({
  lettering: Object.freeze({ duration: 660, from: 'translateY(16px) rotate(-0.6deg) scale(0.985)', to: 'translateY(0) rotate(0) scale(1)' }),
  poster: Object.freeze({ duration: 620, from: 'translateY(20px) rotate(-0.8deg)', to: 'translateY(0) rotate(0)' }),
  rise: Object.freeze({ duration: 420, from: 'translateY(12px)', to: 'translateY(0)' }),
  photo: Object.freeze({ duration: 480, from: 'translateY(16px)', to: 'translateY(0)' }),
  settle: Object.freeze({ duration: 460, from: 'translateY(12px) rotate(-0.45deg)', to: 'translateY(0) rotate(0)' }),
});

export function motionAllowed({ systemReduced = false, visible = true } = {}) {
  return !systemReduced && visible;
}

export function readingProgress(scrollY, documentHeight, viewportHeight) {
  if (![scrollY, documentHeight, viewportHeight].every(Number.isFinite)) return 0;
  const available = documentHeight - viewportHeight;
  return available <= 0 ? 0 : Math.max(0, Math.min(1, scrollY / available));
}

export function activeSection(points, scrollY, headerHeight) {
  if (!Number.isFinite(scrollY) || !Number.isFinite(headerHeight)) return null;
  const line = Math.max(0, scrollY) + Math.max(0, headerHeight) + 32;
  let selected = null;
  for (const point of points) {
    if (!Number.isFinite(point.top) || point.top > line) continue;
    if (!selected || point.top >= selected.top) selected = point;
  }
  return selected?.id ?? null;
}

export function boundedDelay(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.min(160, number)) : 0;
}

export function installMotion({ doc = globalThis.document, win = globalThis.window } = {}) {
  if (!doc?.documentElement || !win) return { destroy() {} };
  const root = doc.documentElement;
  const header = doc.querySelector('.site-header');
  const progress = doc.querySelector('#reading-progress');
  const media = typeof win.matchMedia === 'function' ? win.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const state = { systemReduced: media?.matches ?? true, visible: !doc.hidden };
  const animations = new Map();
  const seen = new WeakSet();
  const removers = [];
  const targets = [...doc.querySelectorAll('[data-reveal]')];
  const navLinks = [...doc.querySelectorAll('.site-nav a[href^="#"], .header-cta[href^="#"]')];
  const sections = ['top', 'about', 'apply', 'benefits', 'stories', 'book', 'poster', 'faq']
    .map(id => doc.getElementById(id)).filter(Boolean);
  const navMap = { about: 'about', apply: 'apply', benefits: 'benefits', stories: 'stories', book: 'stories' };
  let points = [];
  let headerHeight = 0;
  let documentHeight = 0;
  let frame = null;
  let dirty = true;
  let destroyed = false;
  let observer = null;
  let resizeObserver = null;
  const requestFrame = typeof win.requestAnimationFrame === 'function' ? callback => win.requestAnimationFrame(callback) : callback => win.setTimeout(callback, 16);
  const cancelFrame = typeof win.cancelAnimationFrame === 'function' ? id => win.cancelAnimationFrame(id) : id => win.clearTimeout(id);

  function on(target, event, callback, options) {
    if (!target?.addEventListener) return;
    target.addEventListener(event, callback, options);
    removers.push(() => target.removeEventListener(event, callback, options));
  }

  function cancelAnimations() {
    for (const animation of animations.keys()) animation.cancel();
    animations.clear();
  }

  function animate(element, name, delay = 0) {
    if (!element || !motionAllowed(state) || typeof element.animate !== 'function') return;
    if (doc.activeElement && element.contains(doc.activeElement)) return;
    const preset = MOTION_PRESETS[name];
    if (!preset) return;
    try {
      // Content starts visible; finite transforms never gate access to text or links.
      const animation = element.animate([{ transform: preset.from }, { transform: preset.to }], {
        duration: preset.duration, delay: boundedDelay(delay), easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'both', iterations: 1,
      });
      animations.set(animation, element);
      Promise.resolve(animation.finished).then(() => {
        animations.delete(animation);
        animation.cancel(); // Return to ordinary CSS, including independent link hover state.
      }, () => animations.delete(animation));
    } catch {
      // Unsupported optional animation must not hide content or break navigation.
    }
  }

  function updatePreference() {
    const reduced = state.systemReduced;
    root.dataset.motion = reduced ? 'reduced' : 'full';
    root.dataset.pageVisible = String(state.visible);
    if (reduced || !state.visible) cancelAnimations();
  }

  function measure() {
    const y = Number.isFinite(win.scrollY) ? win.scrollY : 0;
    headerHeight = Math.ceil(header?.getBoundingClientRect().height || 0);
    if (headerHeight > 0) root.style.setProperty('--header-height', `${headerHeight}px`);
    points = sections.map(section => ({ id: section.id, top: section.getBoundingClientRect().top + y }));
    documentHeight = Math.max(root.scrollHeight, doc.body?.scrollHeight || 0);
    dirty = false;
  }

  function update() {
    frame = null;
    if (destroyed) return;
    if (dirty) measure();
    const y = Number.isFinite(win.scrollY) ? win.scrollY : 0;
    if (progress) { progress.hidden = false; progress.value = readingProgress(y, documentHeight, win.innerHeight); }
    header?.classList.toggle('is-scrolled', y > 24);
    const section = activeSection(points, y, headerHeight);
    const current = navMap[section] || null;
    for (const link of navLinks) {
      const selected = current !== null && link.getAttribute('href') === `#${current}`;
      link.classList.toggle('is-current', selected);
      if (selected) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }

  function schedule(remeasure = false) {
    if (destroyed) return;
    dirty ||= remeasure;
    if (!state.visible) return;
    if (frame !== null) return;
    frame = requestFrame(update);
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    if (frame !== null) cancelFrame(frame);
    observer?.disconnect();
    resizeObserver?.disconnect();
    cancelAnimations();
    for (const remove of removers) remove();
    for (const link of navLinks) { link.removeAttribute('aria-current'); link.classList.remove('is-current'); }
    header?.classList.remove('is-scrolled');
    root.style.removeProperty('--header-height');
    root.dataset.motion = 'unavailable';
    delete root.dataset.pageVisible;
    if (progress) progress.hidden = true;
  }

  try {
    updatePreference();
    measure();
    update();
    on(win, 'scroll', () => schedule(), { passive: true });
    on(win, 'resize', () => schedule(true), { passive: true });
    on(doc, 'load', event => { if (event.target?.tagName === 'IMG') schedule(true); }, true);
    on(doc, 'toggle', () => schedule(true), true);
    on(win, 'pageshow', () => {
      state.visible = !doc.hidden;
      state.systemReduced = media?.matches ?? true;
      updatePreference();
      schedule(true);
    });
    on(win, 'pagehide', () => {
      state.visible = false;
      root.dataset.pageVisible = 'false';
      cancelAnimations();
      if (frame !== null) { cancelFrame(frame); frame = null; }
    });
    on(doc, 'visibilitychange', () => {
      state.visible = !doc.hidden;
      root.dataset.pageVisible = String(state.visible);
      if (!state.visible) {
        cancelAnimations();
        if (frame !== null) { cancelFrame(frame); frame = null; }
      }
      else schedule(true);
    });
    on(doc, 'focusin', event => {
      for (const [animation, element] of animations) {
        if (element.contains(event.target)) { animation.cancel(); animations.delete(animation); }
      }
    });
    const preferenceChanged = () => { state.systemReduced = media.matches; updatePreference(); };
    if (media?.addEventListener) on(media, 'change', preferenceChanged);
    else if (media?.addListener) {
      media.addListener(preferenceChanged);
      removers.push(() => media.removeListener(preferenceChanged));
    }

    if (typeof win.ResizeObserver === 'function') {
      resizeObserver = new win.ResizeObserver(() => schedule(true));
      if (header) resizeObserver.observe(header);
      if (doc.body) resizeObserver.observe(doc.body);
    }
    if (typeof win.IntersectionObserver === 'function') {
      observer = new win.IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting || seen.has(entry.target)) continue;
          seen.add(entry.target);
          observer.unobserve(entry.target);
          animate(entry.target, entry.target.dataset.reveal, entry.target.dataset.motionDelay);
        }
      }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
      for (const element of targets) observer.observe(element);
    }
    if (state.visible && win.scrollY < 48 && (!win.location.hash || win.location.hash === '#top')) {
      animate(doc.querySelector('.failure-word'), 'lettering');
      animate(doc.querySelector('.poster-card'), 'poster', 90);
    }
    return { destroy };
  } catch (error) {
    destroy();
    throw error;
  }
}
