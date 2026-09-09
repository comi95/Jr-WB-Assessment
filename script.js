/* ============================================
   MARCI METZGER — THE RIDGE REALTY GROUP
   script.js — Interactions & Animations
   ============================================ */

(function () {
  'use strict';

  var navbar      = document.getElementById('navbar');
  var navToggle   = document.getElementById('navToggle');
  var navMenu     = document.getElementById('navMenu');
  var navLinks    = document.querySelectorAll('.nav-link');
  var contactForm = document.getElementById('contactForm');
  var submitBtn   = document.getElementById('submitBtn');
  var formSuccess = document.getElementById('formSuccess');
  var backToTop   = document.getElementById('backToTop');
  var statNumbers = document.querySelectorAll('.achievement-number');


  /* ==========================================
     1. STICKY NAVBAR — Backdrop Blur on Scroll
     ========================================== */
  function handleNavScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();


  /* ==========================================
     2. HAMBURGER NAV TOGGLE
     ========================================== */
  navToggle.addEventListener('click', function () {
    var isOpen = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });


  /* ==========================================
     3. SMOOTH SCROLL for All Anchor Links
     ========================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ==========================================
     4. ACTIVE NAV LINK on Scroll
     ========================================== */
  function updateActiveNavLink() {
    var sections = document.querySelectorAll('section[id]');
    var scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });


  /* ==========================================
     5. ANIMATED STAT COUNTERS
     ========================================== */
  var statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;

    statNumbers.forEach(function (stat) {
      var target = parseInt(stat.getAttribute('data-target'), 10);
      var duration = 2200;
      var startTime = performance.now();

      function tick(now) {
        var elapsed = now - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        stat.textContent = Math.round(eased * target);

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
    });

    statsAnimated = true;
  }

  var achievementsSection = document.getElementById('achievements');
  if (achievementsSection && 'IntersectionObserver' in window) {
    var statsObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateStats();
          statsObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    statsObs.observe(achievementsSection);
  }


  /* ==========================================
     6. SCROLL REVEAL ANIMATIONS
     ========================================== */
  var revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) {
      revealObs.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('revealed');
    });
  }


  /* ==========================================
     7. CONTACT FORM — Validation & Submit
     ========================================== */
  var validators = {
    name: function (v) {
      if (!v.trim()) return 'Please enter your name.';
      if (v.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    },
    email: function (v) {
      if (!v.trim()) return 'Please enter your email.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email.';
      return '';
    },
    message: function (v) {
      if (!v.trim()) return 'Please enter a message.';
      if (v.trim().length < 10) return 'Message must be at least 10 characters.';
      return '';
    }
  };

  function validateField(name, show) {
    var input = contactForm.elements[name];
    var errorEl = document.getElementById(name + 'Error');
    var msg = validators[name](input.value);

    if (show && msg) {
      input.classList.add('error');
      errorEl.textContent = msg;
      errorEl.classList.add('visible');
    } else {
      input.classList.remove('error');
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }

    return msg;
  }

  ['name', 'email', 'message'].forEach(function (fieldName) {
    var input = contactForm.elements[fieldName];
    if (!input) return;

    input.addEventListener('blur', function () {
      validateField(fieldName, true);
    });

    input.addEventListener('input', function () {
      if (this.classList.contains('error')) {
        validateField(fieldName, true);
      }
    });
  });

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var hasError = false;
    ['name', 'email', 'message'].forEach(function (fieldName) {
      if (validateField(fieldName, true)) hasError = true;
    });

    if (hasError) return;

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(function () {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      formSuccess.classList.add('show');
      contactForm.reset();

      setTimeout(function () {
        formSuccess.classList.remove('show');
      }, 6000);
    }, 1400);
  });


  /* ==========================================
     8. BACK TO TOP
     ========================================== */
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
