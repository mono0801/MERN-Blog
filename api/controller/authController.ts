import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../model/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomNicknameTag, randomPassword } from "../utils/utils";

export const postJoin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { nickname, email, password } = req.body;

    if (!email || !nickname || nickname == "" || email == "") {
        return res.status(400).json({ message: "All Fields are Required" });
    }

    try {
        const nicknameExist = await User.exists({ nickname });
        if (nicknameExist) {
            return res.status(400).json({
                message: "Nickname is Exist",
            });
        }
    } catch (err) {
        console.log("Error : ", err);
        next(err);
    }

    try {
        const emailExist = await User.exists({ email });
        if (emailExist) {
            return res.status(400).json({
                message: "E-mail is Exist",
            });
        }
    } catch (err) {
        console.log("Error : ", err);
        next(err);
    }

    const newUser = new User({
        nickname,
        email,
        password,
    });

    try {
        await newUser.save();
        return res.json({ message: "Join is Successful" });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const postLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne<IUser>({
            email,
            socialLogin: false,
        });
        if (!validUser) {
            return res.status(404).json({ message: "User Not Found" });
        }

        const validPassword = await bcrypt.compare(
            password,
            validUser.password
        );
        if (!validPassword) {
            return res.status(404).json({ message: "Invalid Password" });
        }

        const token = jwt.sign(
            { id: validUser._id, admin: validUser.admin },
            process.env.JWT_SECRET!
        );
        // Convert mongoose Object to JS Object
        // & Hide password
        const { password: pass, ...rest } = validUser._doc;

        return res
            .status(200)
            .cookie("access_token", token, { httpOnly: true })
            .json(rest);
    } catch (error) {
        next(error);
    }
};

export const postGoogle = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { nickname, email, profileUrl } = req.body;

    try {
        let user = await User.findOne<IUser>({ email });
        if (!user) {
            user = new User({
                nickname: randomNicknameTag(nickname),
                email,
                password: randomPassword(),
                socialLogin: true,
                profileUrl,
            });

            await user.save();
        }
        const token = jwt.sign(
            { id: user._id, admin: user.admin },
            process.env.JWT_SECRET!
        );
        const { password: pass, ...rest } = user._doc;

        return res
            .status(200)
            .cookie("access_token", token, { httpOnly: true })
            .json(rest);
    } catch (error) {
        next(error);
    }
};

export const githubLogin = (req: Request, res: Response) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config: { [key: string]: string | boolean } = {
        client_id: process.env.GITHUB_CLIENT_ID!,
        allow_signup: false,
        scope: "read:user user:email",
    };

    const params = new URLSearchParams(
        Object.entries(config).map(([key, value]) => [key, String(value)])
    ).toString();
    const githubUrl = `${baseUrl}?${params}`;
    return res.json(githubUrl);
};

