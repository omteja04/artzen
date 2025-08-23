import FormData from "form-data";
import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";
import axios from "axios";
import razorpay from "razorpay";
import { CLIPDROP_API_KEY, CURRENCY, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from "../config/env.js";


export const getUserCredits = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized: User not found" });

        const user = await User.findById(userId).select("username creditBalance");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({ success: true, credits: user.creditBalance });
    } catch (error) {
        next(error);
    }
};


export const generateImage = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { prompt } = req.body;

        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
        if (!prompt || prompt.trim().length < 5)
            return res.status(400).json({ success: false, message: "Prompt must be at least 5 characters long" });

        const user = await User.findById(userId).select("-password");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (!user.creditBalance || user.creditBalance <= 0)
            return res.status(402).json({ success: false, message: "Insufficient credits. Please buy more.", credits: user.creditBalance });

        // Generate image via ClipDrop API
        const formData = new FormData();
        formData.append("prompt", prompt);

        const { data } = await axios.post(
            "https://clipdrop-api.co/text-to-image/v1",
            formData,
            {
                headers: { ...formData.getHeaders(), "x-api-key": CLIPDROP_API_KEY },
                responseType: "arraybuffer"
            }
        );

        const base64Image = Buffer.from(data, "binary").toString("base64");
        const image = `data:image/png;base64,${base64Image}`;

        // Deduct 1 credit
        user.creditBalance -= 1;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Image generated successfully",
            credits: user.creditBalance,
            image
        });

    } catch (error) {
        next(error);
    }
};

export const razorpayInstance = new razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
});


export const paymentRazorpay = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { planId } = req.body;

        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
        if (!planId) return res.status(400).json({ success: false, message: "Missing Plan Details" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Define plans
        const plans = {
            Basic: { credits: 100, amount: 299 },
            Advanced: { credits: 500, amount: 999 },
            Business: { credits: 5000, amount: 4999 }
        };

        if (!plans[planId]) return res.status(404).json({ success: false, message: "Plan not found" });

        const { credits, amount } = plans[planId];

        // Create transaction record (payment: false initially)
        const newTransaction = await Transaction.create({
            userId,
            plan: planId,
            amount,
            credits,
            payment: false
        });


        const options = {
            amount: plans[planId].amount * 100,
            currency: CURRENCY,
            receipt: newTransaction._id,
        }

        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(400).json({ success: false, message: error.message || "Order creation failed" });
            }

            // send only one response here
            res.status(201).json({
                success: true,
                message: "Transaction initialized successfully",
                order,
                transaction: newTransaction
            });
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

export const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        if (orderInfo.status === 'paid') {
            const transactionData = await Transaction.findById(orderInfo.receipt);
            if (transactionData.payment) return res.status(400).json({ success: false, message: 'Payment already verified' });

            const userData = await User.findById(transactionData.userId);
            userData.creditBalance += transactionData.credits;
            await userData.save();
            await Transaction.findByIdAndUpdate(transactionData._id, { payment: true });

            return res.status(200).json({ success: true, message: 'Credits added' });
        }
        res.status(400).json({ success: false, message: 'Payment failed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
