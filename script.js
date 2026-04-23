const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const pageSections = document.querySelectorAll('[data-page]');
const pageTriggers = document.querySelectorAll('a[href^="#"]');
const pageNavPrev = document.querySelector('.page-nav.prev');
const pageNavNext = document.querySelector('.page-nav.next');

function closeMenu() {
  if (!menuToggle || !navLinks) return;

  navLinks.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

function showPage(pageId, direction = 'next') {
  const hasPage = Array.from(pageSections).some((section) => section.id === pageId);
  const targetId = hasPage ? pageId : 'home';

  pageSections.forEach((section) => {
    const isActive = section.id === targetId;
    section.classList.toggle('active', isActive);
    section.classList.toggle('slide-right', isActive && direction === 'next');
    section.classList.toggle('slide-left', isActive && direction === 'prev');
    section.setAttribute('aria-hidden', String(!isActive));

    if (isActive) {
      section.querySelectorAll('.reveal').forEach((el) => el.classList.add('show'));
    }
  });

  navAnchors.forEach((anchor) => {
    anchor.classList.toggle('active', anchor.getAttribute('href') === `#${targetId}`);
  });

  window.scrollTo(0, 0);
  closeMenu();
}

function getHashPage() {
  return window.location.hash.replace('#', '') || 'home';
}

function getCurrentPageIndex() {
  return Array.from(pageSections).findIndex((section) => section.classList.contains('active'));
}

function getPageIdByOffset(offset) {
  const currentIndex = getCurrentPageIndex();
  const nextIndex = (currentIndex + offset + pageSections.length) % pageSections.length;
  return pageSections[nextIndex].id;
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  });
}

pageTriggers.forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const pageId = anchor.getAttribute('href').replace('#', '');
    const target = document.getElementById(pageId);

    if (!target || !target.matches('[data-page]')) return;

    event.preventDefault();
    window.history.pushState(null, '', `#${pageId}`);
    const currentIndex = getCurrentPageIndex();
    const targetIndex = Array.from(pageSections).findIndex((section) => section.id === pageId);
    const direction = targetIndex > currentIndex ? 'next' : 'prev';
    showPage(pageId, direction);
  });
});

if (pageNavPrev) {
  pageNavPrev.addEventListener('click', () => {
    const nextPage = getPageIdByOffset(-1);
    window.history.pushState(null, '', `#${nextPage}`);
    showPage(nextPage, 'prev');
  });
}

if (pageNavNext) {
  pageNavNext.addEventListener('click', () => {
    const nextPage = getPageIdByOffset(1);
    window.history.pushState(null, '', `#${nextPage}`);
    showPage(nextPage, 'next');
  });
}

const revealTargets = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach((el) => observer.observe(el));

const tierButtons = document.querySelectorAll('.tier-btn');
const tierPanels = document.querySelectorAll('.tier-panel');

function activateTier(tier) {
  tierButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.tier === tier));
  tierPanels.forEach((panel) => panel.classList.toggle('active', panel.dataset.tierPanel === tier));
}

tierButtons.forEach((button) => {
  button.addEventListener('click', () => activateTier(button.dataset.tier));
});

window.addEventListener('hashchange', () => showPage(getHashPage()));
showPage(getHashPage());

// 스와이프 네비게이션
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  if (!showModal.hidden) return;
  const deltaX = e.changedTouches[0].clientX - touchStartX;
  const deltaY = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY)) return;
  if (deltaX < 0) {
    const next = getPageIdByOffset(1);
    window.history.pushState(null, '', `#${next}`);
    showPage(next, 'next');
  } else {
    const prev = getPageIdByOffset(-1);
    window.history.pushState(null, '', `#${prev}`);
    showPage(prev, 'prev');
  }
}, { passive: true });

// Show modal
const showModal = document.getElementById('showModal');
const showTrigger = document.querySelector('.show-trigger');
const showModalClose = document.querySelector('.show-modal-close');
const showModalBackdrop = document.querySelector('.show-modal-backdrop');

function openShowModal() {
  showModal.hidden = false;
  document.body.classList.add('menu-open');
  showModalClose.focus();
}

function closeShowModal() {
  showModal.hidden = true;
  document.body.classList.remove('menu-open');
}

if (showTrigger) {
  showTrigger.addEventListener('click', openShowModal);
  showTrigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openShowModal(); }
  });
}

if (showModalClose) showModalClose.addEventListener('click', closeShowModal);
if (showModalBackdrop) showModalBackdrop.addEventListener('click', closeShowModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !showModal.hidden) closeShowModal();
});
