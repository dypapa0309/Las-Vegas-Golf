const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  });

  navAnchors.forEach((anchor) => {
    anchor.addEventListener('click', () => {
      navLinks.classList.remove('open');
      document.body.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
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
