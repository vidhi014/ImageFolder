import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import axios from 'axios';
import CreateFolder from "../components/CreateFolder.jsx";
import ImageUpload from "../components/ImageUpload.jsx";
import FolderIcon from '@mui/icons-material/Folder';
import ImageIcon from '@mui/icons-material/Image';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

// Styled Components
const DashboardMain = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  @media (max-width: 768px) {
    padding: 6px 10px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.text_primary};
  font-size: 24px;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 15px;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Section = styled.div`
  background-color: ${({ theme }) => theme.bg};
  border-radius: 10px;
  padding: 20px;
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.text_primary};
  font-size: 20px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 15px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
  }
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.bgLight};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ItemIcon = styled.div`
  font-size: 40px;
  color: ${({ theme }) => theme.primary};
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const ItemName = styled.span`
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  text-align: center;
  word-break: break-word;
  width: 100%;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${({ theme }) => theme.text_secondary};
`;

const Dashboard = () => {
   const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  // Fetch ALL folders from API (including those without parents)
  useEffect(() => {
    const fetchAllFolders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/folders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('All Folders API Response:', response.data);
        
        // Handle different possible response structures
        if (response.data && Array.isArray(response.data.folders)) {
          setFolders(response.data.folders);
        } else if (response.data && Array.isArray(response.data)) {
          setFolders(response.data);
        } else if (response.data?.result) {
          // If the response has a result object (like your example)
          setFolders([response.data.result]); // Wrap in array if single folder
        } else {
          console.error('Unexpected API response format:', response.data);
          setError('No folders data received from server');
        }
      } catch (err) {
        console.error('Error fetching all folders:', err);
        setError(err.response?.data?.message || 'Failed to fetch folders');
      } finally {
        setLoading(false);
      }
    };

    fetchAllFolders();
  }, []);

  const handleCreateFolder = async (folderName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4000/api/folders', {
        folderName: folderName,
        parentId: null 
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Handle different response structures
      const newFolder = response.data.folder || response.data.result || response.data;
      setFolders(prev => [...prev, newFolder]);
      setShowCreateFolder(false);
    } catch (err) {
      console.error('Error creating folder:', err);
      alert(err.response?.data?.message || 'Failed to create folder');
    }
  };

  const handleImageUpload = async (imageData) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', imageData.file);
      formData.append('folderId', imageData.folderId);
      formData.append('name', imageData.name);

      await axios.post('http://localhost:4000/api/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      setShowImageUpload(false);
      alert('Image uploaded successfully!');
    } catch (err) {
      console.error('Error uploading image:', err);
      alert(err.response?.data?.message || 'Failed to upload image');
    }
  };

  return (
        <DashboardMain>
      <Header>
        <Title>My Dashboard</Title>
        <Actions>
          <Button 
            variant="contained" 
            onClick={() => setShowCreateFolder(true)}
            startIcon={<FolderIcon />}
            size="medium"
          >
            Create Folder
          </Button>
          <Button 
            variant="contained" 
            onClick={() => setShowImageUpload(true)}
            startIcon={<ImageIcon />}
            size="medium"
          >
            Upload Image
          </Button>
        </Actions>
      </Header>
      
      <CreateFolder 
        open={showCreateFolder} 
        onClose={() => setShowCreateFolder(false)} 
        onCreate={handleCreateFolder}
      />
      
      <ImageUpload 
        open={showImageUpload} 
        onClose={() => setShowImageUpload(false)} 
        onUpload={handleImageUpload}
        folders={folders}
      />
      
      <Content>
        <Section>
          <SectionTitle>
            <FolderIcon /> All Folders
          </SectionTitle>
          
          {loading ? (
            <LoadingContainer>
              <CircularProgress />
            </LoadingContainer>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : folders.length > 0 ? (
            <ItemsGrid>
              {folders.map(folder => (
                <Item key={folder._id} onClick={() => {}}>
                  <ItemIcon>
                    <FolderIcon fontSize="inherit" />
                  </ItemIcon>
                  <ItemName>{folder.name}</ItemName>
                  {!folder.parentId && <span>(Root Folder)</span>}
                </Item>
              ))}
            </ItemsGrid>
          ) : (
            <EmptyState>No folders found. Create your first folder!</EmptyState>
          )}
        </Section>
      </Content>
    </DashboardMain>
  );
};

export default Dashboard;