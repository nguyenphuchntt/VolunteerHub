import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Typography, Button, Card, CardContent, Avatar, AvatarGroup, Chip } from "@mui/material";
import { Event, TrendingUp, People, Notifications, ArrowForward, CalendarMonth, LocationOn } from "@mui/icons-material";
import { ThreeColumnLayout, PageHeader, StatsCard } from "../../components/common";
import { mockEvents } from "../../data/mockEvents";
import { mockUsers } from "../../data/mockData";

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const user = mockUsers[0];

  // Mock dashboard data
  const stats = [
    { title: "Sự kiện đã tham gia", value: "12", icon: <Event />, trend: "up", trendValue: "+2 tháng này", color: "primary" },
    { title: "Sự kiện sắp tới", value: "3", icon: <CalendarMonth />, color: "info" },
    { title: "Giờ tình nguyện", value: "48h", icon: <TrendingUp />, trend: "up", trendValue: "+8h", subtitle: "so với tháng trước", color: "success" },
    { title: "Thông báo mới", value: "5", icon: <Notifications />, color: "warning" },
  ];

  // New events
  const newEvents = mockEvents.filter(e => e.status === "upcoming").slice(0, 3);
  
  // Trending events
  const trendingEvents = [...mockEvents].sort((a, b) => b.stats.going - a.stats.going).slice(0, 3);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", { day: "numeric", month: "short" });
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
          Dashboard
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Xin chào, {user.name}! Đây là tổng quan hoạt động của bạn.
        </Typography>

        {/* Stats Grid */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <StatsCard {...stat} />
            </Grid>
          ))}
        </Grid>

        {/* New Events */}
        <Card elevation={0} sx={{ borderRadius: "16px", border: "1px solid", borderColor: "grey.200", mb: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Sự kiện mới
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowForward />}
                onClick={() => navigate("/events")}
                sx={{ textTransform: "none", fontWeight: 500 }}
              >
                Xem tất cả
              </Button>
            </Box>

            {newEvents.map((event) => (
              <Box
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
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
                  component="img"
                  src={event.coverImage}
                  alt={event.title}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {event.title}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                    <CalendarMonth sx={{ fontSize: 12, color: "text.secondary" }} />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(event.date)}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={event.category}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: "10px",
                    backgroundColor: "primary.light",
                    color: "#fff",
                  }}
                />
              </Box>
            ))}
          </CardContent>
        </Card>

        {/* Trending Events */}
        <Card elevation={0} sx={{ borderRadius: "16px", border: "1px solid", borderColor: "grey.200" }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <TrendingUp sx={{ color: "primary.main", fontSize: 20 }} />
              <Typography variant="subtitle1" fontWeight={700}>
                Sự kiện thu hút
              </Typography>
            </Box>

            {trendingEvents.map((event, index) => (
              <Box
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
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
                    {event.stats.going} đã tham gia
                  </Typography>
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
    </ThreeColumnLayout>
  );
};

export default VolunteerDashboard;
