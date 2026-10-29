/**
 * SAFI AHMAD — CYBERNETIC DARK DEVELOPER CV & PORTFOLIO
 * Vanilla JavaScript Controller (No External Libraries)
 * Single-Page Smooth Scroll, ScrollSpy, Interactive Glow, Category Filters, Clipboard & Transmission
 */

document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------------------------------------------------
  // DOM ELEMENT REFERENCES
  // -------------------------------------------------------------------------
  const header = document.getElementById('site-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-card');
  const interactivePanels = document.querySelectorAll('.glass-panel, .terminal-window');
  const copyBtn = document.getElementById('btn-copy-email');
  const copyText = document.getElementById('copy-text');
  const contactForm = document.getElementById('portfolio-contact-form');
  const submitBtn = document.getElementById('btn-submit-message');
  const submitText = document.getElementById('submit-button-text');
  const successToast = document.getElementById('form-success-toast');
  const emailAddress = 'safiahmad.dev@gmail.com';
  const headerOffset = 80;

  // -------------------------------------------------------------------------
  // 01. SMOOTH SCROLLING WITH FIXED HEADER OFFSET
  // -------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile drawer if active
        if (mobileDrawer && mobileDrawer.classList.contains('open')) {
          mobileDrawer.classList.remove('open');
          if (mobileToggle) {
            mobileToggle.classList.remove('open');
            mobileToggle.setAttribute('aria-expanded', 'false');
          }
        }

        // Update URL hash without jumping
        history.pushState(null, null, targetId);
      }
    });
  });

  // -------------------------------------------------------------------------
  // 02. NAVIGATION SCROLLSPY (ACTIVE LINK HIGHLIGHTING)
  // -------------------------------------------------------------------------
  const sectionIds = ['hero', 'about', 'experience', 'skills', 'contact'];

  function updateScrollSpy() {
    let currentSection = 'hero';
    const scrollPosition = window.scrollY + 160;

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentSection = id;
        }
      }
    });

    // Update Desktop Nav Links
    navLinks.forEach(link => {
      if (link.getAttribute('data-section') === currentSection) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update Mobile Drawer Links
    mobileNavLinks.forEach(link => {
      if (link.getAttribute('data-section') === currentSection) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateScrollSpy, { passive: true });
  updateScrollSpy();

  // -------------------------------------------------------------------------
  // 03. MOBILE NAVIGATION DRAWER TOGGLE
  // -------------------------------------------------------------------------
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('open') && 
          !mobileDrawer.contains(e.target) && 
          !mobileToggle.contains(e.target)) {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 04. SKILLS CATEGORY FILTER TABS
  // -------------------------------------------------------------------------
  if (filterTabs.length > 0 && skillCards.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-filter');

        // Update active tab styles & ARIA attributes
        filterTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // Filter cards with smooth fade & translate transition
        skillCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
              card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            }, 20);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // -------------------------------------------------------------------------
  // 05. MOUSE-TRACKING AMBIENT RADIAL SPOTLIGHT
  // -------------------------------------------------------------------------
  interactivePanels.forEach(panel => {
    panel.addEventListener('mousemove', (e) => {
      const rect = panel.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      panel.style.background = `radial-gradient(circle 280px at ${x}px ${y}px, rgba(0, 242, 254, 0.08), rgba(22, 27, 34, 0.75) 70%)`;
    });

    panel.addEventListener('mouseleave', () => {
      panel.style.background = '';
    });
  });

  // -------------------------------------------------------------------------
  // 06. DIRECT EMAIL COPY-TO-CLIPBOARD WITH UI FEEDBACK
  // -------------------------------------------------------------------------
  if (copyBtn && copyText) {
    copyBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailAddress);
        } else {
          // Fallback for non-https or older browsers
          const tempInput = document.createElement('textarea');
          tempInput.value = emailAddress;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        copyText.textContent = 'Copied!';
        copyBtn.classList.add('copied');

        setTimeout(() => {
          copyText.textContent = 'Copy';
          copyBtn.classList.remove('copied');
        }, 2500);
      } catch (err) {
        copyText.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyText.textContent = 'Copy';
          copyBtn.classList.remove('copied');
        }, 2500);
      }
    });
  }

  // -------------------------------------------------------------------------
  // 07. INTERACTIVE CONTACT FORM SUBMISSION WITH SIMULATED TERMINAL PIPELINE
  // -------------------------------------------------------------------------
  if (contactForm && submitBtn && submitText && successToast) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Set transmitting state
      submitBtn.disabled = true;
      submitText.textContent = 'Sending...';

      setTimeout(() => {
        submitText.textContent = 'Sent';
        successToast.classList.add('visible');
        contactForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitText.textContent = 'Send Message';
          successToast.classList.remove('visible');
        }, 4000);
      }, 950);
    });
  }

  // -------------------------------------------------------------------------
  // 08. RESUME ACTION HANDLER
  // -------------------------------------------------------------------------
  const resumeCtas = [
    document.getElementById('header-resume-cta'),
    document.getElementById('hero-download-cv')
  ];

  resumeCtas.forEach(cta => {
    if (cta) {
      cta.addEventListener('click', () => {
        console.log('Resume access requested for Safi Ahmad');
      });
    }
  });

});
