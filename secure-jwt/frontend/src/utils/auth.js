// Token management utilities
class AuthService {
  constructor() {
    // Store access token in memory only 
    this.accessToken = null;
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  setAccessToken(token) {
    // Only store in memory
    this.accessToken = token;
  }

  getAccessToken() {
    return this.accessToken || localStorage.getItem("accessToken");
  }

  async refreshToken() {
    try {
      const response = await fetch("http://localhost:4000/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        this.setAccessToken(data.accessToken);
        return data.accessToken;
      } else {
        this.logout();
        throw new Error("Token refresh failed");
      }
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  async apiCall(url, options = {}) {
    const token = this.getAccessToken();

    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: "include",
    };

    let response = await fetch(url, config);

    if (response.status === 401 && token) {
      if (this.isRefreshing) {
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject, url, options });
        });
      }

      this.isRefreshing = true;

      try {
        const newToken = await this.refreshToken();
        this.isRefreshing = false;

        this.failedQueue.forEach(({ resolve, url, options }) => {
          resolve(this.apiCall(url, options));
        });
        this.failedQueue = [];

        config.headers.Authorization = `Bearer ${newToken}`;
        response = await fetch(url, config);
      } catch (refreshError) {
        this.isRefreshing = false;
        this.failedQueue.forEach(({ reject }) => {
          reject(refreshError);
        });
        this.failedQueue = [];
        throw refreshError;
      }
    }

    return response;
  }

  async initializeAuth() {
    try {
      const response = await fetch("http://localhost:4000/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        this.setAccessToken(data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      return false;
    }
  }

  logout() {
    this.setAccessToken(null);
    // Clear any pending requests

    this.failedQueue = [];
    this.isRefreshing = false;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.accessToken;
  }
}

export const authService = new AuthService();
