import express, { Router } from 'express';
import { errorMiddleware } from './error/error.js';
import dotenv  from 'dotenv';
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './db.js';
import authRoutes from "./modules/authentication/userroute.js";
import folderRoutes from "./modules/Folder/folderRoute.js";
import imageRoutes from "./modules/image/imageRoute.js";


const app = express();
dotenv.config();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.use(errorMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/images", imageRoutes);

connectDB();

app.listen(4000, () => {
  console.log(`Server is running on port 4000`);
});


