/* =========================================================
   Samuel Marshall Photo — interactions
   Vanilla JS, no dependencies.
   ========================================================= */
(function () {
    'use strict';

    const $  = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- year ---------- */
    const yr = $('#year');
    if (yr) yr.textContent = new Date().getFullYear();

    /* ---------- nav: scrolled state + mobile toggle ---------- */
    const nav = $('#nav');
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const toggle = $('#navToggle');
    const links  = $('#navLinks');
    const closeMenu = () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
    toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
    });
    $$('#navLinks a').forEach(a => a.addEventListener('click', closeMenu));

    /* ---------- hero slideshow ---------- */
    const slides = $$('.hero__slide');
    const dotsWrap = $('#heroDots');
    let current = 0, timer = null;

    if (slides.length && dotsWrap) {
        slides.forEach((_, i) => {
            const b = document.createElement('button');
            b.setAttribute('aria-label', 'Show slide ' + (i + 1));
            if (i === 0) b.classList.add('is-active');
            b.addEventListener('click', () => go(i, true));
            dotsWrap.appendChild(b);
        });
        const dots = $$('button', dotsWrap);

        function go(i, manual) {
            slides[current].classList.remove('is-active');
            dots[current].classList.remove('is-active');
            current = (i + slides.length) % slides.length;
            slides[current].classList.add('is-active');
            dots[current].classList.add('is-active');
            if (manual) restart();
        }
        function next() { go(current + 1); }
        function restart() { clearInterval(timer); if (!reduceMotion) timer = setInterval(next, 5500); }
        restart();
    }

    /* ---------- count-up stats ---------- */
    const counters = $$('.stats__num');
    const animateCount = (el) => {
        const target = parseFloat(el.dataset.count) || 0;
        const suffix = el.dataset.suffix || '';
        if (reduceMotion) { el.textContent = target + suffix; return; }
        const dur = 1400, start = performance.now();
        const step = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    /* ---------- reveal on scroll + trigger counters ---------- */
    const revealEls = $$('.reveal');
    if ('IntersectionObserver' in window && !reduceMotion) {
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                e.target.classList.add('in');
                $$('.stats__num', e.target).forEach(animateCount);
                if (e.target.classList.contains('stats__num')) animateCount(e.target);
                obs.unobserve(e.target);
            });
        }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
        revealEls.forEach(el => io.observe(el));
        // observe stat <li> wrappers handled above; also catch direct numbers
    } else {
        revealEls.forEach(el => el.classList.add('in'));
        counters.forEach(c => c.textContent = (c.dataset.count || '') + (c.dataset.suffix || ''));
    }

    /* ---------- portfolio filtering ---------- */
    const filters = $$('.filter');
    const shots = $$('.shot');
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
            btn.classList.add('is-active');
            btn.setAttribute('aria-selected', 'true');
            const f = btn.dataset.filter;
            shots.forEach(s => {
                const show = f === 'all' || s.dataset.cat === f;
                s.classList.toggle('hide', !show);
            });
            rebuildLightboxList();
        });
    });

    /* ---------- lightbox ---------- */
    const lb     = $('#lightbox');
    const lbImg  = $('#lbImg');
    const lbCap  = $('#lbCap');
    const lbClose= $('#lbClose');
    const lbPrev = $('#lbPrev');
    const lbNext = $('#lbNext');
    let visibleShots = [];
    let lbIndex = 0;

    function rebuildLightboxList() {
        visibleShots = shots.filter(s => !s.classList.contains('hide'));
    }
    rebuildLightboxList();

    function openLightbox(shot) {
        lbIndex = visibleShots.indexOf(shot);
        renderLightbox();
        lb.classList.add('open');
        lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lbClose.focus();
    }
    function renderLightbox() {
        const s = visibleShots[lbIndex];
        if (!s) return;
        lbImg.src = s.dataset.full;
        lbImg.alt = s.querySelector('img') ? s.querySelector('img').alt : (s.dataset.title || '');
        lbCap.querySelector('strong').textContent = s.dataset.title || '';
        lbCap.querySelector('span').textContent = s.dataset.meta || '';
    }
    function closeLightbox() {
        lb.classList.remove('open');
        lb.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    function step(dir) {
        lbIndex = (lbIndex + dir + visibleShots.length) % visibleShots.length;
        renderLightbox();
    }

    shots.forEach(s => s.addEventListener('click', () => openLightbox(s)));
    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', () => step(-1));
    lbNext.addEventListener('click', () => step(1));
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') step(1);
        if (e.key === 'ArrowLeft') step(-1);
    });

    /* ---------- contact form (graceful: works with or without Formspree id) ---------- */
    const form = $('#bookForm');
    const status = $('#formStatus');
    if (form) {
        form.addEventListener('submit', async (e) => {
            const action = form.getAttribute('action') || '';
            const configured = action.includes('formspree.io') && !action.includes('your-form-id');

            if (!configured) {
                // Fall back to a mailto so the form is never a dead end.
                e.preventDefault();
                const data = new FormData(form);
                const subject = encodeURIComponent('Photography inquiry — ' + (data.get('type') || ''));
                const body = encodeURIComponent(
                    'Name: ' + (data.get('name') || '') + '\n' +
                    'Email: ' + (data.get('email') || '') + '\n' +
                    'Occasion: ' + (data.get('type') || '') + '\n' +
                    'Date: ' + (data.get('date') || '') + '\n\n' +
                    (data.get('message') || '')
                );
                window.location.href = 'mailto:samuelmphoto@gmail.com?subject=' + subject + '&body=' + body;
                status.textContent = 'Opening your email app…';
                status.className = 'form-status ok';
                return;
            }

            // Formspree AJAX path
            e.preventDefault();
            if (!form.checkValidity()) { form.reportValidity(); return; }
            status.textContent = 'Sending…';
            status.className = 'form-status';
            try {
                const res = await fetch(action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { Accept: 'application/json' }
                });
                if (res.ok) {
                    form.reset();
                    status.textContent = "Thanks — your inquiry is in. I'll be in touch within a day.";
                    status.className = 'form-status ok';
                } else {
                    throw new Error('bad response');
                }
            } catch (err) {
                status.textContent = 'Something went wrong. Email me directly at samuelmphoto@gmail.com.';
                status.className = 'form-status err';
            }
        });
    }
})();
