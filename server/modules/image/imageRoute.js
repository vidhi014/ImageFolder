import express from "express";
import multer from "multer";
import { getImages,uploadImage, searchImages } from "../image/imageController.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

router.get("/",auth,getImages);
router.post("/upload", auth, upload.single("image"), uploadImage);
router.get("/search", auth, searchImages);

export default router;
