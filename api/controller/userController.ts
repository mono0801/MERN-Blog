import { Request, Response } from "express";
import User, { IUser } from "../model/User";
import bcrypt from "bcrypt";
import { oneMonthAgo, randomNicknameTag } from "../utils/utils";

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
        return res.end();
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
        console.log("Error : ", error);
        return res.end();
    }
};

export const getUsers = async (req: Request, res: Response) => {
    const startIndex = Number(req.query.startIndex) || 0;
    const limit = Number(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    try {
        const users = await User.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc;
            return rest;
        });

        const total = await User.countDocuments();
        const lastMonthUserCount = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo() },
        });

        res.status(200).json({
            users: usersWithoutPassword,
            total,
            lastMonthUserCount,
        });
    } catch (error) {
        console.log("Error : ", error);
        return res.end();
    }
};

const existNickname = async (name: string) => {
    const randomNickname = randomNicknameTag(randomNicknameTag(name));
    const nickname = `A${randomNickname}`;
    let user = await User.exists({ nickname });
    if (user) {
        existNickname(name);
    }
    return nickname;
};
export const updateUserfromAdmin = async (req: Request, res: Response) => {
    const _id = req.params.userId;
    const { nickname, profile } = req.query;
    let updateUser;

    const user = await User.findById<IUser>(_id);

    if (!user) {
        return res.status(404).json("User Not Found");
    }

    const newNickname = await existNickname("nonymous_");

    if (nickname) {
        updateUser = await User.findByIdAndUpdate(
            _id,
            {
                nickname: newNickname,
            },
            { new: true }
        );
        return res.status(200).json("Nickname is Changed");
    } else if (profile) {
        updateUser = await User.findByIdAndUpdate(
            _id,
            {
                profileUrl:
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            },
            { new: true }
        );
        return res.status(200).json("Profile is Changed");
    } else {
        return res.status(400).json("Please fill The Query");
    }
};
