
import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  IconButton,
  CircularProgress,
  Box,
  Button
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../api';

const FollowListModal = ({ open, onClose, type, userId }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const title = type === 'followers' ? 'Người theo dõi' : 'Đang theo dõi';

  const fetchUsers = useCallback(async (pageNum) => {
    if (!userId) return;
    setLoading(true);
    try {
      const params = { page: pageNum, size: 10 };
      let response;
      if (type === 'followers') {
        response = await userService.getFollowersList(userId, params);
      } else {
        response = await userService.getFollowingList(userId, params);
      }
      if (pageNum === 0) {
        setUsers(response.content || []);
      } else {
        setUsers(prev => [...prev, ...(response.content || [])]);
      }
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error(`Failed to fetch ${type}:`, error);
    } finally {
      setLoading(false);
    }
  }, [userId, type]);

  useEffect(() => {
    if (open) {
      setPage(0);
      fetchUsers(0);
    } else {
        setUsers([]);
    }
  }, [open, fetchUsers]);

  const loadMore = () => {
    if (page < totalPages - 1) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUsers(nextPage);
    }
  };

  const getUserData = (item) => {
    if (type === 'followers') {
        return {
            id: item.followedByAccountId,
            username: item.followByUsername,
            fullName: item.followByFullName,
            avatar: null // Avatar not currently in DTO, fallback in UI
        };
    } else {
         return {
            id: item.accountId,
            username: item.username,
            fullName: item.fullName,
            avatar: null // Avatar not currently in DTO, fallback in UI
        };
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0, height: '400px', display: 'flex', flexDirection: 'column' }}>
        {loading && page === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : users.length === 0 ? (
             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography color="text.secondary">Chưa có ai</Typography>
             </Box>
        ) : (
          <List sx={{ flex: 1, overflowY: 'auto' }}>
            {users.map((item, index) => {
                const userData = getUserData(item);
                const displayName = userData.fullName || userData.username;

                return (
                    <ListItem 
                        key={index} 
                        button 
                        onClick={() => {
                            navigate(`/profiles/${userData.username}`);
                            onClose();
                        }}
                        sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                    >
                        <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {displayName ? displayName.charAt(0).toUpperCase() : '?'}
                        </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                            primary={<Typography fontWeight="600">{displayName}</Typography>}
                            secondary={`@${userData.username}`} 
                        />
                    </ListItem>
                );
            })}
             {page < totalPages - 1 && (
                <Box sx={{ textAlign: 'center', p: 1 }}>
                     <Button onClick={loadMore} disabled={loading}>{loading ? 'Đang tải...' : 'Xem thêm'}</Button>
                </Box>
            )}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FollowListModal;
