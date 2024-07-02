import { Request, Response } from "express";
import Comment from "../model/Comment";

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
        console.log(err);
        return res.end();
    }
};

export const getComments = async (req: Request, res: Response) => {
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
        console.log(err);
        return res.end();
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
        console.log(err);
        return res.end();
    }
};
