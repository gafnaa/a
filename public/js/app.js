// Main application initialization
import router from './router.js';
import Auth from './auth.js';
import API from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    const user = await Auth.verifyToken();
    
    // Define routes
    router.addRoute('/login', async () => {
        if (user) {
            router.navigate('/');
            return;
        }
        const app = document.getElementById('app');
        const response = await fetch('/pages/login.html');
        app.innerHTML = await response.text();
    });

    router.addRoute('/questionnaire', async () => {
        if (!user) {
            router.navigate('/login');
            return;
        }
        const app = document.getElementById('app');
        const response = await fetch('/pages/questionnaire.html');
        app.innerHTML = await response.text();
    });

    // Landing page route
    router.addRoute('/', async () => {
        if (!user) {
            router.navigate('/login');
            return;
        }
        const app = document.getElementById('app');
        const response = await fetch('/pages/landing.html');
        app.innerHTML = await response.text();
        // Wait for script to load, then call loadLandingPage
        setTimeout(async () => {
            if (typeof loadLandingPage === 'function') {
                await loadLandingPage();
            }
        }, 100);
    });

    // Dashboard route
    router.addRoute('/dashboard', async () => {
        if (!user) {
            router.navigate('/login');
            return;
        }
        const app = document.getElementById('app');
        const response = await fetch('/pages/dashboard.html');
        app.innerHTML = await response.text();
        // Wait for script to load, then call loadDashboard
        setTimeout(async () => {
            if (typeof loadDashboard === 'function') {
                await loadDashboard();
            }
        }, 100);
    });

    // Product detail route handler
    router.addRoute('/product/:id', async () => {
        if (!user) {
            router.navigate('/login');
            return;
        }
        
        const path = window.location.pathname;
        const productId = path.split('/product/')[1];
        
        if (!productId) {
            router.navigate('/');
            return;
        }

        const app = document.getElementById('app');
        const response = await fetch('/pages/product-detail.html');
        app.innerHTML = await response.text();
        
        // Wait for script to load, then call loadProductDetail
        setTimeout(async () => {
            if (typeof loadProductDetail === 'function') {
                await loadProductDetail(productId);
            }
        }, 100);
    });

    // Handle all link clicks for SPA navigation
    window.addEventListener('click', (e) => {
        const link = e.target.closest('a');
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
    if (!user && currentPath !== '/login') {
        router.navigate('/login');
    } else if (user && currentPath === '/login') {
        router.navigate('/');
    } else {
        router.handleRoute();
    }
});

