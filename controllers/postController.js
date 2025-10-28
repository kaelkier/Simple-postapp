import Post from '../models/Post.js';
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';

export const createPost = async (req, res) => {
    try {
        const { content } = req.body;

        let imageUrl = null;
        let publicId = null;

        if (!content && !req.file) {
            return res.status(400).json({ message: 'Post must contain content or image'});
        }
        
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'image_posts',
            });

            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            imageUrl = result.secure_url;
            publicId = result.public_id;
        }
        
        const post = await Post.create({
            content,
            image: imageUrl,
            imagePublicId: publicId,
            user: req.user.id,
        });

        res.status(201).json({ message: 'Post successfully created', post });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create post', error: error.message });
    }
};

export const getAllPosts = async (req, res) => {
    try{
        const posts = await Post.find().populate( 'user', 'name username avatar').select('-imagePublicId');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get post', error: error.message });
    }
};

export const getMyPosts = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user.id }).select('-imagePublicId');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get user post', error: error.message });
    }
};

export const deleteMyPost = async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id, user: req.user.id });
        if(!post) {
            return res.status(404).json({ message: 'Post not found'});
        }

        if (post.imagePublicId) {
            await cloudinary.uploader.destroy(post.imagePublicId);
        }

        await post.deleteOne();

        res.status(200).json({ message: 'Post removed' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete post', error: error.message });
    }
};

