'use strict';

const menuButton = document.querySelector('.menu-button');
const mobileNav = document.getElementById('mobile-nav');
const productMenus = [...document.querySelectorAll('.products')];
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  mobileNav.hidden = true;
  for (const menu of productMenus) if (mobileNav.contains(menu)) menu.open = false;
}
menuButton.addEventListener('click', () => {
  if (!mobileNav.hidden) { closeMenu(); return; }
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'Close navigation');
  mobileNav.hidden = false;
});
document.addEventListener('click', event => {
  for (const menu of productMenus) if (menu.open && !menu.contains(event.target)) menu.open = false;
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const openProducts = productMenus.find(menu => menu.open && menu.getClientRects().length);
  if (openProducts) {
    openProducts.open = false;
    openProducts.querySelector('summary').focus();
  } else if (!mobileNav.hidden) {
    closeMenu();
    menuButton.focus();
  }
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
