import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const Login = ({ onClose }) => {
    const { setUser } = useContext(AppContext) || {};
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        setErrors((er) => ({ ...er, [name]: "" }));
    };

    const validate = () => {
        const er = {};
        if (isSignUp) {
            if (!form.name.trim()) er.name = "Name is required";
            if (!form.username.trim()) er.username = "Username is required";
            if (!form.email.trim()) er.email = "Email is required";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                er.email = "Invalid email";
            if (!form.password) er.password = "Password is required";
        } else {
            if (!form.loginId.trim()) er.loginId = "Enter username or email";
            if (!form.password) er.password = "Password is required";
        }
        setErrors(er);
        return Object.keys(er).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            await new Promise((r) => setTimeout(r, 1000));

            if (isSignUp) {
                if (setUser) setUser({ name: form.name, username: form.username, email: form.email });
            } else {
                if (setUser)
                    setUser({ name: form.loginId.split("@")[0], email: form.loginId });
            }

            onClose?.();
        } catch {
            setErrors({ form: "Something went wrong" });
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
                    {/* Close */}
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
                        {/* Sign Up Fields */}
                        {isSignUp ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className={`w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-2 focus:ring-zinc-900 ${errors.name ? "border-red-400" : "border-gray-300"
                                            }`}
                                        placeholder="yourname"
                                    />
                                    {errors.name && (
                                        <p className="text-xs text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={form.username}
                                        onChange={handleChange}
                                        className={`w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-2 focus:ring-zinc-900 ${errors.username ? "border-red-400" : "border-gray-300"
                                            }`}
                                        placeholder="yourusername"
                                    />
                                    {errors.username && (
                                        <p className="text-xs text-red-600">{errors.username}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className={`w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-2 focus:ring-zinc-900 ${errors.email ? "border-red-400" : "border-gray-300"
                                            }`}
                                        placeholder="you@example.com"
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-red-600">{errors.email}</p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Username or Email
                                </label>
                                <input
                                    type="text"
                                    name="loginId"
                                    value={form.loginId}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-2 focus:ring-zinc-900 ${errors.loginId ? "border-red-400" : "border-gray-300"
                                        }`}
                                    placeholder="username or email"
                                />
                                {errors.loginId && (
                                    <p className="text-xs text-red-600">{errors.loginId}</p>
                                )}
                            </div>
                        )}

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className={`w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-2 focus:ring-zinc-900 ${errors.password ? "border-red-400" : "border-gray-300"
                                    }`}
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="text-xs text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Submit */}
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

                    {/* Switch form */}
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
