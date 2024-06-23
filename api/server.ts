import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import userRouter from "./router/userRoute";
import authRouter from "./router/authRoute";
import { HttpException } from "./utils/interface";
import cookieParser from "cookie-parser";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/users", userRouter);
app.use("/auth", authRouter);

app.use(
    (err: HttpException, req: Request, res: Response, next: NextFunction) => {
        const statusCode = err.statusCode || 500;
        const message = err.message || "Internal Server Error";

        res.status(statusCode).json({
            success: false,
            statusCode,
            message,
        });
    }
);

export default app;
