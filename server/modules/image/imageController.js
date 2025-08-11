import Image from "./imageModal.js";
import Folder from "../Folder/folderModal.js";

export const uploadImage = async (req, res) => {
  try {
    const { name, folderId } = req.body;

    const folder = await Folder.findOne({ _id: folderId, user: req.user._id });
    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const image = await Image.create({
      name: name || req.file.originalname,
      path: req.file.path.replace(/\\/g, '/'),
      folder: folderId,
      user: req.user._id
    });

    res.status(201).json(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image upload failed" });
  }
};

export const getImages = async (req, res) => {
  try {
    const { folderId } = req.query;
    
    if (folderId) {
      const folder = await Folder.findOne({ _id: folderId, user: req.user._id });
      if (!folder) {
        return res.status(404).json({ error: "Folder not found" });
      }
    }

    const query = { user: req.user._id };
    if (folderId) {
      query.folder = folderId;
    }

    const images = await Image.find(query).sort({ createdAt: -1 });
    res.json({ images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching images" });
  }
};

export const searchImages = async (req, res) => {
  try {
    const { q, folderId } = req.query;

    const query = { user: req.user._id };

    if (folderId) {
      query.folder = folderId;
    }

    if (q) {
      query.name = { $regex: q, $options: "i" };
    }

    const images = await Image.find(query).sort({ createdAt: -1 });
    res.json({ images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error searching images" });
  }
};

// export const uploadImage = async (req, res) => {
//   try {
//     const { name, folderName } = req.body;

//     let folder = await Folder.findOne({ name: folderName, user: req.user._id });
//     if (!folder) {
//       folder = await Folder.create({
//         name: folderName,
//         user: req.user._id,
//         parent: null
//       });
//     }

//     const image = await Image.create({
//       name,
//       path: req.file.path,
//       folder: folder._id,
//       user: req.user._id
//     });

//     res.status(201).json(image);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Image upload failed" });
//   }
// };

// export const searchImages = async (req, res) => {
//   try {
//     const { q, folderId } = req.query;

//     const query = { user: req.user._id };

//     if (folderId) {
//       query.folder = folderId;
//     }


//     if (q) {
//       query.name = { $regex: q, $options: "i" };
//     }

//     const images = await Image.find(query);
//     res.json(images);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error searching images" });
//   }
// };


// export const getImages = async (req, res) => {
//   try {
//     const { folderId } = req.query;

//     const query = { user: req.user._id };

//     if (folderId) {
//       query.folder = folderId;
//     }

//     const images = await Image.find(query);
//     res.json({ images });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error fetching images" });
//   }
// };
