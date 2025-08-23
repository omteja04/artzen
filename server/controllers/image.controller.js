import FormData from "form-data";
import User from "../models/user.model.js";
import axios from "axios";
import { CLIPDROP_API_KEY } from '../config/env.js';

export const getUserCredits = async (req, res, next) => {
    try {
        // Assuming your auth middleware adds userId to req.user
        const userId = req.user.id;
        const user = await User.findById(userId).select('username creditBalance');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, credits: user.creditBalance });
    } catch (error) {
        next(error);
    }
};

export const generateImage = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { prompt } = req.body;

        if (!prompt) return res.status(400).json({ success: false, message: 'Missing Prompt' });

        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (!user.creditBalance || user.creditBalance <= 0)
            return res.status(400).json({ success: false, message: 'No Credit Balance', credits: user.creditBalance });

        // Generate image via ClipDrop API
        const formData = new FormData();
        formData.append('prompt', prompt);

        const { data } = await axios.post(
            'https://clipdrop-api.co/text-to-image/v1',
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'x-api-key': CLIPDROP_API_KEY
                },
                responseType: 'arraybuffer'
            }
        );

        const base64Image = Buffer.from(data, 'binary').toString('base64');
        const image = `data:image/png;base64,${base64Image}`;

        // Deduct 1 credit
        user.creditBalance -= 1;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Image generated successfully',
            credits: user.creditBalance,
            image
        });
    } catch (error) {
        next(error);
    }
};