"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const postController_1 = require("../controller/postController");
const postRouter = express_1.default.Router();
postRouter
    .route("/category")
    .get(postController_1.getCategory)
    .post(middleware_1.verifyToken, middleware_1.verifyAdminCategory, postController_1.postCategory)
    .delete(middleware_1.verifyToken, middleware_1.verifyAdminCategory, postController_1.deleteCategory);
postRouter
    .route("/")
    .get(postController_1.getPosts)
    .post(middleware_1.verifyToken, middleware_1.protectAdminUploadPost, postController_1.postUpload);
postRouter
    .route("/:postId([0-9a-f]{24})")
    .put(middleware_1.verifyToken, middleware_1.verifyAdminforPost, middleware_1.verifyUserforPost, postController_1.putPost)
    .delete(middleware_1.verifyToken, middleware_1.verifyAdminforPost, middleware_1.verifyUserforPost, postController_1.deletePost);
exports.default = postRouter;
