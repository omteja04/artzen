// controllers/auth.controller.js
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.js";
import {
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
    JWT_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN,
    SERVER_URL,
    NODE_ENV,
} from "../config/env.js";

/* ----------------------- Helpers ----------------------- */

const sanitizeUser = (doc) => {
    const raw = doc.toObject ? doc.toObject() : doc;
    delete raw.password;
    delete raw.resetPasswordToken;
    delete raw.resetPasswordExpires;
    delete raw.refreshTokenHash;
    delete raw.refreshTokenExpires;
    delete raw.refreshTokenVersion;
    return raw;
};

const createAccessToken = (userId) =>
    jwt.sign({ userId }, JWT_ACCESS_TOKEN_SECRET, { expiresIn: JWT_EXPIRES_IN });

const createRefreshToken = (userId, version) =>
    jwt.sign({ userId, v: version }, JWT_REFRESH_TOKEN_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });

const cookieBase = {
    httpOnly: true,
    secure: NODE_ENV === "production",
    // If your frontend and backend are on different domains, use "None".
    // Keep "Strict" if same-site (same domain).
    sameSite: NODE_ENV === "production" ? "None" : "Lax",
};

const setAuthCookies = (res, accessToken, refreshToken) => {
    // Access token cookie (short-lived)
    res.cookie("access_token", accessToken, {
        ...cookieBase,
        maxAge: 1000 * 60 * 60, // 1h max cap here; real expiry enforced by JWT
    });

    // Refresh token cookie (long-lived)
    res.cookie("refresh_token", refreshToken, {
        ...cookieBase,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
};

const clearAuthCookies = (res) => {
    res.clearCookie("access_token", {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: NODE_ENV === "production" ? "None" : "Lax",
    });
    res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: NODE_ENV === "production" ? "None" : "Lax",
    });
};

/* ----------------------- Controllers ----------------------- */

// POST /api/v1/auth/sign-up
export const signUp = async (req, res, next) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) {
            return res.status(409).json({ success: false, message: "User already exists with this email/username" });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, username, email, password: hashedPassword });

        // Optional welcome email
        await sendEmail({ to: user.email, type: "welcome", data: { name: user.name || "User" } });

        return res.status(201).json({
            success: true,
            message: "Signup successful",
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                name: user.name,
            },
        });
    } catch (err) {
        next(err);
    }
};

// POST /api/v1/auth/sign-in
export const signIn = async (req, res, next) => {
    try {
        const { loginId, password } = req.body;
        if (!loginId || !password)
            return res.status(400).json({ success: false, message: "Email or username and password are required" });
        const user = await User.findOne({
            $or: [{ email: loginId }, { username: loginId }],
        }).select("+password +refreshTokenVersion +refreshTokenHash");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ success: false, message: "Invalid credentials" });

        // Issue tokens
        const accessToken = createAccessToken(user._id);
        const refreshToken = createRefreshToken(user._id, user.refreshTokenVersion);

        // Store hashed refresh token in DB
        const refreshHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
        user.refreshTokenHash = refreshHash;
        user.refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await user.save({ validateBeforeSave: false });

        setAuthCookies(res, accessToken, refreshToken);

        return res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                accessToken,
                user: sanitizeUser(user),
            },
        });
    } catch (err) {
        next(err);
    }
};

// POST /api/v1/auth/refresh
export const refresh = async (req, res, next) => {
    try {
        const fromCookie = req.cookies?.refresh_token;
        const fromHeader = req.headers["x-refresh-token"];
        const incoming = fromCookie || fromHeader;

        if (!incoming) return res.status(401).json({ success: false, message: "Refresh token missing" });

        let payload;
        try {
            payload = jwt.verify(incoming, JWT_REFRESH_TOKEN_SECRET);
        } catch {
            return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
        }

        const user = await User.findById(payload.userId).select(
            "+refreshTokenHash +refreshTokenExpires +refreshTokenVersion"
        );
        if (!user) return res.status(401).json({ success: false, message: "User not found" });

        // version check (rotation invalidation)
        if (payload.v !== user.refreshTokenVersion)
            return res.status(401).json({ success: false, message: "Refresh token version mismatch" });

        // compare hash
        const incomingHash = crypto.createHash("sha256").update(incoming).digest("hex");
        if (
            !user.refreshTokenHash ||
            user.refreshTokenHash !== incomingHash ||
            !user.refreshTokenExpires ||
            user.refreshTokenExpires.getTime() <= Date.now()
        ) {
            return res.status(401).json({ success: false, message: "Refresh token invalid" });
        }

        // Rotate refresh token
        user.refreshTokenVersion += 1;
        const newRefreshToken = createRefreshToken(user._id, user.refreshTokenVersion);
        user.refreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
        user.refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await user.save({ validateBeforeSave: false });

        const newAccessToken = createAccessToken(user._id);
        setAuthCookies(res, newAccessToken, newRefreshToken);

        return res.status(200).json({ success: true, accessToken: newAccessToken });
    } catch (err) {
        next(err);
    }
};

// GET /api/v1/auth/sign-out
export const signOut = async (req, res, next) => {
    try {
        const fromCookie = req.cookies?.refresh_token;
        if (fromCookie) {
            try {
                const payload = jwt.verify(fromCookie, JWT_REFRESH_TOKEN_SECRET);
                const user = await User.findById(payload.userId).select("+refreshTokenHash +refreshTokenVersion");
                if (user) {
                    // invalidate by bumping version and clearing hash
                    user.refreshTokenVersion += 1;
                    user.refreshTokenHash = undefined;
                    user.refreshTokenExpires = undefined;
                    await user.save({ validateBeforeSave: false });
                }
            } catch {
                // ignore token errors on logout
            }
        }

        clearAuthCookies(res);
        return res.status(200).json({ success: true, message: "User signed out successfully" });
    } catch (err) {
        next(err);
    }
};

// POST /api/v1/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "No user found with that email address" });

        // Crypto token (plain) -> hash in DB
        const resetTokenPlain = crypto.randomBytes(32).toString("hex");
        const resetTokenHashed = crypto.createHash("sha256").update(resetTokenPlain).digest("hex");

        user.resetPasswordToken = resetTokenHashed;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
        await user.save({ validateBeforeSave: false });

        const resetLink = `${SERVER_URL}/reset-password?token=${resetTokenPlain}`;

        await sendEmail({
            to: user.email,
            type: "forgot-password",
            data: { name: user.name || "User", resetLink },
        });

        return res.status(200).json({
            success: true,
            message: "Password reset link has been sent to your email",
        });
    } catch (err) {
        next(err);
    }
};

// POST /api/v1/auth/reset-password
export const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword)
            return res.status(400).json({ success: false, message: "Token and new password are required" });
        if (newPassword.length < 8)
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });

        const hashed = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken: hashed,
            resetPasswordExpires: { $gt: Date.now() },
        }).select("+password");

        if (!user) {
            return res.status(403).json({
                success: false,
                message: "Invalid or expired token. Please request a new password reset link.",
            });
        }

        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(newPassword, salt);

        // Invalidate reset fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        await sendEmail({
            to: user.email,
            type: "password-changed",
            data: { name: user.name || "User" },
        });

        return res.status(200).json({ success: true, message: "Password has been reset successfully" });
    } catch (err) {
        next(err);
    }
};
