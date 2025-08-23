import React, { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { NavLink } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ onLoginClick }) => {
    const { user, logout, credit } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
    };

    return (
        <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center justify-between py-4 px-4 sm:px-8 "
        >
            <NavLink to="/" className={`flex justify-center items-center gap-3`}>
                <img src={assets.logo_icon} alt="artzen-logo" className="w-9 sm:w-12" />
                <h1 className="text-3xl font-semibold">artzen</h1>
            </NavLink>

            <div>
                {user ? (
                    <div className="flex items-center gap-4 sm:gap-6">
                        <NavLink
                            to="/buy"
                            className="flex items-center gap-2 bg-blue-50 px-4 sm:px-6 py-2 rounded-full shadow-sm border hover:scale-105 hover:shadow-md transition-all duration-300"
                        >
                            <img src={assets.credit_star} alt="credit-star" className="w-5" />
                            <p className="text-xs sm:text-sm font-medium text-gray-700">
                                Credits Left: {credit ?? "--"}
                            </p>
                        </NavLink>

                        <p className="max-sm:hidden text-gray-700 font-medium">
                            Hi, {user.username || "User"}
                        </p>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <motion.img
                                src={assets.profile_icon}
                                alt="profile-icon"
                                className="w-10 cursor-pointer drop-shadow"
                                whileHover={{ scale: 1.1 }}
                                onClick={() => setIsOpen(!isOpen)}
                            />

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-3 w-44 rounded-xl shadow-lg bg-white border z-20"
                                    >
                                        <ul className="list-none p-2 text-sm text-gray-700">
                                            <li>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-md text-red-600 hover:bg-red-50 transition"
                                                >
                                                    🚪 Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 sm:gap-6">
                        <NavLink
                            to="/buy"
                            className="cursor-pointer relative after:block after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
                        >
                            Pricing
                        </NavLink>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onLoginClick}
                            className="bg-zinc-800 text-white py-2 px-7 sm:px-10 text-sm rounded-full cursor-pointer hover:bg-zinc-700 transition"
                        >
                            Login
                        </motion.button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Navbar;
