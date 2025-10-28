import rateLimit from "express-rate-limit";


export const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 3,
    message: 'Too many login attempts, please try again later'
});

export const registerLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 2,
    message: 'Too many register attempts, please try again later'
});

