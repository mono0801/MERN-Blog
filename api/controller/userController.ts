import { Request, Response } from "express";
import User, { IUser } from "../model/User";
import bcrypt from "bcrypt";

export const updateProfile = async (req: Request, res: Response) => {
    const _id = req.params.userId;
    const { profileUrl } = req.body;
    let updateUser;

    const user = await User.findById<IUser>(_id);
    if (!user) {
        return res.status(404).json("User Not Found");
    }
    updateUser = await User.findByIdAndUpdate(
        _id,
        {
            profileUrl,
        },
        { new: true }
    );

    const { password, ...rest } = updateUser?._doc;

    res.status(200).json(rest);
};

export const updateAccount = async (req: Request, res: Response) => {
    const _id = req.params.userId;
    const { nickname, email } = req.body;
    let updateUser;

    const user = await User.findById<IUser>(_id);

    if (!user) {
        return res.status(404).json("User Not Found");
    }

    if (nickname != user.nickname) {
        const nicknameExist = await User.exists({ nickname });
        if (nicknameExist) {
            return res.status(401).json(`${nickname} is exist`);
        }
    }

    if (email != user.email) {
        const emailExist = await User.exists({ email });
        if (emailExist) {
            return res.status(401).json(`${email} is exist`);
        }
    }

    updateUser = await User.findByIdAndUpdate(
        _id,
        {
            nickname,
            email,
        },
        { new: true }
    );

    const { password, ...rest } = updateUser?._doc;

    res.status(200).json(rest);
};

export const updatePassword = async (req: Request, res: Response) => {
    const _id = req.params.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById<IUser>(_id);

    if (!user) {
        return res.status(404).json("User Not Found");
    }

    const pwMatch = await bcrypt.compare(currentPassword, user.password);
    if (!pwMatch) {
        return res.status(401).json("Please Enter your Password Correctly");
    }

    try {
        const pwMatch = await bcrypt.compare(newPassword, user.password);
        if (pwMatch) {
            return res.status(401).json("The Password is Same");
        }
    } catch (err) {
        console.log("Error : ", err);
    }

    user.password = newPassword;
    await user.save();

    const { password, ...rest } = user?._doc;

    res.status(200).json(rest);
};

export const deleteUser = async (req: Request, res: Response) => {
    const _id = req.params.userId;

    const user = await User.findById<IUser>(_id);
    if (!user) {
        return res.status(404).json("User Not Found");
    }

    try {
        await User.findByIdAndDelete(_id);
        res.status(200).json("User Account is Deleted");
    } catch (error) {
        return console.log("Error : ", error);
    }
};
