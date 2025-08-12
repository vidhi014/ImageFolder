import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import FolderIcon from '@mui/icons-material/Folder';
import ImageIcon from '@mui/icons-material/Image';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { FileUpload } from 'primereact/fileupload';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

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

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #2D2F3B;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: white;
  margin-left: 8px;
  width: 200px;
  outline: none;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
  overflow-y: auto;
`;

const Card = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1;
  background-color: #2D2F3B;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.03);
  }
`;

const CardTitle = styled.div`
  margin-top: 10px;
  text-align: center;
  padding: 0 10px;
  word-break: break-word;
  width: 100%;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 80%;
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

const DialogStyles = styled.div`
  .custom-dialog-header {
    background: #2D2F3B;
    color: white;
    border-bottom: 1px solid #3D404D;
    padding: 1rem;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  
  .custom-dialog-content {
    background: #2D2F3B;
    color: white;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  
  .p-inputtext:enabled:focus {
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    border-color: #3498db;
  }
`;

const FolderView = () => {
   const { folderId } = useParams();
  const navigate = useNavigate();
  const [currentFolder, setCurrentFolder] = useState(null);
  const [images, setImages] = useState([]);
  const [subfolders, setSubfolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
   const [folderName, setFolderName] = useState('');
  const [parentId, setParentId] = useState('');


  useEffect(() => {
    const fetchFolderData = async () => {
      try {
          const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await axios.get(`http://localhost:4000/api/folders/${folderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCurrentFolder(response.data.folder);
      setSubfolders(response.data.childFolders || []);
      setImages(response.data.images || []);
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
  }, [folderId]);

  useEffect(() => {
    if (searchQuery) {
      const searchImages = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:4000/api/images/search`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { q: searchQuery, folderId }
          });
          setImages(response.data.images || []);
        } catch (err) {
          console.error('Search error:', err);
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to search images',
            life: 3000
          });
        }
      };

      const debounceTimer = setTimeout(() => {
        searchImages();
      }, 500);

      return () => clearTimeout(debounceTimer);
    } else {
      // Reset to original images when search is cleared
      const fetchOriginalImages = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:4000/api/images?folderId=${folderId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setImages(response.data.images || []);
        } catch (err) {
          console.error('Error fetching images:', err);
        }
      };
      fetchOriginalImages();
    }
  }, [searchQuery, folderId]);

   const [toast, setToast] = useState({
    open: false,
    severity: 'success',
    message: '',
  });

  const showToast = (severity, message) => {
    setToast({ open: true, severity, message });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

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
      showToast('success', 'Image uploaded successfully');
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to upload image');
    }
  };

  const handleCreateFolder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post("http://localhost:4000/api/folders", {
        folderName: folderName, 
        parent: parentId || folderId || null
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSubfolders([...subfolders, response.data]);
      setShowCreateFolderDialog(false);
      setFolderName('');
      setParentId('');
      showToast('success', 'Folder created successfully');
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to create folder');
    }
  };

  // Update your error handling in useEffect:
  useEffect(() => {
    const fetchFolderData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');

        const response = await axios.get(`http://localhost:4000/api/folders/${folderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setCurrentFolder(response.data.folder);
        setSubfolders(response.data.childFolders || []);
        setImages(response.data.images || []);
        setLoading(false);

      } catch (err) {
        console.error('Error:', err);
        setLoading(false);
        
        showToast('error', 
          err.message.includes('not found') 
            ? 'Folder not found or you don\'t have access' 
            : 'Failed to load folder data'
        );
        
        if (err.message.includes('not found')) {
          navigate('/');
        }
      }
    };

    fetchFolderData();
  }, [folderId]);

//   const handleUpload = async (e) => {
//     const file = e.files[0];
//     try {
//       const token = localStorage.getItem('token');
//       const formData = new FormData();
//       formData.append('image', file);
//       formData.append('folderId', folderId);
//       formData.append('name', file.name);

//       const response = await axios.post('http://localhost:4000/api/images/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`
//         }
//       });

