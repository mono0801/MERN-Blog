import express from "express";
import { postComment } from "../controller/commentController";
import { verifyToken, verifyUserComment } from "../middleware";

const commentRouter = express.Router();

commentRouter.route("/").post(verifyToken, verifyUserComment, postComment);

export default commentRouter;
