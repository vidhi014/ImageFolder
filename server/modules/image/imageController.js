import Image from "./imageModal.js";
import Folder from "../Folder/folderModal.js";

export const uploadImage = async (req, res) => {
  try {
    const { name, folderName } = req.body;

    let folder = await Folder.findOne({ name: folderName, user: req.user._id });
    if (!folder) {
      folder = await Folder.create({
        name: folderName,
        user: req.user._id,
        parent: null
      });
    }

    const image = await Image.create({
      name,
      path: req.file.path,
      folder: folder._id,
      user: req.user._id
    });

    res.status(201).json(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image upload failed" });
  }
};

export const searchImages = async (req, res) => {
  const { q } = req.query;
  const images = await Image.find({
    name: { $regex: q, $options: "i" },
    user: req.user._id
  });
  res.json(images);
};