import { Router } from "express";
import {
    signUp,
    signIn,
    signOut,
    refresh,
    forgotPassword,
    resetPassword,
} from "../controllers/auth.controller.js";

const authRouter = Router();

// path:  /api/v1/auth/...
authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.get("/sign-out", signOut);

authRouter.post("/refresh", refresh);

// Example protected route
// authRouter.get("/me", authorize, (req, res) => res.json({ success: true, user: req.user }));

authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