const existNickname = async (name: string) => {
    const nickname = randomNicknameTag(name);
    let user = await User.exists({ nickname });
    if (user) {
        existNickname(name);
    }
    return nickname;
};
export const githubLoginCallback = async (req: Request, res: Response) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config: { [key: string]: string } = {
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code: req.body.code,
    };

    const params = new URLSearchParams(config).toString();
    const githubUrl = `${baseUrl}?${params}`;

    const tokenReq = await (
        await fetch(githubUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        })
    ).json();

    if ("access_token" in tokenReq) {
        const baseUrl = "https://api.github.com";
        const { access_token } = tokenReq;
        const userData = await (
            await fetch(`${baseUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();

        const emailData = await (
            await fetch(`${baseUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        const emailObj = emailData.find(
            (email: { primary: boolean; verified: boolean }) =>
                email.primary == true && email.verified == true
        );
        if (!emailObj) {
            return res.json("E-mail is not Exist");
        }

        let user = await User.findOne({ email: emailObj.email });
        if (!user) {
            const name = userData.name ? userData.name : userData.login;
            const nickname = await existNickname(name);
            user = await User.create({
                nickname,
                email: emailObj.email,
                password: randomPassword(),
                socialLogin: true,
                profileUrl: userData.avatar_url,
            });
        }

        const token = jwt.sign(
            { id: user._id, admin: user.admin },
            process.env.JWT_SECRET!
        );
        const { password: pass, ...rest } = user._doc;
        return res
            .status(200)
            .cookie("access_token", token, { httpOnly: true })
            .json(rest);
    } else {
        return res.json("Something Problem is occured");
    }
};

export const kakaoLogin = (req: Request, res: Response) => {
    const baseUrl = "https://kauth.kakao.com/oauth/authorize";
    const config: { [key: string]: string } = {
        client_id: process.env.KAKAOTALK_CLIENT_ID!,
        redirect_uri: process.env.KAKAOTALK_REDIRECT_URL!,
        response_type: "code",
        scope: "account_email,profile_nickname,profile_image,name",
    };

    const params = new URLSearchParams(config).toString();
    const kakaotalkUrl = `${baseUrl}?${params}`;

    return res.json(kakaotalkUrl);
};

export const kakaoLoginCallback = async (req: Request, res: Response) => {
    const baseUrl = "https://kauth.kakao.com/oauth/token";
    const config: { [key: string]: string } = {
        client_id: process.env.KAKAOTALK_CLIENT_ID!,
        grant_type: "authorization_code",
        code: req.body.code,
    };
    const params = new URLSearchParams(config).toString();
    const kakaotalkUrl = `${baseUrl}?${params}`;

    const tokenReq = await (
        await fetch(kakaotalkUrl, {
            method: "POST",
        })
    ).json();

    if ("access_token" in tokenReq) {
        const baseUrl = "https://kapi.kakao.com/v2/user/me";
        const { access_token } = tokenReq;
        const userData = await (
            await fetch(baseUrl, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            })
        ).json();
        const { kakao_account } = userData;

        let user = await User.findOne({ email: kakao_account.email });
        if (!user) {
            const name = kakao_account.profile.nickname
                ? kakao_account.profile.nickname
                : kakao_account.name;
            const nickname = await existNickname(name);
            user = await User.create({
                nickname,
                email: kakao_account.email,
                password: randomPassword(),
                socialLogin: true,
                profileUrl: kakao_account.profile.profile_image_url,
            });
        }

        const token = jwt.sign(
            { id: user._id, admin: user.admin },
            process.env.JWT_SECRET!
        );
        const { password: pass, ...rest } = user._doc;
        return res
            .status(200)
            .cookie("access_token", token, { httpOnly: true })
            .json(rest);
    } else {
        return res.json("Something Problem is occured");
    }
};

export const naverLogin = (req: Request, res: Response) => {
    const baseUrl = "https://nid.naver.com/oauth2.0/authorize";
    const config: { [key: string]: string | number } = {
        client_id: process.env.NAVER_CLIENT_ID!,
        redirect_uri: process.env.NAVER_REDIRECT_URL!,
        response_type: "code",
        state: randomPassword(),
    };

    const params = new URLSearchParams(
        Object.entries(config).map(([key, value]) => [key, String(value)])
    ).toString();
    const naverUrl = `${baseUrl}?${params}`;
    return res.json(naverUrl);
};

export const naverLoginCallback = async (req: Request, res: Response) => {
    const baseUrl = "https://nid.naver.com/oauth2.0/token";
    const config: { [key: string]: string } = {
        client_id: process.env.NAVER_CLIENT_ID!,
        client_secret: process.env.NAVER_CLIENT_SECRET!,
        grant_type: "authorization_code",
        code: req.body.code,
        state: req.body.state,
    };
    const params = new URLSearchParams(config).toString();
    const naverUrl = `${baseUrl}?${params}`;

    const tokenReq = await (
        await fetch(naverUrl, {
            method: "POST",
        })
    ).json();

    if ("access_token" in tokenReq) {
        const baseUrl = "https://openapi.naver.com/v1/nid/me";
        const { access_token } = tokenReq;
        const userData = await (
            await fetch(baseUrl, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            })
        ).json();

        const naver_account = userData.response;

        let user = await User.findOne({ email: naver_account.email });
        if (!user) {
            const name = naver_account.nickname
                ? naver_account.nickname
                : naver_account.name;
            const nickname = await existNickname(name);
            user = await User.create({
                email: naver_account.email,
                nickname,
                password: randomPassword,
                socialLogin: true,
                profileUrl: naver_account.profile_image,
            });
        }

        const token = jwt.sign(
            { id: user._id, admin: user.admin },
            process.env.JWT_SECRET!
        );
        const { password: pass, ...rest } = user._doc;
        return res
            .status(200)
            .cookie("access_token", token, { httpOnly: true })
            .json(rest);
    } else {
        return res.json("Something Problem is occured");
    }
};

export const logout = (req: Request, res: Response) => {
    try {
        return res
            .clearCookie("access_token")
            .status(200)
            .json("User is Logged Out");
    } catch (error) {
        console.log("Error : ", error);
    }
};
