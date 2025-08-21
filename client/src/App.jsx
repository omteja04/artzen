import React from "react";
import Home from "./pages/Home";
import BuyCredit from "./pages/BuyCredit";
import Generate from "./pages/Generate";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppContextProvider, { AppContext } from "./context/AppContext.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./components/Login.jsx";
import { useContext } from "react";

const Layout = ({ onLoginClick }) => (
    <>
        <Navbar onLoginClick={onLoginClick} />
        <Outlet />
        <Footer />
    </>
);

const router = (onLoginClick) =>
    createBrowserRouter([
        {
            element: <Layout onLoginClick={onLoginClick} />,
            children: [
                { path: "/", element: <Home /> },
                { path: "/generate", element: <Generate /> },
                { path: "/buy", element: <BuyCredit /> },
            ],
        },
    ]);

const AppContent = () => {
    const { authModal, setAuthModal } = useContext(AppContext);

    return (
        <div className="px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50">
            <RouterProvider router={router(() => setAuthModal("login"))} />
            {authModal && (
                <Login mode={authModal} onClose={() => setAuthModal(null)} />
            )}
        </div>
    );
};

const App = () => {
    return (
        <AppContextProvider>
            <AppContent />
        </AppContextProvider>
    );
};

export default App;
