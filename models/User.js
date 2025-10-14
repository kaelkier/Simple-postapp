import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true ,required: true },
    password: { type: String, required: true },
    avatar: { type: String }
});

export default mongoose.model('User', userSchema);
