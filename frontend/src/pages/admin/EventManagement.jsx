import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  CheckCircle,
  Block,
  Visibility,
  Delete,
  Refresh,
  Event,
  People,
  Edit,
} from "@mui/icons-material";
import { ThreeColumnLayout, DataTable, ConfirmDialog } from "../../components/common";
import { eventService } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { buildEventUrl, buildManageEventUrl, buildEditEventUrl } from "../../utils/urlUtils";
import { getCategoryLabel } from "../../constants/categories";

const AdminEventManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // API states - allEvents stores all fetched events, filtered is derived
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [selectedTab, setSelectedTab] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: null, event: null });
  const [rejectDialog, setRejectDialog] = useState({ open: false, event: null });
  const [rejectReason, setRejectReason] = useState("");

  // Fetch ALL events once - no dependency on selectedTab
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventService.searchAllEvents({ size: 100 });
      setAllEvents(response.content || []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Không thể tải danh sách sự kiện.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Filter events client-side based on selected tab - no refetch needed!
  const filteredEvents = (() => {
    switch (selectedTab) {
      case 1: return allEvents.filter(e => e.status?.toUpperCase() === "PENDING");
      case 2: return allEvents.filter(e => e.status?.toUpperCase() === "SCHEDULED");
      case 3: return allEvents.filter(e => e.status?.toUpperCase() === "CANCELLED");
      default: return allEvents;
    }
  })();

  // Counts for tab labels  
  const pendingCount = allEvents.filter((e) => e.status?.toUpperCase() === "PENDING").length;
  const approvedCount = allEvents.filter((e) => e.status?.toUpperCase() === "SCHEDULED").length;
  const rejectedCount = allEvents.filter((e) => e.status?.toUpperCase() === "CANCELLED").length;

  // Backend EventStatus: PENDING, SCHEDULED, STARTED, FINISHED, CANCELLED
  const getStatusConfig = (status) => {
    const statusUpper = (status || "PENDING").toUpperCase();
    const configs = {
      PENDING: { label: "Chờ duyệt", bg: "#fff3e0", color: "#f57c00" },
      SCHEDULED: { label: "Đã duyệt", bg: "#edf7ed", color: "#2e7d32" },
      STARTED: { label: "Đang diễn ra", bg: "#e3f2fd", color: "#1976d2" },
      FINISHED: { label: "Đã kết thúc", bg: "#f3e5f5", color: "#7b1fa2" },
      CANCELLED: { label: "Đã hủy", bg: "#fdeded", color: "#d32f2f" },
    };
    return configs[statusUpper] || configs.PENDING;
  };

  // Get gradient for event without image
  const getGradient = (category) => {
    const gradients = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    ];
    const hash = (category || "default").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

  const columns = [
    {
      id: "title",
      label: "Sự kiện",
      render: (value, row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {row.coverImageUrl ? (
            <Box
              component="img"
              src={row.coverImageUrl}
              alt={value}
              sx={{ width: 48, height: 48, borderRadius: "8px", objectFit: "cover" }}
            />
          ) : (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "8px",
                background: getGradient(row.category),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Event sx={{ color: "white", fontSize: 20 }} />
            </Box>
          )}
          <Box>
            <Typography variant="body2" fontWeight={600}>{value}</Typography>
            <Typography variant="caption" color="text.secondary">
              {row.location || "Chưa có địa điểm"}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: "category",
      label: "Danh mục",
      render: (value) => (
        <Chip label={getCategoryLabel(value)} size="small" sx={{ fontSize: "11px" }} />
      ),
    },
    {
      id: "attendeeCount",
      label: "Người tham gia",
      render: (value) => value || 0,
    },
    {
      id: "status",
      label: "Trạng thái",
      render: (value) => {
        const c = getStatusConfig(value);
        return (
          <Chip
            label={c.label}
            size="small"
            sx={{ backgroundColor: c.bg, color: c.color, fontWeight: 600, fontSize: "11px" }}
          />
        );
      },
    },
  ];

  // Handle approve
  const handleApprove = async (event) => {
    try {
      await eventService.updateEventStatus(event.eventId, "SCHEDULED");
      setSnackbar({ open: true, message: "Đã duyệt sự kiện thành công!", severity: "success" });
      fetchEvents();
    } catch (err) {
      console.error("Failed to approve event:", err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || "Không thể duyệt sự kiện.", 
        severity: "error" 
      });
    }
  };

  // Handle reject
  const handleReject = async () => {
    if (!rejectDialog.event) return;
    try {
      await eventService.updateEventStatus(rejectDialog.event.eventId, "CANCELLED");
      setSnackbar({ open: true, message: "Đã từ chối sự kiện.", severity: "success" });
      fetchEvents();
    } catch (err) {
      console.error("Failed to reject event:", err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || "Không thể từ chối sự kiện.", 
        severity: "error" 
      });
    }
    setRejectDialog({ open: false, event: null });
    setRejectReason("");
  };

  // Handle delete
  const handleDelete = async () => {
    if (!confirmDialog.event) return;
    try {
      await eventService.deleteEvent(confirmDialog.event.eventId);
      setSnackbar({ open: true, message: "Đã xóa sự kiện.", severity: "success" });
      fetchEvents();
    } catch (err) {
      console.error("Failed to delete event:", err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || "Không thể xóa sự kiện.", 
        severity: "error" 
      });
    }
    setConfirmDialog({ open: false, type: null, event: null });
  };

  const actions = [
    {
      label: "Xem",
      icon: <Visibility sx={{ fontSize: 18 }} />,
      onClick: (row) => navigate(buildEventUrl(row)),
    },
    {
      label: "Quản lý",
      icon: <People sx={{ fontSize: 18 }} />,
      onClick: (row) => navigate(buildManageEventUrl(row)),
    },
    {
      label: "Sửa",
      icon: <Edit sx={{ fontSize: 18 }} />,
      onClick: (row) => navigate(buildEditEventUrl(row)),
    },
    {
      label: "Duyệt",
      icon: <CheckCircle sx={{ fontSize: 18 }} />,
      color: "success.main",
      onClick: (row) => handleApprove(row),
      show: (row) => row.status?.toUpperCase() === "PENDING",
    },
    {
      label: "Từ chối",
      icon: <Block sx={{ fontSize: 18 }} />,
      color: "warning.main",
      onClick: (row) => setRejectDialog({ open: true, event: row }),
      show: (row) => row.status?.toUpperCase() === "PENDING",
    },
    {
      label: "Xóa",
      icon: <Delete sx={{ fontSize: 18 }} />,
      color: "error.main",
      onClick: (row) => setConfirmDialog({ open: true, type: "delete", event: row }),
    },
  ];


  return (
    <ThreeColumnLayout user={user} role="admin" showRightSidebar={true} showSearch={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Quản lý sự kiện
          </Typography>
          <Button 
            size="small" 
            startIcon={<Refresh />} 
            onClick={fetchEvents}
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
            "& .MuiTab-root": { textTransform: "none", fontWeight: 600, minHeight: 48 },
          }}
        >
          <Tab label={`Tất cả (${allEvents.length})`} />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                Chờ duyệt
                {pendingCount > 0 && (
                  <Chip label={pendingCount} size="small" color="warning" sx={{ height: 20 }} />
                )}
              </Box>
            }
          />
          <Tab label={`Đã duyệt (${approvedCount})`} />
          <Tab label={`Đã hủy (${rejectedCount})`} />
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
            data={filteredEvents}
            rowKey="eventId"
            searchable
            searchPlaceholder="Tìm kiếm sự kiện..."
            actions={actions}
            emptyMessage="Không có sự kiện nào"
          />
        )}
      </Box>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open && confirmDialog.type === "delete"}
        onClose={() => setConfirmDialog({ open: false, type: null, event: null })}
        onConfirm={handleDelete}
        title="Xóa sự kiện?"
        message={`Bạn có chắc chắn muốn xóa sự kiện "${confirmDialog.event?.title}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        variant="danger"
      />

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialog.open}
        onClose={() => setRejectDialog({ open: false, event: null })}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Từ chối sự kiện</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn từ chối sự kiện <strong>"{rejectDialog.event?.title}"</strong>?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Lý do từ chối (tùy chọn)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Nhập lý do từ chối..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRejectDialog({ open: false, event: null })} sx={{ textTransform: "none" }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
            sx={{ textTransform: "none", borderRadius: "9999px" }}
          >
            Từ chối
          </Button>
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

export default AdminEventManagement;
