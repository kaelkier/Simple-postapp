import express from 'express';
import { createPost, getAllPosts, getMyPosts } from '../controllers/postController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/multerCloud.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), createPost);

router.get('/', protect, getAllPosts);

router.get('/:me', protect, getMyPosts);

export const postRouter =  router;