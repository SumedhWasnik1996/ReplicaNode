import { initNavbar, showScreen } from "./navigation.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  showScreen("login.html");

  // ------------------------------
  // Desktop avatar dropdown
  // ------------------------------
  const avatarBtn = document.getElementById("avatarBtn");
  const dropdownMenu = document.getElementById("dropdownMenu");

  if (avatarBtn && dropdownMenu) {
    avatarBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent click from closing immediately
      dropdownMenu.classList.toggle("hidden");
    });

    // Close dropdown if clicking outside
    document.addEventListener("click", (e) => {
      if (!avatarBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.add("hidden");
      }
    });
  }

  // ------------------------------
  // Mobile menu toggle
  // ------------------------------
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const hamburgerIcon = document.getElementById("hamburgerIcon");
  const closeIcon = document.getElementById("closeIcon");

  if (mobileMenuBtn && mobileMenu && hamburgerIcon && closeIcon) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      hamburgerIcon.classList.toggle("hidden");
      closeIcon.classList.toggle("hidden");
    });
  }
});
