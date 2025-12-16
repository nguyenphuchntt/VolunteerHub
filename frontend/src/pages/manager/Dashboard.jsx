import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Typography, Card, CardContent, Button, Avatar, Chip, LinearProgress } from "@mui/material";
import { Event, People, TrendingUp, Add, ArrowForward, CheckCircle, HourglassEmpty, Cancel } from "@mui/icons-material";
import { ThreeColumnLayout, StatsCard } from "../../components/common";
import { mockEvents } from "../../data/mockEvents";
import { mockUsers } from "../../data/mockData";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const user = mockUsers[0];

  // Mock manager data
  const myEvents = mockEvents.slice(0, 4);
  const pendingRegistrations = 12;
  const totalParticipants = myEvents.reduce((sum, e) => sum + e.participants.length, 0);

  const stats = [
    { title: "Sự kiện của tôi", value: myEvents.length.toString(), icon: <Event />, color: "primary" },
    { title: "Đang chờ duyệt", value: pendingRegistrations.toString(), icon: <HourglassEmpty />, color: "warning" },
    { title: "Tổng TNV", value: totalParticipants.toString(), icon: <People />, trend: "up", trendValue: "+8", color: "success" },
    { title: "Hoàn thành", value: "2", icon: <CheckCircle />, color: "info" },
  ];

  const getStatusChip = (status) => {
    const config = {
      upcoming: { label: "Sắp diễn ra", color: "#1976d2", bg: "#e3f2fd" },
      ongoing: { label: "Đang diễn ra", color: "#388e3c", bg: "#e8f5e9" },
      completed: { label: "Hoàn thành", color: "#7b1fa2", bg: "#f3e5f5" },
    };
    const c = config[status] || config.upcoming;
    return (
      <Chip label={c.label} size="small" sx={{ backgroundColor: c.bg, color: c.color, fontWeight: 600, fontSize: "10px" }} />
    );
  };

  return (
    <ThreeColumnLayout user={user} role="manager" showRightSidebar={true} showSearch={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Dashboard Quản lý
          </Typography>
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

      <Box sx={{ p: 2 }}>
        {/* Stats Grid */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} key={index}>
              <StatsCard {...stat} />
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

            {myEvents.map((event) => (
              <Box
                key={event.id}
                onClick={() => navigate(`/manage/events/${event.id}`)}
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
                      Tình nguyện viên
                    </Typography>
                    <Typography variant="caption" fontWeight={600}>
                      {event.participants.length} / {event.stats.going}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(event.participants.length / event.stats.going) * 100}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: "grey.200",
                      "& .MuiLinearProgress-bar": { borderRadius: 2 },
                    }}
                  />
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>

        {/* Recent Registrations */}
        <Card elevation={0} sx={{ borderRadius: "16px", border: "1px solid", borderColor: "grey.200" }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Đăng ký mới
              </Typography>
              <Chip label={pendingRegistrations} size="small" color="warning" />
            </Box>

            {mockUsers.slice(0, 3).map((u, index) => (
              <Box
                key={u.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1,
                  mb: 1,
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "grey.50" },
                }}
              >
                <Avatar src={u.avatar} alt={u.name} sx={{ width: 32, height: 32 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={500} noWrap>
                    {u.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {myEvents[index % myEvents.length]?.title}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <Button size="small" variant="contained" color="success" sx={{ minWidth: 28, px: 0.5, py: 0.25 }}>
                    <CheckCircle sx={{ fontSize: 14 }} />
                  </Button>
                  <Button size="small" variant="outlined" color="error" sx={{ minWidth: 28, px: 0.5, py: 0.25 }}>
                    <Cancel sx={{ fontSize: 14 }} />
                  </Button>
                </Box>
              </Box>
            ))}

            <Button
              fullWidth
              variant="outlined"
              size="small"
              onClick={() => navigate("/manage/participants")}
              sx={{ mt: 1, textTransform: "none", borderRadius: "8px" }}
            >
              Xem tất cả
            </Button>
          </CardContent>
        </Card>
      </Box>
    </ThreeColumnLayout>
  );
};

export default ManagerDashboard;
