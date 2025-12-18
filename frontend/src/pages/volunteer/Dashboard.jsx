import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, Grid, Typography, Button, Card, CardContent, Chip, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Pagination,
  Divider
} from "@mui/material";
import { 
  Event, TrendingUp, Notifications, ArrowForward, CalendarMonth, LocationOn, Close 
} from "@mui/icons-material";
import { ThreeColumnLayout, StatsCard } from "../../components/common";
import { myEventsService, eventService } from "../../api";
import { useAuth } from "../../context/AuthContext";

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // API states
  const [myEvents, setMyEvents] = useState([]);
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const [allEventsPage, setAllEventsPage] = useState(1);
  const [previewEvent, setPreviewEvent] = useState(null);

  const EVENTS_PER_PAGE = 5;

  // Fetch user's registered events
  const fetchMyEvents = useCallback(async () => {
    try {
      const response = await myEventsService.getMyEvents();
      setMyEvents(response.content || []);
    } catch (err) {
      console.error("Failed to fetch my events:", err);
    }
  }, []);

  // Fetch trending/new events
  const fetchEvents = useCallback(async () => {
    try {
      const response = await eventService.searchEvents({ sort: "likeCount,desc" });
      setTrendingEvents(response.content?.slice(0, 5) || []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchMyEvents(), fetchEvents()]);
      setLoading(false);
    };
    loadData();
  }, [fetchMyEvents, fetchEvents]);

  // Calculate stats from real data
  const upcomingCount = myEvents.filter(e => e.status === "PENDING" || e.status === "APPROVED").length;
  const completedCount = myEvents.filter(e => e.status === "FINISHED").length;

  const stats = [
    { title: "Sự kiện đã đăng ký", value: myEvents.length.toString(), icon: <Event />, color: "primary" },
    { title: "Đang chờ/Sắp tới", value: upcomingCount.toString(), icon: <CalendarMonth />, color: "info" },
    { title: "Đã hoàn thành", value: completedCount.toString(), icon: <TrendingUp />, color: "success" },
    { title: "Thông báo mới", value: "0", icon: <Notifications />, color: "warning" },
  ];

  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.username || "bạn";

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("vi-VN", { day: "numeric", month: "short" });
  };

  const formatFullDate = (dateString) => {
    if (!dateString) return "Chưa xác định";
    return new Date(dateString).toLocaleDateString("vi-VN", { 
      weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" 
    });
  };

  // Generate gradient for events without images
  const getGradient = (index) => {
    const gradients = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    ];
    return gradients[index % gradients.length];
  };

  const statusConfig = {
    PENDING: { label: "Chờ duyệt", color: "warning" },
    APPROVED: { label: "Đã tham gia", color: "success" },
    REJECTED: { label: "Bị từ chối", color: "error" },
    FINISHED: { label: "Đã xong", color: "info" },
  };

  // Paginated events for View All dialog
  const paginatedEvents = myEvents.slice(
    (allEventsPage - 1) * EVENTS_PER_PAGE,
    allEventsPage * EVENTS_PER_PAGE
  );
  const totalPages = Math.ceil(myEvents.length / EVENTS_PER_PAGE);

  // Handle event click - show preview
  const handleEventClick = (eventUser) => {
    setPreviewEvent(eventUser);
  };

  // Render event item (reusable)
  const renderEventItem = (eventUser, index) => {
    const status = statusConfig[eventUser.status] || { label: eventUser.status, color: "default" };

    return (
      <Box
        key={eventUser.eventId || index}
        onClick={() => handleEventClick(eventUser)}
        sx={{
          display: "flex",
          gap: 1.5,
          p: 1.5,
          mb: 1,
          borderRadius: "12px",
          cursor: "pointer",
          transition: "background-color 0.2s",
          "&:hover": { backgroundColor: "grey.50" },
          "&:last-child": { mb: 0 },
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: "8px",
            background: getGradient(index),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}
        >
          <Event sx={{ color: "white", fontSize: 24 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} noWrap>
            {eventUser.title || `Sự kiện #${eventUser.eventId}`}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
            <CalendarMonth sx={{ fontSize: 12, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {formatDate(eventUser.startAt)}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
             Vai trò: <strong>{eventUser.role || "TNV"}</strong>
          </Typography>
        </Box>
        
        <Box sx={{ display: "flex", alignItems: "center" }}>
           <Chip
              label={status.label}
              size="small"
              color={status.color}
              variant={eventUser.status === "PENDING" ? "outlined" : "filled"}
              sx={{
                height: 24,
                fontSize: "11px",
                fontWeight: 600
              }}
            />
        </Box>
      </Box>
    );
  };

  return (
    <ThreeColumnLayout user={user} role="volunteer" showRightSidebar={true} showSearch={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ p: 2, position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 10 }}
        >
          Sự kiện của tôi
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Xin chào, {displayName}! Đây là tổng quan hoạt động của bạn.
        </Typography>

        {/* Stats Grid */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} key={index} sx={{ display: "flex" }}>
              <StatsCard {...stat} sx={{ flex: 1 }} />
            </Grid>
          ))}
        </Grid>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* My Registered Events */}
            <Card elevation={0} sx={{ borderRadius: "16px", border: "1px solid", borderColor: "grey.200", mb: 2 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Sự kiện đã đăng ký
                  </Typography>
                  <Button 
                    size="small" 
                    endIcon={<ArrowForward />} 
                    onClick={() => setViewAllOpen(true)}
                    sx={{ textTransform: "none" }}
                  >
                    Xem tất cả
                  </Button>
                </Box>

                {myEvents.length > 0 ? (
                  myEvents.slice(0, 5).map((eventUser, index) => renderEventItem(eventUser, index))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                    Bạn chưa đăng ký sự kiện nào. <Button onClick={() => navigate("/explore")}>Khám phá ngay!</Button>
                  </Typography>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </Box>

      {/* View All Events Dialog */}
      <Dialog 
        open={viewAllOpen} 
        onClose={() => setViewAllOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box component="span" sx={{ fontWeight: 700, fontSize: "1.25rem" }}>Tất cả sự kiện đã đăng ký</Box>
          <IconButton onClick={() => setViewAllOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {paginatedEvents.length > 0 ? (
            paginatedEvents.map((eventUser, index) => renderEventItem(eventUser, index + (allEventsPage - 1) * EVENTS_PER_PAGE))
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
              Không có sự kiện nào.
            </Typography>
          )}
        </DialogContent>
        {totalPages > 1 && (
          <DialogActions sx={{ justifyContent: "center", py: 2 }}>
            <Pagination 
              count={totalPages} 
              page={allEventsPage} 
              onChange={(e, page) => setAllEventsPage(page)}
              color="primary"
            />
          </DialogActions>
        )}
      </Dialog>

      {/* Event Preview Dialog */}
      <Dialog 
        open={Boolean(previewEvent)} 
        onClose={() => setPreviewEvent(null)} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        {previewEvent && (
          <>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box component="span" sx={{ fontWeight: 700, fontSize: "1.25rem", maxWidth: "85%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {previewEvent.title || `Sự kiện #${previewEvent.eventId}`}
              </Box>
              <IconButton onClick={() => setPreviewEvent(null)} size="small">
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarMonth sx={{ color: "text.secondary" }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Thời gian</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatFullDate(previewEvent.startAt)}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOn sx={{ color: "text.secondary" }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Địa điểm</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {previewEvent.location || "Chưa xác định"}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Vai trò của bạn</Typography>
                    <Typography variant="body2" fontWeight={600}>{previewEvent.role || "Tình nguyện viên"}</Typography>
                  </Box>
                  <Chip 
                    label={statusConfig[previewEvent.status]?.label || previewEvent.status}
                    color={statusConfig[previewEvent.status]?.color || "default"}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                {previewEvent.description && (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Mô tả</Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {previewEvent.description.length > 200 
                          ? `${previewEvent.description.substring(0, 200)}...` 
                          : previewEvent.description}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button 
                variant="contained" 
                fullWidth 
                onClick={() => {
                  setPreviewEvent(null);
                  navigate(`/events/${previewEvent.eventId}`);
                }}
                sx={{ borderRadius: "9999px", textTransform: "none", fontWeight: 600 }}
              >
                Xem chi tiết
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </ThreeColumnLayout>
  );
};

export default VolunteerDashboard;
