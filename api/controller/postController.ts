import { Request, Response } from "express";
import Category, { ICategory } from "../model/Category";

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
