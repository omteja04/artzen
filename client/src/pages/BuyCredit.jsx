import React, { useContext } from "react";
import { assets, plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { api } from "../api/api.js";

const BuyCredit = () => {

    const { user, fetchCredits, setShowLogin } = useContext(AppContext);
    const navigate = useNavigate();
    const initializePayment = async (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Credits Payment',
            description: 'Payment for Credits',
            image: assets.logo_icon,
            order_id: order.id,
            handler: async (response) => {
                try {
                    const { data } = await api.post('/user/verify-payment', response);
                    if (data.success) {
                        fetchCredits();
                        navigate('/');
                        toast.success('Credits Added');
                    }
                } catch (error) {
                    toast.error(error.message);
                }
            }
        }
        const razorpay = new window.Razorpay(options);
        razorpay.open();
    }
    const paymentRazorpay = async (planId) => {
        try {
            if (!user) {
                setShowLogin(true);
                return;
            }
            const response = await api.post('/user/payment', { planId });
            if (response.data.success) {
                toast.info("Transaction initialized successfully!");
                initializePayment(response.data.order)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    }
    return (
        <div className="min-h-[80vh] text-center pt-14 mb-10">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-gray-400 px-10 py-2 rounded-full mb-6 hover:bg-gray-100 transition"
            >
                Our Plans
            </motion.button>

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-semibold mb-6 sm:mb-10"
            >
                Choose the Plan
            </motion.h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
                {plans.map((item, index) => {
                    const isPopular = index === 1;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
                            className={`relative border rounded-2xl p-8 flex flex-col items-center shadow-md transition 
                                ${isPopular
                                    ? "border-blue-500 scale-105 bg-gradient-to-b from-blue-50 to-white"
                                    : "border-gray-200 bg-white"
                                }`}
                        >
                            {isPopular && (
                                <motion.span
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                    className="absolute -top-4 bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow"
                                >
                                    Most Popular
                                </motion.span>
                            )}

                            <motion.img
                                src={assets.logo_icon}
                                alt="plan-icon"
                                className="w-12 h-12 mb-4"
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                            />

                            <p className="text-2xl font-semibold mb-2">{item.id}</p>
                            <p className="text-gray-600 text-sm mb-4">{item.desc}</p>
                            <p className="text-3xl font-bold mb-6 text-blue-600">
                                ₹{item.price}
                                <span className="text-base text-gray-500 font-normal">
                                    {" "}
                                    / {item.credits} credits
                                </span>
                            </p>

                            <motion.button
                                onClick={() => paymentRazorpay(item.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.9 }}
                                className={`w-full py-3 rounded-full font-medium transition 
                                    ${isPopular
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-zinc-900 text-white hover:bg-zinc-800"
                                    }`}
                            >
                                {user ? "Buy Now" : "Get Started"}
                            </motion.button>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default BuyCredit;
