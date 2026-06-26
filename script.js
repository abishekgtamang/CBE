const supportForm = document.querySelector(".support-form");
const statusText = document.querySelector(".form-status");
const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const revealItems = document.querySelectorAll(
  ".hero-copy, .intro-photo, .intro-content, .section-heading, .report-item, .support-copy, .contact-box, .support-form"
);

let lastScrollY = window.scrollY;

const closeNavMenu = () => {
  siteHeader?.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open navigation menu");
};

const updateHeaderVisibility = () => {
  if (!siteHeader) return;

  const currentScrollY = window.scrollY;
  const isScrollingDown = currentScrollY > lastScrollY;
  const hasScrolledPastHeader = currentScrollY > siteHeader.offsetHeight + 24;
  const isMenuOpen = siteHeader.classList.contains("nav-open");

  siteHeader.classList.toggle(
    "is-hidden",
    isScrollingDown && hasScrolledPastHeader && !isMenuOpen
  );
  lastScrollY = Math.max(currentScrollY, 0);
};

navToggle?.addEventListener("click", () => {
  const willOpen = navToggle.getAttribute("aria-expanded") !== "true";

  siteHeader?.classList.toggle("nav-open", willOpen);
  navToggle.setAttribute("aria-expanded", String(willOpen));
  navToggle.setAttribute(
    "aria-label",
    willOpen ? "Close navigation menu" : "Open navigation menu"
  );
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNavMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNavMenu();
  }
});

window.addEventListener("scroll", updateHeaderVisibility, { passive: true });

if ("IntersectionObserver" in window) {
  revealItems.forEach((item, index) => {
    item.classList.add("scroll-reveal");
    item.style.setProperty("--reveal-delay", `${Math.min(index * 70, 280)}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    {
      rootMargin: "-8% 0px -12% 0px",
      threshold: 0.18,
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

supportForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(supportForm);
  const name = String(formData.get("name") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !message) {
    statusText.textContent = "Please add your name and message.";
    return;
  }

  supportForm.reset();
  statusText.textContent = `Thank you, ${name}. Your message is ready for follow-up.`;
});
