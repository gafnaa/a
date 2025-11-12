// API utility functions
import Auth from './auth.js';

const API = {
    baseURL: import.meta.env.VITE_API_BASE_URL || '',

    async request(endpoint, options = {}) {
        const token = Auth.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers
            });
            const data = await response.json();
            
            // Check if response is not ok and has an error
            if (!response.ok && data.error) {
                throw new Error(data.error);
            }
            
            return data;
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    },

    // Auth endpoints
    async login(phoneNumber) {
        return this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ phoneNumber })
        });
    },

    // Questionnaire endpoints
    async submitQuestionnaire(data) {
        return this.request('/api/questionnaire/submit', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async getQuestionnaireData() {
        return this.request('/api/questionnaire/data');
    },

    // Product endpoints
    async getProducts(category = null, featured = null) {
        let url = '/api/products';
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (featured) params.append('featured', featured);
        if (params.toString()) url += '?' + params.toString();
        return this.request(url);
    },

    async getProduct(id) {
        return this.request(`/api/products/${id}`);
    },

    // Recommendation endpoints
    async getUserRecommendations() {
        return this.request('/api/recommendations/user');
    },

    async getRelatedProducts(category) {
        return this.request(`/api/recommendations/related/${category}`);
    }
};

export default API;

