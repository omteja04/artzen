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
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            try {
                const refreshResponse = await api.post("/auth/refresh-token");
                const newToken = refreshResponse.data.accessToken;

                localStorage.setItem("token", newToken);
                error.config.headers.Authorization = `Bearer ${newToken}`;
                return api.request(error.config); // retry
            } catch (refreshError) {
                // If refresh fails → trigger callback
                localStorage.removeItem("token");
                if (logoutCallback) logoutCallback();
            }
        }
        return Promise.reject(error);
    }
);
