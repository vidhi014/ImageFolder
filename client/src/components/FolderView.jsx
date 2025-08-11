import React, { useState, useEffect,useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import FolderIcon from '@mui/icons-material/Folder';
import ImageIcon from '@mui/icons-material/Image';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';

const Container = styled.div`
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1C1E27;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
  overflow-y: auto;
`;

const ImageCard = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1;
  background-color: #2D2F3B;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const UploadButton = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #7f8c8d;
  gap: 20px;
`;

const FolderView = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);
  const [folder, setFolder] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchFolderData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const [folderRes, imagesRes] = await Promise.all([
        axios.get(`http://localhost:4000/api/folders/${folderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(err => {
          if (err.response?.status === 404) {
            return { data: null }; 
          }
          throw err;
        }),
        axios.get(`http://localhost:4000/api/images?folderId=${folderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (!folderRes.data) {
        throw new Error('Folder not found');
      }

      setFolder(folderRes.data);
      setImages(imagesRes.data.images || []);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
      
      if (toast.current) {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: err.message.includes('not found') 
            ? 'Folder not found or you don\'t have access' 
            : 'Failed to load folder data',
          life: 3000
        });
      }
      
      if (err.message.includes('not found')) {
        navigate('/');
      }
    }
  };

  fetchFolderData();
}, [folderId, navigate]);

  const handleUpload = async (e) => {
    const file = e.files[0];
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folderId', folderId);
      formData.append('name', file.name);

      const response = await axios.post('http://localhost:4000/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setImages([...images, response.data]);
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Image uploaded successfully',
        life: 3000
      });
    } catch (err) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: err.response?.data?.message || 'Failed to upload image',
        life: 3000
      });
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress size={60} />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Toast ref={toast} />
      <Header>
        <Title>
          <ArrowBackIcon style={{ cursor: 'pointer' }} onClick={() => navigate('/')} />
          {folder?.folderName || 'Folder'}
        </Title>
        <ActionButtons>
          <Button variant="contained" startIcon={<ImageIcon />}
            onClick={() => document.querySelector('.p-fileupload-choose').click()}
            sx={{ backgroundColor: '#2ecc71', '&:hover': { backgroundColor: '#27ae60' } }} >
            Upload Image
          </Button>
        </ActionButtons>
      </Header>

      <Content>
        {images.length > 0 ? (
          <ImageGrid>
            {images.map((image) => (
              <ImageCard key={image._id}>
                <Image src={`http://localhost:4000/${image.path}`} alt={image.name} />
              </ImageCard>
            ))}
          </ImageGrid>
        ) : (
          <EmptyState>
            <ImageIcon style={{ fontSize: 80, color: '#bdc3c7' }} />
            <p>No images in this folder. Upload your first image!</p>
            <FileUpload mode="basic" name="image" accept="image/*" maxFileSize={10000000}
              customUpload uploadHandler={handleUpload} chooseLabel="Select Image" auto style={{ display: 'none' }} className="hidden-upload" />
            
            <Button variant="contained" startIcon={<ImageIcon />}
              onClick={() => document.querySelector('.p-fileupload-choose').click()}
              sx={{ backgroundColor: '#2ecc71', '&:hover': { backgroundColor: '#27ae60' } }} > Upload Image
            </Button>
          </EmptyState>
        )}
      </Content>

      <FileUpload mode="basic" name="image" accept="image/*" maxFileSize={10000000}
        customUpload uploadHandler={handleUpload} chooseLabel="Select Image" auto style={{ display: 'none' }} />
    </Container>
  );
};

export default FolderView;