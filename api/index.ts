import express from "express";
import "dotenv/config";
import "./db";

const app = express();
const PORT = 3000;

const handleListening = () => {
    console.log("✔ Server is running on port 3000");
};

app.listen(PORT, handleListening);
