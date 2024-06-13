import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL as string);

const db = mongoose.connection;

db.on("Error", (error) => console.log("❌ DB Error", error));

const handleOpen = () => console.log("✔ Connected to DB");

db.once("open", handleOpen);
