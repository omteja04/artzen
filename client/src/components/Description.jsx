import React from "react";
import { assets } from "../assets/assets";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Description = () => {
    return (
        <div className="flex flex-col items-center justify-center my-24 px-6 md:px-28">

            {/* Section Header */}
            <motion.h1
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-semibold mb-2 text-center"
            >
                Create AI Images
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-gray-500 mb-12 text-center"
            >
                Turn your imagination into stunning visuals.
            </motion.p>

            {/* Content */}
            <div className="flex flex-col gap-10 md:gap-16 md:flex-row items-center">

                {/* Left Image */}
                <motion.img
                    initial={{ x: -60, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    viewport={{ once: true }}
                    className="w-80 xl:w-[420px] rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                    src={assets.sample_img_1}
                    alt="sample-img"
                />

                {/* Right Text */}
                <motion.div
                    initial={{ x: 60, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    viewport={{ once: true }}
                    className="max-w-xl"
                >
                    <h2 className="text-3xl font-semibold mb-4 leading-snug">
                        Introducing the AI-Powered{" "}
                        <span className="text-blue-600">Text-to-Image</span> Generator
                    </h2>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                        Our tool helps you bring ideas to life in seconds. Simply describe what
                        you imagine, and our AI instantly creates high-quality images that match
                        your vision. Whether you're a designer, creator, or just exploring,
                        creativity has never been this easy.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Powered by state-of-the-art AI models, you can refine styles, adjust
                        details, and generate unlimited variations. Unlock new ways to
                        experiment, visualize, and share your creativity with the world.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Description;
