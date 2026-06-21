const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const revealItems = document.querySelectorAll(".reveal");
const currentTime = document.querySelector("[data-current-time]");

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuButton.addEventListener("click", () => {
  const nextState = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(nextState));
  mobileMenu.classList.toggle("is-open", nextState);
  header.classList.toggle("menu-visible", nextState);
  document.body.classList.toggle("menu-open", nextState);
});

mobileMenu.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuButton.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("is-open");
    header.classList.remove("menu-visible");
    document.body.classList.remove("menu-open");
  }
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (currentTime) {
  const updateStatusTime = () => {
    const formatted = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date());
    currentTime.textContent = `Last updated: ${formatted}`;
  };

  updateStatusTime();
  window.setInterval(updateStatusTime, 30000);
}
