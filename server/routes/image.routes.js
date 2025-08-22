import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { generateImage, getUserCredits } from '../controllers/image.controller.js';

const imageRouter = Router();

// base path: /api/v1/user

// Private routes
imageRouter.get('/credits', authorize, getUserCredits);
imageRouter.post('/generate-image', authorize, generateImage);

// Public route — example
// imageRouter.get('/:username', publicProfileLimiter, getUserByUsername);

export default imageRouter;
