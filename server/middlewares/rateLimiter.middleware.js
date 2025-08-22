import rateLimit from 'express-rate-limit';

export const publicProfileLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // limit to 30 requests/min per IP
    message: {
        message: "Too many requests. Please try again later.",
    },
});
