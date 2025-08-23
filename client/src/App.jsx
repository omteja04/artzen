import React, { useContext } from "react";
import Home from "./pages/Home";
import BuyCredit from "./pages/BuyCredit";
import Generate from "./pages/Generate";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppContextProvider, { AppContext } from "./context/AppContext.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./components/Login.jsx";
import { ToastContainer } from "react-toastify";

const Layout = ({ onLoginClick }) => (
    <>
        <ToastContainer position="bottom-right" />
        <Navbar onLoginClick={onLoginClick} />
        <Outlet />
        <Footer />
    </>
);

const AppContent = () => {
    const { authModal, setAuthModal } = useContext(AppContext);
    return (
        <>
            {authModal && <Login mode={authModal} onClose={() => setAuthModal(null)} />}
            <Outlet />
        </>
    );
};

const App = () => {
    const router = createBrowserRouter([
        {
            element: (
                <AppContextProvider>
                    <Layout onLoginClick={() => { }}>
                        <AppContent />
                    </Layout>
                </AppContextProvider>
            ),
            children: [
                { path: "/", element: <Home /> },
                { path: "/generate", element: <Generate /> },
                { path: "/buy", element: <BuyCredit /> },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
};

export default App;
