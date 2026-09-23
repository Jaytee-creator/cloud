/* =====================================================================
   JESUTOFUNMI AWODEYI — PORTFOLIO SCRIPT
   ---------------------------------------------------------------------
   This single file is loaded on every page. Each feature is wrapped in
   its own function and guarded with an element check (e.g. `if (!form)
   return;`) so pages that don't have a particular section simply skip
   that piece of code — nothing breaks if, say, a page has no contact
   form on it.

   Sections:
   1. Footer year
   2. Navbar scroll state + mobile menu
   3. Active nav link
   4. Theme toggle (dark / light, saved to localStorage)
   5. Background particles
   6. Scroll-reveal animations
   7. Back-to-top button
   8. Project filtering (projects.html)
   9. Skill bar fill animation (skills.html)
   10. Contact form validation (contact.html)
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* Each feature is run through this small wrapper instead of being
     called directly. Reason: if one feature throws an error (for
     example, a browser blocking a particular API), an uncaught error
     would normally stop every feature listed AFTER it from running
     too. Catching errors per-feature means one problem can't take
     down the rest of the page. */
  const features = [
    setFooterYear,
    initNavbarScroll,
    initMobileMenu,
    setActiveNavLink,
    initThemeToggle,
    initParticles,
    initScrollReveal,
    initBackToTop,
    initProjectFilter,
    initSkillBars,
    initContactForm,
  ];

  features.forEach((feature) => {
    try {
      feature();
    } catch (error) {
      console.error(`Portfolio script: "${feature.name}" failed to start.`, error);
    }
  });
});

/* Respect the visitor's OS-level motion preference throughout. */
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* ---------------------------------------------------------------------
   1. FOOTER YEAR
   Keeps the copyright year correct without editing HTML every January.
   --------------------------------------------------------------------- */
function setFooterYear() {
  const yearEl = document.querySelector("[data-year]");
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------------------
   2. NAVBAR SCROLL STATE + MOBILE MENU
   --------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const toggleScrolled = () => {
    navbar.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  toggleScrolled();
  window.addEventListener("scroll", toggleScrolled, { passive: true });
}

function initMobileMenu() {
  const toggleBtn = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("mobile-open");
    document.body.classList.toggle("nav-open", isOpen);
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });

  /* Close the menu automatically once a link is tapped. */
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("mobile-open");
      document.body.classList.remove("nav-open");
      toggleBtn.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------------------------------------------------------------------
   3. ACTIVE NAV LINK
   Compares each link's file name against the current page's file name
   so the right item gets highlighted, no matter which page loads.
   --------------------------------------------------------------------- */
function setActiveNavLink() {
  const links = document.querySelectorAll(".nav-links a");
  if (!links.length) return;

  let currentPage = window.location.pathname.split("/").pop();
  if (currentPage === "") currentPage = "index.html";

  links.forEach((link) => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

/* ---------------------------------------------------------------------
   4. THEME TOGGLE
   Dark is the default look. The chosen theme is saved to localStorage
   so it persists across pages and future visits.
   --------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.querySelector(".theme-toggle");
  const root = document.documentElement;
  const STORAGE_KEY = "portfolio-theme";

  /* Reading/writing localStorage can throw (not just return null) when a
     page is opened directly as a file:// URL in some browsers, since the
     page has no real "origin" to store data against. We still want the
     toggle to work during the visit even if it can't be remembered for
     next time, so every localStorage call here is wrapped separately. */
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    /* Storage isn't available — the theme just won't persist. */
  }

  if (savedTheme === "light") {
    root.setAttribute("data-theme", "light");
  }

  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    if (isLight) {
      root.removeAttribute("data-theme");
      try {
        localStorage.setItem(STORAGE_KEY, "dark");
      } catch (error) {
        /* Ignore — theme still switches visually for this visit. */
      }
    } else {
      root.setAttribute("data-theme", "light");
      try {
        localStorage.setItem(STORAGE_KEY, "light");
      } catch (error) {
        /* Ignore — theme still switches visually for this visit. */
      }
    }
  });
}

/* ---------------------------------------------------------------------
   5. BACKGROUND PARTICLES
   Generates a handful of small dots that drift upward inside any
   element with a [data-particles] container. Skipped entirely if the
   visitor has asked their OS to reduce motion.
   --------------------------------------------------------------------- */
function initParticles() {
  const field = document.querySelector("[data-particles]");
  if (!field || prefersReducedMotion) return;

  const PARTICLE_COUNT = 22;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const dot = document.createElement("span");
    dot.className = "particle";
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.animationDuration = `${14 + Math.random() * 14}s`;
    dot.style.animationDelay = `${Math.random() * 20}s`;
    dot.style.opacity = String(0.2 + Math.random() * 0.4);
    field.appendChild(dot);
  }
}

