import express from "express";
import { userTest } from "../controller/userController";

const userRouter = express.Router();

userRouter.route("/").get(userTest);

export default userRouter;
