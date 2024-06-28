import { Request, Response } from "express";
import Category, { ICategory } from "../model/Category";
import Post, { IPost } from "../model/Post";
import { oneMonthAgo } from "../utils/utils";

export const getCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.find<ICategory>({});
        return res.status(200).json(category);
    } catch (error) {
        console.log("Error : ", error);
        return res.end();
    }
};

export const postCategory = async (req: Request, res: Response) => {
    const newCategory = req.body.category;

    const categoryList = new Category({
        category: newCategory,
    });
    await categoryList.save();

    try {
        const category = await Category.find<ICategory>({});
        return res.status(200).json(category);
    } catch (error) {
        console.log("Error : ", error);
        return res.end();
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    const selectCategory = req.body.category;

    try {
        await Category.deleteOne({ category: selectCategory });

        const category = await Category.find<ICategory>({});
        return res.status(200).json(category);
    } catch (error) {
        console.log("Error : ", error);
        return res.end();
    }
};

export const postUpload = async (req: Request, res: Response) => {
    const { title } = req.body;

    const existPost = await Post.findOne({ title });
    if (existPost) {
        return res.status(400).json({ message: `[${title}] is Already Exist` });
    }
    const newPost = new Post({
        ...req.body,
        userId: req.user?.id,
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json({
            message: "Upload Post is Successfully",
            post: savedPost,
        });
    } catch (error) {
        console.log("Error : ", error);
        return res.end();
    }
};

export const getPostList = async (req: Request, res: Response) => {
    const startIndex = Number(req.query.startIndex) || 0;
    const limit = Number(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    try {
        const postList = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.title && { title: req.query.title }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.keyword && {
                $or: [
                    { title: { $regex: req.query.keyword, $options: "i" } },
                    {
                        content: {
                            $regex: req.query.keyword,
                            $options: "i",
                        },
                    },
                ],
            }),
        })
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const total = await Post.countDocuments();
        const lastMonthPostCount = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo() },
        });

        res.status(200).json({
            postList,
            total,
            lastMonthPostCount,
        });
    } catch (error) {
        console.log("Error : ", error);
        return res.end();
    }
};