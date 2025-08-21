import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { assets, testimonialsData } from "../assets/assets";

const Testimonials = () => {
    return (
        <div className="flex flex-col items-center justify-center my-20 py-12 px-6">
            <h1 className="text-3xl sm:text-4xl font-semibold mb-2 text-gray-900 text-center">
                Customer Testimonials
            </h1>
            <p className="text-gray-500 mb-12 text-center">
                What Our Users Are Saying
            </p>

            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                {testimonialsData.map((testimonial, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-md border border-gray-200 cursor-pointer transition-all duration-300"
                    >
                        <div className="flex flex-col items-center text-center">
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="rounded-full w-16 h-16 object-cover"
                            />

                            <h2 className="text-lg font-semibold mt-4 text-gray-800">
                                {testimonial.name}
                            </h2>
                            <p className="text-gray-500 text-sm mb-3">{testimonial.role}</p>

                            {/* Stars */}
                            <div
                                className="flex mb-4"
                                aria-label={`${testimonial.stars} out of 5 stars`}
                            >
                                {[...Array(testimonial.stars)].map((_, idx) => (
                                    <img
                                        key={idx}
                                        src={assets.rating_star}
                                        alt="star"
                                        className="w-5 h-5"
                                    />
                                ))}
                            </div>

                            <p className="text-base text-gray-700 leading-relaxed italic">
                                “{testimonial.text}”
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Testimonials;
