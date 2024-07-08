import { Request, Response } from "express";
import Comment from "../model/Comment";
import { oneMonthAgo } from "../utils/utils";

export const postComment = async (req: Request, res: Response) => {
    const { content, postId, userId } = req.body;

    try {
        const newComment = new Comment({
            userId,
            postId,
            content,
        });

        await newComment.save();

        return res.status(201).json(newComment);
    } catch (err) {
        return res.json("Something Problem is occured in Comment Upload");
    }
};

export const getPostComments = async (req: Request, res: Response) => {
    try {
        const comments = await Comment.find({
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
    } catch (err) {
        return res.json("Something Problem is occured in Get Comment");
    }
};

export const getDashBoardComments = async (req: Request, res: Response) => {
    const startIndex = Number(req.query.startIndex) || 0;
    const limit = Number(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    try {
        const comments = await Comment.find({
            ...(req.query.userId && { userId: req.query.userId }),
        })
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

        const total = await Comment.countDocuments();
        const lastMonthCommentsCount = await Comment.countDocuments({
            createdAt: { $gte: oneMonthAgo() },
        });

        return res.status(200).json({
            comments,
            total,
            lastMonthCommentsCount,
        });
    } catch (err) {
        return res.json("Something Problem is occured in Get Comment List");
    }
};

export const putCommentLike = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json("Comment not Found");
        }

        const likeIndex = comment.likes.findIndex((id) => id === userId);

        if (likeIndex == -1) {
            comment.likes.push(userId!);
            comment.likesCount += 1;
        } else {
            comment.likes.splice(likeIndex, 1);
            comment.likesCount -= 1;
        }
        await comment.save();

        return res.status(200).json(comment);
    } catch (err) {
        return res.json("Something Problem is occured in Edit Comment");
    }
};

export const putComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json("Comment not Found");
        }

        const newComment = await Comment.findByIdAndUpdate(
            commentId,
            {
                content: req.body.content,
            },
            { new: true }
        );
        return res.status(201).json(newComment);
    } catch (err) {
        return res.json("Something Problem is occured in Edit Comment Like");
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json("Comment not Found");
        }

        await Comment.findByIdAndDelete(commentId);
        return res.status(200).json("Delete Comment is Successfully");
    } catch (err) {
        return res.json("Something Problem is occured in Delete Comment");
    }
};
