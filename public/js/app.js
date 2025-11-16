import router from "./router.js";
import Auth from "./auth.js";
import API from "./api.js";

window.router = router;
window.Auth = Auth;
window.API = API;

// Function to show notifications
window.showNotification = function (type) {
  const alertContainer = document.createElement("div");
  alertContainer.className = "notification-container";

  let svgIcon = "";
  let alertText = "";

  if (type === "success") {
    svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    `;
    alertText = "Operation successful!"; // Changed to be more generic
  } else if (type === "error") {
    svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    `;
    alertText = "Operation failed!"; // Changed to be more generic
  }

  alertContainer.innerHTML = `
    <div role="alert" class="alert alert-${type}">
      ${svgIcon}
      <span>${alertText}</span>
    </div>
  `;

  document.body.appendChild(alertContainer);

  // Trigger fade-in animation
  setTimeout(() => {
    alertContainer.classList.add("visible");
  }, 100); // Small delay to allow element to be added to DOM before transition

  // Auto-hide the notification
  setTimeout(() => {
    alertContainer.classList.remove("visible");
    alertContainer.classList.add("hidden");
    // Remove the element from the DOM after the fade-out transition
    setTimeout(() => {
      alertContainer.remove();
    }, 300); // Match the CSS transition duration
  }, 5000); // Hide after 5 seconds
};

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
          console.log("Attempting login with phone number:", phoneNumber);

          // --- Client-side login logic ---
          // Since the backend endpoint was removed and user wants logic in app.js,
          // we'll simulate a successful login.
          // In a real app, this might involve localStorage or a different API.

          // Simulate successful login
          const simulatedUser = {
            fullName: "User " + phoneNumber, // Placeholder name
            phoneNumber: phoneNumber,
            hasQuestionnaire: false, // Assume new users don't have it completed
          };

          // If Auth.setToken is required, it would need a token.
          // For simplicity, we'll just set a user object directly if Auth supports it,
          // or rely on navigate to handle the state.
          // Auth.setToken("simulated_token_for_" + phoneNumber);

          console.log("Simulated login successful. Navigating...");
          // Redirect to dashboard or home page
          router.navigate("/");
          showNotification("success");
        } catch (error) {
          console.error("An error occurred during login:", error);
          showNotification("error");
        } finally {
          spinner.classList.add("hidden");
          submitBtn.disabled = false;
        }
      });
    }

    setTimeout(() => window.updateNavbarAuth(), 10);
  });

  // === REGISTER ROUTE ===
  router.addRoute("/register", async () => {
    const app = document.getElementById("app");

    // If user is already logged in, redirect to home
    if (await Auth.verifyToken()) {
      router.navigate("/");
      return;
    }

    const response = await fetch("/pages/register.html");
    app.innerHTML = await response.text();

    // Add register form submission logic here
    const registerForm = document.getElementById("registerForm");
    console.log("Register form found:", registerForm); // Debugging log

    if (registerForm) {
      registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("Registration form submission prevented.");

        // Debugging logs for element retrieval
        const fullNameInput = document.getElementById("fullName");
        console.log("fullName input element:", fullNameInput);
        const fullName = fullNameInput ? fullNameInput.value : null; // Safely get value

        const phoneNumberInput = document.getElementById("phoneNumber");
        console.log("phoneNumber input element:", phoneNumberInput);
        const phoneNumber = phoneNumberInput ? phoneNumberInput.value : null;

        // Removed username collection as per user request

        const spinner = document.getElementById("registerSpinner");
        const submitBtn = e.target.querySelector('button[type="submit"]');

        spinner.classList.remove("hidden");
        submitBtn.disabled = true;

        try {
          console.log("Attempting registration with:", {
            fullName,
            phoneNumber,
          });

          // --- Client-side registration logic ---
          // Since the backend endpoint was removed and user wants logic in app.js,
          // we'll simulate a successful registration and navigate.
          // In a real app, this might involve localStorage or a different API.

          // Simulate successful registration
          const simulatedUser = {
            fullName,
            phoneNumber,
            hasQuestionnaire: false,
          };
          // For simplicity, we won't set a token here as there's no backend auth.
          // If Auth.setToken is required, it would need a token.
          // Auth.setToken("simulated_token_for_" + phoneNumber);

          console.log("Simulated registration successful. Navigating...");
          // Redirect to login or a success page. Let's redirect to login for now.
          router.navigate("/login");
          showNotification("success");
        } catch (error) {
          console.error("An error occurred during registration:", error);
          showNotification("error");
        } finally {
          spinner.classList.add("hidden");
          submitBtn.disabled = false;
        }
      });
    }
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
