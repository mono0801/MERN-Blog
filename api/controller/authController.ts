import { Request, Response } from "express";
import User from "../model/User";

export const signup = async (req: Request, res: Response) => {
    const { username, nickname, email, password } = req.body;

    if (
        !username ||
        !email ||
        !nickname ||
        username == "" ||
        nickname == "" ||
        email == ""
    ) {
        return res.json({ message: "Fields are Required" });
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
    }

    const newUser = new User({
        username,
        nickname,
        email,
        password,
    });

    try {
        await newUser.save();
        return res.json({ message: "SignUp is Successful" });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
