import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { api } from "../api/api.js";

const validateForm = (form, isSignUp) => {
    const errors = {};
    if (isSignUp) {
        if (!form.name.trim()) errors.name = "Name is required";
        if (!form.username.trim()) errors.username = "Username is required";
        if (!form.email.trim()) errors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            errors.email = "Invalid email";
        if (!form.password) errors.password = "Password is required";
    } else {
        if (!form.loginId.trim()) errors.loginId = "Enter username or email";
        if (!form.password) errors.password = "Password is required";
    }
    return errors;
};

const Login = ({ onClose }) => {
    const { login } = useContext(AppContext) || {};
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        loginId: "",
    });
    const [errors, setErrors] = useState({});
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        setErrors((er) => ({ ...er, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm(form, isSignUp);
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setLoading(true);

        try {
            const endpoint = isSignUp ? "/auth/sign-up" : "/auth/sign-in";
            const payload = isSignUp
                ? {
                    name: form.name,
                    username: form.username,
                    email: form.email,
                    password: form.password,
                }
                : {
                    loginId: form.loginId,
                    password: form.password,
                };

            const response = await api.post(endpoint, payload);

            if (response.data.success) {
                const { user, accessToken, message } = response.data;
                login(user, accessToken);
                toast.success(message);
                onClose?.();
            } else {
                toast.error(response.data.message);
            }


        } catch (err) {
            const msg = err.response?.data?.message || "Something went wrong";
            setErrors({ form: msg });
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
                <motion.div
                    initial={{ scale: 0.9, y: -20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: -20, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>

                    <h1 className="text-2xl font-bold text-center mb-1">
                        {isSignUp ? "Create Account" : "Welcome Back"}
                    </h1>
                    <p className="text-gray-500 text-center mb-6">
                        {isSignUp ? "Sign up to get started" : "Sign in to continue"}
                    </p>

                    {errors.form && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3"
                        >
                            {errors.form}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isSignUp ? (
                            <>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border px-4 py-2.5 ${errors.name ? "border-red-400" : "border-gray-300"
                                        }`}
                                />
                                {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}

                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={form.username}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border px-4 py-2.5 ${errors.username ? "border-red-400" : "border-gray-300"
                                        }`}
                                />
                                {errors.username && (
                                    <p className="text-xs text-red-600">{errors.username}</p>
                                )}

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border px-4 py-2.5 ${errors.email ? "border-red-400" : "border-gray-300"
                                        }`}
                                />
                                {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}

                                {/* Signup password */}
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Create Password"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    className={`w-full rounded-lg border px-4 py-2.5 ${errors.password ? "border-red-400" : "border-gray-300"
                                        }`}
                                />
                                {errors.password && (
                                    <p className="text-xs text-red-600">{errors.password}</p>
                                )}
                            </>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    name="loginId"
                                    placeholder="Username or Email"
                                    value={form.loginId}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border px-4 py-2.5 ${errors.loginId ? "border-red-400" : "border-gray-300"
                                        }`}
                                />
                                {errors.loginId && (
                                    <p className="text-xs text-red-600">{errors.loginId}</p>
                                )}

                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter Password"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    className={`w-full rounded-lg border px-4 py-2.5 ${errors.password ? "border-red-400" : "border-gray-300"
                                        }`}
                                />
                                {errors.password && (
                                    <p className="text-xs text-red-600">{errors.password}</p>
                                )}
                            </>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-zinc-900 text-white py-2.5 rounded-full hover:bg-zinc-800 transition disabled:opacity-60"
                        >
                            {loading
                                ? isSignUp
                                    ? "Signing Up..."
                                    : "Signing In..."
                                : isSignUp
                                    ? "Sign Up"
                                    : "Sign In"}
                        </motion.button>
                    </form>


                    <p className="text-sm text-gray-600 text-center mt-4">
                        {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
                        <button
                            type="button"
                            onClick={() => setIsSignUp((prev) => !prev)}
                            className="text-zinc-900 font-semibold hover:underline"
                        >
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </button>
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Login;
