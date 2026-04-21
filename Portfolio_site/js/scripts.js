/* =========================================================
   Torin Kelly Portfolio — JS (single-page)
   Handles: mobile nav, anchor-based active link (scroll-spy),
            projects filter (multi-select, OR logic),
            smooth-close mobile menu on anchor click.
   ========================================================= */

(function () {


  // -------- Mobile nav toggle --------
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close mobile menu when any nav link is tapped
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // -------- Scroll-spy for anchor-based active nav --------
  const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const sections = navLinks
    .map(function (a) {
      const id = a.getAttribute('href').slice(1);
      return { link: a, el: document.getElementById(id) };
    })
    .filter(function (pair) { return pair.el; });

  function setActive() {
    // Active = last section whose top has passed the viewport trigger line
    const trigger = window.scrollY + 120;
    let current = null;
    sections.forEach(function (pair) {
      if (pair.el.offsetTop <= trigger) current = pair;
    });
    navLinks.forEach(function (a) { a.classList.remove('active'); });
    if (current) current.link.classList.add('active');
  }

  if (sections.length) {
    setActive();
    let raf = null;
    window.addEventListener('scroll', function () {
      if (raf) return;
      raf = requestAnimationFrame(function () { setActive(); raf = null; });
    }, { passive: true });
    window.addEventListener('resize', setActive, { passive: true });
  }

  // -------- Projects filter (multi-select, OR logic) --------
  const filterBar = document.querySelector('[data-filter-bar]');
  const grid = document.querySelector('[data-project-grid]');
  if (filterBar && grid) {
    const activeTags = new Set();
    const buttons = filterBar.querySelectorAll('.filter-btn');
    const clear = filterBar.querySelector('.filter-clear');
    const cards = grid.querySelectorAll('[data-tags]');
    const empty = document.querySelector('[data-filter-empty]');

    function applyFilter() {
      let visible = 0;
      cards.forEach(function (card) {
        const tags = (card.getAttribute('data-tags') || '')
          .split(',').map(function (s) { return s.trim(); });
        let show = true;
        if (activeTags.size > 0) {
          show = Array.from(activeTags).some(function (t) { return tags.indexOf(t) !== -1; });
        }
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const tag = btn.getAttribute('data-tag');
        if (activeTags.has(tag)) {
          activeTags.delete(tag);
          btn.classList.remove('active');
        } else {
          activeTags.add(tag);
          btn.classList.add('active');
        }
        applyFilter();
      });
    });

    if (clear) {
      clear.addEventListener('click', function () {
        activeTags.clear();
        buttons.forEach(function (b) { b.classList.remove('active'); });
        applyFilter();
      });
    }
  }
// -------- Image carousels --------
document.querySelectorAll('.carousel').forEach(function (carousel) {
  const slides = carousel.querySelectorAll('.carousel-track img');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  const dotsContainer = carousel.querySelector('.carousel-dots');
  let current = 0;

  if (slides.length <= 1) {
    // Hide controls if only one image
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (dotsContainer) dotsContainer.style.display = 'none';
    return;
  }

  // Build dots
  slides.forEach(function (_, i) {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', 'Go to image ' + (i + 1));
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', function (e) {
  e.preventDefault();
  e.stopPropagation();
  show(i);
});
    dotsContainer.appendChild(dot);
  });

  function show(index) {
    slides[current].classList.remove('active');
    dotsContainer.children[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dotsContainer.children[current].classList.add('active');
  }

 prevBtn.addEventListener('click', function (e) {
  e.preventDefault();
  e.stopPropagation();
  show(current - 1);
});
nextBtn.addEventListener('click', function (e) {
  e.preventDefault();
  e.stopPropagation();
  show(current + 1);
});

document.querySelectorAll('.card details').forEach(d => {
  d.addEventListener('toggle', () => {
    d.closest('.card').classList.toggle('expanded', d.open);
  });
});

  // Keyboard support when carousel is focused
  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { show(current - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { show(current + 1); e.preventDefault(); }
  });
});
})();
