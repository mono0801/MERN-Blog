import express from "express";
import {
    deleteComment,
    getDashBoardComments,
    getPostComments,
    postComment,
    putComment,
    putCommentLike,
} from "../controller/commentController";
import {
    verifyAdminComment,
    verifyAdminGetComments,
    verifyToken,
    verifyUserComment,
} from "../middleware";

const commentRouter = express.Router();

commentRouter
    .route("/")
    .get(verifyToken, verifyAdminGetComments, getDashBoardComments)
    .post(verifyToken, verifyUserComment, postComment);

commentRouter
    .route("/like/:commentId([0-9a-f]{24})")
    .put(verifyToken, putCommentLike);

commentRouter
    .route("/edit/:commentId([0-9a-f]{24})/")
    .put(verifyToken, verifyAdminComment, putComment)
    .delete(verifyToken, verifyAdminComment, deleteComment);

commentRouter.route("/:postId([0-9a-f]{24})").get(getPostComments);

export default commentRouter;
