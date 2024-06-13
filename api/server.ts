import express from "express";
import userRouter from "./router/userRoute";

const app = express();

app.use("/users", userRouter);

export default app;
