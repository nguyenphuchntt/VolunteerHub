import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  TextField,
  Badge,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Visibility,
  Refresh,
  HourglassEmpty,
  SupervisorAccount,
} from "@mui/icons-material";
import { ThreeColumnLayout, DataTable, ConfirmDialog } from "../../components/common";
import { requestService } from "../../api";
import { useAuth } from "../../context/AuthContext";

const RequestManagement = () => {
  const { user } = useAuth();
  
  // API states
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [pendingCount, setPendingCount] = useState(0);
  
  const [selectedTab, setSelectedTab] = useState(0);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewAction, setReviewAction] = useState(null); // 'APPROVED' or 'REJECTED'
  const [adminResponse, setAdminResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Tab status mapping
  const getStatusFromTab = (tab) => {
    const statusMap = {
      0: null, // All
      1: "WAITING",
      2: "APPROVED",
      3: "REJECTED"
    };
    return statusMap[tab];
  };

  // Fetch requests from API
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const status = getStatusFromTab(selectedTab);
      let response;
      
      if (status) {
        response = await requestService.getRequestsByStatus(status, 0, 100);
      } else {
        response = await requestService.getAllRequests(0, 100);
      }
      
      setRequests(response.content || []);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
      setError("Không thể tải danh sách yêu cầu.");
    } finally {
      setLoading(false);
    }
  }, [selectedTab]);

  // Fetch pending count
  const fetchPendingCount = useCallback(async () => {
    try {
      const response = await requestService.getPendingCount();
      setPendingCount(response.count || 0);
    } catch (err) {
      console.error("Failed to fetch pending count:", err);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    fetchPendingCount();
  }, [fetchPendingCount]);

  // Status config
  const getStatusConfig = (status) => {
    const statusUpper = (status || "WAITING").toUpperCase();
    const configs = {
      WAITING: { 
        label: "Đang chờ", 
        bg: "#fff3e0", 
        color: "#f57c00",
        icon: <HourglassEmpty sx={{ fontSize: 14 }} />
      },
      APPROVED: { 
        label: "Đã duyệt", 
        bg: "#e8f5e9", 
        color: "#2e7d32",
        icon: <CheckCircle sx={{ fontSize: 14 }} />
      },
      REJECTED: { 
        label: "Đã từ chối", 
        bg: "#ffebee", 
        color: "#c62828",
        icon: <Cancel sx={{ fontSize: 14 }} />
      },
    };
    return configs[statusUpper] || configs.WAITING;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const columns = [
    {
      id: "username",
      label: "Người dùng",
      render: (value, row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main" }}>
            {(value || "?").charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Box sx={{ fontWeight: 600, fontSize: "14px" }}>{value}</Box>
            <Box sx={{ fontSize: "12px", color: "text.secondary" }}>{row.email}</Box>
          </Box>
        </Box>
      ),
    },
    {
      id: "reason",
      label: "Lý do",
      render: (value) => (
        <Typography 
          variant="body2" 
          sx={{ 
            maxWidth: 250, 
            overflow: "hidden", 
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {value}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "Trạng thái",
      render: (value) => {
        const c = getStatusConfig(value);
        return (
          <Chip
            icon={c.icon}
            label={c.label}
            size="small"
            sx={{
              backgroundColor: c.bg,
              color: c.color,
              fontWeight: 600,
              fontSize: "11px",
              "& .MuiChip-icon": { color: c.color },
            }}
          />
        );
      },
    },
    {
      id: "createdAt",
      label: "Ngày gửi",
      render: (value) => (
        <Typography variant="caption" color="text.secondary">
          {formatDate(value)}
        </Typography>
      ),
    },
  ];

  // Handle review request
  const handleReview = async () => {
    if (!selectedRequest || !reviewAction) return;
    
    setSubmitting(true);
    try {
      await requestService.reviewRequest(
        selectedRequest.requestId, 
        reviewAction, 
        adminResponse.trim()
      );
      setSnackbar({ 
        open: true, 
        message: reviewAction === "APPROVED" 
          ? "Đã duyệt yêu cầu thành công! Người dùng đã được nâng cấp thành Manager." 
          : "Đã từ chối yêu cầu.", 
        severity: "success" 
      });
      fetchRequests();
      fetchPendingCount();
    } catch (err) {
      console.error("Failed to review request:", err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || "Không thể xử lý yêu cầu.", 
        severity: "error" 
      });
    } finally {
      setSubmitting(false);
      setReviewDialogOpen(false);
      setSelectedRequest(null);
      setAdminResponse("");
      setReviewAction(null);
    }
  };

  const actions = [
    {
      label: "Xem",
      icon: <Visibility sx={{ fontSize: 18 }} />,
      onClick: (row) => {
        setSelectedRequest(row);
        setDetailDialogOpen(true);
      },
    },
    {
      label: "Duyệt",
      icon: <CheckCircle sx={{ fontSize: 18 }} />,
      color: "success.main",
      onClick: (row) => {
        setSelectedRequest(row);
        setReviewAction("APPROVED");
        setAdminResponse("");
        setReviewDialogOpen(true);
      },
      show: (row) => row.status === "WAITING",
    },
    {
      label: "Từ chối",
      icon: <Cancel sx={{ fontSize: 18 }} />,
      color: "error.main",
      onClick: (row) => {
        setSelectedRequest(row);
        setReviewAction("REJECTED");
        setAdminResponse("");
        setReviewDialogOpen(true);
      },
      show: (row) => row.status === "WAITING",
    },
  ];

  return (
    <ThreeColumnLayout user={user} role="admin" showRightSidebar={true} showSearch={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <SupervisorAccount sx={{ color: "primary.main" }} />
            <Typography variant="h6" fontWeight={700}>
              Quản lý yêu cầu
            </Typography>
            {pendingCount > 0 && (
              <Chip 
                label={`${pendingCount} chờ duyệt`} 
                size="small" 
                color="warning"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
          <Button 
            size="small" 
            startIcon={<Refresh />} 
            onClick={() => { fetchRequests(); fetchPendingCount(); }}
            sx={{ textTransform: "none" }}
          >
            Làm mới
          </Button>
        </Box>

        {/* Tabs */}
        <Tabs
          value={selectedTab}
          onChange={(e, v) => setSelectedTab(v)}
          sx={{
            px: 2,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minHeight: 48,
            },
          }}
        >
          <Tab label="Tất cả" />
          <Tab 
            label={
              <Badge badgeContent={pendingCount} color="warning" max={99}>
                <Box sx={{ pr: pendingCount > 0 ? 2 : 0 }}>Đang chờ</Box>
              </Badge>
            } 
          />
          <Tab label="Đã duyệt" />
          <Tab label="Đã từ chối" />
        </Tabs>
      </Box>

      <Box sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: "12px" }}>{error}</Alert>
        ) : (
          <DataTable
            columns={columns}
            data={requests}
            searchable
            searchPlaceholder="Tìm kiếm yêu cầu..."
            actions={actions}
            emptyMessage="Không có yêu cầu nào"
          />
        )}
      </Box>

      {/* Review Confirm Dialog */}
      <Dialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {reviewAction === "APPROVED" ? "Duyệt yêu cầu?" : "Từ chối yêu cầu?"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {reviewAction === "APPROVED" 
              ? `Bạn có chắc chắn muốn duyệt yêu cầu của "${selectedRequest?.username}"? Người dùng sẽ được nâng cấp thành Manager.`
              : `Bạn có chắc chắn muốn từ chối yêu cầu của "${selectedRequest?.username}"?`
            }
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Phản hồi cho người dùng (tùy chọn)"
            placeholder={reviewAction === "APPROVED" 
              ? "Ví dụ: Chào mừng bạn trở thành quản lý sự kiện!"
              : "Ví dụ: Vui lòng cung cấp thêm thông tin về tổ chức của bạn..."
            }
            value={adminResponse}
            onChange={(e) => setAdminResponse(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setReviewDialogOpen(false)} 
            sx={{ textTransform: "none" }}
            disabled={submitting}
          >
            Hủy
          </Button>
          <Button 
            variant="contained" 
            color={reviewAction === "APPROVED" ? "success" : "error"}
            onClick={handleReview}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : 
              reviewAction === "APPROVED" ? <CheckCircle /> : <Cancel />
            }
            sx={{ textTransform: "none", borderRadius: "9999px" }}
          >
            {submitting ? "Đang xử lý..." : reviewAction === "APPROVED" ? "Duyệt" : "Từ chối"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Request Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main" }}>
              {(selectedRequest?.username || "?").charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {selectedRequest?.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedRequest?.email}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Trạng thái
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  icon={getStatusConfig(selectedRequest?.status).icon}
                  label={getStatusConfig(selectedRequest?.status).label}
                  size="small"
                  sx={{
                    backgroundColor: getStatusConfig(selectedRequest?.status).bg,
                    color: getStatusConfig(selectedRequest?.status).color,
                    fontWeight: 600,
                    "& .MuiChip-icon": { color: getStatusConfig(selectedRequest?.status).color },
                  }}
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Lý do yêu cầu
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {selectedRequest?.reason}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Ngày gửi
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {formatDate(selectedRequest?.createdAt)}
              </Typography>
            </Box>

            {selectedRequest?.adminResponse && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Phản hồi từ Admin
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {selectedRequest.adminResponse}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDetailDialogOpen(false)} sx={{ textTransform: "none" }}>
            Đóng
          </Button>
          {selectedRequest?.status === "WAITING" && (
            <>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
                onClick={() => {
                  setDetailDialogOpen(false);
                  setReviewAction("REJECTED");
                  setAdminResponse("");
                  setReviewDialogOpen(true);
                }}
                sx={{ textTransform: "none", borderRadius: "9999px" }}
              >
                Từ chối
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => {
                  setDetailDialogOpen(false);
                  setReviewAction("APPROVED");
                  setAdminResponse("");
                  setReviewDialogOpen(true);
                }}
                sx={{ textTransform: "none", borderRadius: "9999px" }}
              >
                Duyệt
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThreeColumnLayout>
  );
};

export default RequestManagement;
