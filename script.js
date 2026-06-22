(() => {
  const STORAGE_KEY = "portfolio-language";
  const body = document.body;
  const languageButtons = Array.from(document.querySelectorAll(".lang-btn"));
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const pageKey = body?.dataset.page;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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
      // The site still works when storage is unavailable.
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
    document.dispatchEvent(new CustomEvent("portfolio:languagechange", { detail: { lang: normalizedLang } }));
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
      body.classList.add("menu-open");
      updateMenuLabel();

      requestAnimationFrame(() => {
        mobileNav.classList.add("is-open");
      });

      window.setTimeout(focusFirstLink, 80);
    };

    const closeMenu = ({ restoreFocus = false } = {}) => {
      mobileNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      body.classList.remove("menu-open");
      updateMenuLabel();

      window.setTimeout(() => {
        if (!mobileNav.classList.contains("is-open")) {
          mobileNav.classList.add("hidden");
        }
      }, prefersReducedMotion.matches ? 0 : 190);

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

  function setupRevealAnimations() {
    const targets = Array.from(
      new Set(document.querySelectorAll("main header, main section, main article, details.project-card, .glass-panel, .glass-card"))
    );

    if (!targets.length) {
      return;
    }

    targets.forEach((element, index) => {
      element.classList.add("reveal-ready");
      element.style.setProperty("--reveal-delay", `${(index % 4) * 60}ms`);
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
    document.querySelectorAll("main article, .glass-panel, .glass-card, details.project-card, .contact-card").forEach((card) => {
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

    let finished = false;

    const finishOpen = () => {
      if (finished) {
        return;
      }

      finished = true;
      content.style.height = "auto";
      delete card.dataset.animating;
      content.removeEventListener("transitionend", handleTransitionEnd);
    };

    const handleTransitionEnd = (event) => {
      if (event.propertyName !== "height") {
        return;
      }

      finishOpen();
    };

    content.addEventListener("transitionend", handleTransitionEnd);
    window.setTimeout(finishOpen, 460);
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

    let finished = false;

    const finishClose = () => {
      if (finished) {
        return;
      }

      finished = true;
      card.open = false;
      summary.setAttribute("aria-expanded", "false");
      delete card.dataset.animating;
      content.removeEventListener("transitionend", handleTransitionEnd);
    };

    const handleTransitionEnd = (event) => {
      if (event.propertyName !== "height") {
        return;
      }

      finishClose();
    };

    content.addEventListener("transitionend", handleTransitionEnd);
    window.setTimeout(finishClose, 460);
  }

  function setupProjectAccordions() {
    const cards = Array.from(document.querySelectorAll("details.project-card"));

    cards.forEach((card) => {
      const summary = card.querySelector("summary");
      const content = Array.from(card.children).find((child) => child.tagName !== "SUMMARY");
      const icon = summary?.querySelector(".material-symbols-outlined");

      if (!summary || !content) {
        return;
      }

      content.classList.add("project-card__content");
      summary.setAttribute("aria-expanded", String(card.open));

      if (icon) {
        icon.classList.add("project-card__icon");
        icon.setAttribute("aria-hidden", "true");
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

  function setupContactForm() {
    const form = document.querySelector("[data-contact-form]");

    if (!form) {
      return;
    }

    const fields = Array.from(form.querySelectorAll("input, textarea"));
    const submitButton = form.querySelector("button[type='submit']");
    const status = form.querySelector("[data-form-status]");
    let attemptedSubmit = false;

    const getMessage = (field, type) => {
      const suffix = getCurrentLanguage() === "pl" ? "Pl" : "En";
      return field.dataset[`${type}${suffix}`] || "";
    };

    const setFieldError = (field, message) => {
      const errorId = field.getAttribute("aria-describedby");
      const error = errorId ? document.getElementById(errorId) : null;

      field.setAttribute("aria-invalid", message ? "true" : "false");
      if (error) {
        error.textContent = message;
      }
    };

    const validateField = (field) => {
      const value = field.value.trim();

      if (field.required && !value) {
        const message = getMessage(field, "errorRequired");
        setFieldError(field, message);
        return false;
      }

      if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        const message = getMessage(field, "errorEmail");
        setFieldError(field, message);
        return false;
      }

      setFieldError(field, "");
      return true;
    };

    const validateForm = () => fields.map(validateField).every(Boolean);

    const setStatus = (state) => {
      if (!status) {
        return;
      }

      const suffix = getCurrentLanguage() === "pl" ? "Pl" : "En";
      const message = status.dataset[`${state}${suffix}`] || "";
      status.textContent = message;
      status.classList.toggle("is-error", state === "error");
    };

    fields.forEach((field) => {
      field.addEventListener("input", () => {
        if (attemptedSubmit) {
          validateField(field);
        }
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      attemptedSubmit = true;

      if (form.dataset.busy === "true") {
        return;
      }

      if (!validateForm()) {
        setStatus("error");
        return;
      }

      const data = new FormData(form);
      const target = form.dataset.mailto;
      const subject = `Portfolio contact - ${data.get("name") || "Adam Sapiecha"}`;
      const message = [
        `Name: ${data.get("name")}`,
        `Email: ${data.get("email")}`,
        "",
        data.get("message")
      ].join("\n");
      const mailto = `mailto:${target}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

      form.dataset.busy = "true";
      submitButton?.setAttribute("disabled", "true");
      setStatus("success");
      window.location.href = mailto;

      window.setTimeout(() => {
        delete form.dataset.busy;
        submitButton?.removeAttribute("disabled");
      }, 1200);
    });

    document.addEventListener("portfolio:languagechange", () => {
      if (attemptedSubmit) {
        validateForm();
      }

      if (status?.textContent) {
        setStatus(status.classList.contains("is-error") ? "error" : "success");
      }
    });
  }

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyLanguage(button.dataset.lang);
    });
  });

  setupActiveNav();
  setupMobileMenu();
  setupNavMotion();
  setupMotionCards();
  setupRevealAnimations();
  setupProjectAccordions();
  setupContactForm();
  setupPageEntrance();
  applyLanguage(getInitialLanguage());
})();
