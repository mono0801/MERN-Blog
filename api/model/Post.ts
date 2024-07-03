import mongoose from "mongoose";

export interface IPost extends mongoose.Document {
    userId: mongoose.Schema.Types.ObjectId;
    title: string;
    category: string[];
    content: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    _doc?: any;
}

const postSchema = new mongoose.Schema<IPost>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        title: { type: String, required: true, unique: true },
        category: { type: [String], trim: true, default: ["UnCategorized"] },
        content: { type: String, required: true },
        image: {
            type: String,
            default:
                "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
        },
    },
    { timestamps: true }
);

const postModel = mongoose.model<IPost>("Post", postSchema);

export default postModel;
