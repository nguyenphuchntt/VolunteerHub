import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Chip, 
  LinearProgress, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import { 
  Event, 
  People, 
  Add, 
  ArrowForward, 
  CheckCircle, 
  HourglassEmpty,
  Edit,
  Visibility,
  Delete,
} from "@mui/icons-material";
import { ThreeColumnLayout, StatsCard, ConfirmDialog } from "../../components/common";
import { managerService } from "../../api/services/manager.service";
import { eventService } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { buildEventUrl, buildManageEventUrl, buildEditEventUrl } from "../../utils/urlUtils";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // API states
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Event action dialog states
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Fetch manager's events
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      // Get events managed by current user (uses /api/manager/me/managed-events)
      const response = await managerService.getManagedEvents();
      setMyEvents(response.content || []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Calculate stats
  const totalParticipants = myEvents.reduce((sum, e) => sum + (e.attendeeCount || 0), 0);
  const completedEvents = myEvents.filter(e => e.status === "FINISHED").length;
  const pendingEvents = myEvents.filter(e => e.status === "PENDING").length;

  const stats = [
    { title: "Sự kiện của tôi", value: myEvents.length.toString(), icon: <Event />, color: "primary" },
    { title: "Đang chờ duyệt", value: pendingEvents.toString(), icon: <HourglassEmpty />, color: "warning" },
    { title: "Tổng TNV", value: totalParticipants.toString(), icon: <People />, color: "success" },
    { title: "Hoàn thành", value: completedEvents.toString(), icon: <CheckCircle />, color: "info" },
  ];

  const getStatusChip = (status) => {
    const statusUpper = (status || "").toUpperCase();
    const config = {
      PENDING: { label: "Chờ duyệt", color: "#f57c00", bg: "#fff3e0" },
      SCHEDULED: { label: "Đã duyệt", color: "#1976d2", bg: "#e3f2fd" },
      STARTED: { label: "Đang diễn ra", color: "#388e3c", bg: "#e8f5e9" },
      FINISHED: { label: "Hoàn thành", color: "#7b1fa2", bg: "#f3e5f5" },
      CANCELLED: { label: "Đã hủy", color: "#d32f2f", bg: "#ffebee" },
    };
    const c = config[statusUpper] || config.PENDING;
    return (
      <Chip label={c.label} size="small" sx={{ backgroundColor: c.bg, color: c.color, fontWeight: 600, fontSize: "10px" }} />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "short",
    });
  };

  // Handle event click - open action dialog
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setActionDialogOpen(true);
  };

  // Handle delete event
  const handleDeleteEvent = async () => {
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
    setActionDialogOpen(false);
    setSelectedEvent(null);
  };

  return (
    <>
      <ThreeColumnLayout user={user} role="manager" showRightSidebar={true} showSearch={false}>
        {/* Header */}
        <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              Dashboard Quản lý
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 2 }}>
          {/* Stats Grid - 2 cards in a row */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {stats.map((stat, index) => (
              <Grid size={6} key={index} sx={{ display: 'flex' }}>
                <StatsCard {...stat} sx={{ flex: 1, height: '100%' }} />
              </Grid>
            ))}
          </Grid>

          {/* My Events */}
          <Card elevation={0} sx={{ borderRadius: "16px", border: "1px solid", borderColor: "grey.200", mb: 2 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={700}>
                  Sự kiện của tôi
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate("/manage/events")}
                  sx={{ textTransform: "none", fontWeight: 500 }}
                >
                  Xem tất cả
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : myEvents.length > 0 ? (
                myEvents.slice(0, 4).map((event) => (
                  <Box
                    key={event.eventId}
                    onClick={() => handleEventClick(event)}
                    sx={{
                      p: 1.5,
                      mb: 1.5,
                      borderRadius: "12px",
                      border: "1px solid",
                      borderColor: "grey.200",
                      cursor: "pointer",
                      "&:hover": { borderColor: "primary.main" },
                      "&:last-child": { mb: 0 },
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2" fontWeight={600} noWrap sx={{ flex: 1 }}>
                        {event.title}
                      </Typography>
                      {getStatusChip(event.status)}
                    </Box>

                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(event.startAt)}
                        </Typography>
                        <Typography variant="caption" fontWeight={600}>
                          {event.attendeeCount || 0} TNV
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min((event.attendeeCount || 0) * 10, 100)}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: "grey.200",
                          "& .MuiLinearProgress-bar": { borderRadius: 2 },
                        }}
                      />
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                  Chưa có sự kiện nào
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </ThreeColumnLayout>

      {/* Event Action Dialog */}
      <Dialog
        open={actionDialogOpen}
        onClose={() => {
          setActionDialogOpen(false);
          setSelectedEvent(null);
        }}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" fontWeight={700} noWrap sx={{ flex: 1, pr: 2 }}>
              {selectedEvent?.title}
            </Typography>
            {getStatusChip(selectedEvent?.status)}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {formatDate(selectedEvent?.startAt)} • {selectedEvent?.attendeeCount || 0} TNV
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<People />}
              onClick={() => {
                setActionDialogOpen(false);
                navigate(buildManageEventUrl(selectedEvent));
              }}
              sx={{ 
                justifyContent: "flex-start", 
                borderRadius: "12px", 
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Quản lý
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => {
                setActionDialogOpen(false);
                navigate(buildEditEventUrl(selectedEvent));
              }}
              sx={{ 
                justifyContent: "flex-start", 
                borderRadius: "12px", 
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Sửa thông tin sự kiện
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Visibility />}
              onClick={() => {
                setActionDialogOpen(false);
                navigate(buildEventUrl(selectedEvent));
              }}
              sx={{ 
                justifyContent: "flex-start", 
                borderRadius: "12px", 
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Xem chi tiết sự kiện
            </Button>
            <Divider sx={{ my: 0.5 }} />
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => setDeleteDialogOpen(true)}
              sx={{ 
                justifyContent: "flex-start", 
                borderRadius: "12px", 
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Xóa sự kiện
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            fullWidth
            onClick={() => {
              setActionDialogOpen(false);
              setSelectedEvent(null);
            }}
            sx={{ borderRadius: "12px", textTransform: "none" }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteEvent}
        title="Xóa sự kiện?"
        message={`Bạn có chắc chắn muốn xóa sự kiện "${selectedEvent?.title}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        variant="danger"
      />

      {/* Snackbar */}
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
    </>
  );
};

export default ManagerDashboard;
