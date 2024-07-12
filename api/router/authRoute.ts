import express from "express";
import {
    githubLogin,
    githubLoginCallback,
    kakaoLogin,
    kakaoLoginCallback,
    logout,
    naverLogin,
    naverLoginCallback,
    postGoogle,
    postJoin,
    postLogin,
    putReissuePassword,
} from "../controller/authController";

const authRouter = express.Router();

authRouter.route("/join").post(postJoin);
authRouter.route("/login").post(postLogin);
authRouter.route("/reissue").put(putReissuePassword);

authRouter.route("/google").post(postGoogle);

authRouter.route("/github").get(githubLogin);
authRouter.route("/github/callback").post(githubLoginCallback);

authRouter.route("/kakao").get(kakaoLogin);
authRouter.route("/kakao/callback").post(kakaoLoginCallback);

authRouter.route("/naver").get(naverLogin);
authRouter.route("/naver/callback").post(naverLoginCallback);

authRouter.route("/logout").post(logout);

export default authRouter;
