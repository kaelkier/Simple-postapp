import mongoose from 'mongoose';

export const postSchema = new mongoose.Schema({
    content: { type: String },
    image: { type: String },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

export default mongoose.model('Post', postSchema);