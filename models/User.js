import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
        lowercase: true, 
        minlength: 3, 
        maxlength: 20,
    },
    name: { type: String, required: true },
    email: { type: String, unique: true ,required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    avatarPublicId: { type: String }
});

export default mongoose.model('User', userSchema);
