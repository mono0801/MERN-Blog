"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.putComment = exports.putCommentLike = exports.getDashBoardComments = exports.getPostComments = exports.postComment = void 0;
const Comment_1 = __importDefault(require("../model/Comment"));
const utils_1 = require("../utils/utils");
const postComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, postId, userId } = req.body;
    try {
        const newComment = new Comment_1.default({
            userId,
            postId,
            content,
        });
        yield newComment.save();
        return res.status(201).json(newComment);
    }
    catch (err) {
        return res.json("Something Problem is occured in Comment Upload");
    }
});
exports.postComment = postComment;
const getPostComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield Comment_1.default.find({
            postId: req.params.postId,
        })
            .sort({ createdAt: -1 })
            .populate({
            path: "userId",
            select: [
                "-password",
                "-admin",
                "-socialLogin",
                "-createdAt",
                "-updatedAt",
            ],
        });
        return res.status(200).json(comments);
    }
    catch (err) {
        return res.json("Something Problem is occured in Get Comment");
    }
});
exports.getPostComments = getPostComments;
const getDashBoardComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const startIndex = Number(req.query.startIndex) || 0;
    const limit = Number(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    try {
        const comments = yield Comment_1.default.find(Object.assign({}, (req.query.userId && { userId: req.query.userId })))
            .sort({ createdAt: sortDirection })
            .populate([
            {
                path: "userId",
                select: [
                    "-email",
                    "-password",
                    "-admin",
                    "-socialLogin",
                    "-createdAt",
                    "-updatedAt",
                ],
            },
            {
                path: "postId",
                select: [
                    "-userId",
                    "-category",
                    "-content",
                    "-image",
                    "-createdAt",
                    "-updatedAt",
                ],
            },
        ])
            .skip(startIndex)
            .limit(limit);
        const total = yield Comment_1.default.countDocuments();
        const lastMonthCommentsCount = yield Comment_1.default.countDocuments({
            createdAt: { $gte: (0, utils_1.oneMonthAgo)() },
        });
        return res.status(200).json({
            comments,
            total,
            lastMonthCommentsCount,
        });
    }
    catch (err) {
        return res.json("Something Problem is occured in Get Comment List");
    }
});
exports.getDashBoardComments = getDashBoardComments;
const putCommentLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const comment = yield Comment_1.default.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json("Comment not Found");
        }
        const likeIndex = comment.likes.findIndex((id) => id === userId);
        if (likeIndex == -1) {
            comment.likes.push(userId);
            comment.likesCount += 1;
        }
        else {
            comment.likes.splice(likeIndex, 1);
            comment.likesCount -= 1;
        }
        yield comment.save();
        return res.status(200).json(comment);
    }
    catch (err) {
        return res.json("Something Problem is occured in Edit Comment");
    }
});
exports.putCommentLike = putCommentLike;
const putComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    try {
        const comment = yield Comment_1.default.findById(commentId);
        if (!comment) {
            return res.status(404).json("Comment not Found");
        }
        const newComment = yield Comment_1.default.findByIdAndUpdate(commentId, {
            content: req.body.content,
        }, { new: true });
        return res.status(201).json(newComment);
    }
    catch (err) {
        return res.json("Something Problem is occured in Edit Comment Like");
    }
});
exports.putComment = putComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    try {
        const comment = yield Comment_1.default.findById(commentId);
        if (!comment) {
            return res.status(404).json("Comment not Found");
        }
        yield Comment_1.default.findByIdAndDelete(commentId);
        return res.status(200).json("Delete Comment is Successfully");
    }
    catch (err) {
        return res.json("Something Problem is occured in Delete Comment");
    }
});
exports.deleteComment = deleteComment;
