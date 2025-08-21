import React from "react";
import { assets } from "../assets/assets";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Footer = () => {
    return (
        <footer className="mt-16 mb-1 py-6 px-4 border-t border-gray-200">
            <div className="relative flex items-center justify-between max-w-6xl mx-auto">
                <motion.img
                    src={assets.logo}
                    alt="Imagify Logo"
                    className="w-32 sm:w-40"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                />

                <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
                    <motion.p
                        className="text-sm text-gray-500"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        © {new Date().getFullYear()}{" "}
                        <span className="font-medium">omteja04</span> | All rights reserved.
                    </motion.p>
                    <motion.p
                        className="text-xs text-gray-400 mt-1"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        Made with ❤️ by Omteja
                    </motion.p>
                </div>

                <div className="flex gap-4">
                    {[assets.facebook_icon, assets.twitter_icon, assets.instagram_icon].map(
                        (icon, idx) => (
                            <motion.img
                                key={idx}
                                src={icon}
                                alt="social"
                                className="w-8 cursor-pointer"
                                whileHover={{ scale: 1.2, rotate: 10 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            />
                        )
                    )}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
