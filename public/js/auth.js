// Authentication utilities
const Auth = {
  getToken() {
    return localStorage.getItem("token");
  },

  setToken(token) {
    localStorage.setItem("token", token);
  },

  removeToken() {
    localStorage.removeItem("token");
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  async verifyToken() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data.success ? data.user : null;
    } catch (error) {
      console.error("Token verification error:", error);
      return null;
    }
  },

  logout() {
    this.removeToken();
  },
};

export default Auth;
