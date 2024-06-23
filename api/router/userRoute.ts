import express from "express";
import {
    deleteUser,
    updateAccount,
    updatePassword,
    updateProfile,
} from "../controller/userController";
import { protectAccessUser, verifyToken } from "../middleware";

const userRouter = express.Router();

userRouter
    .route("/profile/:userId")
    .put(verifyToken, protectAccessUser, updateProfile);
userRouter
    .route("/account/:userId")
    .put(verifyToken, protectAccessUser, updateAccount);
userRouter
    .route("/password/:userId")
    .put(verifyToken, protectAccessUser, updatePassword);
userRouter
    .route("/delete/:userId")
    .delete(verifyToken, protectAccessUser, deleteUser);

export default userRouter;
