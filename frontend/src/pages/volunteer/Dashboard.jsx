import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Typography, Button, Card, CardContent, Chip, CircularProgress } from "@mui/material";
import { Event, TrendingUp, People, Notifications, ArrowForward, CalendarMonth, LocationOn } from "@mui/icons-material";
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
  const completedCount = myEvents.filter(e => e.status === "COMPLETED").length;

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
            <Grid item xs={12} sm={6} key={index}>
              <StatsCard {...stat} />
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
                </Box>

                {myEvents.length > 0 ? (
                  myEvents.slice(0, 5).map((eventUser, index) => (
                    <Box
                      key={eventUser.eventId || index}
                      onClick={() => navigate(`/events/${eventUser.eventId}`)}
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        p: 1.5,
                        mb: 1,
                        borderRadius: "12px",
                        cursor: "pointer",
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
                        }}
                      >
                        <Event sx={{ color: "white", fontSize: 24 }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {eventUser.eventTitle || `Sự kiện #${eventUser.eventId}`}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                          <CalendarMonth sx={{ fontSize: 12, color: "text.secondary" }} />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(eventUser.startAt)}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={eventUser.eventUserRole || "TNV"}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: "10px",
                          backgroundColor: "primary.light",
                          color: "#fff",
                        }}
                      />
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                    Bạn chưa đăng ký sự kiện nào. <Button onClick={() => navigate("/explore")}>Khám phá ngay!</Button>
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Trending Events */}
            <Card elevation={0} sx={{ borderRadius: "16px", border: "1px solid", borderColor: "grey.200" }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TrendingUp sx={{ color: "primary.main", fontSize: 20 }} />
                    <Typography variant="subtitle1" fontWeight={700}>
                      Sự kiện nổi bật
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/explore")}
                    sx={{ textTransform: "none", fontWeight: 500 }}
                  >
                    Xem tất cả
                  </Button>
                </Box>

                {trendingEvents.map((event, index) => (
                  <Box
                    key={event.eventId || index}
                    onClick={() => navigate(`/events/${event.eventId}`)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1.5,
                      mb: 1,
                      borderRadius: "12px",
                      backgroundColor: index === 0 ? "rgba(136, 178, 139, 0.1)" : "grey.50",
                      cursor: "pointer",
                      "&:hover": { opacity: 0.8 },
                      "&:last-child": { mb: 0 },
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color={index === 0 ? "primary.main" : "text.secondary"}
                      sx={{ width: 28 }}
                    >
                      #{index + 1}
                    </Typography>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {event.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ❤️ {event.likeCount || 0} • {event.attendeeCount || 0} người tham gia
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </ThreeColumnLayout>
  );
};

export default VolunteerDashboard;

