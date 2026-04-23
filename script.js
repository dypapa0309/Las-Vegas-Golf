const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const pageSections = document.querySelectorAll('[data-page]');
const pageTriggers = document.querySelectorAll('a[href^="#"]');
const pageNavPrev = document.querySelector('.page-nav.prev');
const pageNavNext = document.querySelector('.page-nav.next');

const isMobile = () => window.innerWidth <= 768;

function closeMenu() {
  if (!menuToggle || !navLinks) return;
  navLinks.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

// 모바일: 스크롤 이동 / 데스크탑: 페이지 전환
function showPage(pageId, direction = 'next') {
  const hasPage = Array.from(pageSections).some((s) => s.id === pageId);
  const targetId = hasPage ? pageId : 'home';

  if (isMobile()) {
    const target = document.getElementById(targetId);
    if (target) {
      const headerH = document.querySelector('.header')?.offsetHeight || 82;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    navAnchors.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === `#${targetId}`);
    });
    closeMenu();
    return;
  }

  // 데스크탑 페이지 전환
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

  navAnchors.forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === `#${targetId}`);
  });

  window.scrollTo(0, 0);
  closeMenu();
}

function getHashPage() {
  return window.location.hash.replace('#', '') || 'home';
}

function getCurrentPageIndex() {
  return Array.from(pageSections).findIndex((s) => s.classList.contains('active'));
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
    if (!isMobile()) {
      const currentIndex = getCurrentPageIndex();
      const targetIndex = Array.from(pageSections).findIndex((s) => s.id === pageId);
      const direction = targetIndex > currentIndex ? 'next' : 'prev';
      showPage(pageId, direction);
    } else {
      showPage(pageId);
    }
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

// 데스크탑 reveal 애니메이션
const revealTargets = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.12 });
revealTargets.forEach((el) => observer.observe(el));

// 멤버십 탭
const tierButtons = document.querySelectorAll('.tier-btn');
const tierPanels = document.querySelectorAll('.tier-panel');

function activateTier(tier) {
  tierButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.tier === tier));
  tierPanels.forEach((panel) => panel.classList.toggle('active', panel.dataset.tierPanel === tier));
}
tierButtons.forEach((button) => {
  button.addEventListener('click', () => activateTier(button.dataset.tier));
});

// 모바일 스크롤 시 nav active 업데이트
function updateNavOnScroll() {
  if (!isMobile()) return;
  const headerH = document.querySelector('.header')?.offsetHeight || 82;
  let current = 'home';
  pageSections.forEach((section) => {
    const top = section.getBoundingClientRect().top - headerH;
    if (top <= 60) current = section.id;
  });
  navAnchors.forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', updateNavOnScroll, { passive: true });

window.addEventListener('hashchange', () => {
  if (!isMobile()) showPage(getHashPage());
});

// 초기 로드
if (isMobile()) {
  // 모바일: 모든 섹션 보이게, 해시 있으면 스크롤
  const hash = getHashPage();
  if (hash !== 'home') {
    setTimeout(() => showPage(hash), 100);
  }
} else {
  showPage(getHashPage());
}

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
