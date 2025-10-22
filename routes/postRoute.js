import express from 'express';
import { createPost, getAllPosts, getMyPosts, deleteMyPost } from '../controllers/postController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/multerCloud.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), createPost);

router.get('/', protect, getAllPosts);

router.get('/me', protect, getMyPosts);

router.delete('/:id', protect, deleteMyPost);

export const postRouter =  router;