import router from "./router.js";
import Auth from "./auth.js";
import API from "./api.js";

window.router = router;
window.Auth = Auth;
window.API = API;

// Function to show notifications
window.showNotification = function (type, title, message) {
  const alertContainer = document.createElement("div");
  alertContainer.className = "notification-container";

  let bgColor = "";
  let borderColor = "";
  let iconBg = "";

  if (type === "success") {
    bgColor = "bg-white dark:bg-dark-2";
    borderColor = "border-l-[#10b981]";
    iconBg = "bg-[#10b981]";
  } else if (type === "error") {
    bgColor = "bg-white dark:bg-dark-2";
    borderColor = "border-l-red-500";
    iconBg = "bg-red-500";
  }

  const defaultTitle = type === "success" ? "Login berhasil!" : "Login Gagal";
  const defaultMessage =
    type === "success" ? "Selamat datang!" : "Silakan coba lagi.";

  alertContainer.innerHTML = `
    <div class="border-stroke dark:border-dark-3 flex items-center rounded-md border border-l-[8px] ${borderColor} ${bgColor} p-5 pl-8 notification-content">
      <div class="mr-5 flex h-[36px] w-full max-w-[36px] items-center justify-center rounded-full ${iconBg}">
        ${
          type === "success"
            ? `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M17.4038 4.22274C17.883 4.70202 17.883 5.47909 17.4038 5.95837L8.40377 14.9584C7.92449 15.4376 7.14742 15.4376 6.66814 14.9584L2.57723 10.8675C2.09795 10.3882 2.09795 9.61111 2.57723 9.13183C3.05651 8.65255 3.83358 8.65255 4.31286 9.13183L7.53595 12.3549L15.6681 4.22274C16.1474 3.74346 16.9245 3.74346 17.4038 4.22274Z"
            fill="white" />
        </svg>
        `
            : `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM8.70711 7.29289C8.31658 6.90237 7.68342 6.90237 7.29289 7.29289C6.90237 7.68342 6.90237 8.31658 7.29289 8.70711L8.58579 10L7.29289 11.2929C6.90237 11.6834 6.90237 12.3166 7.29289 12.7071C7.68342 13.0976 8.31658 13.0976 8.70711 12.7071L10 11.4142L11.2929 12.7071C11.6834 13.0976 12.3166 13.0976 12.7071 12.7071C13.0976 12.3166 13.0976 11.6834 12.7071 11.2929L11.4142 10L12.7071 8.70711C13.0976 8.31658 13.0976 7.68342 12.7071 7.29289C12.3166 6.90237 11.6834 6.90237 11.2929 7.29289L10 8.58579L8.70711 7.29289Z"
            fill="white" />
        </svg>
        `
        }
      </div>
      <div class="flex w-full items-center justify-between">
        <div>
          <h3 class="mb-1 text-lg font-medium text-black dark:text-white">
            ${title || defaultTitle}
          </h3>
          <p class="text-body-color dark:text-dark-6 text-sm">
            ${message || defaultMessage}
          </p>
        </div>
        <div>
          <button class="hover:text-danger text-[#ACACB0] notification-close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" class="fill-current">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M18.8839 5.11612C19.372 5.60427 19.372 6.39573 18.8839 6.88388L6.88388 18.8839C6.39573 19.372 5.60427 19.372 5.11612 18.8839C4.62796 18.3957 4.62796 17.6043 5.11612 17.1161L17.1161 5.11612C17.6043 4.62796 18.3957 4.62796 18.8839 5.11612Z" />
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M5.11612 5.11612C5.60427 4.62796 6.39573 4.62796 6.88388 5.11612L18.8839 17.1161C19.372 17.6043 19.372 18.3957 18.8839 18.8839C18.3957 19.372 17.6043 19.372 17.1161 18.8839L5.11612 6.88388C4.62796 6.39573 4.62796 5.60427 5.11612 5.11612Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(alertContainer);

  // Close button handler
  const closeBtn = alertContainer.querySelector(".notification-close-btn");
  const closeNotification = () => {
    alertContainer.classList.remove("visible");
    alertContainer.classList.add("hidden");
    setTimeout(() => {
      alertContainer.remove();
    }, 300);
  };
  closeBtn?.addEventListener("click", closeNotification);

  // Trigger fade-in animation
  setTimeout(() => {
    alertContainer.classList.add("visible");
  }, 100);

  // Auto-hide the notification after 3-4 seconds
  setTimeout(() => {
    closeNotification();
  }, 3500);
};

document.addEventListener("DOMContentLoaded", async () => {
  // === PAGE TRANSITION HELPER ===
  window.pageTransition = async function (loadPageFunction) {
    const app = document.getElementById("app");

    // Fade out
    app.style.opacity = "0";

    // Wait for fade out animation
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Load new page content
    await loadPageFunction();

    // Fade in
    setTimeout(() => {
      app.style.opacity = "1";
    }, 50);
  };

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

          const response = await API.login(phoneNumber);

          if (response.success && response.token) {
            Auth.setToken(response.token);
            console.log("Login successful. User:", response.user);

            const userName = response.user.fullName || "User";
            showNotification(
              "success",
              "Login berhasil!",
              `Selamat datang ${userName}`
            );

            if (!response.user.hasQuestionnaire) {
              router.navigate("/questionnaire");
            } else {
              router.navigate("/");
            }

            await window.updateNavbarAuth();
          } else {
            throw new Error(response.error || "Login failed");
          }
        } catch (error) {
          console.error("An error occurred during login:", error);
          showNotification(
            "error",
            "Login Gagal",
            error.message || "Silakan coba lagi."
          );
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

    if (await Auth.verifyToken()) {
      router.navigate("/");
      return;
    }

    const response = await fetch("/pages/register.html");
    app.innerHTML = await response.text();

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
      registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("Registration form submission prevented.");

        const fullNameInput = document.getElementById("fullName");
        const fullName = fullNameInput ? fullNameInput.value : null;

        const phoneNumberInput = document.getElementById("phoneNumber");
        const phoneNumber = phoneNumberInput ? phoneNumberInput.value : null;

        const spinner = document.getElementById("registerSpinner");
        const submitBtn = e.target.querySelector('button[type="submit"]');

        spinner.classList.remove("hidden");
        submitBtn.disabled = true;

        try {
          console.log("Attempting registration with:", {
            fullName,
            phoneNumber,
          });

          const response = await API.register(fullName, phoneNumber);

          if (response.success && response.token) {
            Auth.setToken(response.token);
            console.log("Registration successful. User:", response.user);

            router.navigate("/questionnaire");
            alert("Registrasi Berhasil! Silakan isi questionnaire.");
            await window.updateNavbarAuth();
          } else {
            throw new Error(response.error || "Registration failed");
          }
        } catch (error) {
          console.error("An error occurred during registration:", error);
          alert(error.message || "Registrasi gagal. Silakan coba lagi.");
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

  router.addRoute("/questionnaire", async () => {
    if (!(await Auth.verifyToken())) {
      router.navigate("/login");
      return;
    }

    const app = document.getElementById("app");
    const response = await fetch("/pages/questionnaire.html");

    app.innerHTML = await response.text();

    window.updateNavbarAuth();
  });

  // === SERVICES ROUTE ===
  router.addRoute("/services", async () => {
    const app = document.getElementById("app");
    const response = await fetch("/pages/services.html");

    app.innerHTML = await response.text();

    window.updateNavbarAuth();
  });

  // === PRODUCTS CATALOG ROUTE ===
  router.addRoute("/products", async () => {
    // Cek login jika perlu (optional, biasanya katalog produk bisa publik)
    // if (!(await Auth.verifyToken())) { router.navigate("/login"); return; }

    const app = document.getElementById("app");
    const response = await fetch("/pages/products.html"); // Pastikan file ini sudah dibuat

    app.innerHTML = await response.text();

    // Jalankan script inline di products.html
    // Karena innerHTML tidak mengeksekusi script tag secara otomatis:
    const scripts = app.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value)
      );
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });

    // Panggil fungsi init jika perlu, tapi script di products.html di atas sudah auto run via 'script' tag replacement trick atau logic pemanggilan manual.
    // Namun, script inline products.html di atas memanggil loadProducts() langsung, jadi aman jika script dieksekusi.

    window.updateNavbarAuth();
  });

  // === LOGOUT ROUTE ===
  router.addRoute("/logout", async () => {
    Auth.logout();
    router.navigate("/login");
    window.updateNavbarAuth();
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
  e.stopPropagation();
  profileDropdown?.classList.toggle("hidden");
});

document.addEventListener("click", (e) => {
  if (
    profileDropdown &&
    !profileDropdown.contains(e.target) &&
    !profileIcon.contains(e.target)
  ) {
    profileDropdown.classList.add("hidden");
  }
});
