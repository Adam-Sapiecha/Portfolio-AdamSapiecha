// ================= PAGE NAVIGATION =================
function navigatePage(pageName) {
  // Hide all pages
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });
  
  // Show selected page
  const targetPage = document.getElementById(pageName);
  if (targetPage) {
    targetPage.classList.add("active");
    window.scrollTo({top: 0, behavior: "smooth"});
  }
  
  // Update nav links
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("active", "border-b-2", "border-[#abcec1]");
    link.classList.add("text-[#d7e8f2]/60");
    if (link.dataset.page === pageName) {
      link.classList.add("active", "border-b-2", "border-[#abcec1]");
      link.classList.remove("text-[#d7e8f2]/60");
    }
  });
  
  history.replaceState(null, "", `#${pageName}`);
}

// ================= FORM HANDLING =================
function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const message = document.getElementById("formMessage");
  
  // Collect form data
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message")
  };
  
  // Show processing
  message.classList.remove("hidden");
  message.textContent = "Sending...";
  
  // Simulate sending (in a real app, send to backend/email service)
  setTimeout(() => {
    message.textContent = "✓ Message received! I'll get back to you soon.";
    message.classList.add("text-green-400");
    form.reset();
    
    // Hide message after 5 seconds
    setTimeout(() => {
      message.classList.add("hidden");
      message.classList.remove("text-green-400");
    }, 5000);
  }, 800);
}

// ================= INITIALIZATION =================
document.addEventListener("DOMContentLoaded", () => {
  // Set year in footer
  const yearElement = document.querySelector("footer .font-\\[\\'Inter\\'\\]");
  
  // Navigation links
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.dataset.page || link.getAttribute("href").replace("#", "");
      navigatePage(page);
    });
  });
  
  // Form submission
  const contactForm = document.getElementById("contactFormElement");
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
  }
  
  // Handle initial hash-based navigation
  const initialPage = window.location.hash.replace("#", "") || "main";
  if (["main", "projects", "about", "contact"].includes(initialPage)) {
    navigatePage(initialPage);
  }
});

// Handle browser back/forward
window.addEventListener("hashchange", () => {
  const page = window.location.hash.replace("#", "") || "main";
  if (["main", "projects", "about", "contact"].includes(page)) {
    navigatePage(page);
  }
});