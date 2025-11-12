// Simple router for SPA navigation
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        this.init();
    }

    init() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => this.handleRoute());
    }

    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    navigate(path) {
        window.history.pushState({}, '', path);
        this.handleRoute();
    }

    async handleRoute() {
        const path = window.location.pathname || '/';
        
        // Check for exact match first
        if (this.routes[path]) {
            this.currentRoute = path;
            await this.routes[path]();
            return;
        }

        // Check for dynamic routes (e.g., /product/:id)
        for (const routePath in this.routes) {
            const routePattern = routePath.replace(/:[^/]+/g, '([^/]+)');
            const regex = new RegExp(`^${routePattern}$`);
            const match = path.match(regex);
            
            if (match) {
                this.currentRoute = path;
                await this.routes[routePath]();
                return;
            }
        }

        // Default route
        if (this.routes['/']) {
            this.currentRoute = '/';
            await this.routes['/']();
        }
    }
}

const router = new Router();

export default router;

