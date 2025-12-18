import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Button, Chip, Avatar, Tabs, Tab, CircularProgress, Alert, Snackbar } from "@mui/material";
import { CheckCircle, Cancel, Refresh } from "@mui/icons-material";
import { ThreeColumnLayout, DataTable, ConfirmDialog, EmptyState } from "../../components/common";
import { eventUserService, eventService } from "../../api";
import { useAuth } from "../../context/AuthContext";

const ParticipantManagement = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { user } = useAuth();

  // API states
  const [participants, setParticipants] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [activeTab, setActiveTab] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null, participant: null });

  // Fetch event details if eventId provided
  const fetchEvent = useCallback(async () => {
    if (!eventId) return;
    try {
      const eventData = await eventService.getEventById(eventId);
      setEvent(eventData);
    } catch (err) {
      console.error("Failed to fetch event:", err);
    }
  }, [eventId]);

  // Fetch participants
  const fetchParticipants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Filter by eventId if provided, otherwise get all with PENDING status first
      const params = eventId 
        ? { eventId: eventId }
        : activeTab === 1 
          ? { status: "PENDING" } 
          : activeTab === 2 
            ? { status: "APPROVED" }
            : {};
      
      const response = await eventUserService.searchEventUsers(params);
      setParticipants(response.content || []);
    } catch (err) {
      console.error("Failed to fetch participants:", err);
      setError("Không thể tải danh sách đăng ký.");
    } finally {
      setLoading(false);
    }
  }, [eventId, activeTab]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  // Backend EventUserStatus: APPROVED, REJECTED, PENDING, FINISHED
  const getStatusColor = (status) => {
    const statusUpper = (status || "PENDING").toUpperCase();
    const colors = {
      PENDING: { bg: "#fff3e0", color: "#f57c00" },
      APPROVED: { bg: "#e8f5e9", color: "#388e3c" },
      FINISHED: { bg: "#e3f2fd", color: "#1976d2" },
      REJECTED: { bg: "#ffebee", color: "#d32f2f" },
    };
    return colors[statusUpper] || colors.PENDING;
  };

  const getStatusLabel = (status) => {
    const statusUpper = (status || "PENDING").toUpperCase();
    const labels = { 
      PENDING: "Chờ duyệt", 
      APPROVED: "Đã duyệt", 
      FINISHED: "Hoàn thành", 
      REJECTED: "Từ chối" 
    };
    return labels[statusUpper] || status;
  };

  // Handle approve/reject
  const handleConfirmAction = async () => {
    const { action, participant } = confirmDialog;
    if (!participant) return;
    
    const newStatus = action === "approve" ? "APPROVED" : "REJECTED";
    
    try {
      await eventUserService.updateEventUserStatus(
        participant.eventId, 
        participant.accountId, 
        newStatus
      );
      
      setSnackbar({
        open: true,
        message: `Đã ${action === "approve" ? "duyệt" : "từ chối"} đăng ký thành công!`,
        severity: "success"
      });
      
      // Refresh the list
      fetchParticipants();
    } catch (err) {
      console.error("Failed to update status:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || `Không thể ${action === "approve" ? "duyệt" : "từ chối"} đăng ký.`,
        severity: "error"
      });
    }
    
    setConfirmDialog({ open: false, action: null, participant: null });
  };

  const columns = [
    {
      id: "username",
      label: "Tình nguyện viên",
      render: (value, row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
            {(row.firstName || row.username || "?").charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {row.firstName && row.lastName ? `${row.firstName} ${row.lastName}` : value}
            </Typography>
            <Typography variant="caption" color="text.secondary">@{value}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: "title",
      label: "Sự kiện",
      render: (value) => (
        <Typography variant="body2" sx={{ maxWidth: 200 }} noWrap title={value}>
          {value}
        </Typography>
      )
    },
    { 
      id: "eventUserRole", 
      label: "Vai trò",
      render: (value) => value || "PARTICIPANT"
    },
    {
      id: "status",
      label: "Trạng thái",
      render: (value) => {
        const c = getStatusColor(value);
        return <Chip label={getStatusLabel(value)} size="small" sx={{ backgroundColor: c.bg, color: c.color, fontWeight: 500, fontSize: "11px" }} />;
      },
    },
  ];

  const actions = [
    { 
      label: "Duyệt", 
      icon: <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />, 
      onClick: (row) => row.status?.toUpperCase() === "PENDING" && setConfirmDialog({ open: true, action: "approve", participant: row }),
      disabled: (row) => row.status?.toUpperCase() !== "PENDING"
    },
    { 
      label: "Từ chối", 
      icon: <Cancel sx={{ fontSize: 16 }} />, 
      color: "error.main", 
      onClick: (row) => row.status?.toUpperCase() === "PENDING" && setConfirmDialog({ open: true, action: "reject", participant: row }),
      disabled: (row) => row.status?.toUpperCase() !== "PENDING"
    },
  ];

  const pendingCount = participants.filter((p) => p.status?.toUpperCase() === "PENDING").length;

  return (
    <ThreeColumnLayout user={user} role="manager" showRightSidebar={true} showSearch={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            {event ? `TNV - ${event.title}` : "Quản lý tình nguyện viên"}
          </Typography>
          <Button 
            size="small" 
            startIcon={<Refresh />} 
            onClick={fetchParticipants}
            sx={{ textTransform: "none" }}
          >
            Làm mới
          </Button>
        </Box>

        {!eventId && (
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            sx={{ px: 2, "& .MuiTab-root": { textTransform: "none", fontWeight: 500, fontSize: "14px" } }}
          >
            <Tab label="Tất cả" />
            <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Chờ duyệt <Chip label={pendingCount} size="small" color="warning" sx={{ height: 18, fontSize: "10px" }} /></Box>} />
            <Tab label="Đã duyệt" />
          </Tabs>
        )}
      </Box>

      <Box sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: "12px" }}>{error}</Alert>
        ) : participants.length > 0 ? (
          <DataTable columns={columns} data={participants} searchable searchPlaceholder="Tìm kiếm..." actions={actions} />
        ) : (
          <EmptyState title="Chưa có đăng ký" description="Chưa có ai đăng ký tham gia." />
        )}
      </Box>

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, action: null, participant: null })}
        onConfirm={handleConfirmAction}
        title={confirmDialog.action === "approve" ? "Duyệt đăng ký?" : "Từ chối đăng ký?"}
        message={`Bạn có chắc chắn muốn ${confirmDialog.action === "approve" ? "duyệt" : "từ chối"} đăng ký của "${confirmDialog.participant?.firstName || confirmDialog.participant?.username}"?`}
        confirmLabel={confirmDialog.action === "approve" ? "Duyệt" : "Từ chối"}
        variant={confirmDialog.action === "approve" ? "success" : "danger"}
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

export default ParticipantManagement;

