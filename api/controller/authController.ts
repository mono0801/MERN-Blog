import { NextFunction, Request, Response } from "express";
import User from "../model/User";
import { HttpException } from "../utils";

export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { nickname, email, password } = req.body;

    if (!email || !nickname || nickname == "" || email == "") {
        next(new HttpException(400, "All Fields are Required"));
        // return res.status(400).json({ message: "All Fields are Required" });
    }

    // try {
    //     const emailExist = await User.exists({ email });
    //     if (emailExist) {
    //         return res.status(400).json({
    //             message: "E-mail is Exist",
    //         });
    //     }
    // } catch (err) {
    //     console.log("Error : ", err);
    // }

    // try {
    //     const nicknameExist = await User.exists({ nickname });
    //     if (nicknameExist) {
    //         return res.status(400).json({
    //             message: "Nickname is Exist",
    //         });
    //     }
    // } catch (err) {
    //     console.log("Error : ", err);
    // }

    const newUser = new User({
        nickname,
        email,
        password,
    });

    try {
        await newUser.save();
        return res.json({ message: "SignUp is Successful" });
    } catch (error: any) {
        // res.status(500).json({ message: error.message });
        next(error);
    }
};
