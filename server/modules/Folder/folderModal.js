import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  folderName: {
    type: String,
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

const FolderModal= mongoose.model("Folder", folderSchema);
export default FolderModal;