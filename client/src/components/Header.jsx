import React, { useContext } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Header = () => {

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
        <div className="flex flex-col justify-center items-center text-center my-20 px-4">

            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ scale: 1.05, boxShadow: "0px 4px 15px rgba(0,0,0,0.15)" }}
                className="text-stone-600 inline-flex items-center gap-2 bg-white/80 px-6 py-1 rounded-full 
                    border border-neutral-300 shadow-sm cursor-pointer"
            >
                <p className="text-sm font-medium">Best text-to-image generator</p>
                <img src={assets.star_icon} alt="star-icon" className="h-4 animate-pulse" />
            </motion.div>

            {/* Heading */}
            <motion.h1
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-4xl max-w-[320px] sm:text-6xl sm:max-w-[650px] mx-auto mt-10 font-bold leading-tight"
            >
                Turn Text into{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 animate-gradient">
                    Images
                </span>{" "}
                in Seconds.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-center text-gray-600 max-w-2xl mx-auto mt-5 text-base sm:text-lg"
            >
                Unleash your creativity with AI. Transform your imagination into stunning visual art.
                Generate images from prompts, refine styles, and share your unique creations instantly.
            </motion.p>

            {/* Button */}
            <motion.button
                onClick={onClickHandler}
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="group relative text-white bg-gradient-to-r from-black via-gray-800 to-black px-8 mt-8 py-3 
                    flex items-center gap-3 rounded-full shadow-lg 
                    hover:shadow-[0_0_25px_rgba(0,0,0,0.5)] cursor-pointer"
            >
                <span className="tracking-wide font-medium">Generate Images</span>
                <img
                    className="h-6 transition-transform group-hover:rotate-12 group-hover:scale-110"
                    src={assets.star_group}
                    alt="star-group"
                />
            </motion.button>

            {/* Sample Images */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1 }
                    }
                }}
                className="flex flex-wrap justify-center gap-3 mt-12"
            >
                {Array(6).fill("").map((_, index) => (
                    <motion.img
                        key={index}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        whileHover={{ scale: 1.15, rotate: -2 }}
                        transition={{ type: "spring", stiffness: 150 }}
                        className="rounded-lg transition-transform duration-500 cursor-pointer shadow-md"
                        src={index % 2 === 1 ? assets.sample_img_1 : assets.sample_img_2}
                        alt="sample"
                        width={80}
                    />
                ))}
            </motion.div>

            {/* Footer Note */}
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                viewport={{ once: true, amount: 0.3 }}
                className="mt-4 text-neutral-600 text-sm"
            >
                Generated using <span className="font-semibold">artzen</span>
            </motion.p>
        </div>
    );
};

export default Header;
