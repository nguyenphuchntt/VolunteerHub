import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Button, 
  Chip, 
  CircularProgress, 
  Alert,
  Snackbar 
} from "@mui/material";
import { Add, Edit, Delete, Visibility, People, Refresh, Event } from "@mui/icons-material";
import { ThreeColumnLayout, DataTable, ConfirmDialog } from "../../components/common";
import { eventService } from "../../api";
import { useAuth } from "../../context/AuthContext";

const EventManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // API states
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch manager's events from API
  const fetchEvents = useCallback(async () => {
    if (!user?.accountID) return;
    setLoading(true);
    setError(null);
    try {
      // Get events owned by current manager
      const response = await eventService.getEventsByAccountId(user.accountID);
      setEvents(response.content || []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Không thể tải danh sách sự kiện.");
    } finally {
      setLoading(false);
    }
  }, [user?.accountID]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Backend EventStatus: PENDING, SCHEDULED, STARTED, FINISHED, CANCELLED
  const getStatusConfig = (status) => {
    const statusUpper = (status || "PENDING").toUpperCase();
    const configs = {
      PENDING: { label: "Chờ duyệt", bg: "#fff3e0", color: "#f57c00" },
      SCHEDULED: { label: "Đã duyệt", bg: "#e3f2fd", color: "#1976d2" },
      STARTED: { label: "Đang diễn ra", bg: "#e8f5e9", color: "#388e3c" },
      FINISHED: { label: "Hoàn thành", bg: "#f3e5f5", color: "#7b1fa2" },
      CANCELLED: { label: "Đã hủy", bg: "#ffebee", color: "#d32f2f" },
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
      label: "Tên sự kiện",
      render: (value, row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {row.coverImageUrl ? (
            <Box
              component="img"
              src={row.coverImageUrl}
              alt={value}
              sx={{ width: 40, height: 40, borderRadius: "8px", objectFit: "cover" }}
            />
          ) : (
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "8px",
                background: getGradient(row.category),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Event sx={{ color: "white", fontSize: 18 }} />
            </Box>
          )}
          <Box>
            <Box sx={{ fontWeight: 600, fontSize: "14px" }}>{value}</Box>
            <Box sx={{ fontSize: "12px", color: "text.secondary" }}>{row.category || "Khác"}</Box>
          </Box>
        </Box>
      ),
    },
    {
      id: "startAt",
      label: "Ngày",
      render: (value) => {
        if (!value) return "TBD";
        const date = new Date(value);
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "short", year: "numeric" });
      },
    },
    {
      id: "attendeeCount",
      label: "TNV",
      render: (value) => <Chip label={value || 0} size="small" sx={{ minWidth: 40 }} />,
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

  // Handle delete
  const handleDelete = async () => {
    if (!selectedEvent) return;
    try {
      await eventService.deleteEvent(selectedEvent.eventId);
      setSnackbar({ open: true, message: "Đã xóa sự kiện thành công!", severity: "success" });
      fetchEvents();
    } catch (err) {
      console.error("Failed to delete event:", err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || "Không thể xóa sự kiện.", 
        severity: "error" 
      });
    }
    setDeleteDialogOpen(false);
    setSelectedEvent(null);
  };

  const actions = [
    {
      label: "Xem",
      icon: <Visibility sx={{ fontSize: 18 }} />,
      onClick: (row) => navigate(`/events/${row.eventId}`),
    },
    {
      label: "Quản lý TNV",
      icon: <People sx={{ fontSize: 18 }} />,
      onClick: (row) => navigate(`/manage/events/${row.eventId}/participants`),
    },
    {
      label: "Sửa",
      icon: <Edit sx={{ fontSize: 18 }} />,
      onClick: (row) => navigate(`/manage/events/${row.eventId}/edit`),
    },
    {
      label: "Xóa",
      icon: <Delete sx={{ fontSize: 18 }} />,
      color: "error.main",
      onClick: (row) => {
        setSelectedEvent(row);
        setDeleteDialogOpen(true);
      },
    },
  ];

  return (
    <ThreeColumnLayout user={user} role="manager" showRightSidebar={true} showSearch={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Quản lý sự kiện
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              startIcon={<Refresh />}
              onClick={fetchEvents}
              sx={{ textTransform: "none" }}
            >
              Làm mới
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<Add />}
              onClick={() => navigate("/manage/events/new")}
              sx={{ borderRadius: "9999px", textTransform: "none", fontWeight: 600 }}
            >
              Tạo sự kiện
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: "12px" }}>{error}</Alert>
        ) : events.length > 0 ? (
          <DataTable
            columns={columns}
            data={events}
            searchable
            searchPlaceholder="Tìm kiếm sự kiện..."
            actions={actions}
            rowKey="eventId"
          />
        ) : (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Event sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Chưa có sự kiện nào
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Bạn chưa tạo sự kiện nào. Hãy tạo sự kiện đầu tiên!
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/manage/events/new")}
              sx={{ borderRadius: "9999px", textTransform: "none" }}
            >
              Tạo sự kiện
            </Button>
          </Box>
        )}
      </Box>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedEvent(null);
        }}
        onConfirm={handleDelete}
        title="Xóa sự kiện?"
        message={`Bạn có chắc chắn muốn xóa sự kiện "${selectedEvent?.title}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        variant="danger"
      />

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

export default EventManagement;
