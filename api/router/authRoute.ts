import express from "express";
import { postJoin, postLogin } from "../controller/authController";

const authRouter = express.Router();

authRouter.route("/join").post(postJoin);
authRouter.route("/login").post(postLogin);

export default authRouter;
