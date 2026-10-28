/* CLWNPRNT — dependency-free interactions; also works when opened locally. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const config = window.CLWNPRNT_CONFIG || {};
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const projects = [
    { category: 'graphic', file: 'graphic-design', title: 'Built to stand out.', discipline: 'Graphic design / Art direction', description: 'A concept artwork exploring the impact of a limited palette, layered shapes, and a bold focal point. Red, white, and black create a striking visual language around an original samurai mask.', tags: ['Concept artwork', 'Graphic composition', 'Red / White / Black'] },
    { category: 'presentation', file: 'presentation-design', title: 'A clearer point of view.', discipline: 'Presentation design / Visual storytelling', description: 'A presentation concept exploring structure, hierarchy, and clear data storytelling. Floating slide mockups bring a clean blue-and-white visual system into focus. This is a visual study, not a downloadable slide deck.', tags: ['Presentation concept', 'Visual hierarchy', 'Data storytelling'] },
    { category: 'motion', file: 'motion-graphics', title: 'Make every frame count.', discipline: 'Motion graphics / 3D styleframe', description: 'A still-image styleframe for a motion design direction. Luminous typography, architectural symmetry, and a small human silhouette explore light and scale. This study shows the visual direction; it is not a playable animation.', tags: ['Still-image study', 'Motion direction', 'Light & scale'] },
    { category: 'video', file: 'video-editing', title: 'Stories with a pulse.', discipline: 'Video editing / Cinematic direction', description: 'A cinematic color and composition study. Purple atmosphere, warm amber highlights, and a solitary traveler set the mood for a visual narrative. This is a concept frame, not a playable video or a completed client project.', tags: ['Concept frame', 'Color direction', 'Visual narrative'] },
    { category: 'spatial', file: 'spatial-design', title: 'Step into the idea.', discipline: '3D / Spatial visualization', description: 'An architectural visualization concept exploring a warm industrial space. Natural materials, greenery, and afternoon light bring a sense of depth and atmosphere to the scene.', tags: ['Spatial concept', 'Material study', 'Architectural mood'] },
    { category: 'illustration', file: 'illustration', title: 'Character in every line.', discipline: 'Illustration / Character design', description: 'An original character concept built around confident linework and contrasting color. Electric blue hair, orange streetwear, and expressive cel shading give the illustration its distinctive energy.', tags: ['Original character concept', 'Digital illustration', 'Color contrast'] }
  ];
  $('#year').textContent = new Date().getFullYear();

  // Header and active anchor state.
  const header = $('#header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        $$('.desktop-nav a').forEach(link => {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-12% 0px -65% 0px', threshold: 0 });
    $$('main > section[id]').forEach(section => sectionObserver.observe(section));
  }

  // Navigation overlay: keyboard loop, Escape, and focus restoration.
  const menuButton = $('#menu-toggle');
  const menu = $('#menu-panel');
  function setMenu(open, restoreFocus = true) {
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
    $('#main').inert = open;
    $('.site-footer').inert = open;
    if (open) $('a', menu).focus();
    else if (restoreFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => setMenu(menu.hidden));
  $$('.site-header a').forEach(link => link.addEventListener('click', () => {
    if (!menu.hidden) setMenu(false, false);
  }));
  $$('.menu-panel a').forEach(link => link.addEventListener('click', () => {
    const target = $(link.getAttribute('href'));
    setMenu(false, false);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }));
  document.addEventListener('keydown', event => {
    if (menu.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); setMenu(false); }
    if (event.key === 'Tab') {
      const focusable = [menuButton, ...$$('a', menu)];
      const index = focusable.indexOf(document.activeElement);
      const next = event.shiftKey ? (index - 1 + focusable.length) % focusable.length : (index + 1) % focusable.length;
      event.preventDefault(); focusable[next].focus();
    }
  });

  // Horizontal discipline strip and gallery filters.
  const categoryCards = $$('.category-card');
  let categoryIndex = 0;
  function selectCategory(index, scroll = true) {
    categoryIndex = (index + categoryCards.length) % categoryCards.length;
    categoryCards.forEach((card, i) => card.classList.toggle('selected', i === categoryIndex));
    $('#slide-current').textContent = String(categoryIndex + 1).padStart(2, '0');
    $('#slide-progress').style.width = ((categoryIndex + 1) / categoryCards.length * 100) + '%';
    if (scroll) {
      const track = $('#category-track');
      const card = categoryCards[categoryIndex];
      const trackRect = track.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      if (track.scrollWidth > track.clientWidth + 4) track.scrollTo({ left: track.scrollLeft + cardRect.left - trackRect.left - track.clientWidth * .08, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    }
  }
  $('#previous-category').addEventListener('click', () => selectCategory(categoryIndex - 1));
  $('#next-category').addEventListener('click', () => selectCategory(categoryIndex + 1));
  function filterProjects(category) {
    $$('.filter').forEach(button => {
      const active = button.dataset.filter === category;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    let count = 0;
    $$('.project-card').forEach(card => {
      card.hidden = category !== 'all' && card.dataset.category !== category;
      if (!card.hidden) count++;
    });
    $('#filter-status').textContent = category === 'all' ? 'Showing all 6 concept studies.' : 'Showing ' + count + ' concept study.';
  }
  $$('.filter').forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));
  categoryCards.forEach((card, index) => card.addEventListener('click', () => {
    selectCategory(index, false);
    filterProjects(card.dataset.category);
    $('#works').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }));
  $('.hero-cta').addEventListener('click', () => filterProjects('all'));
  $$('.desktop-nav a[href="#works"], .menu-panel a[href="#works"]').forEach(link => link.addEventListener('click', () => filterProjects('all')));

  // Accessible project lightbox, with native dialog focus containment.
  const dialog = $('#project-dialog');
  let currentProject = 0;
  function populateProject(index) {
    currentProject = (index + projects.length) % projects.length;
    const project = projects[currentProject];
    const imagePath = 'assets/images/' + project.file + '.webp';
    $('#dialog-image').src = (window.CLWNPRNT_ASSETS || {})[imagePath] || imagePath;
    $('#dialog-image').alt = $('.project-card[data-project="' + currentProject + '"] img').alt;
    $('#dialog-title').textContent = project.title;
    $('#dialog-category').textContent = project.discipline + ' · Concept study';
    $('#dialog-description').textContent = project.description;
    $('#dialog-tags').replaceChildren(...project.tags.map(text => {
      const span = document.createElement('span'); span.textContent = text; return span;
    }));
    dialog.scrollTop = 0;
  }
  $$('.project-card').forEach(card => card.addEventListener('click', () => {
    populateProject(Number(card.dataset.project));
    dialog.showModal(); document.body.classList.add('dialog-open');
  }));
  $('#dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  $('#dialog-prev').addEventListener('click', () => populateProject(currentProject - 1));
  $('#dialog-next').addEventListener('click', () => populateProject(currentProject + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); populateProject(currentProject - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); populateProject(currentProject + 1); }
  });
  $('#dialog-contact').addEventListener('click', () => {
    $('#service-select').value = projects[currentProject].category;
    dialog.close(); $('#contact').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    $('input[name="name"]').focus({ preventScroll: true });
  });

  // Contact: honest offline brief export, or an email draft when configured.
  const email = typeof config.email === 'string' ? config.email.trim() : '';
  const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/[\r\n]/.test(email);
  if (hasEmail) {
    const emailLink = $('#direct-email');
    emailLink.hidden = false; emailLink.href = 'mailto:' + encodeURIComponent(email); emailLink.textContent = email + ' ↗';
    $('#contact-description').textContent = 'Tell me about your project. Let’s find the right way to bring it to life.';
    $('#submit-label').textContent = 'Create email draft';
    $('#form-note').textContent = 'Opens your email app with the brief filled in. Review it there before sending.';
  }
  const socials = $('#social-links');
  (Array.isArray(config.socialLinks) ? config.socialLinks : []).forEach(item => {
    if (!item || typeof item.url !== 'string' || typeof item.label !== 'string') return;
    try {
      const url = new URL(item.url);
      if (url.protocol !== 'https:') return;
      const a = document.createElement('a'); a.href = url.href; a.textContent = item.label + ' ↗'; a.target = '_blank'; a.rel = 'noopener noreferrer'; socials.append(a);
    } catch { /* Ignore invalid links. */ }
  });
  socials.hidden = socials.childElementCount === 0;
  $('#contact-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('name')).trim();
    const visitorEmail = String(data.get('email')).trim();
    const message = String(data.get('message')).trim();
    if (!name || message.length < 10) { $('#form-status').textContent = 'Please add your name and at least 10 characters about your idea.'; return; }
    const service = $('#service-select').selectedOptions[0].text;
    const subject = 'Project inquiry — ' + service;
    const brief = 'CLWNPRNT — PROJECT BRIEF\n\nName: ' + name + '\nEmail: ' + visitorEmail + '\nService: ' + service + '\n\nTHE IDEA\n' + message + '\n';
    if (hasEmail) {
      window.location.href = 'mailto:' + encodeURIComponent(email) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(brief);
      $('#form-status').textContent = 'Your email draft is ready in your email app. Nothing is sent automatically.';
    } else {
      const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }));
      const link = document.createElement('a'); link.href = url; link.download = 'CLWNPRNT-project-brief.txt'; document.body.append(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 10000);
      $('#form-status').textContent = 'Your brief has been downloaded. Keep it handy to share with your project details.';
    }
  });
})();
