import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../model/User";
import { HttpException } from "../utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const postJoin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { nickname, email, password } = req.body;

    if (!email || !nickname || nickname == "" || email == "") {
        // next(new HttpException(400, "All Fields are Required"));
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

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET!);
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
            const randomPassword =
                Math.random().toString(36).slice(-6) +
                Math.random().toString(36).slice(-6);

            user = new User({
                nickname:
                    nickname.toLowerCase().split(" ").join("") +
                    Math.random().toString(9).slice(-4),
                email,
                password: randomPassword,
                socialLogin: true,
                profileUrl,
            });

            await user.save();
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);
        const { password: pass, ...rest } = user._doc;

        return res
            .status(200)
            .cookie("access_token", token, { httpOnly: true })
            .json(rest);
    } catch (error) {
        next(error);
    }
};
