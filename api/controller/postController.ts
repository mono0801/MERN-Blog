import { Request, Response } from "express";
import Category, { ICategory } from "../model/Category";
import Post from "../model/Post";

export const getCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.find<ICategory>({});
        return res.status(200).json(category);
    } catch (error) {
        console.log("Error : ", error);
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
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    const selectCategory = req.body.category;

    const result = await Category.deleteOne({ category: selectCategory });
    console.log(result);

    try {
        const category = await Category.find<ICategory>({});
        return res.status(200).json(category);
    } catch (error) {
        console.log("Error : ", error);
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
    }
};
