import mongoose from "mongoose";

export interface IComment extends mongoose.Document {
    userId: mongoose.Schema.Types.ObjectId;
    postId: mongoose.Schema.Types.ObjectId;
    content: string;
    likes: string[];
    likesCount: number;
    createdAt: Date;
    updatedAt: Date;
    _doc?: any;
}

const commentSchema = new mongoose.Schema<IComment>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Post",
        },
        content: { type: String, required: true },
        likes: {
            type: [String],
            default: [],
        },
        likesCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const commentModel = mongoose.model<IComment>("Comment", commentSchema);

export default commentModel;
