import { Request, Response } from "express";
import { oneMonthAgo } from "../utils/utils";
import Post from "../model/Post";
import User from "../model/User";
import Comment from "../model/Comment";

export const getOverview = async (req: Request, res: Response) => {
    try {
        const userTotal = await User.countDocuments();
        const lastMonthUserCount = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo() },
        });

        const postTotal = await Post.countDocuments();
        const lastMonthPostCount = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo() },
        });

        const commentTotal = await Comment.countDocuments();
        const lastMonthCommentCount = await Comment.countDocuments({
            createdAt: { $gte: oneMonthAgo() },
        });

        const data = {
            user: {
                total: userTotal,
                lastMonth: lastMonthUserCount,
            },
            post: {
                total: postTotal,
                lastMonth: lastMonthPostCount,
            },
            comment: {
                total: commentTotal,
                lastMonth: lastMonthCommentCount,
            },
        };

        res.status(200).json(data);
    } catch (error) {
        console.log("Error : ", error);
        return res.end();
    }
};
