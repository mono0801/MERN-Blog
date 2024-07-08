import { Request, Response } from "express";
import Category, { ICategory } from "../model/Category";
import Post from "../model/Post";
import { oneMonthAgo } from "../utils/utils";

export const getCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.find<ICategory>({});
        return res.status(200).json(category);
    } catch (error) {
        return res.json("Something Problem is occured in Get Category List");
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
        return res.json("Something Problem is occured in Upload Category");
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    const selectCategory = req.body.category;

    try {
        await Category.deleteOne({ category: selectCategory });

        const category = await Category.find<ICategory>({});
        return res.status(200).json(category);
    } catch (error) {
        return res.json("Something Problem is occured in Delete Category");
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
        return res.json({
            message: "Something Problem is occured in Upload Post",
        });
    }
};

export const getPosts = async (req: Request, res: Response) => {
    const startIndex = Number(req.query.startIndex) || 0;
    const limit = Number(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

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
            .populate({
                path: "userId",
                select: [
                    "-password",
                    "-email",
                    "-admin",
                    "-socialLogin",
                    "-createdAt",
                    "-updatedAt",
                ],
            })
            .sort({ createdAt: sortDirection })
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
        return res.json("Something Problem is occured in Get Post List");
    }
};

export const deletePost = async (req: Request, res: Response) => {
    try {
        await Post.findByIdAndDelete(req.params.postId);
        return res.status(200).json(`${req.body.title} is Deleted`);
    } catch (error) {
        return res.json("Something Problem is occured in Delete Post");
    }
};

export const putPost = async (req: Request, res: Response) => {
    const _id = req.params.postId;
    const { title, category, content, image } = req.body;

    let post = await Post.findById(_id);
    if (!post) {
        return res.status(404).json({ message: `${_id} Not Found` });
    }
    try {
        post = await Post.findByIdAndUpdate(
            _id,
            {
                title: title ? title : post.title,
                category: category ? category : post.category,
                content: content ? content : post.content,
                image: image ? image : post.image,
            },
            { new: true }
        );

        return res
            .status(200)
            .json({ message: `[ ${req.body.title} ] is Updated`, post: post });
    } catch (error) {
        return res.json({
            message: "Something Problem is occured in Edit Post",
        });
    }
};
