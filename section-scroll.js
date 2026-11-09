// Desktop chapter navigation. Long sections and mobile keep native scrolling.
(() => {
  const root = document.documentElement;
  const screens = Array.from(document.querySelectorAll('[data-screen]'));
  const links = Array.from(document.querySelectorAll('.screen-nav a'));
  const desktop = matchMedia('(min-width: 1024px) and (min-height: 650px) and (pointer: fine)');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let positions = [];
  let frame = 0;
  let animating = false;
  let gestureLocked = false;
  let releaseTimer = 0;
  let wheelTotal = 0;
  let wheelSign = 0;

  function measure() {
    positions = screens.map(screen => {
      const bounds = screen.getBoundingClientRect();
      return { top: bounds.top + scrollY, bottom: bounds.bottom + scrollY };
    });
  }

  function current() {
    let index = 0;
    positions.forEach((position, candidate) => {
      if (position.top <= scrollY + 4) index = candidate;
    });
    return index;
  }

  function updateLocation() {
    if (!positions.length) return;
    const center = scrollY + innerHeight * .45;
    let index = 0;
    positions.forEach((position, candidate) => {
      if (position.top <= center) index = candidate;
    });
    links.forEach((link, candidate) => {
      if (candidate === index) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
  }

  function cancelAnimation() {
    cancelAnimationFrame(frame);
    animating = false;
    root.classList.remove('is-paging');
  }

  function moveTo(index) {
    measure();
    if (index < 0 || index >= screens.length) return;
    cancelAnimation();
    const destination = Math.min(positions[index].top, root.scrollHeight - innerHeight);
    if (motion.matches) {
      scrollTo({ top: destination, behavior: 'instant' });
      updateLocation();
      return;
    }
    const start = scrollY;
    const started = performance.now();
    animating = true;
    root.classList.add('is-paging');
    function tick(now) {
      const progress = Math.min((now - started) / 700, 1);
      const ease = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
      scrollTo({ top: start + (destination - start) * ease, behavior: 'instant' });
      if (progress < 1) frame = requestAnimationFrame(tick);
      else {
        animating = false;
        root.classList.remove('is-paging');
        scrollTo({ top: destination, behavior: 'instant' });
        updateLocation();
      }
    }
    frame = requestAnimationFrame(tick);
  }

  function editable(target) {
    return target instanceof Element && Boolean(target.closest('input,textarea,select,[contenteditable=true],[data-native-scroll]'));
  }

  function onWheel(event) {
    if (!desktop.matches || event.ctrlKey || event.metaKey || event.altKey || editable(event.target) || Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.deltaY === 0) return;
    clearTimeout(releaseTimer);
    releaseTimer = setTimeout(() => {
      gestureLocked = false;
      wheelTotal = 0;
      wheelSign = 0;
    }, 220);
    if (animating || gestureLocked) {
      event.preventDefault();
      return;
    }
    measure();
    const index = current();
    const direction = Math.sign(event.deltaY);
    const position = positions[index];
    // Read all of an oversized chapter before crossing its boundary.
    if (direction > 0 && scrollY < position.bottom - innerHeight - 3) return;
    if (direction < 0 && scrollY > position.top + 3) return;
    const target = index + direction;
    if (target < 0 || target >= screens.length) return;
    event.preventDefault();
    if (direction !== wheelSign) wheelTotal = 0;
    wheelSign = direction;
    wheelTotal += Math.abs(event.deltaY) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
    if (wheelTotal < 24) return;
    gestureLocked = true;
    wheelTotal = 0;
    moveTo(target);
  }

  function onKey(event) {
    if (!desktop.matches || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || editable(event.target)) return;
    if (event.key !== 'PageDown' && event.key !== 'PageUp') return;
    measure();
    const index = current();
    const direction = event.key === 'PageDown' ? 1 : -1;
    const position = positions[index];
    if (direction > 0 && scrollY < position.bottom - innerHeight - 3) return;
    if (direction < 0 && scrollY > position.top + 3) return;
    if (index + direction < 0 || index + direction >= screens.length) return;
    event.preventDefault();
    gestureLocked = false;
    moveTo(index + direction);
  }

  function configure() {
    cancelAnimation();
    gestureLocked = false;
    root.classList.toggle('fullpage-ready', desktop.matches);
    measure();
    updateLocation();
  }

  addEventListener('wheel', onWheel, { passive: false });
  addEventListener('keydown', onKey);
  addEventListener('pointerdown', () => { cancelAnimation(); gestureLocked = false; }, { passive: true });
  addEventListener('scroll', updateLocation, { passive: true });
  addEventListener('resize', configure);
  desktop.addEventListener('change', configure);
  motion.addEventListener('change', configure);
  const observer = new ResizeObserver(() => { measure(); updateLocation(); });
  screens.forEach(screen => observer.observe(screen));
  document.fonts.ready.then(configure);
  configure();
})();
