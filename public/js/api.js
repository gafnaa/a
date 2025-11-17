import router from "./router.js";
import Auth from "./auth.js";

const API = {
  // Use relative URL for same-origin requests
  baseURL: "",

  async request(endpoint, options = {}) {
    const token = Auth.getToken();
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });
      // Check if the response is OK before trying to parse JSON
      if (!response.ok) {
        // Try to get error message from JSON, otherwise use status text
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.message) {
            // Some APIs might use 'message'
            errorMessage = errorData.message;
          } else {
            errorMessage = JSON.stringify(errorData); // Fallback to stringify
          }
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  },

  // Auth endpoints
  async login(phoneNumber) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ phoneNumber }),
    });
  },

  async register(fullName, phoneNumber) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ fullName, phoneNumber }),
    });
  },

  // Questionnaire endpoints
  async submitQuestionnaire(data) {
    return this.request("/api/questionnaire/submit", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getQuestionnaireData() {
    return this.request("/api/questionnaire/data");
  },

  // Product endpoints
  async getProducts(category = null, featured = null) {
    let url = "/api/products";
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (featured) params.append("featured", featured);
    if (params.toString()) url += "?" + params.toString();
    return this.request(url);
  },

  async getProduct(id) {
    return this.request(`/api/products/${id}`);
  },

  // Recommendation endpoints
  async getUserRecommendations() {
    return this.request("/api/recommendations/user");
  },

  async getRelatedProducts(category) {
    return this.request(`/api/recommendations/related/${category}`);
  },
};

export default API;
