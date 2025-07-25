import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

const imageModal = mongoose.model("Image", imageSchema);
export default imageModal;