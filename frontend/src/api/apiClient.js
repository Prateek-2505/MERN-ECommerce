import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // 🔐 allow httpOnly refresh cookie
});

// 🔁 RESPONSE INTERCEPTOR (SILENT REFRESH)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRoute =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/refresh-token");

    // ❌ NEVER refresh for auth routes
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;

      try {
        // 🔁 Attempt refresh
        const refreshResponse = await axios.post(
          "http://localhost:5000/api/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        const newToken = refreshResponse.data.token;

        // 🔐 Update default header
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken}`;

        // 🔁 Retry original request
        originalRequest.headers =
          originalRequest.headers || {};
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${newToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        // 🔴 Refresh failed → force logout
        window.dispatchEvent(
          new Event("auth-logout")
        );
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
