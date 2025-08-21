import React, { useContext, useEffect, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Generate = () => {
    const [image, setImage] = useState(assets.sample_img_1);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState('');

    const { user, setAuthModal } = useContext(AppContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
            setAuthModal("signup");
            navigate("/");
        }
    }, [user]);
    if (!user) return null;

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setLoading(true);
        setIsImageLoaded(false);

        setTimeout(() => {
            setImage(assets.sample_img_1);
            setIsImageLoaded(true);
            setLoading(false);
        }, 3000);
    };

    return (
        <form
            onSubmit={onSubmitHandler}
            className="flex flex-col min-h-[90vh] justify-center items-center"
        >
            <div>
                <div className="relative">
                    {/* Animate image fade-in & scale */}
                    <motion.img
                        key={image} // ensures re-animation on change
                        src={image}
                        alt="generated"
                        className="max-w-sm rounded shadow"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    />

                    {/* Loading bar */}
                    <span
                        className={`absolute left-0 bottom-0 h-1 bg-blue-500 
                        ${loading ? 'w-full transition-[width] duration-[3s]' : 'w-0'}`}
                    />
                </div>

                {loading && (
                    <motion.p
                        className="text-sm text-gray-600 mt-2 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                    >
                        Loading...
                    </motion.p>
                )}
            </div>

            {/* Input bar when no image */}
            {!isImageLoaded && (
                <motion.div
                    className="flex w-full max-w-xl bg-neutral-500 text-white text-sm p-1 mt-10 rounded-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <input
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        type="text"
                        placeholder="Describe what you want to generate..."
                        className="flex-1 bg-transparent outline-none px-4 placeholder-gray-200"
                    />
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        type="submit"
                        className="bg-zinc-900 px-8 sm:px-12 py-3 rounded-full hover:bg-zinc-800 transition"
                    >
                        Generate
                    </motion.button>
                </motion.div>
            )}

            {/* Action buttons after image loads */}
            {isImageLoaded && (
                <motion.div
                    className="flex gap-3 flex-wrap justify-center text-sm p-1 mt-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setIsImageLoaded(false)}
                        type="button"
                        className="border border-zinc-900 text-black px-8 py-3 rounded-full hover:bg-gray-100 transition"
                    >
                        Generate Another
                    </motion.button>
                    <motion.a
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        href={image}
                        download
                        className="bg-zinc-900 text-white px-10 py-3 rounded-full hover:bg-zinc-800 transition"
                    >
                        Download
                    </motion.a>
                </motion.div>
            )}
        </form>
    );
};

export default Generate;
