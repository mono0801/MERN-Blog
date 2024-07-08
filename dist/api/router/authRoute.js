"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controller/authController");
const authRouter = express_1.default.Router();
authRouter.route("/join").post(authController_1.postJoin);
authRouter.route("/login").post(authController_1.postLogin);
authRouter.route("/google").post(authController_1.postGoogle);
authRouter.route("/github").get(authController_1.githubLogin);
authRouter.route("/github/callback").post(authController_1.githubLoginCallback);
authRouter.route("/kakao").get(authController_1.kakaoLogin);
authRouter.route("/kakao/callback").post(authController_1.kakaoLoginCallback);
authRouter.route("/naver").get(authController_1.naverLogin);
authRouter.route("/naver/callback").post(authController_1.naverLoginCallback);
authRouter.route("/logout").post(authController_1.logout);
exports.default = authRouter;
