"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("./db");
require("./model/User");
require("./model/Post");
require("./model/Category");
require("./model/Comment");
const server_1 = __importDefault(require("./server"));
const PORT = 3000;
const handleListening = () => {
    console.log("✔ Server is running on port 3000");
};
server_1.default.listen(PORT, handleListening);
