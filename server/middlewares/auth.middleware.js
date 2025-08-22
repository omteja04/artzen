import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_ACCESS_TOKEN_SECRET } from "../config/env.js";

const authorize = async (req, res, next) => {
    try {
        let token;

        // Check Authorization header first
        if (req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }
        // Fallback to cookie
        else if (req.cookies?.access_token) {
            token = req.cookies.access_token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: token missing",
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);

        // Fetch user and exclude password
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: user not found",
            });
        }

        // Attach user to req
        req.user = user;
        next();
    } catch (err) {
        console.error("Auth middleware error:", err.message);
        return res.status(401).json({
            success: false,
            message: "Unauthorized: invalid or expired token",
        });
    }
};

export default authorize;
