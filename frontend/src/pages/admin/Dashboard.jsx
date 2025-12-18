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
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Event,
  People,
  TrendingUp,
  Pending,
  ArrowForward,
  Download,
  AccessTime,
} from "@mui/icons-material";
import { ThreeColumnLayout, StatsCard } from "../../components/common";
import { eventService, userService } from "../../api";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // API states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalEvents: 0,
    pendingEvents: 0,
    totalUsers: 0,
    scheduledEvents: 0,
  });
  const [pendingEvents, setPendingEvents] = useState([]);
  const [trendingEvents, setTrendingEvents] = useState([]);

  // Fetch dashboard data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch events with different statuses for stats
      const [allEvents, pendingEventsRes, trendingEventsRes, usersRes] = await Promise.all([
        eventService.searchEvents({ size: 1 }),
        eventService.searchEvents({ status: "PENDING", size: 5 }),
        eventService.searchEvents({ sort: "likeCount,desc", size: 5 }),
        userService.searchUsers({ size: 1 }),
      ]);

      setStats({
        totalEvents: allEvents.totalElements || 0,
        pendingEvents: pendingEventsRes.totalElements || 0,
        totalUsers: usersRes.totalElements || 0,
        scheduledEvents: allEvents.content?.filter(e => e.status === "SCHEDULED").length || 0,
      });

      setPendingEvents(pendingEventsRes.content || []);
      setTrendingEvents(trendingEventsRes.content || []);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Không thể tải dữ liệu dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle quick approve/reject
  const handleQuickApprove = async (eventId) => {
    try {
      await eventService.updateEventStatus(eventId, "SCHEDULED");
      fetchData();
    } catch (err) {
      console.error("Failed to approve event:", err);
    }
  };

  const handleQuickReject = async (eventId) => {
    try {
      await eventService.updateEventStatus(eventId, "CANCELLED");
      fetchData();
    } catch (err) {
      console.error("Failed to reject event:", err);
    }
  };

  const statsCards = [
    {
      title: "Tổng sự kiện",
      value: stats.totalEvents.toString(),
      icon: <Event />,
      color: "primary",
    },
    {
      title: "Người dùng",
      value: stats.totalUsers.toLocaleString(),
      icon: <People />,
      color: "success",
    },
    {
      title: "Chờ duyệt",
      value: stats.pendingEvents.toString(),
      icon: <Pending />,
      color: "warning",
    },
    {
      title: "Đang hoạt động",
      value: stats.scheduledEvents.toString(),
      icon: <AccessTime />,
      color: "info",
    },
  ];

  // Get gradient for event without image
  const getGradient = (category) => {
    const gradients = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    ];
    const hash = (category || "default").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

  return (
    <ThreeColumnLayout user={user} role="admin" showRightSidebar={true} showSearch={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Admin Dashboard
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download />}
            onClick={() => navigate("/admin/export")}
            sx={{ borderRadius: "9999px", textTransform: "none", fontWeight: 600 }}
          >
            Xuất dữ liệu
          </Button>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: "12px" }}>{error}</Alert>
        ) : (
          <>
            {/* Stats Grid */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {statsCards.map((stat, index) => (
                <Grid item xs={6} key={index}>
                  <StatsCard {...stat} />
                </Grid>
              ))}
            </Grid>

            {/* Pending Events */}
            <Card
              elevation={0}
              sx={{ borderRadius: "16px", border: "1px solid", borderColor: "grey.200", mb: 2 }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Pending sx={{ color: "warning.main", fontSize: 20 }} />
                    <Typography variant="subtitle1" fontWeight={700}>
                      Sự kiện chờ duyệt
                    </Typography>
                    <Chip
                      label={stats.pendingEvents}
                      size="small"
                      color="warning"
                      sx={{ height: 20, fontSize: "11px" }}
                    />
                  </Box>
                  <Button
                    size="small"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/admin/events")}
                    sx={{ textTransform: "none", fontWeight: 500 }}
                  >
                    Xem tất cả
                  </Button>
                </Box>

                {pendingEvents.length > 0 ? (
                  pendingEvents.slice(0, 3).map((event) => (
                    <Box
                      key={event.eventId}
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        p: 1.5,
                        mb: 1,
                        borderRadius: "12px",
                        border: "1px solid",
                        borderColor: "grey.200",
                        "&:hover": { borderColor: "primary.main" },
                        "&:last-child": { mb: 0 },
                      }}
                    >
                      {event.coverImage ? (
                        <Box
                          component="img"
                          src={event.coverImage}
                          alt={event.title}
                          sx={{ width: 56, height: 56, borderRadius: "8px", objectFit: "cover" }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "8px",
                            background: getGradient(event.category),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Event sx={{ color: "white", fontSize: 24 }} />
                        </Box>
                      )}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {event.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {event.location || "Chưa có địa điểm"}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Button
                          size="small"
                          color="success"
                          onClick={() => handleQuickApprove(event.eventId)}
                          sx={{ minWidth: 0, p: 0.5 }}
                        >
                          Duyệt
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleQuickReject(event.eventId)}
                          sx={{ minWidth: 0, p: 0.5 }}
                        >
                          Từ chối
                        </Button>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 3 }}>
                    Không có sự kiện nào đang chờ duyệt.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </ThreeColumnLayout>
  );
};

export default AdminDashboard;
