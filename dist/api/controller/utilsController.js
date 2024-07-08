"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOverview = void 0;
const utils_1 = require("../utils/utils");
const Post_1 = __importDefault(require("../model/Post"));
const User_1 = __importDefault(require("../model/User"));
const Comment_1 = __importDefault(require("../model/Comment"));
const getOverview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userTotal = yield User_1.default.countDocuments();
        const lastMonthUserCount = yield User_1.default.countDocuments({
            createdAt: { $gte: (0, utils_1.oneMonthAgo)() },
        });
        const postTotal = yield Post_1.default.countDocuments();
        const lastMonthPostCount = yield Post_1.default.countDocuments({
            createdAt: { $gte: (0, utils_1.oneMonthAgo)() },
        });
        const commentTotal = yield Comment_1.default.countDocuments();
        const lastMonthCommentCount = yield Comment_1.default.countDocuments({
            createdAt: { $gte: (0, utils_1.oneMonthAgo)() },
        });
        const data = {
            user: {
                total: userTotal,
                lastMonth: lastMonthUserCount,
            },
            post: {
                total: postTotal,
                lastMonth: lastMonthPostCount,
            },
            comment: {
                total: commentTotal,
                lastMonth: lastMonthCommentCount,
            },
        };
        res.status(200).json(data);
    }
    catch (error) {
        return res.json("Something Problem is occured in Get Overview Data");
    }
});
exports.getOverview = getOverview;
