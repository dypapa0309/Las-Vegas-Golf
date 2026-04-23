const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const pageSections = document.querySelectorAll('[data-page]');
const pageTriggers = document.querySelectorAll('a[href^="#"]');

function closeMenu() {
  if (!menuToggle || !navLinks) return;

  navLinks.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

function showPage(pageId) {
  const hasPage = Array.from(pageSections).some((section) => section.id === pageId);
  const targetId = hasPage ? pageId : 'home';

  pageSections.forEach((section) => {
    const isActive = section.id === targetId;
    section.classList.toggle('active', isActive);
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
    showPage(pageId);
  });
});

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
