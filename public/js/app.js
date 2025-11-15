// Main application initialization
console.log("app.js script is being loaded and parsed."); // Added for basic script execution check

import router from "./router.js";
import Auth from "./auth.js";
import API from "./api.js";

// === TAMBAHAN PENTING ===
// Menjadikan modul global agar bisa diakses oleh
// <script> di dalam file HTML yang dimuat
window.router = router;
window.Auth = Auth;
window.API = API;
// === AKHIR TAMBAHAN ===

document.addEventListener("DOMContentLoaded", async () => {
  // Check authentication
  const user = await Auth.verifyToken();

  // Define routes
  router.addRoute("/login", async () => {
    if (user) {
      router.navigate("/");
      return;
    }
    const app = document.getElementById("app");
    const response = await fetch("/pages/login.html");
    app.innerHTML = await response.text();
  });

  router.addRoute("/questionnaire", async () => {
    if (!user) {
      router.navigate("/login");
      return;
    }
    const app = document.getElementById("app");
    const response = await fetch("/pages/questionnaire.html");
    app.innerHTML = await response.text();
  });

  // Landing page route
  router.addRoute("/", async () => {
    if (!user) {
      router.navigate("/login");
      return;
    }
    const app = document.getElementById("app");
    const response = await fetch("/pages/landing.html");
    app.innerHTML = await response.text();
    // Wait for script to load, then call loadLandingPage
    setTimeout(async () => {
      // Skrip dari landing.html sekarang bisa memanggil API
      if (typeof loadLandingPage === "function") {
        await loadLandingPage();
      }
    }, 100);
  });

  // Dashboard route
  router.addRoute("/dashboard", async () => {
    if (!user) {
      router.navigate("/login");
      return;
    }
    const app = document.getElementById("app");
    const response = await fetch("/pages/dashboard.html");
    app.innerHTML = await response.text();
    // Wait for script to load, then call loadDashboard
    setTimeout(async () => {
      // Skrip dari dashboard.html sekarang bisa memanggil API
      if (typeof loadDashboard === "function") {
        await loadDashboard();
      }
    }, 100);
  });

  // Product detail route handler
  router.addRoute("/product/:id", async () => {
    if (!user) {
      router.navigate("/login");
      return;
    }

    const path = window.location.pathname;
    const productId = path.split("/product/")[1];

    if (!productId) {
      router.navigate("/");
      return;
    }

    const app = document.getElementById("app");
    const response = await fetch("/pages/product-detail.html");
    app.innerHTML = await response.text();

    // Wait for script to load, then call loadProductDetail
    setTimeout(async () => {
      // Skrip dari product-detail.html sekarang bisa memanggil API
      if (typeof loadProductDetail === "function") {
        await loadProductDetail(productId);
      }
    }, 100);
  });

  // Handle all link clicks for SPA navigation
  window.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link && link.href) {
      const url = new URL(link.href);
      // Only handle internal links
      if (url.origin === window.location.origin) {
        e.preventDefault();
        router.navigate(url.pathname);
      }
    }
  });

  // Initial route
  const currentPath = window.location.pathname;
  if (!user && currentPath !== "/login") {
    console.log(
      "Initial route: Navigating to /login because user is not authenticated."
    );
    router.navigate("/login");
  } else if (user && currentPath === "/login") {
    console.log(
      "Initial route: Navigating to / because user is authenticated and on /login."
    );
    router.navigate("/");
  } else {
    console.log("Initial route: Handling current route.");
    router.handleRoute();
  }

  // --- Navbar Auth Toggle Logic ---
  const loginButton = document.getElementById("login-button");
  const profileIcon = document.getElementById("profile-icon");

  // BUAT FUNGSI INI GLOBAL agar bisa dipanggil dari login.html
  window.updateNavbarAuth = function () {
    console.log(`Auth.isAuthenticated(): ${Auth.isAuthenticated()}`);

    if (Auth.isAuthenticated()) {
      // User is authenticated, show profile icon, hide login button
      if (loginButton) loginButton.classList.add("hidden");
      if (profileIcon) profileIcon.classList.remove("hidden");
      console.log("Navbar updated: Showing profile icon, hiding login button.");
    } else {
      // User is not authenticated, show login button, hide profile icon
      if (loginButton) loginButton.classList.remove("hidden");
      if (profileIcon) profileIcon.classList.add("hidden");
      console.log("Navbar updated: Showing login button, hiding profile icon.");
    }
  };

  // Call the function on initial load
  window.updateNavbarAuth();
  // --- End Navbar Auth Toggle Logic ---
});
