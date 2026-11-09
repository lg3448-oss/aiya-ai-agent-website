// Shared navigation for the home and FAQ pages.
(() => {
const menu = document.querySelector('[data-menu]');
const navigation = document.querySelector('[data-nav-links]');
function setMenu(open, restoreFocus = false) {
  navigation.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  if (restoreFocus) menu.focus();
}
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') setMenu(false, true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('[data-nav]')) setMenu(false);
});
document.addEventListener('focusin', event => {
  if (!event.target.closest('[data-nav]')) setMenu(false);
});
window.matchMedia('(max-width: 900px)').addEventListener('change', () => setMenu(false));

})();
