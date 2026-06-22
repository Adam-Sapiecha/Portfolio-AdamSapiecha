(() => {
  const STORAGE_KEY = "portfolio-language";
  const body = document.body;
  const languageButtons = Array.from(document.querySelectorAll(".lang-btn"));
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const pageKey = body?.dataset.page;

  function getStoredLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function saveLanguage(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Strona dalej działa, jeśli localStorage jest niedostępny.
    }
  }

  function getCurrentLanguage() {
    return document.documentElement.lang === "en" ? "en" : "pl";
  }

  function getInitialLanguage() {
    return getStoredLanguage() === "en" ? "en" : "pl";
  }

  function getDatasetValue(element, lang, prefix = "") {
    const suffix = lang === "pl" ? "Pl" : "En";
    return element.dataset[`${prefix}${suffix}`];
  }

  function setMeta(selector, value, attribute = "content") {
    if (!value) {
      return;
    }

    const element = document.head.querySelector(selector);
    if (element) {
      element.setAttribute(attribute, value);
    }
  }

  function updateMenuLabel() {
    if (!menuToggle) {
      return;
    }

    const lang = getCurrentLanguage();
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    const key = expanded
      ? `labelClose${lang === "pl" ? "Pl" : "En"}`
      : `labelOpen${lang === "pl" ? "Pl" : "En"}`;
    const label = menuToggle.dataset[key];

    if (label) {
      menuToggle.setAttribute("aria-label", label);
    }
  }

  function applyLanguage(lang) {
    const normalizedLang = lang === "en" ? "en" : "pl";
    const suffix = normalizedLang === "pl" ? "Pl" : "En";
    document.documentElement.lang = normalizedLang;
    saveLanguage(normalizedLang);

    languageButtons.forEach((button) => {
      const selected = button.dataset.lang === normalizedLang;
      button.classList.toggle("is-selected", selected);
      button.classList.toggle("text-primary", selected);
      button.classList.toggle("text-on-surface-variant", !selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    document.querySelectorAll("[data-pl][data-en]").forEach((element) => {
      element.textContent = element.dataset[normalizedLang];
    });

    document.querySelectorAll("[data-alt-pl][data-alt-en]").forEach((element) => {
      element.setAttribute("alt", getDatasetValue(element, normalizedLang, "alt"));
    });

    document.querySelectorAll("[data-aria-label-pl][data-aria-label-en]").forEach((element) => {
      element.setAttribute("aria-label", getDatasetValue(element, normalizedLang, "ariaLabel"));
    });

    document.querySelectorAll("[data-placeholder-pl][data-placeholder-en]").forEach((element) => {
      element.setAttribute("placeholder", element.dataset[`placeholder${suffix}`]);
    });

    const title = normalizedLang === "en" ? body.dataset.titleEn : body.dataset.titlePl;
    const description = normalizedLang === "en" ? body.dataset.descriptionEn : body.dataset.descriptionPl;

    if (title) {
      document.title = title;
      setMeta('meta[property="og:title"]', title);
      setMeta('meta[name="twitter:title"]', title);
    }

    if (description) {
      setMeta('meta[name="description"]', description);
      setMeta('meta[property="og:description"]', description);
      setMeta('meta[name="twitter:description"]', description);
    }

    setMeta('meta[property="og:locale"]', normalizedLang === "pl" ? "pl_PL" : "en_US");
    updateMenuLabel();
  }

  function setupActiveNav() {
    document.querySelectorAll("[data-nav]").forEach((link) => {
      const active = link.dataset.nav === pageKey;
      link.classList.toggle("is-active", active);
      link.classList.toggle("text-primary", active);
      link.classList.toggle("text-on-surface-variant", !active);

      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function setupMobileMenu() {
    if (!menuToggle || !mobileNav) {
      return;
    }

    if (!mobileNav.id) {
      mobileNav.id = "mobile-navigation";
    }

    menuToggle.setAttribute("aria-controls", mobileNav.id);
    menuToggle.setAttribute("aria-expanded", "false");
    mobileNav.classList.add("mobile-nav-panel");

    const focusFirstLink = () => {
      const firstLink = mobileNav.querySelector("a");
      firstLink?.focus({ preventScroll: true });
    };

    const openMenu = () => {
      mobileNav.classList.remove("hidden");
      menuToggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-open");
      updateMenuLabel();

      requestAnimationFrame(() => {
        mobileNav.classList.add("is-open");
      });

      window.setTimeout(focusFirstLink, 80);
    };

    const closeMenu = ({ restoreFocus = false } = {}) => {
      mobileNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
      updateMenuLabel();

      window.setTimeout(() => {
        if (!mobileNav.classList.contains("is-open")) {
          mobileNav.classList.add("hidden");
        }
      }, 170);

      if (restoreFocus) {
        menuToggle.focus({ preventScroll: true });
      }
    };

    menuToggle.addEventListener("click", () => {
      if (mobileNav.classList.contains("hidden")) {
        openMenu();
        return;
      }

      closeMenu();
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeMenu());
    });

    document.addEventListener("click", (event) => {
      if (mobileNav.classList.contains("hidden")) {
        return;
      }

      const clickedInsideMenu = mobileNav.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !mobileNav.classList.contains("hidden")) {
        closeMenu({ restoreFocus: true });
      }
    });
  }

  function setupProjectAccordions() {
    document.querySelectorAll("details.project-card").forEach((card) => {
      const summary = card.querySelector("summary");
      const icon = summary?.querySelector(".material-symbols-outlined");

      if (!summary) {
        return;
      }

      const syncState = () => {
        summary.setAttribute("aria-expanded", String(card.open));
      };

      if (icon) {
        icon.setAttribute("aria-hidden", "true");
      }

      syncState();
      card.addEventListener("toggle", syncState);
    });
  }

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyLanguage(button.dataset.lang);
    });
  });

  setupActiveNav();
  setupMobileMenu();
  setupProjectAccordions();
  applyLanguage(getInitialLanguage());
})();
