import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

mongoose.connect(process.env.MONGO_URL as string);

const db = mongoose.connection;

export default db;
