import express from "express";
import {
    updateAccount,
    updatePassword,
    updateProfile,
} from "../controller/userController";
import { verifyToken } from "../middleware";

const userRouter = express.Router();

userRouter.route("/profile/:userId").put(verifyToken, updateProfile);
userRouter.route("/account/:userId").put(verifyToken, updateAccount);
userRouter.route("/password/:userId").put(verifyToken, updatePassword);

export default userRouter;
