import "dotenv/config";
import "./db";
import "./model/User";
import app from "./server";

const PORT = 3000;

const handleListening = () => {
    console.log("✔ Server is running on port 3000");
};

app.listen(PORT, handleListening);
