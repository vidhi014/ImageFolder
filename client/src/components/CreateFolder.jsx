import React, { useState } from 'react';
import axios from 'axios';

const CreateFolder = () => {
  const [folderName, setFolderName] = useState('');
  const [parentId, setParentId] = useState(''); 

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:4000/api/folders/", {
      folderName: folderName, 
      parent: parentId || null
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Folder created successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error creating folder", error);
    }
  };

  return (
    <div>
      <h2>Create Folder</h2>
      <form onSubmit={handleCreate}>
        <input type="text" placeholder="Folder name" value={folderName} onChange={(e) => setFolderName(e.target.value)} required />
        <input type="text" placeholder="Parent Folder ID (optional)" value={parentId} onChange={(e) => setParentId(e.target.value)} />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateFolder;
