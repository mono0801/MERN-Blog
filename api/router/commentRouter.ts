import express from "express";
import {
    getComments,
    postComment,
    putComment,
    putCommentLike,
} from "../controller/commentController";
import {
    verifyAdminComment,
    verifyToken,
    verifyUserComment,
} from "../middleware";

const commentRouter = express.Router();

commentRouter.route("/").post(verifyToken, verifyUserComment, postComment);
commentRouter
    .route("/like/:commentId([0-9a-f]{24})")
    .put(verifyToken, putCommentLike);
commentRouter
    .route("/edit/:commentId([0-9a-f]{24})/")
    .put(verifyToken, verifyAdminComment, putComment);
commentRouter.route("/:postId([0-9a-f]{24})").get(getComments);

export default commentRouter;
