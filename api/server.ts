import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import userRouter from "./router/userRoute";
import authRouter from "./router/authRoute";
import { HttpException } from "./utils/interface";
import cookieParser from "cookie-parser";
import postRouter from "./router/postRouter";
import commentRouter from "./router/commentRouter";
import utilsRouter from "./router/utilsRouter";
import path from "path";

const __dirname = path.resolve();

const app = express();

app.disable("x-powered-by");
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);
app.use("/api/utils", utilsRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

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
