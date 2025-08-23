import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { generateImage, getUserCredits, paymentRazorpay, verifyRazorpay } from '../controllers/user.controller.js';

const userRouter = Router();

// base path: /api/v1/user

// Private routes
userRouter.get('/credits', authorize, getUserCredits);
userRouter.post('/generate-image', authorize, generateImage);
userRouter.post('/payment', authorize, paymentRazorpay);
userRouter.post('/verify-payment', authorize, verifyRazorpay);

// Public route — example
// userRouter.get('/:username', publicProfileLimiter, getUserByUsername);

export default userRouter;
