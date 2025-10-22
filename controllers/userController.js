import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';
import bcrypt from 'bcrypt';

const defaultAvatar = 'https://res.cloudinary.com/dgl06pqcl/image/upload/v1760942622/default-avatar_ugaeii.jpg';
const defaultAvatarPublicId = 'default-avatar_ugaeii';

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const registerUser = async (req, res) => {
    try {
        const { username, name, email, password } = req.body;

        if (!username || !name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'User with this email already exists'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ username, name, email, password: hashPassword });

        res.status(201).json({
            message: 'Registration successful',
            user: { 
                id: newUser._id, 
                username: newUser.username, 
                name: newUser.name, 
                email: newUser.email 
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration', error: error.message});
    }
};

export const loginUser = async (req, res) => {
    try{ 
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email }).select('+password');
        if(!user) {
            return res.status(401).json({ message: 'Invalid email or password'});
        }

        const isMatchPw = await bcrypt.compare(password, user.password)
        if(!isMatchPw) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = generateToken(user._id);

        res.json({
            message: 'Login successful',
            token,
            user: {id: user._id, name: user.name, email: user.email},
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id || req.user?.id;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const OwnProfile = req.user && req.user.id === userId;

        const selectField = OwnProfile
            ? '-avatarPublicId'
            : '-email -avatarPublicId';

        const user = await User.findById(userId).select(selectField);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
        return res.status(400).json({ message: 'User not found' });
        }

        const { name, email, password } = req.body;

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password;

        if (user.avatarPublicId && user.avatarPublicId !== defaultAvatarPublicId) {
            await cloudinary.uploader.destroy(user.avatarPublicId);
        }

        if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "user_avatars",
        });

        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        user.avatar = result.secure_url;
        user.avatarPublicId = result.public_id;
        };

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error('Update profile error', error.response?.body || error);
        return res.status(500).json({ message: 'Server error during profile update', error: error.message || error.toString });
    }
};

export const searchUser = async (req, res) => {
    try {
        const query = req.query.q || '';
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i'}},
                { name: { $regex: query, $options: 'i'}},
            ]
        }).select('-email -avatarPublicId');
        res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Cannot find user', error: error.message });
    }
};

export const deleteAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.avatarPublicId) {
            await cloudinary.uploader.destroy(user.avatarPublicId);
        }

        user.avatar = defaultAvatar;
        user.avatarPublicId = defaultAvatarPublicId;

        await user.save();

        res.status(200).json({ message: 'Avatar delete successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed delete avatar', error: error.message });
    }
};