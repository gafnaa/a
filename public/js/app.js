import router from "./router.js";
import Auth from "./auth.js";
import API from "./api.js";

window.router = router;
window.Auth = Auth;
window.API = API;

document.addEventListener("DOMContentLoaded", async () => {
  // === NAVBAR AUTH HANDLER ===
  window.updateNavbarAuth = async function () {
    const user = await Auth.verifyToken();

    const loginButton = document.getElementById("login-button");
    const profileIcon = document.getElementById("profile-icon");

    if (user) {
      loginButton?.classList.add("hidden");
      profileIcon?.classList.remove("hidden");
    } else {
      loginButton?.classList.remove("hidden");
      profileIcon?.classList.add("hidden");
    }
  };

  // === ROUTES ===

  router.addRoute("/login", async () => {
    const app = document.getElementById("app");

    if (await Auth.verifyToken()) {
      router.navigate("/");
      return;
    }

    const response = await fetch("/pages/login.html");
    app.innerHTML = await response.text();

    // Add login form submission logic here
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("Form submission prevented.");

        const phoneNumber = document.getElementById("phoneNumber").value;
        const spinner = document.getElementById("loginSpinner");
        const submitBtn = e.target.querySelector('button[type="submit"]');

        spinner.classList.remove("hidden");
        submitBtn.disabled = true;

        try {
          console.log("API object:", API);
          console.log("Attempting login with phone number:", phoneNumber);
          const response = await API.login(phoneNumber);
          console.log("API.login response:", response);

          if (response.success) {
            Auth.setToken(response.token);
            if (typeof updateNavbarAuth === "function") {
              updateNavbarAuth();
            }
            console.log("Login successful. Navigating...");
            if (response.user.hasQuestionnaire) {
              console.log("Navigating to /");
              router.navigate("/");
            } else {
              console.log("Navigating to /questionnaire");
              router.navigate("/questionnaire");
            }
          } else {
            console.error("Login failed:", response.message || "Unknown error");
            alert("Login gagal. Silakan coba lagi.");
          }
        } catch (error) {
          console.error("An error occurred during login:", error);
          alert("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
          spinner.classList.add("hidden");
          submitBtn.disabled = false;
        }
      });
    }

    setTimeout(() => window.updateNavbarAuth(), 10);
  });

  router.addRoute("/", async () => {
    if (!(await Auth.verifyToken())) {
      router.navigate("/login");
      return;
    }

    const app = document.getElementById("app");
    const response = await fetch("/pages/landing.html");

    app.innerHTML = await response.text();

    setTimeout(() => {
      if (typeof loadLandingPage === "function") loadLandingPage();
    }, 50);

    window.updateNavbarAuth();
  });

  router.addRoute("/dashboard", async () => {
    if (!(await Auth.verifyToken())) {
      router.navigate("/login");
      return;
    }

    const app = document.getElementById("app");
    const response = await fetch("/pages/dashboard.html");

    app.innerHTML = await response.text();

    setTimeout(() => {
      if (typeof loadDashboard === "function") loadDashboard();
    }, 50);

    window.updateNavbarAuth();
  });

  router.addRoute("/product/:id", async () => {
    if (!(await Auth.verifyToken())) {
      router.navigate("/login");
      return;
    }

    const productId = window.location.pathname.split("/product/")[1];
    if (!productId) {
      router.navigate("/");
      return;
    }

    const app = document.getElementById("app");
    const response = await fetch("/pages/product-detail.html");

    app.innerHTML = await response.text();

    setTimeout(() => {
      if (typeof loadProductDetail === "function") {
        loadProductDetail(productId);
      }
    }, 50);

    window.updateNavbarAuth();
  });

  // === LOGOUT ROUTE ===
  router.addRoute("/logout", async () => {
    Auth.logout();
    router.navigate("/login");
    window.updateNavbarAuth(); // Update navbar immediately
  });

  // === SPA LINK HANDLER ===
  window.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    const url = new URL(link.href);

    if (url.origin === window.location.origin) {
      e.preventDefault();
      router.navigate(url.pathname);
      setTimeout(() => window.updateNavbarAuth(), 10);
    }
  });

  // INITIAL LOAD
  await router.handleRoute();
  setTimeout(() => window.updateNavbarAuth(), 20);
});

// === PROFILE DROPDOWN TOGGLE ===
const profileIcon = document.getElementById("profile-icon");
const profileDropdown = document.getElementById("profile-dropdown");

profileIcon?.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent click from immediately closing the dropdown
  profileDropdown?.classList.toggle("hidden");
});

// Close dropdown if clicking outside of it
document.addEventListener("click", (e) => {
  if (
    profileDropdown &&
    !profileDropdown.contains(e.target) &&
    !profileIcon.contains(e.target)
  ) {
    profileDropdown.classList.add("hidden");
  }
});
