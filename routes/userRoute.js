import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile, searchUser, deleteAvatar } from '../controllers/userController.js';
import { upload }  from '../middlewares/multerCloud.js';
import { protect } from '../middlewares/authMiddleware.js';
import { loginLimiter, registerLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/register', registerLimiter,registerUser);

router.post('/login', loginLimiter, loginUser);

router.get('/profile', protect, getProfile);

router.get('/profile/:id', getProfile);

router.patch('/profile', protect, upload.single('avatar'), updateProfile);

router.get('/search/', protect, searchUser);

router.delete('/profile', protect, deleteAvatar);

export const userRouter = router;