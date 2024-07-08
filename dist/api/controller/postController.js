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
exports.putPost = exports.deletePost = exports.getPosts = exports.postUpload = exports.deleteCategory = exports.postCategory = exports.getCategory = void 0;
const Category_1 = __importDefault(require("../model/Category"));
const Post_1 = __importDefault(require("../model/Post"));
const utils_1 = require("../utils/utils");
const getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield Category_1.default.find({});
        return res.status(200).json(category);
    }
    catch (error) {
        return res.json("Something Problem is occured in Get Category List");
    }
});
exports.getCategory = getCategory;
const postCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newCategory = req.body.category;
    const categoryList = new Category_1.default({
        category: newCategory,
    });
    yield categoryList.save();
    try {
        const category = yield Category_1.default.find({});
        return res.status(200).json(category);
    }
    catch (error) {
        return res.json("Something Problem is occured in Upload Category");
    }
});
exports.postCategory = postCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const selectCategory = req.body.category;
    try {
        yield Category_1.default.deleteOne({ category: selectCategory });
        const category = yield Category_1.default.find({});
        return res.status(200).json(category);
    }
    catch (error) {
        return res.json("Something Problem is occured in Delete Category");
    }
});
exports.deleteCategory = deleteCategory;
const postUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title } = req.body;
    const existPost = yield Post_1.default.findOne({ title });
    if (existPost) {
        return res.status(400).json({ message: `[${title}] is Already Exist` });
    }
    const newPost = new Post_1.default(Object.assign(Object.assign({}, req.body), { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }));
    try {
        const savedPost = yield newPost.save();
        res.status(201).json({
            message: "Upload Post is Successfully",
            post: savedPost,
        });
    }
    catch (error) {
        return res.json({
            message: "Something Problem is occured in Upload Post",
        });
    }
});
exports.postUpload = postUpload;
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const startIndex = Number(req.query.startIndex) || 0;
    const limit = Number(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    try {
        const postList = yield Post_1.default.find(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (req.query.userId && { userId: req.query.userId })), (req.query.category && { category: req.query.category })), (req.query.title && { title: req.query.title })), (req.query.postId && { _id: req.query.postId })), (req.query.keyword && {
            $or: [
                { title: { $regex: req.query.keyword, $options: "i" } },
                {
                    content: {
                        $regex: req.query.keyword,
                        $options: "i",
                    },
                },
            ],
        })))
            .populate({
            path: "userId",
            select: [
                "-password",
                "-email",
                "-admin",
                "-socialLogin",
                "-createdAt",
                "-updatedAt",
            ],
        })
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);
        const total = yield Post_1.default.countDocuments();
        const lastMonthPostCount = yield Post_1.default.countDocuments({
            createdAt: { $gte: (0, utils_1.oneMonthAgo)() },
        });
        res.status(200).json({
            postList,
            total,
            lastMonthPostCount,
        });
    }
    catch (error) {
        return res.json("Something Problem is occured in Get Post List");
    }
});
exports.getPosts = getPosts;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Post_1.default.findByIdAndDelete(req.params.postId);
        return res.status(200).json(`${req.body.title} is Deleted`);
    }
    catch (error) {
        return res.json("Something Problem is occured in Delete Post");
    }
});
exports.deletePost = deletePost;
const putPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.postId;
    const { title, category, content, image } = req.body;
    let post = yield Post_1.default.findById(_id);
    if (!post) {
        return res.status(404).json({ message: `${_id} Not Found` });
    }
    try {
        post = yield Post_1.default.findByIdAndUpdate(_id, {
            title: title ? title : post.title,
            category: category ? category : post.category,
            content: content ? content : post.content,
            image: image ? image : post.image,
        }, { new: true });
        return res
            .status(200)
            .json({ message: `[ ${req.body.title} ] is Updated`, post: post });
    }
    catch (error) {
        return res.json({
            message: "Something Problem is occured in Edit Post",
        });
    }
});
exports.putPost = putPost;
