import Post from '../models/Post.js';

export const createPost = async (req, res) => {
    try {
        const { content, image} = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required'});
        }

        const post = await Post.create({
            content,
            image,
            user: req.user.id,
        });

        res.status(200).json({ message: 'Post successfully created', post });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create post', error: error.message });
    }
};

export const getAllPosts = async (req, res) => {
    try{
        const posts = await Post.find().populate( 'user', 'name email avatar');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get post', error: error.message });
    }
};

export const getMyPosts = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user.id });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get user post', error: error.message });
    }
};

