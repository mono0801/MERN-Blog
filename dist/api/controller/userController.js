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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserfromAdmin = exports.getUsers = exports.deleteUser = exports.updatePassword = exports.updateAccount = exports.updateProfile = void 0;
const User_1 = __importDefault(require("../model/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("../utils/utils");
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.userId;
    const { profileUrl } = req.body;
    let updateUser;
    const user = yield User_1.default.findById(_id);
    if (!user) {
        return res.status(404).json("User Not Found");
    }
    updateUser = yield User_1.default.findByIdAndUpdate(_id, {
        profileUrl,
    }, { new: true });
    const _a = updateUser === null || updateUser === void 0 ? void 0 : updateUser._doc, { password } = _a, rest = __rest(_a, ["password"]);
    res.status(200).json(rest);
});
exports.updateProfile = updateProfile;
const updateAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.userId;
    const { nickname, email } = req.body;
    let updateUser;
    const user = yield User_1.default.findById(_id);
    if (!user) {
        return res.status(404).json("User Not Found");
    }
    if (nickname != user.nickname) {
        const nicknameExist = yield User_1.default.exists({ nickname });
        if (nicknameExist) {
            return res.status(401).json(`${nickname} is exist`);
        }
    }
    if (email != user.email) {
        const emailExist = yield User_1.default.exists({ email });
        if (emailExist) {
            return res.status(401).json(`${email} is exist`);
        }
    }
    updateUser = yield User_1.default.findByIdAndUpdate(_id, {
        nickname,
        email,
    }, { new: true });
    const _b = updateUser === null || updateUser === void 0 ? void 0 : updateUser._doc, { password } = _b, rest = __rest(_b, ["password"]);
    res.status(200).json(rest);
});
exports.updateAccount = updateAccount;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.userId;
    const { currentPassword, newPassword } = req.body;
    const user = yield User_1.default.findById(_id);
    if (!user) {
        return res.status(404).json("User Not Found");
    }
    const pwMatch = yield bcrypt_1.default.compare(currentPassword, user.password);
    if (!pwMatch) {
        return res.status(401).json("Please Enter your Password Correctly");
    }
    try {
        const pwMatch = yield bcrypt_1.default.compare(newPassword, user.password);
        if (pwMatch) {
            return res.status(401).json("The Password is Same");
        }
    }
    catch (err) {
        return res.json("Something Problem is occured in Update Password");
    }
    user.password = newPassword;
    yield user.save();
    const _c = user === null || user === void 0 ? void 0 : user._doc, { password } = _c, rest = __rest(_c, ["password"]);
    res.status(200).json(rest);
});
exports.updatePassword = updatePassword;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.userId;
    const user = yield User_1.default.findById(_id);
    if (!user) {
        return res.status(404).json("User Not Found");
    }
    try {
        yield User_1.default.findByIdAndDelete(_id);
        res.status(200).json("User Account is Deleted");
    }
    catch (error) {
        return res.json("Something Problem is occured in Delete User");
    }
});
exports.deleteUser = deleteUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const startIndex = Number(req.query.startIndex) || 0;
    const limit = Number(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    try {
        const users = yield User_1.default.find(Object.assign({}, (req.query.admin && {
            admin: { $ne: true },
        })))
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);
        const usersWithoutPassword = users.map((user) => {
            const _a = user._doc, { password } = _a, rest = __rest(_a, ["password"]);
            return rest;
        });
        const total = yield User_1.default.countDocuments();
        const lastMonthUserCount = yield User_1.default.countDocuments({
            createdAt: { $gte: (0, utils_1.oneMonthAgo)() },
        });
        res.status(200).json({
            users: usersWithoutPassword,
            total,
            lastMonthUserCount,
        });
    }
    catch (error) {
        return res.json("Something Problem is occured in Get User List");
    }
});
exports.getUsers = getUsers;
const existNickname = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const randomNickname = (0, utils_1.randomNicknameTag)((0, utils_1.randomNicknameTag)(name));
    const nickname = `A${randomNickname}`;
    let user = yield User_1.default.exists({ nickname });
    if (user) {
        existNickname(name);
    }
    return nickname;
});
const updateUserfromAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.userId;
    const { nickname, profile } = req.query;
    let updateUser;
    const user = yield User_1.default.findById(_id);
    if (!user) {
        return res.status(404).json("User Not Found");
    }
    const newNickname = yield existNickname("nonymous_");
    if (nickname) {
        updateUser = yield User_1.default.findByIdAndUpdate(_id, {
            nickname: newNickname,
        }, { new: true });
        return res.status(200).json("Nickname is Changed");
    }
    else if (profile) {
        updateUser = yield User_1.default.findByIdAndUpdate(_id, {
            profileUrl: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        }, { new: true });
        return res.status(200).json("Profile is Changed");
    }
    else {
        return res.status(400).json("Please fill The Query");
    }
});
exports.updateUserfromAdmin = updateUserfromAdmin;
