import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    // main user information
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    // default values for profile picture, bio, role and phone number
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    profilePicture: {
        type: [String],
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    bannerImage: {
        type: [String],
        default: "",
    },
    phoneNumber: {
        type: String,
        default: "",
    },
});
const User = mongoose.model('Users', userSchema);

export default User;