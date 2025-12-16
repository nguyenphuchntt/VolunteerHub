import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Event,
  People,
  TrendingUp,
  Pending,
  CheckCircle,
  Block,
  ArrowForward,
  Download,
  Visibility,
  Speed,
  AccessTime,
  NewReleases,
  EmojiEvents,
} from "@mui/icons-material";
import { ThreeColumnLayout, StatsCard } from "../../components/common";
import { mockUsers } from "../../data/mockData";
import { mockEvents } from "../../data/mockEvents";
import {
  mockAdminStats,
  mockPendingEvents,
  mockTrendingEvents,
  mockRecentActivity,
} from "../../data/mockAdminData";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = mockUsers[0]; // Admin user

  const stats = [
    {
      title: "Tổng sự kiện",
      value: mockAdminStats.totalEvents.toString(),
      icon: <Event />,
      trend: "up",
      trendValue: `+${mockAdminStats.newEventsThisWeek} tuần này`,
      color: "primary",
    },
    {
      title: "Tình nguyện viên",
      value: mockAdminStats.totalVolunteers.toLocaleString(),
      icon: <People />,
      trend: "up",
      trendValue: `+${mockAdminStats.newUsersThisWeek}`,
      color: "success",
    },
    {
      title: "Đang chờ duyệt",
      value: mockAdminStats.pendingApprovals.toString(),
      icon: <Pending />,
      color: "warning",
    },
    {
      title: "Giờ tình nguyện",
      value: mockAdminStats.totalHoursVolunteered.toLocaleString() + "h",
      icon: <AccessTime />,
      color: "info",
    },
  ];

  const getApprovalStatusChip = (status) => {
    const config = {
      pending: { label: "Chờ duyệt", color: "#ed6c02", bg: "#fff4e5" },
      approved: { label: "Đã duyệt", color: "#2e7d32", bg: "#edf7ed" },
      rejected: { label: "Từ chối", color: "#d32f2f", bg: "#fdeded" },
    };
    const c = config[status] || config.pending;
    return (
      <Chip
        label={c.label}
        size="small"
        sx={{
          backgroundColor: c.bg,
          color: c.color,
          fontWeight: 600,
          fontSize: "10px",
        }}
      />
    );
  };

  const getActivityIcon = (type) => {
    const icons = {
      event_created: <NewReleases sx={{ color: "primary.main" }} />,
      user_registered: <People sx={{ color: "success.main" }} />,
      event_approved: <CheckCircle sx={{ color: "success.main" }} />,
      milestone: <EmojiEvents sx={{ color: "warning.main" }} />,
    };
    return icons[type] || <Event />;
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
        {/* Stats Grid */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {stats.map((stat, index) => (
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
                  label={mockPendingEvents.filter((e) => e.approvalStatus === "pending").length}
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

            {mockPendingEvents
              .filter((e) => e.approvalStatus === "pending")
              .slice(0, 3)
              .map((event) => (
                <Box
                  key={event.id}
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
                  <Box
                    component="img"
                    src={event.coverImage}
                    alt={event.title}
                    sx={{ width: 56, height: 56, borderRadius: "8px", objectFit: "cover" }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {event.title}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                      <Avatar src={event.host.avatar} sx={{ width: 16, height: 16 }} />
                      <Typography variant="caption" color="text.secondary">
                        {event.host.name}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="Duyệt">
                      <IconButton size="small" color="success">
                        <CheckCircle sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Từ chối">
                      <IconButton size="small" color="error">
                        <Block sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ))}
          </CardContent>
        </Card>

        {/* Trending Events */}
        <Card
          elevation={0}
          sx={{ borderRadius: "16px", border: "1px solid", borderColor: "grey.200", mb: 2 }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <TrendingUp sx={{ color: "primary.main", fontSize: 20 }} />
              <Typography variant="subtitle1" fontWeight={700}>
                Sự kiện thu hút
              </Typography>
            </Box>

            {mockTrendingEvents.map((event, index) => (
              <Box
                key={event.id}
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
                onClick={() => navigate(`/events/${event.id}`)}
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      <TrendingUp sx={{ fontSize: 12, mr: 0.5, verticalAlign: "middle" }} />
                      +{event.growthRate}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      +{event.newMembers} thành viên
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  icon={<Speed sx={{ fontSize: 14 }} />}
                  label={event.engagement}
                  size="small"
                  sx={{
                    backgroundColor: index === 0 ? "primary.main" : "grey.300",
                    color: index === 0 ? "#fff" : "text.primary",
                    fontWeight: 600,
                    fontSize: "11px",
                  }}
                />
              </Box>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card elevation={0} sx={{ borderRadius: "16px", border: "1px solid", borderColor: "grey.200" }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Hoạt động gần đây
            </Typography>

            {mockRecentActivity.map((activity) => (
              <Box
                key={activity.id}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  p: 1,
                  mb: 1,
                  "&:last-child": { mb: 0 },
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: "grey.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {getActivityIcon(activity.type)}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">{activity.message}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {activity.timestamp}
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

export default AdminDashboard;
