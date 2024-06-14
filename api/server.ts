import express from "express";
import userRouter from "./router/userRoute";
import authRouter from "./router/authRoute";

const app = express();

app.use(express.json());

app.use("/users", userRouter);
app.use("/auth", authRouter);

export default app;