//       setImages([...images, response.data]);
//       toast.current.show({
//         severity: 'success',
//         summary: 'Success',
//         detail: 'Image uploaded successfully',
//         life: 3000
//       });
//     } catch (err) {
//       toast.current.show({
//         severity: 'error',
//         summary: 'Error',
//         detail: err.response?.data?.message || 'Failed to upload image',
//         life: 3000
//       });
//     }
//   };

// const handleCreateFolder = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post("http://localhost:4000/api/folders", {
//         folderName: folderName, 
//         parent: parentId || folderId || null // Use current folderId as parent if creating subfolder
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       setSubfolders([...subfolders, response.data]);
//       setShowCreateFolderDialog(false);
//       setFolderName('');
//       setParentId('');
//       toast.current.show({
//         severity: 'success',
//         summary: 'Success',
//         detail: 'Folder created successfully',
//         life: 3000
//       });
//     } catch (err) {
//       console.error('Error creating folder:', err);
//       toast.current.show({
//         severity: 'error',
//         summary: 'Error',
//         detail: err.response?.data?.message || 'Failed to create folder',
//         life: 3000
//       });
//     }
//   };

  const navigateToFolder = (folderId) => {
    navigate(`/folder/${folderId}`);
  };

  const renderCreateFolderDialog = () => (
  <Dialog
    header="Create New Folder"
    visible={showCreateFolderDialog}
    style={{ 
      width: '450px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#ffffff', 
      color: '#2d3436'
    }}
    onHide={() => {
      setShowCreateFolderDialog(false);
      setFolderName('');
      setParentId('');
    }}
    headerStyle={{
      background: '#ffffff',
      color: '#2d3436',
      borderBottom: '1px solid #f1f3f5',
      padding: '20px',
      fontSize: '1.1rem',
      fontWeight: '600',
      borderTopLeftRadius: '12px',
      borderTopRightRadius: '12px'
    }}
    contentStyle={{
      background: '#ffffff',
      color: '#2d3436',
      padding: '20px',
      borderBottomLeftRadius: '12px',
      borderBottomRightRadius: '12px'
    }}
  >
    <div className="p-field" style={{ marginBottom: '24px' }}>
      <label htmlFor="folderName" style={{ display: 'block', color: '#636e72', fontSize: '0.9rem', fontWeight: '500', marginBottom: '8px' }} >
        Folder Name
      </label>
      <InputText id="folderName" value={folderName} onChange={(e) => setFolderName(e.target.value)}
        style={{ width: '100%', padding: '12px 14px', backgroundColor: '#f8f9fa', border: '1px solid #dfe6e9', color: '#2d3436', borderRadius: '8px',
          fontSize: '0.95rem', marginTop: '8px', '&:focus': { borderColor: '#3498db', boxShadow: '0 0 0 2px rgba(52, 152, 219, 0.2)' } }}
        required
      />
    </div>

    <div className="p-field" style={{ marginBottom: '24px', marginTop: '16px' }}>
      <label htmlFor="parentId" style={{ display: 'block', color: '#636e72', fontSize: '0.9rem', fontWeight: '500', marginBottom: '8px' }} >
        Parent Folder ID
      </label>
      <InputText id="parentId" value={parentId} onChange={(e) => setParentId(e.target.value)}
        style={{ width: '100%', padding: '12px 14px', backgroundColor: '#f8f9fa', border: '1px solid #dfe6e9', color: '#2d3436', borderRadius: '8px',
          fontSize: '0.95rem', marginTop: '8px', '&:focus': { borderColor: '#3498db', boxShadow: '0 0 0 2px rgba(52, 152, 219, 0.2)' } }}
        placeholder="Current Folder Name"
      />
    </div>

    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
      <Button
        variant="contained"
        onClick={handleCreateFolder}
        disabled={!folderName.trim()}
        sx={{ backgroundColor: '#2ecc71', 
          '&:hover': { backgroundColor: '#27ae60' },
          '&:disabled': { backgroundColor: '#dfe6e9', color: '#b2bec3' }
        }} >
        Create
      </Button>
    </div>
  </Dialog>
);

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress size={60} />
      </LoadingContainer>
    );
  }

  const hasContent = images.length > 0 || subfolders.length > 0;

  return (
    <Container>
        <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseToast}
          severity={toast.severity}
          sx={{ 
            width: '100%',
            backgroundColor: toast.severity === 'error' ? '#d32f2f' : 
                           toast.severity === 'success' ? '#2e7d32' : 
                           '#1976d2',
            color: '#fff',
            fontSize: '0.875rem',
            padding: '8px 16px',
          }}
        >
          {toast.message}
        </MuiAlert>
      </Snackbar>
      
      {renderCreateFolderDialog()}
      
      <Header>
        <Title>
          {currentFolder?.parent ? (
            <ArrowBackIcon 
              style={{ cursor: 'pointer' }} 
              onClick={() => navigate(`/folder/${currentFolder.parent}`)} 
            />
          ) : (
            <ArrowBackIcon 
              style={{ cursor: 'pointer' }} 
              onClick={() => navigate('/')} 
            />
          )}
          {currentFolder?.folderName || 'Folder'}
        </Title>
        <ActionButtons>
          <Button 
            variant="contained" 
            startIcon={<CreateNewFolderIcon />}
            onClick={() => setShowCreateFolderDialog(true)}
          >
            Create Folder
          </Button>
          <Button 
            variant="contained" 
            startIcon={<ImageIcon />}
            onClick={() => document.querySelector('.p-fileupload-choose').click()}
          >
            Upload Image
          </Button>
        </ActionButtons>
      </Header>

      <SearchContainer>
        <SearchIcon style={{ color: '#7f8c8d' }} />
        <SearchInput
          type="text"
          placeholder="Search images..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchContainer>

      <Content>
        {hasContent ? (
          <Grid>
        
            {subfolders.map((subfolder) => (
              <Card key={subfolder._id} onClick={() => navigate(`/folder/${subfolder._id}`)}>
                <FolderIcon style={{ fontSize: 60, color: '#3498db' }} />
                <CardTitle>{subfolder.folderName}</CardTitle>
              </Card>
            ))}

          
            {images.map((image) => (
              <Card key={image._id}>
                <Image src={`http://localhost:4000/${image.path}`} alt={image.name} />
                <CardTitle>{image.name}</CardTitle>
              </Card>
            ))}
          </Grid>
        ) : (
          <EmptyState>
            <ImageIcon style={{ fontSize: 80, color: '#bdc3c7' }} />
            <p>No content in this folder. Upload images or create subfolders!</p>
            <FileUpload 
              mode="basic" 
              name="image" 
              accept="image/*" 
              maxFileSize={10000000}
              customUpload 
              uploadHandler={handleUpload} 
              chooseLabel="Select Image" 
              auto 
              style={{ display: 'none' }} 
              className="hidden-upload" 
            />
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <Button 
                variant="contained" 
                startIcon={<CreateNewFolderIcon />}
                onClick={() => setShowCreateFolderDialog(true)}
                sx={{ backgroundColor: '#3498db', '&:hover': { backgroundColor: '#2980b9' } }}
              >
                Create Folder
              </Button>
              <Button 
                variant="contained" 
                startIcon={<ImageIcon />}
                onClick={() => document.querySelector('.p-fileupload-choose').click()}
                sx={{ backgroundColor: '#2ecc71', '&:hover': { backgroundColor: '#27ae60' } }}
              >
                Upload Image
              </Button>
            </div>
          </EmptyState>
        )}
      </Content>

      <FileUpload 
        mode="basic" 
        name="image" 
        accept="image/*" 
        maxFileSize={10000000}
        customUpload 
        uploadHandler={handleUpload} 
        chooseLabel="Select Image" 
        auto 
        style={{ display: 'none' }} 
      />
    </Container>
  );
};

export default FolderView;
