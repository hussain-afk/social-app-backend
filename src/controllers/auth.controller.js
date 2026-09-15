import bcrypt from 'bcryptjs';
import UserSchema from '../models/user.model.js';
import generateToken from '../services/token.js';
import uploadContent from '../services/uploadContent.service.js';

export const registerUser = async (req, res) => {
    const { username, email, password, role = 'user' } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        // Additional logic for user registration can be added here
        const isExistingUser = await UserSchema.findOne({
            $or: [
                { username },
                { email }
            ],
        });
        if (isExistingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserSchema.create({
            username,
            email,
            role,
            password: hashedPassword,
        });
        const token = await generateToken(user);
        res.cookie("token", token,
            {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            }
        );
        return res.status(201).json({
            username: user.username,
            email: user.email,
            role: user.role,
            bio: user.bio,
            profilePicture: user.profilePicture,
            _id: user._id,
            phoneNumber: user.phoneNumber,
            bannerImage: user.bannerImage
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        // Additional logic for user login can be added here
        const isUserValid = await UserSchema.findOne({ username });
        if (!isUserValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, isUserValid.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = await generateToken(isUserValid);
        res.cookie("token", token,
            // {
            //     httpOnly: true,
            //     secure: true,
            //     sameSite: 'none'
            // }
        );

        return res.status(201).json({
            username: isUserValid.username,
            email: isUserValid.email,
            role: isUserValid.role,
            bio: isUserValid.bio,
            profilePicture: isUserValid.profilePicture,
            _id: isUserValid._id,
            phoneNumber: isUserValid.phoneNumber,
            bannerImage: isUserValid.bannerImage
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        const user = req.user;
        // findOneById ki jagah findById use karein aur .select('-password') se password hata dein
        const currentUser = await UserSchema.findById(user.id).select('-password');

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(currentUser);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Auth middleware se user ki ID
        const { username, email, bio, phoneNumber, password } = req.body;
        // console.log("Request Body:", req.body);
        // console.log("Request Files:", req.files);

        const profilePicture = req.files && req.files['profilePicture'] ? req.files['profilePicture'][0] : null;
        const bannerImage = req.files && req.files['bannerImage'] ? req.files['bannerImage'][0] : null;
        console.log("Profile Picture:", profilePicture);
        console.log("Banner Image:", bannerImage);
        const base64ProfilePicture = profilePicture ? profilePicture.buffer.toString('base64') : null;
        const base64BannerImage = bannerImage ? bannerImage.buffer.toString('base64') : null;
        const uploadedProfilePicture = profilePicture ? await uploadContent(base64ProfilePicture) : null;
        const uploadedBannerImage = bannerImage ? await uploadContent(base64BannerImage) : null;
        const updatedUser = await UserSchema.findByIdAndUpdate(userId, {
            username,
            email,
            password,
            bio,
            profilePicture: uploadedProfilePicture,
            bannerImage: uploadedBannerImage,
            phoneNumber
        }, { returnDocument: 'after' });
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};