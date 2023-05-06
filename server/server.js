import "dotenv/config";
import path from "path";

import express, { json } from "express";
const app = express();

import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";

import cors from "cors";

import connectDB from "./config/dbConnecton.js";
import logger from "./config/logger.js";
import corsOption from "./config/corsOptons.js";

const port = 5000;

app.use("*", cors(corsOption));

app.use(json());
app.use(cookieParser());

import userRoutes from "./routes/userRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import publicNotesRoute from "./routes/publicNotesRoute.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

app.get("/", (req, res) => {
  res.send("API WORKING FINE !!!!!");
});

app.use("/user", userRoutes);
app.use("/note", noteRoutes);
app.use("/public", publicNotesRoute);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

app.use(errorHandler);
app.use(cookieParser());

connectDB();
app.listen(port, () => {
  logger.info(`Server running on ${port}`);
});
