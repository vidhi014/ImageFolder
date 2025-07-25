import Folder from "./folderModal.js"

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
  const folders = await Folder.find({ user: req.user._id });
  res.json(folders);
};
