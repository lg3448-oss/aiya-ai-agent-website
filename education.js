// All resources remain available without JavaScript.
(() => {
  const filters = document.querySelector('.resource-filters');
  const resources = Array.from(document.querySelectorAll('[data-resource-kind]'));
  const status = document.querySelector('[data-resource-status]');
  filters.hidden = false;
  filters.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      const kind = button.dataset.resourceFilter;
      let visible = 0;
      resources.forEach(resource => {
        resource.hidden = kind !== 'all' && resource.dataset.resourceKind !== kind;
        if (!resource.hidden) visible++;
      });
      filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      status.textContent = `${visible} ${kind === 'all' ? 'resources' : kind === 'article' ? 'articles' : 'videos'}`;
    });
  });
})();
