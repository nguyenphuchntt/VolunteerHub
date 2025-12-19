import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import {
  SupervisorAccount,
  Send,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  ArrowBack,
  Delete,
} from "@mui/icons-material";
import { requestService } from "../../api";
import { useAuth } from "../../context/AuthContext";

const ManagerRequest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reason, setReason] = useState("");
  const [currentRequest, setCurrentRequest] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Check if user is already manager or admin
  const isAlreadyManager = user?.role === "MANAGER" || user?.role === "ADMIN";

  // Fetch current request status
  const fetchCurrentRequest = useCallback(async () => {
    if (isAlreadyManager) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await requestService.getMyRequests(0, 10);
      // Find the most recent WAITING request or the latest request
      const requests = response.content || [];
      const waitingRequest = requests.find(r => r.status === "WAITING");
      const latestRequest = requests[0]; // Most recent
      setCurrentRequest(waitingRequest || latestRequest || null);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    } finally {
      setLoading(false);
    }
  }, [isAlreadyManager]);

  useEffect(() => {
    fetchCurrentRequest();
  }, [fetchCurrentRequest]);

  // Handle submit new request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Vui lòng nhập lý do yêu cầu");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const newRequest = await requestService.createRequest(reason.trim());
      setCurrentRequest(newRequest);
      setReason("");
      setSuccess("Yêu cầu đã được gửi thành công!");
    } catch (err) {
      const message = err.response?.data?.message || "Không thể gửi yêu cầu. Vui lòng thử lại.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel request
  const handleCancel = async () => {
    if (!currentRequest) return;
    
    setSubmitting(true);
    setError(null);
    try {
      await requestService.cancelRequest(currentRequest.requestId);
      setCurrentRequest(null);
      setSuccess("Đã hủy yêu cầu thành công!");
    } catch (err) {
      const message = err.response?.data?.message || "Không thể hủy yêu cầu.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Get status display config
  const getStatusConfig = (status) => {
    const configs = {
      WAITING: {
        label: "Đang chờ duyệt",
        color: "warning",
        icon: <HourglassEmpty sx={{ fontSize: 18 }} />,
        bg: "#fff3e0",
        textColor: "#f57c00"
      },
      APPROVED: {
        label: "Đã được duyệt",
        color: "success",
        icon: <CheckCircle sx={{ fontSize: 18 }} />,
        bg: "#e8f5e9",
        textColor: "#2e7d32"
      },
      REJECTED: {
        label: "Đã bị từ chối",
        color: "error",
        icon: <Cancel sx={{ fontSize: 18 }} />,
        bg: "#ffebee",
        textColor: "#c62828"
      }
    };
    return configs[status] || configs.WAITING;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Already a manager
  if (isAlreadyManager) {
    return (
      <Card elevation={0} sx={{ borderRadius: "16px", border: "1px solid", borderColor: "grey.200" }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <IconButton onClick={() => navigate("/settings")} size="small">
              <ArrowBack />
            </IconButton>
            <SupervisorAccount sx={{ color: "primary.main" }} />
            <Typography variant="h6" fontWeight={700}>
              Yêu cầu làm Quản lý
            </Typography>
          </Box>
          
          <Alert severity="success" icon={<CheckCircle />} sx={{ borderRadius: "12px" }}>
            Bạn đã là {user?.role === "ADMIN" ? "Admin" : "Quản lý sự kiện"}. Bạn có thể tạo và quản lý các sự kiện tình nguyện.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={0} sx={{ borderRadius: "16px", border: "1px solid", borderColor: "grey.200" }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <IconButton onClick={() => navigate("/settings")} size="small">
            <ArrowBack />
          </IconButton>
          <SupervisorAccount sx={{ color: "primary.main" }} />
          <Typography variant="h6" fontWeight={700}>
            Yêu cầu làm Quản lý
          </Typography>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2, borderRadius: "12px" }}>
            {success}
          </Alert>
        )}

        {/* Current Request Status */}
        {currentRequest && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
              Trạng thái yêu cầu gần nhất
            </Typography>
            
            <Box
              sx={{
                p: 2.5,
                borderRadius: "12px",
                backgroundColor: getStatusConfig(currentRequest.status).bg,
                border: "1px solid",
                borderColor: getStatusConfig(currentRequest.status).textColor + "40",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <Chip
                  icon={getStatusConfig(currentRequest.status).icon}
                  label={getStatusConfig(currentRequest.status).label}
                  size="small"
                  sx={{
                    backgroundColor: "transparent",
                    color: getStatusConfig(currentRequest.status).textColor,
                    fontWeight: 600,
                    "& .MuiChip-icon": { color: getStatusConfig(currentRequest.status).textColor }
                  }}
                />
                {currentRequest.status === "WAITING" && (
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={handleCancel}
                    disabled={submitting}
                    sx={{ textTransform: "none" }}
                  >
                    Hủy yêu cầu
                  </Button>
                )}
              </Box>

              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Lý do:</strong> {currentRequest.reason}
              </Typography>
              
              <Typography variant="caption" color="text.secondary">
                Gửi lúc: {formatDate(currentRequest.createdAt)}
              </Typography>

              {currentRequest.adminResponse && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="body2">
                    <strong>Phản hồi từ Admin:</strong> {currentRequest.adminResponse}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        )}

        {/* New Request Form - Show if no pending request */}
        {(!currentRequest || currentRequest.status !== "WAITING") && (
          <Box>
            {currentRequest?.status === "REJECTED" && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Yêu cầu trước đã bị từ chối. Bạn có thể gửi lại yêu cầu mới với lý do cụ thể hơn.
              </Typography>
            )}
            
            {!currentRequest && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Trở thành <strong>Quản lý sự kiện</strong> để có thể tạo và quản lý các sự kiện tình nguyện trên VolunteerHub.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vui lòng cho chúng tôi biết lý do bạn muốn trở thành quản lý sự kiện:
                </Typography>
              </Box>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Ví dụ: Tôi là trưởng CLB tình nguyện XYZ, muốn tổ chức các hoạt động thiện nguyện cho sinh viên..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  }
                }}
              />
              
              <Button
                type="submit"
                variant="contained"
                startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <Send />}
                disabled={submitting || !reason.trim()}
                sx={{
                  textTransform: "none",
                  borderRadius: "9999px",
                  px: 3,
                }}
              >
                {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
              </Button>
            </Box>
          </Box>
        )}

        {/* Waiting message */}
        {currentRequest?.status === "WAITING" && (
          <Alert severity="info" sx={{ borderRadius: "12px" }}>
            Yêu cầu của bạn đang được xem xét. Admin sẽ phản hồi trong thời gian sớm nhất.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ManagerRequest;
