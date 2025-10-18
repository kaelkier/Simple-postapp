import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile, searchUser, deleteAvatar } from '../controllers/userController.js';
import { upload }  from '../middlewares/multerCloud.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', protect, getProfile);

router.get('/profile/:id', getProfile);

router.patch('/profile', protect, upload.single('avatar'), updateProfile);

router.get('/search/', protect, searchUser);

router.delete('/profile', protect, deleteAvatar);

export const userRouter = router;