import { Request, Response } from "express";
import User from "../model/User";

export const userTest = (req: Request, res: Response) => {
    res.json({ message: "Api is Working!!!" });
};