/* ---------------------------------------------------------------------
   6. SCROLL REVEAL
   Adds .in-view to any [.reveal] or [.reveal-stagger] element the
   moment it enters the viewport. Uses IntersectionObserver so it costs
   almost nothing on the main thread.
   --------------------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal, .reveal-stagger");
  if (!items.length) return;

  /* If motion is reduced, or this browser has no IntersectionObserver
     support at all, just show everything immediately instead of leaving
     it invisible. */
  if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
    items.forEach((item) => item.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((item) => observer.observe(item));
}

/* ---------------------------------------------------------------------
   7. BACK TO TOP
   --------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.querySelector(".back-to-top");
  if (!btn) return;

  const toggleVisibility = () => {
    btn.classList.toggle("visible", window.scrollY > 500);
  };

  toggleVisibility();
  window.addEventListener("scroll", toggleVisibility, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });
}

/* ---------------------------------------------------------------------
   8. PROJECT FILTERING (projects.html)
   Buttons carry a [data-filter] value ("all", "web", "python", "ml").
   Cards carry a [data-category] value with one or more space-separated
   categories, e.g. data-category="python ml".
   --------------------------------------------------------------------- */
function initProjectFilter() {
  const filterBar = document.querySelector(".filter-bar");
  const cards = document.querySelectorAll(".project-card");
  if (!filterBar || !cards.length) return;

  const buttons = filterBar.querySelectorAll(".filter-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      button.classList.add("active");

      const filter = button.getAttribute("data-filter");

      cards.forEach((card) => {
        const categories = (card.getAttribute("data-category") || "").split(" ");
        const shouldShow = filter === "all" || categories.includes(filter);
        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });
}

/* ---------------------------------------------------------------------
   9. SKILL BAR FILL (skills.html)
   Bars start at width: 0 in CSS and are only filled in once their
   category scrolls into view, using each bar's [data-level] (0-100).
   --------------------------------------------------------------------- */
function initSkillBars() {
  const bars = document.querySelectorAll(".skill-bar-fill");
  if (!bars.length) return;

  const fillBar = (bar) => {
    const level = bar.getAttribute("data-level") || "0";
    bar.style.width = `${level}%`;
  };

  if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
    bars.forEach(fillBar);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fillBar(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  bars.forEach((bar) => observer.observe(bar));
}

/* ---------------------------------------------------------------------
   10. CONTACT FORM VALIDATION (contact.html)
   Plain client-side validation — no backend is wired up yet. On a
   valid submission we show a success message and reset the form. See
   the README for notes on connecting this to a real email service.
   --------------------------------------------------------------------- */
function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const statusBox = document.querySelector("#form-status");

  const fields = {
    name: {
      input: form.querySelector("#name"),
      error: form.querySelector("#name-error"),
      validate: (value) => value.trim().length >= 2,
      message: "Please enter your full name.",
    },
    email: {
      input: form.querySelector("#email"),
      error: form.querySelector("#email-error"),
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
      message: "Please enter a valid email address.",
    },
    subject: {
      input: form.querySelector("#subject"),
      error: form.querySelector("#subject-error"),
      validate: (value) => value.trim().length >= 3,
      message: "Please add a short subject.",
    },
    message: {
      input: form.querySelector("#message"),
      error: form.querySelector("#message-error"),
      validate: (value) => value.trim().length >= 10,
      message: "Your message should be at least 10 characters.",
    },
  };

  const validateField = (field) => {
    if (!field.input) return true;
    const isValid = field.validate(field.input.value);
    field.input.classList.toggle("invalid", !isValid);
    if (field.error) {
      field.error.textContent = isValid ? "" : field.message;
    }
    return isValid;
  };

  /* Validate a field as soon as the visitor leaves it. */
  Object.values(fields).forEach((field) => {
    if (!field.input) return;
    field.input.addEventListener("blur", () => validateField(field));
    field.input.addEventListener("input", () => {
      if (field.input.classList.contains("invalid")) validateField(field);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const results = Object.values(fields).map(validateField);
    const allValid = results.every(Boolean);

    if (!statusBox) return;

    if (!allValid) {
      statusBox.textContent =
        "Please fix the highlighted fields before sending.";
      statusBox.className = "form-status visible error";
      return;
    }

    /* No backend is connected yet — this just simulates a send.
       Swap this block out for a real request (e.g. to Formspree,
       EmailJS, or your own API) when you're ready to go live. */
    statusBox.textContent =
      "Thanks! Your message has been noted — I'll get back to you soon.";
    statusBox.className = "form-status visible success";
    form.reset();
  });
}
