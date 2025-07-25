import express from "express";
const router = express.Router();
import { createFolder, getUserFolders } from "./folderController.js";
import { verifyToken } from "../../middleware/auth.js"; // ✅ Import middleware

router.post("/", verifyToken, createFolder);
router.get("/", verifyToken, getUserFolders);


export default router;
