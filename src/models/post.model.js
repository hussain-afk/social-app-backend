import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', // Ya 'User' (singular name zyada behtar rehta hai)
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true, // Extra spaces remove karne ke liye
    },
    mediaType: { 
        type: String, 
        enum: ['image', 'video'], 
        default: 'image' 
    },
    caption: {
        type: String,
        default: "",
        trim: true,
    },
    // Likes ko Number ki jagah Array of User IDs rakhna zyada behtar hai
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    }],
    comments: {
        type: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users',
                required: true,
            },
            content: {
                type: String,
                required: true,
                trim: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            }
        }],
        default: [],
    },
}, {
    timestamps: true // Ye khud-ba-khud createdAt aur updatedAt add kar dega
});

const Post = mongoose.model('Posts', postSchema);

export default Post;