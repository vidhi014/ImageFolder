import styled from 'styled-components';
import FolderIcon from '@mui/icons-material/Folder';

export const FolderItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ theme }) => theme.shadows[1]};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows[4]};
  }
`;

export const FolderIconStyled = styled(FolderIcon)`
  color: ${({ theme }) => theme.palette.primary.main};
  margin-bottom: 10px;
  font-size: 50px !important;
`;

export const FolderName = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.palette.text.primary};
  text-align: center;
  word-break: break-word;
`;