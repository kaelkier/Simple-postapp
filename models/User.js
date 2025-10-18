import mongoose from 'mongoose';
import validator from 'validator';

export const userSchema = new mongoose.Schema({
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/dgl06pqcl/image/upload/v1760713012/user_g2rplj.png'
    },
    avatarPublicId: {
        type: String,
        default: 'user_g2rplj'
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: 3,
        maxlength: 20,
        trim: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please enter a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        select: false,
        trim: true
    },
    bio: { type: String, maxlength: 150 }
}, { timestamps: true });

export default mongoose.model('User', userSchema);