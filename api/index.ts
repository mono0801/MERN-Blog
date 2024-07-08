import "dotenv/config";
import "./db";
import "./model/User";
import "./model/Post";
import "./model/Category";
import "./model/Comment";
import app from "./server";

const PORT = 3000;

const handleListening = () => {
    console.log("✔ Server is running on port 3000");
};

app.listen(PORT, handleListening);
