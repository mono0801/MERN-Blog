import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json("Unauthorized");
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
        if (err) {
            return res.status(401).json("Unauthorized");
        }
        req.user = user;
        next();
    });
};

export const protectAccessUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const _id = req.params.userId;

    if (req.user?.id != _id) {
        return res.status(403).json("You're not Allowed to Access This User");
    }
    next();
};

export const protectAdminUpload = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user?.admin) {
        return res.status(403).json("You're not Allowed to Access Post");
    }
    if (!req.body.title || !req.body.content) {
        return res.status(403).json("Please Provide All Required Fields");
    }
    next();
};
