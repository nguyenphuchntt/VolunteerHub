import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { AccessTime, LocationOn, Event } from '@mui/icons-material';

const ConfirmJoinDialog = ({ open, onClose, onConfirm, event, loading }) => {
  if (!event) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          padding: 1,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, textAlign: "center", pt: 3 }}>
        Xác nhận tham gia
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" textAlign="center" color="text.secondary" mb={3}>
          Bạn có chắc chắn muốn đăng ký tham gia sự kiện này không?
        </Typography>

        <Box sx={{ 
          backgroundColor: "grey.50", 
          borderRadius: "16px", 
          p: 2.5,
          border: "1px solid",
          borderColor: "grey.200"
        }}>
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: "primary.main" }}>
            {event.title}
          </Typography>
          
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <AccessTime sx={{ color: "text.secondary", fontSize: 20, mt: 0.5 }} />
              <Box>
                <Typography variant="body2" fontWeight={600}>Thời gian</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(event.startAt)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1.5 }}>
              <LocationOn sx={{ color: "text.secondary", fontSize: 20, mt: 0.5 }} />
              <Box>
                <Typography variant="body2" fontWeight={600}>Địa điểm</Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.location}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Typography variant="caption" display="block" textAlign="center" color="text.secondary" sx={{ mt: 3, fontStyle: "italic" }}>
          Thông tin liên hệ của bạn sẽ được gửi tới người tổ chức sự kiện.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, justifyContent: "center", gap: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          disabled={loading}
          sx={{ 
            borderRadius: "50px", 
            textTransform: "none", 
            px: 4,
            fontWeight: 600
          }}
        >
          Hủy
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          disabled={loading}
          sx={{ 
            borderRadius: "50px", 
            textTransform: "none", 
            px: 4,
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(46, 125, 50, 0.2)" 
          }}
        >
          {loading ? "Đang xử lý..." : "Xác nhận tham gia"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmJoinDialog;
