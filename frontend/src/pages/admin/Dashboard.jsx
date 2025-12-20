import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Event,
  People,
  Pending,
  AccessTime,
  Download,
  CheckCircle,
  Cancel
} from "@mui/icons-material";
import { ThreeColumnLayout, StatsCard } from "../../components/common";
import { adminService } from "../../api/services/admin.service";
import { useAuth } from "../../context/AuthContext";
import DashboardCharts from "./components/DashboardCharts";
import DashboardRankings from "./components/DashboardRankings";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [overview, setOverview] = useState(null);
  const [newUsersData, setNewUsersData] = useState([]);
  const [newEventsData, setNewEventsData] = useState([]);
  const [topActiveUsers, setTopActiveUsers] = useState([]);
  const [topInteractiveUsers, setTopInteractiveUsers] = useState([]);
  const [topEvents, setTopEvents] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        overviewRes,
        newUsersRes,
        newEventsRes,
        topActiveRes,
        topInteractiveRes,
        topEventsRes
      ] = await Promise.all([
        adminService.getStatsOverview(),
        adminService.getStatsChart('new_users_last_7_days'),
        adminService.getStatsChart('new_events_last_7_days'),
        adminService.getStatsRanking('top_active_users'),
        adminService.getStatsRanking('top_interactive_users'),
        adminService.getStatsRanking('top_events')
      ]);

      setOverview(overviewRes);
      setNewUsersData(newUsersRes.data || []);
      setNewEventsData(newEventsRes.data || []);
      setTopActiveUsers(topActiveRes || []);
      setTopInteractiveUsers(topInteractiveRes || []);
      setTopEvents(topEventsRes || []);

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

  if (loading) {
    return (
      <ThreeColumnLayout user={user} role="admin" showRightSidebar={true}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </ThreeColumnLayout>
    );
  }

  if (error) {
    return (
      <ThreeColumnLayout user={user} role="admin" showRightSidebar={true}>
        <Box sx={{ p: 2 }}>
          <Alert severity="error">{error}</Alert>
          <Button onClick={fetchData} sx={{ mt: 2 }}>Thử lại</Button>
        </Box>
      </ThreeColumnLayout>
    );
  }

  const statsCards = [
    {
      title: "Tổng người dùng",
      value: overview?.users?.summary?.total?.toLocaleString() || "0",
      icon: <People />,
      color: "primary",
    },
    {
      title: "Người dùng mới (tháng)",
      value: overview?.users?.summary?.newThisMonth?.toLocaleString() || "0",
      icon: <People />,
      color: "success",
    },
    {
      title: "Tổng sự kiện",
      value: overview?.events?.summary?.total?.toLocaleString() || "0",
      icon: <Event />,
      color: "info",
    },
    {
      title: "Sự kiện chờ duyệt",
      value: overview?.events?.summary?.pending?.toLocaleString() || "0",
      icon: <Pending />,
      color: "warning",
    },
  ];

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
        {/* Stats Grid - 2 cards in a row, fill evenly */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {statsCards.map((stat, index) => (
            <Grid size={6} key={index} sx={{ display: 'flex' }}>
              <StatsCard {...stat} sx={{ flex: 1, height: '100%' , width: '40%'}} />
            </Grid>
          ))}
        </Grid>

        {/* Detailed Stats Cards - 2 columns layout */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
           <Grid size={{ xs: 12, sm: 6 }}>
                <Card elevation={0} sx={{ borderRadius: "16px", border: "1px solid", borderColor: "grey.200", height: '100%' }}>
                    <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <CheckCircle color="success" sx={{ fontSize: 20 }} />
                            <Typography variant="subtitle2" fontWeight={600}>Hiệu suất sự kiện</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Tổng người tham gia: <Typography component="span" fontWeight="bold" color="text.primary">{overview?.events?.performance?.totalAttendees}</Typography></Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Tỷ lệ hoàn thành: <Typography component="span" fontWeight="bold" color="text.primary">{overview?.events?.performance?.completionRate?.toFixed(2)}%</Typography></Typography>
                        <Typography variant="body2" color="text.secondary">TB người/sự kiện: <Typography component="span" fontWeight="bold" color="text.primary">{overview?.events?.performance?.avgAttendeesPerEvent?.toFixed(2)}</Typography></Typography>
                    </CardContent>
                </Card>
           </Grid>
           <Grid size={{ xs: 12, sm: 6 }}>
                <Card elevation={0} sx={{ borderRadius: "16px", border: "1px solid", borderColor: "grey.200", height: '100%' }}>
                    <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <AccessTime color="info" sx={{ fontSize: 20 }} />
                            <Typography variant="subtitle2" fontWeight={600}>Trạng thái sự kiện</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Đang diễn ra: <Typography component="span" fontWeight="bold" color="text.primary">{overview?.events?.summary?.ongoing}</Typography></Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Đã kết thúc: <Typography component="span" fontWeight="bold" color="text.primary">{overview?.events?.summary?.finished}</Typography></Typography>
                        <Typography variant="body2" color="text.secondary">Đã hủy: <Typography component="span" fontWeight="bold" color="text.primary">{overview?.events?.summary?.cancelled}</Typography></Typography>
                    </CardContent>
                </Card>
           </Grid>
           <Grid size={{ xs: 12, sm: 6 }}>
                <Card elevation={0} sx={{ borderRadius: "16px", border: "1px solid", borderColor: "grey.200", height: '100%' }}>
                    <CardContent sx={{ p: 2.5 }}>
                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <People color="primary" sx={{ fontSize: 20 }} />
                            <Typography variant="subtitle2" fontWeight={600}>Phân loại người dùng</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Người dùng: <Typography component="span" fontWeight="bold" color="text.primary">{overview?.users?.byRole?.USER}</Typography></Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Quản lý: <Typography component="span" fontWeight="bold" color="text.primary">{overview?.users?.byRole?.MANAGER}</Typography></Typography>
                        <Typography variant="body2" color="text.secondary">Admin: <Typography component="span" fontWeight="bold" color="text.primary">{overview?.users?.byRole?.ADMIN}</Typography></Typography>
                    </CardContent>
                </Card>
           </Grid>
        </Grid>

        {/* Charts */}
        <DashboardCharts newUsersData={newUsersData} newEventsData={newEventsData} />

        {/* Rankings */}
        <DashboardRankings 
            topActiveUsers={topActiveUsers} 
            topInteractiveUsers={topInteractiveUsers} 
            topEvents={topEvents}
        />

      </Box>
    </ThreeColumnLayout>
  );
};

export default AdminDashboard;
