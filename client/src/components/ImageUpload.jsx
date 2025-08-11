import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [imageName, setImageName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [folderId, setFolderId] = useState('');
  const [folders, setFolders] = useState([]);

  
  useEffect(() => {
  const fetchFolders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const res = await axios.get("http://localhost:4000/api/folders", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Folders response:", res.data);
      setFolders(res.data);
    } catch (err) {
      console.error("Error fetching folders", err.response?.data || err.message);
    }
  };

  fetchFolders();
}, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Please select an image");

    const formData = new FormData();
    formData.append("name", imageName);
    formData.append("image", imageFile);
    if (folderId) formData.append("folderId", folderId);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:4000/api/images/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      alert("Image uploaded successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <form onSubmit={handleUpload}>
        <input type="text" placeholder="Image name" value={imageName} onChange={(e) => setImageName(e.target.value)} required />
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required />
        <select value={folderId} onChange={(e) => setFolderId(e.target.value)} required>
          <option value="">Select a folder</option>
          {folders.map((folder) => (
            <option key={folder._id} value={folder._id}>
              {folder.name}
            </option>
          ))}
        </select>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default ImageUpload;
