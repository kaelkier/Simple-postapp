import express from 'express';
import { createPost, getAllPosts, getMyPosts } from '../controllers/postController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createPost);

router.get('/', protect, getAllPosts);

router.get('/:me', protect, getMyPosts);

export const postRouter =  router;