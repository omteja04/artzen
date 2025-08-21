import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { stepsData } from "../assets/assets";

const Steps = () => {
    return (
        <div className="flex flex-col justify-center items-center my-32 px-6 max-w-6xl mx-auto">
            {/* Title */}
            <motion.h1
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-3xl sm:text-4xl font-semibold mb-2 text-gray-900 text-center"
            >
                How it works?
            </motion.h1>

            {/* Subtitle */}
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-lg text-gray-600 mb-12 text-center"
            >
                Transform your words into astonishing AI-generated visuals in just 3 simple steps.
            </motion.p>

            {/* Cards Grid */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }} // triggers when 20% in viewport
                variants={{
                    hidden: {},
                    visible: {
                        transition: { staggerChildren: 0.2 }
                    }
                }}
                className="grid gap-8 w-full sm:grid-cols-1 md:grid-cols-3"
            >
                {stepsData.map((item, index) => (
                    <motion.div
                        key={index}
                        variants={{
                            hidden: { opacity: 0, y: 40 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
                        whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
                        className="flex flex-col items-center text-center gap-4 p-6 bg-white/40 backdrop-blur-lg shadow-md border border-gray-200 transition-all duration-300 rounded-2xl"
                    >
                        <motion.img
                            whileInView={{ y: [0, -8, 0] }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            width={60}
                            height={60}
                            src={item.icon}
                            alt="icon"
                            className="rounded-lg"
                        />
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                            {item.title}
                        </h2>
                        <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default Steps;
