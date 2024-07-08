"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const userRoute_1 = __importDefault(require("./router/userRoute"));
const authRoute_1 = __importDefault(require("./router/authRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const postRouter_1 = __importDefault(require("./router/postRouter"));
const commentRouter_1 = __importDefault(require("./router/commentRouter"));
const utilsRouter_1 = __importDefault(require("./router/utilsRouter"));
const path_1 = __importDefault(require("path"));
const dirname = path_1.default.resolve();
const app = (0, express_1.default)();
app.disable("x-powered-by");
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/users", userRoute_1.default);
app.use("/api/auth", authRoute_1.default);
app.use("/api/post", postRouter_1.default);
app.use("/api/comment", commentRouter_1.default);
app.use("/api/utils", utilsRouter_1.default);
app.use(express_1.default.static(path_1.default.join(dirname, "/client/dist")));
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(dirname, "client", "dist", "index.html"));
});
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
exports.default = app;
