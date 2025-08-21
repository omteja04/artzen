import React, { useContext } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const GenerateButton = () => {
    const { user, setAuthModal } = useContext(AppContext);
    const navigate = useNavigate();

    const onClickHandler = () => {
        if (user) {
            navigate('/generate');
        } else {
            setAuthModal("signup");
        }
    };
    return (
        <div className="flex flex-col items-center justify-center pb-16 text-center">
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-neutral-800 py-6 md:py-16"
            >
                See the magic. Try now
            </motion.h1>

            <motion.button
                onClick={onClickHandler}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                aria-label="Generate AI Images"
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="group relative text-white bg-gradient-to-r from-black via-gray-800 to-black 
                    px-10 py-3 flex items-center gap-3 rounded-full shadow-lg 
                    hover:shadow-[0_0_25px_rgba(0,0,0,0.5)] 
                    hover:from-gray-900 hover:via-black hover:to-gray-900 cursor-pointer"
            >
                <span className="tracking-wide font-medium sm:text-lg">
                    Generate Images
                </span>
                <img
                    className="h-6 transition-transform group-hover:rotate-12 group-hover:scale-110 group-hover:animate-pulse"
                    src={assets.star_group}
                    alt="star-group"
                />
            </motion.button>
        </div>
    );
};

export default GenerateButton;
