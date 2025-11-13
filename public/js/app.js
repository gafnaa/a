// Main application initialization
console.log("app.js script is being loaded and parsed."); // Added for basic script execution check

import router from "./router.js";
import Auth from "./auth.js";
import API from "./api.js";

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
  const authNavItem = document.getElementById("auth-nav-item");

  function updateNavbarAuth() {
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
  }

  // Call the function on initial load
  updateNavbarAuth();

  // --- End Navbar Auth Toggle Logic ---

  // --- Debugging Click Handler ---
  // Add a broad click listener to the document to see if any clicks are registered
  document.addEventListener("click", (e) => {
    console.log("Broad document click event triggered."); // Log any click on the document
    const link = e.target.closest("a");
    if (link && link.href) {
      const url = new URL(link.href);
      if (url.origin === window.location.origin) {
        console.log(`Intercepted click on internal link: ${url.pathname}`);
        e.preventDefault();
        console.log(`Calling router.navigate('${url.pathname}')`);
        router.navigate(url.pathname);
      }
    }
  });
  // --- End Debugging Click Handler ---

  // --- Debugging Login Route Handler ---
  // Removed temporary modification of the login route handler for now to focus on click interception.
  // The original route definition should be used.
  // If the click handler works, we can re-add logs to the route handler if needed.
  // --- End Debugging Login Route Handler ---
});
