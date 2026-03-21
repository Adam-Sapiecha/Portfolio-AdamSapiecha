const STORAGE_KEY = "portfolio-language";
const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const navLinksContainer = document.querySelector("#nav-links");
const languageButtons = Array.from(document.querySelectorAll(".lang-btn"));
const pageKey = body.dataset.page;
const revealNodes = Array.from(document.querySelectorAll("[data-reveal]"));
const accordionButtons = Array.from(document.querySelectorAll("[data-accordion-toggle]"));

function getInitialLanguage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "en" ? "en" : "pl";
}

function applyLanguage(lang) {
  document.documentElement.lang = lang;
  localStorage.setItem(STORAGE_KEY, lang);

  languageButtons.forEach((button) => {
    const selected = button.dataset.lang === lang;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  document.querySelectorAll("[data-pl][data-en]").forEach((element) => {
    element.textContent = element.dataset[lang];
  });

  const title = lang === "en" ? body.dataset.titleEn : body.dataset.titlePl;
  if (title) {
    document.title = title;
  }
}

function closeMenu() {
  if (!menuToggle || !navLinksContainer) {
    return;
  }

  navLinksContainer.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

function setupNavigation() {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.nav === pageKey);
    link.addEventListener("click", closeMenu);
  });
}

function setupReveal() {
  if (!("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

function toggleAccordion(button) {
  const item = button.closest(".accordion-item");
  if (!item) {
    return;
  }

  const expanded = item.classList.toggle("is-open");
  button.setAttribute("aria-expanded", String(expanded));
}

if (menuToggle && navLinksContainer) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinksContainer.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.lang);
  });
});

accordionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    toggleAccordion(button);
  });
});

setupNavigation();
setupReveal();
applyLanguage(getInitialLanguage());
