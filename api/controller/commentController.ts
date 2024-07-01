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
