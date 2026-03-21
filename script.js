const STORAGE_KEY = "portfolio-language";
const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const navLinksContainer = document.querySelector("#nav-links");
const languageButtons = Array.from(document.querySelectorAll(".lang-btn"));
const pageKey = body.dataset.page;
const form = document.querySelector("#contactFormElement");
const formMessage = document.querySelector("#formMessage");

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

  document.querySelectorAll("[data-pl-placeholder][data-en-placeholder]").forEach((element) => {
    element.placeholder = element.dataset[`${lang}Placeholder`];
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

if (form && formMessage) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const lang = localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "pl";
    formMessage.textContent =
      lang === "en"
        ? "Thanks. Your message is ready and I will get back to you as soon as possible."
        : "Dziekuje. Twoja wiadomosc jest gotowa i odezwe sie najszybciej jak to mozliwe.";
    formMessage.classList.add("is-success");
    form.reset();
  });
}

setupNavigation();
applyLanguage(getInitialLanguage());
