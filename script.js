const STORAGE_KEY = "portfolio-language";
const body = document.body;
const languageButtons = Array.from(document.querySelectorAll(".lang-btn"));
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const pageKey = body.dataset.page;

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

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    mobileNav.classList.toggle("hidden");
  });
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.lang);
  });
});

setupActiveNav();
applyLanguage(getInitialLanguage());
