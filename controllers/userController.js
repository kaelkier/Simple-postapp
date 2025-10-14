import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'semua field wajib diisi!' });
        };

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email sudah terdaftar!'});
        };

        const newUser = await User.create({ name, email, password });

        res.status(201).json({
            message: 'Registrasi Berhasil',
            user: { id: newUser._id, name: newUser.name, email: newUser.email },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error saat registrasi', error: error.message});
    }
};

export const loginUser = async (req, res) => {
    try{ 
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: 'Email dan Password wajib diisi' });
        };

        const user = await User.findOne({ email });
        if(!user || user.password !== password) {
            return res.status(401).json({ message: 'Email dan Password salah!'});
        };

        const token = generateToken(user._id);

        res.json({
            message: 'Login berhasil',
            token,
            user: {id: user._id, name: user.name, email: user.email},
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error saat login', error: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Error saat ambil profile', error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
        return res.status(400).json({ message: 'User tidak ditemukan' });
        }

        const { name, email, password } = req.body;

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password;

        if (req.file) {

        if (user.avatar && fs.existsSync(path.join('uploads', user.avatar))) {
            fs.unlinkSync(path.join('uploads', user.avatar));
        }
        user.avatar = req.file.filename;
        }

        await user.save();

        const fullAvatarUrl = user.avatar
        ? `${req.protocol}://${req.get('host')}/uploads/${user.avatar}`
        : null;

        res.json({
        message: 'Profil berhasil di update',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: fullAvatarUrl,
        },
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
