import express from "express";
import {
    protectAdminUploadPost,
    verifyAdminforPost,
    verifyToken,
    verifyUserforPost,
} from "../middleware";
import {
    deleteCategory,
    deletePost,
    getCategory,
    getPosts,
    postCategory,
    postUpload,
    putPost,
} from "../controller/postController";

const postRouter = express.Router();

postRouter
    .route("/category")
    .get(verifyToken, getCategory)
    .post(verifyToken, postCategory)
    .delete(verifyToken, deleteCategory);

postRouter
    .route("/")
    .get(getPosts)
    .post(verifyToken, protectAdminUploadPost, postUpload);

postRouter
    .route("/:postId([0-9a-f]{24})")
    .put(verifyToken, verifyAdminforPost, verifyUserforPost, putPost)
    .delete(verifyToken, verifyAdminforPost, verifyUserforPost, deletePost);

export default postRouter;
