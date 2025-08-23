/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { api, setLogoutHandler } from "../api/api";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (err) {
            console.error("Failed to parse user from localStorage:", err);
            return null;
        }
    });

    const [token, setToken] = useState(() => localStorage.getItem("token") || null);
    const [showLogin, setShowLogin] = useState(false);
    const [credit, setCredits] = useState(null);

    // global logout handler
    useEffect(() => setLogoutHandler(() => logout()), []);

    // persist user and token in localStorage
    useEffect(() => user ? localStorage.setItem("user", JSON.stringify(user)) : localStorage.removeItem("user"), [user]);
    useEffect(() => token ? localStorage.setItem("token", token) : localStorage.removeItem("token"), [token]);

    const login = useCallback((userData, accessToken, refreshToken) => {
        setUser(userData);
        setToken(accessToken);
        localStorage.setItem("refreshToken", refreshToken); // persist refresh token for incognito
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        setCredits(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        toast.success("User logged out successfully");
    }, []);

    // refresh token logic
    const refreshTokenFunc = useCallback(async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) return logout();

            const { data } = await api.post("/auth/refresh", {}, {
                headers: { "x-refresh-token": refreshToken }
            });

            setToken(data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken); // rotate refresh token
        } catch (err) {
            console.error("Failed to refresh token:", err);
            logout();
        }
    }, [logout]);

    // fetch user's credits
    const fetchCredits = useCallback(async () => {
        try {
            const { data } = await api.get("/user/credits");
            if (data.success) {
                setCredits(data.credits);
                setUser(prev => prev ? { ...prev, creditBalance: data.credits } : prev);
            }
        } catch (err) {
            console.error("Failed to fetch credits:", err);
            toast.error("Failed to fetch credits");
        }
    }, []);

    useEffect(() => {
        if (token) fetchCredits();
    }, [token, fetchCredits]);

    const generateImage = async (prompt) => {
        try {
            const response = await api.post('/user/generate-image', { prompt });
            if (response.data.success) {
                fetchCredits();
                return response.data.image;
            } else {
                toast.error(response.data.message || "Failed to generate image");
                fetchCredits();
                if (response.data.credits !== undefined && response.data.credits <= 0) {
                    console.error("Bad Request: Buy Credits");
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Something went wrong");
            if (error.response?.status === 400 && error.response?.data?.message === "No Credit Balance") {
                console.error("Bad Request: Buy Credits");
            }
        }
    };

    const value = {
        user,
        setUser,
        token,
        setToken,
        showLogin,
        setShowLogin,
        credit,
        backendURL,
        login,
        logout,
        refreshTokenFunc,
        fetchCredits,
        generateImage
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
