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
    const [showLogin, setShowLogin] = useState(null);
    const [credit, setCredits] = useState(null);

    useEffect(() => {
        setLogoutHandler(() => {
            setShowLogin(true);
        });
    }, []);

    useEffect(() => {
        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
    }, [user]);

    useEffect(() => {
        if (token) localStorage.setItem("token", token);
        else localStorage.removeItem("token");
    }, [token]);


    const login = useCallback((userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        setCredits(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        toast.success("User Logged out successfully");
    }, []);


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
        if (token) {
            fetchCredits();
        }
    }, [token, fetchCredits]);

    const generateImage = async (prompt) => {
        try {
            const response = await api.post('/user/generate-image', { prompt });

            if (response.data.success) {
                // Update frontend credits
                fetchCredits();
                return response.data.image;
            } else {
                // Backend returned an error but not thrown
                toast.error(response.data.message || "Failed to generate image");
                fetchCredits();

                if (response.data.credits !== undefined && response.data.credits <= 0) {
                    console.error("Bag Request: Buy Credits");
                }
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Something went wrong"
            );

            if (error.response?.status === 400 && error.response?.data?.message === "No Credit Balance") {

                console.error("Bag Request: Buy Credits");
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
        fetchCredits,
        generateImage
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
