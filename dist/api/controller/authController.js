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
exports.logout = exports.naverLoginCallback = exports.naverLogin = exports.kakaoLoginCallback = exports.kakaoLogin = exports.githubLoginCallback = exports.githubLogin = exports.postGoogle = exports.postLogin = exports.postJoin = void 0;
const User_1 = __importDefault(require("../model/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../utils/utils");
const postJoin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { nickname, email, password } = req.body;
    if (!email || !nickname || nickname == "" || email == "") {
        return res.status(400).json({ message: "All Fields are Required" });
    }
    try {
        const nicknameExist = yield User_1.default.exists({ nickname });
        if (nicknameExist) {
            return res.status(400).json({
                message: "Nickname is Exist",
            });
        }
    }
    catch (err) {
        next(err);
    }
    try {
        const emailExist = yield User_1.default.exists({ email });
        if (emailExist) {
            return res.status(400).json({
                message: "E-mail is Exist",
            });
        }
    }
    catch (err) {
        next(err);
    }
    const newUser = new User_1.default({
        nickname,
        email,
        password,
    });
    try {
        yield newUser.save();
        return res.json({ message: "Join is Successful" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.postJoin = postJoin;
const postLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const validUser = yield User_1.default.findOne({
            email,
            socialLogin: false,
        });
        if (!validUser) {
            return res.status(404).json({ message: "User Not Found" });
        }
        const validPassword = yield bcrypt_1.default.compare(password, validUser.password);
        if (!validPassword) {
            return res.status(404).json({ message: "Invalid Password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: validUser._id, admin: validUser.admin }, process.env.JWT_SECRET);
        // Convert mongoose Object to JS Object
        // & Hide password
        const _a = validUser._doc, { password: pass } = _a, rest = __rest(_a, ["password"]);
        return res
            .status(200)
            .cookie("access_token", token, { httpOnly: true })
            .json(rest);
    }
    catch (error) {
        next(error);
    }
});
exports.postLogin = postLogin;
const postGoogle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { nickname, email, profileUrl } = req.body;
    try {
        let user = yield User_1.default.findOne({ email });
        if (!user) {
            user = new User_1.default({
                nickname: (0, utils_1.randomNicknameTag)(nickname),
                email,
                password: (0, utils_1.randomPassword)(),
                socialLogin: true,
                profileUrl,
            });
            yield user.save();
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, admin: user.admin }, process.env.JWT_SECRET);
        const _b = user._doc, { password: pass } = _b, rest = __rest(_b, ["password"]);
        return res
            .status(200)
            .cookie("access_token", token, { httpOnly: true })
            .json(rest);
    }
    catch (error) {
        next(error);
    }
});
exports.postGoogle = postGoogle;
const githubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GITHUB_CLIENT_ID,
        allow_signup: false,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(Object.entries(config).map(([key, value]) => [key, String(value)])).toString();
    const githubUrl = `${baseUrl}?${params}`;
    return res.json(githubUrl);
};
exports.githubLogin = githubLogin;
const existNickname = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const nickname = (0, utils_1.randomNicknameTag)(name);
    let user = yield User_1.default.exists({ nickname });
    if (user) {
        existNickname(name);
    }
    return nickname;
});
const githubLoginCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: req.body.code,
    };
    const params = new URLSearchParams(config).toString();
    const githubUrl = `${baseUrl}?${params}`;
    const tokenReq = yield (yield fetch(githubUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
    })).json();
    if ("access_token" in tokenReq) {
        const baseUrl = "https://api.github.com";
        const { access_token } = tokenReq;
        const userData = yield (yield fetch(`${baseUrl}/user`, {
            headers: {
                Authorization: `token ${access_token}`,
            },
        })).json();
        const emailData = yield (yield fetch(`${baseUrl}/user/emails`, {
            headers: {
                Authorization: `token ${access_token}`,
            },
        })).json();
        const emailObj = emailData.find((email) => email.primary == true && email.verified == true);
        if (!emailObj) {
            return res.json("E-mail is not Exist");
        }
        let user = yield User_1.default.findOne({ email: emailObj.email });
        if (!user) {
            const name = userData.name ? userData.name : userData.login;
            const nickname = yield existNickname(name);
            user = yield User_1.default.create({
                nickname,
                email: emailObj.email,
                password: (0, utils_1.randomPassword)(),
                socialLogin: true,
                profileUrl: userData.avatar_url,
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, admin: user.admin }, process.env.JWT_SECRET);
        const _c = user._doc, { password: pass } = _c, rest = __rest(_c, ["password"]);
        return res
            .status(200)
            .cookie("access_token", token, { httpOnly: true })
            .json(rest);
    }
    else {
        return res.json({
            message: "Something Problem is occured in Github Login",
        });
    }
});
exports.githubLoginCallback = githubLoginCallback;
const kakaoLogin = (req, res) => {
    const baseUrl = "https://kauth.kakao.com/oauth/authorize";
    const config = {
        client_id: process.env.KAKAOTALK_CLIENT_ID,
        redirect_uri: process.env.KAKAOTALK_REDIRECT_URL,
        response_type: "code",
        scope: "account_email,profile_nickname,profile_image,name",
    };
    const params = new URLSearchParams(config).toString();
    const kakaotalkUrl = `${baseUrl}?${params}`;
    return res.json(kakaotalkUrl);
};
exports.kakaoLogin = kakaoLogin;
const kakaoLoginCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const baseUrl = "https://kauth.kakao.com/oauth/token";
    const config = {
        client_id: process.env.KAKAOTALK_CLIENT_ID,
        grant_type: "authorization_code",
        code: req.body.code,
    };
    const params = new URLSearchParams(config).toString();
    const kakaotalkUrl = `${baseUrl}?${params}`;
    const tokenReq = yield (yield fetch(kakaotalkUrl, {
        method: "POST",
    })).json();
    if ("access_token" in tokenReq) {
        const baseUrl = "https://kapi.kakao.com/v2/user/me";
        const { access_token } = tokenReq;
        const userData = yield (yield fetch(baseUrl, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })).json();
        const { kakao_account } = userData;
        let user = yield User_1.default.findOne({ email: kakao_account.email });
        if (!user) {
            const name = kakao_account.profile.nickname
                ? kakao_account.profile.nickname
                : kakao_account.name;
            const nickname = yield existNickname(name);
            user = yield User_1.default.create({
                nickname,
                email: kakao_account.email,
                password: (0, utils_1.randomPassword)(),
                socialLogin: true,
                profileUrl: kakao_account.profile.profile_image_url,
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, admin: user.admin }, process.env.JWT_SECRET);
        const _d = user._doc, { password: pass } = _d, rest = __rest(_d, ["password"]);
        return res
            .status(200)
            .cookie("access_token", token, { httpOnly: true })
            .json(rest);
    }
    else {
        res.json({ message: "Something Problem is occured in Kakao Login" });
    }
});
exports.kakaoLoginCallback = kakaoLoginCallback;
const naverLogin = (req, res) => {
    const baseUrl = "https://nid.naver.com/oauth2.0/authorize";
    const config = {
        client_id: process.env.NAVER_CLIENT_ID,
        redirect_uri: process.env.NAVER_REDIRECT_URL,
        response_type: "code",
        state: (0, utils_1.randomPassword)(),
    };
    const params = new URLSearchParams(Object.entries(config).map(([key, value]) => [key, String(value)])).toString();
    const naverUrl = `${baseUrl}?${params}`;
    return res.json(naverUrl);
};
exports.naverLogin = naverLogin;
const naverLoginCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const baseUrl = "https://nid.naver.com/oauth2.0/token";
    const config = {
        client_id: process.env.NAVER_CLIENT_ID,
        client_secret: process.env.NAVER_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: req.body.code,
        state: req.body.state,
    };
    const params = new URLSearchParams(config).toString();
    const naverUrl = `${baseUrl}?${params}`;
    const tokenReq = yield (yield fetch(naverUrl, {
        method: "POST",
    })).json();
    if ("access_token" in tokenReq) {
        const baseUrl = "https://openapi.naver.com/v1/nid/me";
        const { access_token } = tokenReq;
        const userData = yield (yield fetch(baseUrl, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })).json();
        const naver_account = userData.response;
        let user = yield User_1.default.findOne({ email: naver_account.email });
        if (!user) {
            const name = naver_account.nickname
                ? naver_account.nickname
                : naver_account.name;
            const nickname = yield existNickname(name);
            user = yield User_1.default.create({
                email: naver_account.email,
                nickname,
                password: utils_1.randomPassword,
                socialLogin: true,
                profileUrl: naver_account.profile_image,
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, admin: user.admin }, process.env.JWT_SECRET);
        const _e = user._doc, { password: pass } = _e, rest = __rest(_e, ["password"]);
        return res
            .status(200)
            .cookie("access_token", token, { httpOnly: true })
            .json(rest);
    }
    else {
        res.json({ message: "Something Problem is occured in Naver Login" });
    }
});
exports.naverLoginCallback = naverLoginCallback;
const logout = (req, res, next) => {
    try {
        return res
            .clearCookie("access_token")
            .status(200)
            .json("User is Logged Out");
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
