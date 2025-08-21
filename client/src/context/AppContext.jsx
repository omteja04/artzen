import React, { createContext, useState } from 'react'

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authModal, setAuthModal] = useState(null);
    // values: "login" | "signup" | null

    const value = {
        user,
        setUser,
        authModal,
        setAuthModal
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;
