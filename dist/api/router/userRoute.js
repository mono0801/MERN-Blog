"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const middleware_1 = require("../middleware");
const userRouter = express_1.default.Router();
userRouter
    .route("/profile/:userId([0-9a-f]{24})")
    .put(middleware_1.verifyToken, middleware_1.protectAccessUser, userController_1.updateProfile);
userRouter
    .route("/account/:userId([0-9a-f]{24})")
    .put(middleware_1.verifyToken, middleware_1.protectAccessUser, userController_1.updateAccount);
userRouter
    .route("/password/:userId([0-9a-f]{24})")
    .put(middleware_1.verifyToken, middleware_1.protectAccessUser, userController_1.updatePassword);
userRouter
    .route("/:userId([0-9a-f]{24})")
    .put(middleware_1.verifyToken, middleware_1.protectAccessUser, userController_1.updateUserfromAdmin)
    .delete(middleware_1.verifyToken, middleware_1.protectAccessUser, userController_1.deleteUser);
userRouter.route("/").get(middleware_1.verifyToken, middleware_1.verifyAdminforUser, userController_1.getUsers);
exports.default = userRouter;
