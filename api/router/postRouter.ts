import express from "express";
import { protectAdminUpload, verifyToken } from "../middleware";
import {
    deleteCategory,
    getCategory,
    getPostList,
    postCategory,
    postUpload,
} from "../controller/postController";

const postRouter = express.Router();

postRouter
    .route("/category")
    .get(verifyToken, getCategory)
    .post(verifyToken, postCategory)
    .delete(verifyToken, deleteCategory);

postRouter.route("/list").get(getPostList);

postRouter.route("/upload").post(verifyToken, protectAdminUpload, postUpload);

export default postRouter;