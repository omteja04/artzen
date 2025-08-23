import React, { useContext, useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Generate = () => {
    const [image, setImage] = useState(assets.sample_img_1);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState('');

    const { user, setAuthModal, generateImage } = useContext(AppContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
            setAuthModal("signup");
            navigate("/");
        }
    }, [user, setAuthModal, navigate]);
    if (!user) return null;
    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!input.trim() || input.length < 5) {
            toast.error("Enter a proper prompt");
            return;
        }

        try {
            setLoading(true);
            setIsImageLoaded(false);

            // Check frontend credits first
            if (user.credits <= 0) {
                toast.error("You don't have enough credits! Please buy more.");
                navigate('/buy');
                return;
            }

            // Call backend to generate image
            const generatedImage = await generateImage(input);

            if (generatedImage) {
                setImage(generatedImage);
                setIsImageLoaded(true);
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <form
            onSubmit={onSubmitHandler}
            className="flex flex-col min-h-[90vh] justify-center items-center"
        >
            <div className="relative">
                <motion.img
                    key={image}
                    src={image}
                    alt="generated"
                    className="max-w-sm rounded shadow"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />
                <span
                    className={`absolute left-0 bottom-0 h-1 bg-blue-500 transition-all duration-700 ease-out`}
                    style={{ width: loading ? "100%" : "0%" }}
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

            {!isImageLoaded && (
                <motion.div
                    className="flex w-full max-w-xl bg-neutral-500 text-white text-sm p-1 mt-10 rounded-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
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
                        onClick={() => {
                            setIsImageLoaded(false);
                            setInput("");
                        }}
                        type="button"
                        className="border border-zinc-900 text-black px-8 py-3 rounded-full hover:bg-gray-100 transition"
                    >
                        Generate Another
                    </motion.button>
                    <motion.a
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        href={image}
                        download={`image-${Date.now()}.png`}
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
