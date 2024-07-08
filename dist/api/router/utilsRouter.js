"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utilsController_1 = require("../controller/utilsController");
const middleware_1 = require("../middleware");
const utilsRouter = express_1.default.Router();
utilsRouter.route("/overview").get(middleware_1.verifyToken, utilsController_1.getOverview);
exports.default = utilsRouter;
