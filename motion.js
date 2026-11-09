// Decorative motion is local and never connects accounts or calls an AI service.
(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('[data-motion-toggle]');
  const brief = document.querySelector('[data-brief]');
  const typed = document.querySelector('[data-typed]');
  const demo = document.querySelector('#demo');
  let paused = false;
  let typingTimer;
  let demoVisible = false;
  let hasTyped = false;
  // Fibonacci sphere: a small deterministic constellation, no canvas render loop.
  const sphere = document.querySelector('[data-particle-sphere]');
  if (sphere) {
    for (let index = 0; index < 36; index++) {
      const y = 1 - 2 * index / 35;
      const radius = Math.sqrt(1 - y * y);
      const angle = index * Math.PI * (3 - Math.sqrt(5));
      const dot = document.createElement('i');
      dot.className = 'brain-particle';
      dot.style.setProperty('--x', (Math.cos(angle) * radius).toFixed(4));
      dot.style.setProperty('--y', y.toFixed(4));
      dot.style.setProperty('--z', (Math.sin(angle) * radius).toFixed(4));
      sphere.append(dot);
    }
  }
  document.body.classList.add('motion-ready');
  toggle.hidden = false;

  function finishTyping() {
    clearTimeout(typingTimer);
    typed.textContent = brief.textContent;
    typed.classList.remove('is-typing');
  }
  function typeBrief() {
    finishTyping();
    if (paused || preference.matches || !demoVisible) return;
    const text = brief.textContent;
    let position = 0;
    typed.textContent = '';
    typed.classList.add('is-typing');
    function tick() {
      typed.textContent = text.slice(0, ++position);
      if (position < text.length) typingTimer = setTimeout(tick, 28);
      else typed.classList.remove('is-typing');
    }
    tick();
  }
  function syncMotion() {
    document.body.classList.toggle('motion-paused', paused || preference.matches || document.hidden);
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? 'Play motion' : 'Pause motion';
    toggle.hidden = preference.matches;
    if (paused || preference.matches || document.hidden) {
      finishTyping();
      if (paused && typeof stopTour === 'function') stopTour();
    }
  }
  toggle.addEventListener('click', () => { paused = !paused; syncMotion(); });
  preference.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  new MutationObserver(typeBrief).observe(brief, { childList: true, characterData: true, subtree: true });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('is-inview', entry.isIntersecting);
      if (entry.target === demo) {
        demoVisible = entry.isIntersecting;
        if (demoVisible && !hasTyped) { hasTyped = true; typeBrief(); }
        if (!demoVisible) finishTyping();
      }
    });
  }, { threshold: .25 });
  document.querySelectorAll('[data-motion-scene],#demo').forEach(scene => observer.observe(scene));

  const descriptions = ['Find the work worth automating.', 'Connect your tools. Build your agent.', 'Review, refine, and keep work moving.'];
  const choices = document.querySelectorAll('[data-service],[data-orbit-service]');
  function selectService(index) {
    document.querySelector('[data-orbit-detail]').textContent = descriptions[index];
    choices.forEach(button => button.setAttribute('aria-pressed', String((button.dataset.service ?? button.dataset.orbitService) === index)));
  }
  choices.forEach(button => {
    const index = button.dataset.service ?? button.dataset.orbitService;
    button.addEventListener('click', () => selectService(index));
    button.addEventListener('focus', () => selectService(index));
    button.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') selectService(index); });
  });
  finishTyping();
  syncMotion();
})();
