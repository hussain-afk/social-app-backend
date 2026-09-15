import postSchema from "../models/post.model.js";
import uploadContent from "../services/uploadContent.service.js";

export const createPost = async (req, res) => {
    const { caption, mediaType = 'image' } = req.body;
    const content = req.file
    const user = req.user; // Assuming the user is attached to the request object by the auth middleware
    // console.log(user);
    try {
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!caption) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        if (!content) {
            return res.status(400).json({ message: "Please provide content" });
        }
        const fileDataUri = `data:${content.mimetype};base64,${content.buffer.toString("base64")}`;
        const uploadedContent = await uploadContent(fileDataUri);
        const post = await postSchema.create({
            userId: user.id,
            content: uploadedContent,
            caption,
            mediaType,
        });
        return res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await postSchema.find().populate('userId', 'username email');
        return res.status(200).json( posts );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const addComment = async (req, res) => {
    try {
        const { postId } = req.params; // URL se post ki ID
        const { content } = req.body; 
        const userId = req.user.id; // Auth middleware se user ki ID

        // Post ko find kar ke comments array mein naya comment push karna
        const updatedPost = await postSchema.findByIdAndUpdate(
            postId,
            {
                $push: {
                    comments: {
                        userId: userId,
                        content: content,
                        createdAt: new Date() // Agar schema mein add kiya hai
                    }
                }
            },
            { new: true } // Ye option updated post wapas deta hai
        ).populate('comments.userId', 'username profilePicture'); // Optional: User ki details sath lane ke liye

        if (!updatedPost) {
            return res.status(404).json({ message: "Post nahi mili!" });
        }

        res.status(200).json( updatedPost);

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getAllUserPosts = async (req, res) => {
    // const user = req.user; // Assuming the user is attached to the request object by the auth middleware
    try {
        const userId = req.user.id; // URL se user ki ID
        // console.log(userId);
        const posts = await postSchema.find({ userId });
        return res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        // const user = req.user; 
        // if (!user) {
        //     return res.status(401).json({ message: "Unauthorized" });
        // }
        const deletedPost = await postSchema.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}