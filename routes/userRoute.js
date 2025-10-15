import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile } from '../controllers/userController.js';
import { upload }  from '../middlewares/multerCloud.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', protect, getProfile);

router.patch('/profile', protect, upload.single('avatar'), updateProfile);

export const userRouter = router;