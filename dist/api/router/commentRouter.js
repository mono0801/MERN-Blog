"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controller/commentController");
const middleware_1 = require("../middleware");
const commentRouter = express_1.default.Router();
commentRouter
    .route("/")
    .get(middleware_1.verifyToken, middleware_1.verifyAdminGetComments, commentController_1.getDashBoardComments)
    .post(middleware_1.verifyToken, middleware_1.verifyUserComment, commentController_1.postComment);
commentRouter
    .route("/like/:commentId([0-9a-f]{24})")
    .put(middleware_1.verifyToken, commentController_1.putCommentLike);
commentRouter
    .route("/edit/:commentId([0-9a-f]{24})/")
    .put(middleware_1.verifyToken, middleware_1.verifyAdminComment, commentController_1.putComment)
    .delete(middleware_1.verifyToken, middleware_1.verifyAdminComment, commentController_1.deleteComment);
commentRouter.route("/:postId([0-9a-f]{24})").get(commentController_1.getPostComments);
exports.default = commentRouter;
