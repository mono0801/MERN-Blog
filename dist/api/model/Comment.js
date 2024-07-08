"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    postId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "Post",
    },
    content: { type: String, required: true },
    likes: {
        type: [String],
        default: [],
    },
    likesCount: { type: Number, default: 0 },
}, { timestamps: true });
const commentModel = mongoose_1.default.model("Comment", commentSchema);
exports.default = commentModel;
