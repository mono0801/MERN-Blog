import express from "express";
import {
    deleteUser,
    getUsers,
    updateAccount,
    updatePassword,
    updateProfile,
} from "../controller/userController";
import {
    protectAccessUser,
    verifyAdminforUser,
    verifyToken,
} from "../middleware";

const userRouter = express.Router();

userRouter
    .route("/profile/:userId([0-9a-f]{24})")
    .put(verifyToken, protectAccessUser, updateProfile);
userRouter
    .route("/account/:userId([0-9a-f]{24})")
    .put(verifyToken, protectAccessUser, updateAccount);
userRouter
    .route("/password/:userId([0-9a-f]{24})")
    .put(verifyToken, protectAccessUser, updatePassword);

userRouter
    .route("/:userId([0-9a-f]{24})")
    .delete(verifyToken, protectAccessUser, deleteUser);

userRouter.route("/").get(verifyToken, verifyAdminforUser, getUsers);

export default userRouter;
