import axios from "axios";

let logoutHandler = null;

// a setter to assign the logout function from AppContext
export const setLogoutHandler = (cb) => {
    logoutHandler = cb;
};

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // send cookies automatically
});

// attach access token
api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// auto-refresh on 401
api.interceptors.response.use(
    res => res,
    async (err) => {
        const originalReq = err.config;
        if (err.response?.status === 401 && !originalReq._retry) {
            originalReq._retry = true;
            try {
                const { data } = await api.post("/auth/refresh");
                localStorage.setItem("token", data.accessToken);
                originalReq.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalReq);
            } catch {
                logoutHandler?.();
                return Promise.reject(err);
            }
        }
        return Promise.reject(err);
    }
);
