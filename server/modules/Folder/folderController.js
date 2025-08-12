import Folder from "./folderModal.js"
import Image from "../image/imageModal.js";

export const createFolder = async (req, res) => {
  try {
    const { folderName, parent } = req.body;
    let parentId = null;

    if (parent) {
      const parentFolder = await Folder.findOne({
        folderName: parent,
        user: req.user._id
      });

      if (!parentFolder) {
        return res.status(404).json({ message: "Parent folder not found." });
      }

      parentId = parentFolder._id;
    }

    const existingFolder = await Folder.findOne({
      folderName,
      parent: parentId,
      user: req.user._id
    });

    if (existingFolder) {
      return res.status(400).json({ message: "Folder with this name already exists under the same parent." });
    }

    const folder = await Folder.create({
      folderName,
      parent: parentId,
      user: req.user._id
    });

    res.status(201).json(folder);
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).json({ message: "Server error while creating folder." });
  }
};

export const getUserFolders = async (req, res) => {
  const folders = await Folder.find({ user: req.user._id, parent: null  });
  res.json(folders);
};


export const getFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

   
    const childFolders = await Folder.find({
      parent: req.params.id,
      user: req.user._id
    });

    
    const images = await Image.find({
      folder: req.params.id,
      user: req.user._id
    });

    res.json({
      folder,
      childFolders,
      images
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};