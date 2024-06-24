import express from "express";
import { verifyToken } from "../middleware";
import {
    deleteCategory,
    getCategory,
    postCategory,
} from "../controller/postController";

const postRouter = express.Router();

postRouter
    .route("/category")
    .get(verifyToken, getCategory)
    .post(verifyToken, postCategory)
    .delete(verifyToken, deleteCategory);

export default postRouter;
