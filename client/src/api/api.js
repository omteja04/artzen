import axios from "axios";

let logoutHandler = null;

export const setLogoutHandler = (cb) => {
    logoutHandler = cb;
};

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // send cookies
});

// Request interceptor to attach access token if available
api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// Response interceptor to handle 401 (auto refresh)
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalReq = err.config;
        if (err.response?.status === 401 && !originalReq._retry) {
            originalReq._retry = true;
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                try {
                    const { data } = await axios.post(
                        `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
                        {},
                        { headers: { "x-refresh-token": refreshToken }, withCredentials: true }
                    );
                    localStorage.setItem("accessToken", data.accessToken);
                    localStorage.setItem("refreshToken", data.refreshToken);
                    originalReq.headers.Authorization = `Bearer ${data.accessToken}`;
                    return axios(originalReq);
                } catch {
                    // Refresh failed -> logout
                    logoutHandler?.();
                    return Promise.reject(err);
                }
            } else {
                logoutHandler?.();
            }
        }
        return Promise.reject(err);
    }
);
