"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdminGetComments = exports.verifyAdminComment = exports.verifyUserComment = exports.verifyUserforPost = exports.verifyAdminforPost = exports.protectAdminUploadPost = exports.verifyAdminCategory = exports.verifyAdminforUser = exports.protectAccessUser = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json("Unauthorized");
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json("Unauthorized");
        }
        req.user = user;
        next();
    });
};
exports.verifyToken = verifyToken;
const protectAccessUser = (req, res, next) => {
    var _a, _b;
    const _id = req.params.userId;
    if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.admin) {
        next();
    }
    else if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) != _id) {
        return res.status(403).json("You're not Allowed to Access This User");
    }
    else {
        next();
    }
};
exports.protectAccessUser = protectAccessUser;
const verifyAdminforUser = (req, res, next) => {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.admin)) {
        return res.status(403).json("You're not Allowed to Access User");
    }
    next();
};
exports.verifyAdminforUser = verifyAdminforUser;
const verifyAdminCategory = (req, res, next) => {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.admin)) {
        return res.status(403).json("You're not Allowed to Access Category");
    }
    next();
};
exports.verifyAdminCategory = verifyAdminCategory;
const protectAdminUploadPost = (req, res, next) => {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.admin)) {
        return res.status(403).json("You're not Allowed to Access Post");
    }
    if (!req.body.title || !req.body.content) {
        return res.status(403).json("Please Provide All Required Fields");
    }
    next();
};
exports.protectAdminUploadPost = protectAdminUploadPost;
const verifyAdminforPost = (req, res, next) => {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.admin)) {
        return res.status(403).json("You're not Allowed to Access Post");
    }
    next();
};
exports.verifyAdminforPost = verifyAdminforPost;
const verifyUserforPost = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== req.body.userId) {
        return res.status(403).json("You're not Allowed to Access Post");
    }
    next();
};
exports.verifyUserforPost = verifyUserforPost;
const verifyUserComment = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== req.body.userId) {
        return res.status(403).json("You're not Allowed to Access Comment");
    }
    next();
};
exports.verifyUserComment = verifyUserComment;
const verifyAdminComment = (req, res, next) => {
    var _a, _b;
    if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.admin) {
        next();
    }
    else if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) !== req.body.userId) {
        return res.status(403).json("You're not Allowed to Access Comment");
    }
    else {
        next();
    }
};
exports.verifyAdminComment = verifyAdminComment;
const verifyAdminGetComments = (req, res, next) => {
    var _a, _b;
    if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.admin) {
        next();
    }
    else if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) !== req.query.userId) {
        return res.status(403).json("You're not Allowed to Access Comment");
    }
    else {
        next();
    }
};
exports.verifyAdminGetComments = verifyAdminGetComments;
