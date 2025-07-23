// Token management utilities
class AuthService {
  constructor() {
    this.accessToken = localStorage.getItem("accessToken");
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  setAccessToken(token) {
    this.accessToken = token;
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
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
  logout() {
    this.setAccessToken(null);
    // Redirect will be handled by the component
  }
}

export const authService = new AuthService();
