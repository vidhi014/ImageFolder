import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";
import Button from '@mui/material/Button';
import FolderIcon from '@mui/icons-material/Folder';
import ImageIcon from '@mui/icons-material/Image';
import axios from 'axios';
import Folder from '@mui/icons-material/Folder';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { Modal, Box, TextField, Typography } from '@mui/material';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';


const DashboardContainer = styled.div`
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1C1E27;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  background: linear-gradient(to right, #3498db, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
`;

const FolderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
  padding: 20px;
  overflow-y: auto;
`;

const FolderItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 20px;
  border-radius: 12px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    border-color: #3498db;
  }
`;

const FolderIconStyled = styled(Folder)`
  font-size: 60px !important;
  color: #3498db;
  margin-bottom: 15px;
`;

const FolderName = styled.span`
  font-size: 1.1rem;
  color: #2c3e50;
  font-weight: 500;
  text-align: center;
  word-break: break-word;
`;

const FolderDate = styled.span`
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-top: 8px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #7f8c8d;
  font-size: 1.2rem;
`;

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '10px',
  width: 400,
  boxShadow: 24
};

const Dashboard = () => {
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [folderName, setFolderName] = useState('');
  const navigate = useNavigate();
  const toast = useRef(null);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/folders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setFolders(response.data.folders || response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching folders:', err);
        setLoading(false);
      }
    };

    fetchFolders();
  }, []);

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4000/api/folders', {
        folderName,
        parentId: null 
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFolders([...folders, response.data]);
      setFolderName('');
      setShowCreateFolder(false);
    } catch (err) {
      console.error('Error creating folder:', err);
      alert(err.response?.data?.message || 'Failed to create folder');
    }
  };

  // Removed unused handleFolderClick function

  return (
    <DashboardContainer>
      <Toast ref={toast} />
      <Header>
        <Title>Welcome to ImageAdd</Title>
        <ActionButtons>
          <Button 
            variant="contained" 
            onClick={() => setShowCreateFolder(true)}
            startIcon={<FolderIcon />}
            size="medium"
            sx={{
              backgroundColor: '#3498db',
              '&:hover': { backgroundColor: '#2980b9' }
            }}
          >
            Create Folder
          </Button>
          <Button 
            variant="contained" 
            onClick={() => setShowImageUpload(true)}
            startIcon={<ImageIcon />}
            size="medium"
            sx={{
              backgroundColor: '#2ecc71',
              '&:hover': { backgroundColor: '#27ae60' }
            }}
          >
            Upload Image
          </Button>
        </ActionButtons>
      </Header>

      {loading ? (
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      ) : folders.length > 0 ? (
        <FolderGrid>
          {folders.map((folder) => (
            <FolderItem 
              key={folder._id}
              onClick={() => navigate(`/folder/${folder._id}`)}
            >
              <FolderIconStyled />
              <FolderName>{folder.folderName}</FolderName>
            </FolderItem>
          ))}
        </FolderGrid>
      ) : (
        <EmptyState>
          <Typography>No folders found. Create your first folder!</Typography>
        </EmptyState>
      )}

      {/* Create Folder Modal */}
      <Modal
        open={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
        sx={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>Create Folder</Typography>
          <TextField
            fullWidth
            label="Folder Name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            margin="normal"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setShowCreateFolder(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateFolder} sx={{ ml: 1 }}>
              Create
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Image Upload Modal */}
      <Modal
        open={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        sx={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>Upload Image</Typography>
          <FileUpload
            mode="basic"
            name="demo[]"
            url="/api/upload"
            accept="image/*"
            maxFileSize={1000000}
            auto
            chooseLabel="Select Image"
            onUpload={() => {
              toast.current.show({ severity: 'success', summary: 'Uploaded', detail: 'Image uploaded successfully!' });
              setShowImageUpload(false);
            }}
          />
        </Box>
      </Modal>
    </DashboardContainer>
  );
};

export default Dashboard;
