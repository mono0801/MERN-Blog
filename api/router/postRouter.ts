import express from "express";
import {
    protectAdminUpload,
    verifyAdmin,
    verifyToken,
    verifyUser,
} from "../middleware";
import {
    deleteCategory,
    deletePost,
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

postRouter
    .route("/:postId([0-9a-f]{24})")
    .delete(verifyToken, verifyAdmin, verifyUser, deletePost);

export default postRouter;
