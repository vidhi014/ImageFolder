import express from "express";
const router = express.Router();
import { createFolder, getUserFolders ,getFolder} from "./folderController.js";
import { verifyToken } from "../../middleware/auth.js"; 

router.get("/", verifyToken, getUserFolders);
router.get('/:id', verifyToken, getFolder);
router.post("/", verifyToken, createFolder);


export default router;
