import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

let logoutCallback;

export const setLogoutHandler = (callback) => {
    logoutCallback = callback;
};

api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        // Avoid infinite loops
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshResponse = await api.post("/auth/refresh-token"); // backend route
                const newToken = refreshResponse.data.accessToken;

                // Store token and retry original request
                localStorage.setItem("token", newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api.request(originalRequest);
            } catch (refreshError) {
                // Refresh failed → logout
                console.log("Refresh token failed:", refreshError);
                localStorage.removeItem("token");
                if (logoutCallback) logoutCallback();
            }
        }

        return Promise.reject(error);
    }
);
