const STORAGE_KEY = "portfolio-language";
const body = document.body;
const languageButtons = Array.from(document.querySelectorAll(".lang-btn"));
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const pageKey = body.dataset.page;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function getInitialLanguage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "en" ? "en" : "pl";
}

function applyLanguage(lang) {
  document.documentElement.lang = lang;
  localStorage.setItem(STORAGE_KEY, lang);

  languageButtons.forEach((button) => {
    const selected = button.dataset.lang === lang;
    button.classList.toggle("border-primary", selected);
    button.classList.toggle("text-primary", selected);
    button.classList.toggle("text-on-surface-variant", !selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  document.querySelectorAll("[data-pl][data-en]").forEach((element) => {
    element.textContent = element.dataset[lang];
  });

  document.querySelectorAll("[data-alt-pl][data-alt-en]").forEach((element) => {
    element.setAttribute("alt", element.dataset[`alt${lang === "pl" ? "Pl" : "En"}`]);
  });

  document.querySelectorAll("[data-aria-label-pl][data-aria-label-en]").forEach((element) => {
    element.setAttribute("aria-label", element.dataset[`ariaLabel${lang === "pl" ? "Pl" : "En"}`]);
  });

  const title = lang === "en" ? body.dataset.titleEn : body.dataset.titlePl;
  if (title) {
    document.title = title;
  }
}

function setupActiveNav() {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    const active = link.dataset.nav === pageKey;
    link.classList.toggle("text-primary", active);
    link.classList.toggle("border-b-2", active);
    link.classList.toggle("border-primary", active);
    link.classList.toggle("pb-1", active);
    link.classList.toggle("text-on-surface-variant", !active);
  });
}

function injectMotionStyles() {
  if (document.getElementById("portfolio-motion-styles")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "portfolio-motion-styles";
  style.textContent = `
    html {
      scroll-behavior: smooth;
    }

    body main {
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.45s ease, transform 0.45s ease;
    }

    body.page-ready main {
      opacity: 1;
      transform: none;
    }

    nav {
      transition: background-color 0.28s ease, box-shadow 0.28s ease;
    }

    body.nav-scrolled nav {
      background: rgba(10, 14, 20, 0.92) !important;
      box-shadow: 0 0 24px rgba(0, 255, 156, 0.08), 0 18px 40px rgba(0, 0, 0, 0.22);
    }

    .reveal-ready {
      opacity: 0;
      transform: translateY(26px);
      transition:
        opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
      transition-delay: var(--reveal-delay, 0ms);
      will-change: opacity, transform;
    }

    .reveal-ready.is-visible {
      opacity: 1;
      transform: none;
    }

    .motion-card {
      transition:
        transform 0.28s ease,
        box-shadow 0.28s ease,
        border-color 0.28s ease,
        background-color 0.28s ease;
    }

    .motion-card:hover,
    .motion-card:focus-within {
      transform: translateY(-4px);
      box-shadow: 0 18px 38px rgba(0, 0, 0, 0.18);
    }

    .project-card {
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
    }

    .project-card__content {
      overflow: hidden;
      height: 0;
      opacity: 0;
      margin-top: 0 !important;
      padding-top: 0 !important;
      border-top-color: transparent !important;
      transition:
        height 0.38s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.24s ease,
        margin-top 0.38s cubic-bezier(0.22, 1, 0.36, 1),
        padding-top 0.38s cubic-bezier(0.22, 1, 0.36, 1),
        border-top-color 0.2s ease;
    }

    .project-card.is-open .project-card__content {
      opacity: 1;
      margin-top: 1.5rem !important;
      padding-top: 1.5rem !important;
      border-top-color: rgba(68, 72, 79, 0.4) !important;
    }

    .project-card__icon {
      transition: transform 0.32s ease, color 0.28s ease;
      transform-origin: center;
    }

    .project-card.is-open .project-card__icon {
      transform: rotate(180deg);
    }

    .project-card summary {
      outline: none;
    }

    .project-card summary:focus-visible {
      outline: 2px solid rgba(0, 252, 154, 0.7);
      outline-offset: 8px;
    }

    [data-mobile-nav] {
      overflow: hidden;
      transition: opacity 0.22s ease, transform 0.22s ease;
    }

    [data-mobile-nav].mobile-nav-panel {
      opacity: 0;
      transform: translateY(-8px);
    }

    [data-mobile-nav].mobile-nav-panel.is-open {
      opacity: 1;
      transform: none;
    }

    @media (prefers-reduced-motion: reduce) {
      html {
        scroll-behavior: auto;
      }

      body main,
      .reveal-ready,
      .motion-card,
      .project-card__content,
      .project-card__icon,
      nav,
      [data-mobile-nav] {
        transition: none !important;
      }

      .motion-card:hover,
      .motion-card:focus-within {
        transform: none;
        box-shadow: none;
      }
    }
  `;

  document.head.appendChild(style);
}
function setupPageEntrance() {
  requestAnimationFrame(() => {
    body.classList.add("page-ready");
  });
}

function setupNavMotion() {
  const updateNavState = () => {
    body.classList.toggle("nav-scrolled", window.scrollY > 18);
  };

  updateNavState();
  window.addEventListener("scroll", updateNavState, { passive: true });
}

function setupMobileMenu() {
  if (!menuToggle || !mobileNav) {
    return;
  }

  mobileNav.classList.add("mobile-nav-panel");

  const openMenu = () => {
    mobileNav.classList.remove("hidden");
    requestAnimationFrame(() => {
      mobileNav.classList.add("is-open");
    });
  };

  const closeMenu = () => {
    mobileNav.classList.remove("is-open");
    window.setTimeout(() => {
      if (!mobileNav.classList.contains("is-open")) {
        mobileNav.classList.add("hidden");
      }
    }, 220);
  };

  menuToggle.addEventListener("click", () => {
    if (mobileNav.classList.contains("hidden")) {
      openMenu();
      return;
    }

    closeMenu();
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

function setupRevealAnimations() {
  const targets = Array.from(new Set(document.querySelectorAll("main header, main section, main article, details.project-card, .glass-panel, .glass-card")));

  if (!targets.length) {
    return;
  }

  targets.forEach((element, index) => {
    element.classList.add("reveal-ready");
    element.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
  });

  if (!("IntersectionObserver" in window) || prefersReducedMotion.matches) {
    targets.forEach((element) => {
      element.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  targets.forEach((element) => {
    observer.observe(element);
  });
}

function setupMotionCards() {
  document.querySelectorAll("main article, .glass-panel, .glass-card, details.project-card").forEach((card) => {
    card.classList.add("motion-card");
  });
}

function setProjectState(card, content, summary, expanded) {
  card.classList.toggle("is-open", expanded);
  card.open = expanded;
  summary.setAttribute("aria-expanded", String(expanded));

  if (expanded) {
    content.style.height = "auto";
    content.style.opacity = "1";
    return;
  }

  content.style.height = "0px";
  content.style.opacity = "0";
}

function animateProjectOpen(card, content, summary) {
  card.dataset.animating = "true";
  card.open = true;
  card.classList.add("is-open");
  summary.setAttribute("aria-expanded", "true");

  const targetHeight = content.scrollHeight;
  content.style.height = "0px";
  content.style.opacity = "0";

  requestAnimationFrame(() => {
    content.style.height = `${targetHeight}px`;
    content.style.opacity = "1";
  });

  const handleTransitionEnd = (event) => {
    if (event.propertyName !== "height") {
      return;
    }

    content.style.height = "auto";
    delete card.dataset.animating;
    content.removeEventListener("transitionend", handleTransitionEnd);
  };

  content.addEventListener("transitionend", handleTransitionEnd);
}

function animateProjectClose(card, content, summary) {
  card.dataset.animating = "true";
  const startHeight = content.scrollHeight;

  content.style.height = `${startHeight}px`;
  content.style.opacity = "1";

  requestAnimationFrame(() => {
    card.classList.remove("is-open");
    content.style.height = "0px";
    content.style.opacity = "0";
  });

  const handleTransitionEnd = (event) => {
    if (event.propertyName !== "height") {
      return;
    }

    card.open = false;
    summary.setAttribute("aria-expanded", "false");
    delete card.dataset.animating;
    content.removeEventListener("transitionend", handleTransitionEnd);
  };

  content.addEventListener("transitionend", handleTransitionEnd);
}

function setupProjectAccordions() {
  const cards = Array.from(document.querySelectorAll("details.project-card"));

  if (!cards.length) {
    return;
  }

  cards.forEach((card) => {
    const summary = card.querySelector("summary");
    const content = Array.from(card.children).find((child) => child.tagName !== "SUMMARY");
    const icon = summary?.querySelector(".material-symbols-outlined");

    if (!summary || !content) {
      return;
    }

    content.classList.add("project-card__content");

    if (icon) {
      icon.classList.add("project-card__icon");
    }

    setProjectState(card, content, summary, card.open);

    summary.addEventListener("click", (event) => {
      event.preventDefault();

      if (card.dataset.animating === "true") {
        return;
      }

      if (prefersReducedMotion.matches) {
        setProjectState(card, content, summary, !card.open);
        return;
      }

      if (card.open) {
        animateProjectClose(card, content, summary);
        return;
      }

      animateProjectOpen(card, content, summary);
    });
  });
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.lang);
  });
});

injectMotionStyles();
setupActiveNav();
setupMobileMenu();
setupNavMotion();
setupMotionCards();
setupRevealAnimations();
setupProjectAccordions();
setupPageEntrance();
applyLanguage(getInitialLanguage());
