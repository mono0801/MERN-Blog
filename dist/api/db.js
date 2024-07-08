"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// mongoose.connect(process.env.DB_URL as string);
mongoose_1.default.connect(process.env.DB_URL);
const db = mongoose_1.default.connection;
db.on("Error", (error) => console.log("❌ DB Error", error));
const handleOpen = () => console.log("✔ Connected to DB");
db.once("open", handleOpen);
