import React, { createContext, useState } from "react";

// Create the context
export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    // Initialize user from localStorage safely
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (err) {
            console.error("Failed to parse user from localStorage:", err);
            return null;
        }
    });

    // Initialize token from localStorage
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);

    // Auth modal state ("login" | "signup" | null)
    const [authModal, setAuthModal] = useState(null);

    // Optional: user credits or other state
    const [credit, setCredit] = useState(0);

    // Backend URL from environment
    const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5500/api/v1";

    // Logout helper
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    const value = {
        user,
        setUser,
        token,
        setToken,
        authModal,
        setAuthModal,
        credit,
        setCredit,
        backendURL,
        logout,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
