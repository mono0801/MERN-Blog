import express from "express";
import { postGoogle, postJoin, postLogin } from "../controller/authController";

const authRouter = express.Router();

authRouter.route("/join").post(postJoin);
authRouter.route("/login").post(postLogin);
authRouter.route("/google").post(postGoogle);

export default authRouter;
