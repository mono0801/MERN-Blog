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
