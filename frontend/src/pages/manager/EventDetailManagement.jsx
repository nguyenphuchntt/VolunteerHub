import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Box, Typography, Button, Chip, Avatar, Tabs, Tab, CircularProgress, Alert, Snackbar,
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel,
  Card, CardContent, Grid, LinearProgress
} from "@mui/material";
import { 
  CheckCircle, Cancel, Refresh, TaskAlt, PersonRemove, AdminPanelSettings,
  Dashboard, People, TrendingUp, PieChart, Timeline
} from "@mui/icons-material";
import { ThreeColumnLayout, DataTable, ConfirmDialog, EmptyState } from "../../components/common";
import { eventUserService, eventService, managerService } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { extractEventIdFromSlug } from "../../utils/urlUtils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const EventDetailManagement = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const eventId = useMemo(() => extractEventIdFromSlug(slug), [slug]);
  const { user } = useAuth();

  // API states
  const [participants, setParticipants] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Dashboard data
  const [dashboardData, setDashboardData] = useState({
    overview: null,
    byStatus: null,
    byRole: null,
    attendanceRate: null,
    timeline: null
  });
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // Tabs: 0 = Dashboard, 1 = Chờ duyệt, 2 = Thành viên, 3 = Quản lý role
  const [activeTab, setActiveTab] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null, participant: null });
  
  // Batch selection states
  const [selectedIds, setSelectedIds] = useState([]);
  const [batchConfirmOpen, setBatchConfirmOpen] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);

  // Role change dialog
  const [roleDialog, setRoleDialog] = useState({ open: false, participant: null, newRole: "ATTENDEE" });

  // Fetch event details
  const fetchEvent = useCallback(async () => {
    if (!eventId) return;
    try {
      const eventData = await eventService.getEventById(eventId);
      setEvent(eventData);
    } catch (err) {
      console.error("Failed to fetch event:", err);
    }
  }, [eventId]);

  // Fetch dashboard data
  const fetchDashboard = useCallback(async () => {
    if (!eventId) return;
    setDashboardLoading(true);
    try {
      const [overview, byStatus, byRole, attendanceRate, timeline] = await Promise.all([
        managerService.getEventDashboardOverview(eventId).catch(() => null),
        managerService.getParticipantsByStatus(eventId).catch(() => null),
        managerService.getParticipantsByRole(eventId).catch(() => null),
        managerService.getAttendanceRate(eventId).catch(() => null),
        managerService.getRegistrationTimeline(eventId).catch(() => null)
      ]);
      setDashboardData({ overview, byStatus, byRole, attendanceRate, timeline });
    } catch (err) {
      console.error("Failed to fetch dashboard:", err);
    } finally {
      setDashboardLoading(false);
    }
  }, [eventId]);

  // Fetch ALL participants once
  const fetchParticipants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (eventId) {
        response = await eventUserService.getEventUsersByEventId(eventId, {});
      } else {
        response = await managerService.getPendingUsers();
      }
      setParticipants(response.content || []);
    } catch (err) {
      console.error("Failed to fetch participants:", err);
      setError("Không thể tải danh sách đăng ký.");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
    fetchDashboard();
  }, [fetchEvent, fetchDashboard]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  useEffect(() => {
    setSelectedIds([]);
  }, [activeTab]);

  // Filter participants based on active tab
  const filteredParticipants = useMemo(() => {
    if (!eventId) return participants;
    const currentUserId = user?.accountID;
    
    switch (activeTab) {
      case 1: // Chờ duyệt
        return participants.filter(p => p.status?.toUpperCase() === "PENDING");
      case 2: // Thành viên (APPROVED + FINISHED), exclude current user
        return participants.filter(
          p => (p.status?.toUpperCase() === "APPROVED" || p.status?.toUpperCase() === "FINISHED") &&
               p.accountId !== currentUserId
        );
      case 3: // Quản lý vai trò - show all members
        return participants.filter(
          p => p.status?.toUpperCase() !== "REJECTED" && 
               p.status?.toUpperCase() !== "PENDING"
        );
      default:
        return participants;
    }
  }, [participants, activeTab, eventId, user]);

  // Status helpers
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
    const labels = { PENDING: "Chờ duyệt", APPROVED: "Đã duyệt", FINISHED: "Hoàn thành", REJECTED: "Từ chối" };
    return labels[(status || "PENDING").toUpperCase()] || status;
  };

  const getRoleLabel = (role) => {
    const labels = { ATTENDEE: "Thành viên", MANAGER: "Quản lý sự kiện" };
    return labels[(role || "ATTENDEE").toUpperCase()] || role;
  };

  // Handle actions
  const handleConfirmAction = async () => {
    const { action, participant } = confirmDialog;
    if (!participant) return;
    
    try {
      if (action === "delete") {
        await eventUserService.deleteEventUser(participant.eventId, participant.accountId);
        setSnackbar({ open: true, message: "Đã xóa người dùng khỏi sự kiện!", severity: "success" });
      } else {
        const statusMap = { approve: "APPROVED", reject: "REJECTED", finish: "FINISHED" };
        const actionLabelMap = { approve: "duyệt", reject: "từ chối", finish: "đánh dấu hoàn thành" };
        await eventUserService.updateEventUserStatus(participant.eventId, participant.accountId, statusMap[action]);
        setSnackbar({ open: true, message: `Đã ${actionLabelMap[action]} thành công!`, severity: "success" });
      }
      fetchParticipants();
      fetchDashboard();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || "Không thể thực hiện thao tác.", severity: "error" });
    }
    setConfirmDialog({ open: false, action: null, participant: null });
  };

  // Handle batch finish
  const handleBatchFinish = async () => {
    if (selectedIds.length === 0) return;
    setBatchLoading(true);
    let successCount = 0, failCount = 0;
    
    for (const accountId of selectedIds) {
      const participant = filteredParticipants.find(p => p.accountId === accountId);
      if (!participant || participant.status?.toUpperCase() === "FINISHED") continue;
      try {
        await eventUserService.updateEventUserStatus(participant.eventId, participant.accountId, "FINISHED");
        successCount++;
      } catch { failCount++; }
    }
    
    setBatchLoading(false);
    setBatchConfirmOpen(false);
    setSelectedIds([]);
    setSnackbar({
      open: true,
      message: failCount === 0 ? `Đã hoàn thành ${successCount} TNV!` : `Thành công: ${successCount}, Thất bại: ${failCount}`,
      severity: failCount === 0 ? "success" : "warning"
    });
    fetchParticipants();
    fetchDashboard();
  };

  // Handle role change
  const handleRoleChange = async () => {
    const { participant, newRole } = roleDialog;
    if (!participant || !newRole) return;
    try {
      await eventUserService.updateEventUserRole(participant.eventId, participant.accountId, newRole);
      setSnackbar({ open: true, message: `Đã đổi vai trò thành ${getRoleLabel(newRole)}!`, severity: "success" });
      fetchParticipants();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || "Không thể đổi vai trò.", severity: "error" });
    }
    setRoleDialog({ open: false, participant: null, newRole: "ATTENDEE" });
  };

  // Table columns
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
      id: "role", 
      label: "Vai trò",
      render: (value) => (
        <Chip label={getRoleLabel(value)} size="small" color={value?.toUpperCase() === "MANAGER" ? "primary" : "default"} sx={{ fontSize: "11px" }} />
      )
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

  // Actions based on active tab
  const getActions = () => {
    if (activeTab === 1) {
      return [
        { label: "Duyệt", icon: <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />, onClick: (row) => setConfirmDialog({ open: true, action: "approve", participant: row }) },
        { label: "Từ chối", icon: <Cancel sx={{ fontSize: 16 }} />, color: "error.main", onClick: (row) => setConfirmDialog({ open: true, action: "reject", participant: row }) },
      ];
    } else if (activeTab === 2) {
      return [
        { label: "Hoàn thành", icon: <TaskAlt sx={{ fontSize: 16, color: "info.main" }} />, onClick: (row) => row.status?.toUpperCase() === "APPROVED" && setConfirmDialog({ open: true, action: "finish", participant: row }), disabled: (row) => row.status?.toUpperCase() === "FINISHED" },
        { label: "Xóa", icon: <PersonRemove sx={{ fontSize: 16 }} />, color: "error.main", onClick: (row) => setConfirmDialog({ open: true, action: "delete", participant: row }) },
      ];
    } else if (activeTab === 3) {
      return [
        { label: "Đổi vai trò", icon: <AdminPanelSettings sx={{ fontSize: 16 }} />, onClick: (row) => setRoleDialog({ open: true, participant: row, newRole: row.role?.toUpperCase() === "MANAGER" ? "ATTENDEE" : "MANAGER" }) },
      ];
    }
    return [];
  };

  // Counts
  const pendingCount = participants.filter(p => p.status?.toUpperCase() === "PENDING").length;
  const approvedCount = participants.filter(p => ["APPROVED", "FINISHED"].includes(p.status?.toUpperCase())).length;

  // Dashboard Tab Component
  const DashboardTab = () => {
    const { overview, byStatus, byRole, attendanceRate, timeline } = dashboardData;
    
    if (dashboardLoading) {
      return <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>;
    }

    const StatCard = ({ title, value, icon, color = "primary.main", subtitle }) => (
      <Card sx={{ borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", height: '100%', width: '100%' }}>
        <CardContent sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: '100%' }}>
            <Box>
              <Typography variant="caption" color="text.secondary">{title}</Typography>
              <Typography variant="h4" fontWeight={700} sx={{ color }}>{value}</Typography>
              {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
            </Box>
            <Box sx={{ p: 1.5, borderRadius: "12px", bgcolor: `${color}15` }}>
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );

    const ProgressCard = ({ title, data, getColor, labelKey = "status" }) => {
      // Handle both array format [{status: 'X', count: N}] and object format {X: N}
      const items = Array.isArray(data) 
        ? data 
        : data ? Object.entries(data).map(([key, value]) => ({ [labelKey]: key, count: value })) : [];
      
      const total = items.reduce((sum, item) => sum + (item.count || 0), 0) || 1;
      
      return (
        <Card sx={{ borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>{title}</Typography>
            {items.length > 0 ? items.map((item, idx) => {
              const key = item[labelKey] || item.role || item.status || `item-${idx}`;
              const count = item.count || 0;
              return (
                <Box key={idx} sx={{ mb: 1.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="caption">{getStatusLabel(key) || getRoleLabel(key) || key}</Typography>
                    <Typography variant="caption" fontWeight={600}>{count}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((count / total) * 100, 100)} 
                    sx={{ height: 8, borderRadius: 4, bgcolor: "grey.100", "& .MuiLinearProgress-bar": { bgcolor: getColor?.(key) || "primary.main" } }}
                  />
                </Box>
              );
            }) : (
              <Typography variant="body2" color="text.secondary">Không có dữ liệu</Typography>
            )}
          </CardContent>
        </Card>
      );
    };

    return (
      <Box sx={{ p: 2 }}>
        {/* Overview Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={6} sx={{ display: 'flex' }}>
            <StatCard 
              title="Tổng đăng ký" 
              value={overview?.totalRegistrations || participants.length} 
              icon={<People sx={{ color: "primary.main" }} />}
              color="primary.main"
            />
          </Grid>
          <Grid size={6} sx={{ display: 'flex' }}>
            <StatCard 
              title="Chờ duyệt" 
              value={overview?.pendingCount || pendingCount} 
              icon={<Timeline sx={{ color: "#f57c00" }} />}
              color="#f57c00"
            />
          </Grid>
          <Grid size={6} sx={{ display: 'flex' }}>
            <StatCard 
              title="Đã duyệt" 
              value={overview?.approvedCount || approvedCount} 
              icon={<CheckCircle sx={{ color: "#388e3c" }} />}
              color="#388e3c"
            />
          </Grid>
          <Grid size={6} sx={{ display: 'flex' }}>
            <StatCard 
              title="Tỉ lệ hoàn thành" 
              value={`${attendanceRate?.completionRate || 0}%`}
              subtitle={`${attendanceRate?.completedCount || 0}/${attendanceRate?.totalApproved || 0} TNV`}
              icon={<TrendingUp sx={{ color: "#1976d2" }} />}
              color="#1976d2"
            />
          </Grid>
        </Grid>

        {/* Distribution Charts */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <ProgressCard 
              title="Phân bố theo trạng thái" 
              data={byStatus}
              getColor={(key) => getStatusColor(key).color}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <ProgressCard 
              title="Phân bố theo vai trò" 
              data={byRole}
              getColor={(key) => key === "MANAGER" ? "#1976d2" : "#757575"}
            />
          </Grid>
        </Grid>

        {/* Timeline Chart - using Recharts like admin dashboard */}
        {timeline && Array.isArray(timeline) && timeline.length > 0 && (
          <Card elevation={0} sx={{ borderRadius: "16px", border: "1px solid", borderColor: "grey.200", mt: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Đăng ký theo thời gian</Typography>
              <div style={{ width: '100%', height: 200, minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeline.map(item => ({
                    date: item.date,
                    count: item.count || 0
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => value ? new Date(value).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' }) : ''}
                      fontSize={11}
                    />
                    <YAxis allowDecimals={false} fontSize={11} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(136, 178, 139, 0.1)' }}
                      formatter={(value) => [value, "Đăng ký"]}
                      labelFormatter={(label) => label ? new Date(label).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="#88b28b" 
                      radius={[4, 4, 0, 0]}
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </Box>
    );
  };

  return (
    <ThreeColumnLayout user={user} role="manager" showRightSidebar={true} showSearch={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            {event ? event.title : "Quản lý sự kiện"}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {activeTab === 2 && selectedIds.length > 0 && (
              <Button size="small" variant="contained" color="info" startIcon={<TaskAlt />} onClick={() => setBatchConfirmOpen(true)} disabled={batchLoading} sx={{ textTransform: "none" }}>
                Hoàn thành ({selectedIds.length})
              </Button>
            )}
            <Button size="small" startIcon={<Refresh />} onClick={() => { fetchParticipants(); fetchDashboard(); }} sx={{ textTransform: "none" }}>
              Làm mới
            </Button>
          </Box>
        </Box>

        {/* Tabs */}
        {eventId && (
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ px: 2, "& .MuiTab-root": { textTransform: "none", fontWeight: 500, fontSize: "14px" } }}>
            <Tab icon={<Dashboard sx={{ fontSize: 18 }} />} iconPosition="start" label="Dashboard" />
            <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Chờ duyệt <Chip label={pendingCount} size="small" color="warning" sx={{ height: 18, fontSize: "10px" }} /></Box>} />
            <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Thành viên </Box>} />
            <Tab label="Quản lý vai trò" />
          </Tabs>
        )}
      </Box>

      {/* Tab Content */}
      {activeTab === 0 ? (
        <DashboardTab />
      ) : (
        <Box sx={{ p: 2 }}>          
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>
          ) : error ? (
            <Alert severity="error" sx={{ borderRadius: "12px" }}>{error}</Alert>
          ) : filteredParticipants.length > 0 ? (
            <DataTable columns={columns} data={filteredParticipants} searchable searchPlaceholder="Tìm kiếm..." actions={getActions()} rowKey="accountId" selectable={activeTab === 2} onSelectionChange={(ids) => setSelectedIds(ids)} />
          ) : (
            <EmptyState title={activeTab === 1 ? "Không có yêu cầu chờ duyệt" : activeTab === 2 ? "Không có thành viên" : "Không có thành viên"} description="Không có dữ liệu phù hợp." />
          )}
        </Box>
      )}

      {/* Dialogs */}
      <ConfirmDialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, action: null, participant: null })} onConfirm={handleConfirmAction}
        title={confirmDialog.action === "approve" ? "Duyệt?" : confirmDialog.action === "finish" ? "Hoàn thành?" : confirmDialog.action === "delete" ? "Xóa?" : "Từ chối?"}
        message={`Xác nhận thao tác với "${confirmDialog.participant?.firstName || confirmDialog.participant?.username}"?`}
        confirmLabel={confirmDialog.action === "approve" ? "Duyệt" : confirmDialog.action === "finish" ? "Hoàn thành" : confirmDialog.action === "delete" ? "Xóa" : "Từ chối"}
        variant={confirmDialog.action === "approve" ? "success" : confirmDialog.action === "finish" ? "info" : "danger"}
      />

      <ConfirmDialog open={batchConfirmOpen} onClose={() => setBatchConfirmOpen(false)} onConfirm={handleBatchFinish}
        title="Đánh dấu hoàn thành hàng loạt?" message={`Hoàn thành cho ${selectedIds.length} TNV?`}
        confirmLabel={batchLoading ? "Đang xử lý..." : "Xác nhận"} variant="info"
      />

      <Dialog open={roleDialog.open} onClose={() => setRoleDialog({ ...roleDialog, open: false })} maxWidth="xs" fullWidth>
        <DialogTitle>Đổi vai trò</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>Đổi vai trò của <strong>{roleDialog.participant?.firstName || roleDialog.participant?.username}</strong>:</Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Vai trò</InputLabel>
            <Select value={roleDialog.newRole} label="Vai trò" onChange={(e) => setRoleDialog({ ...roleDialog, newRole: e.target.value })}>
              <MenuItem value="ATTENDEE">Thành viên</MenuItem>
              <MenuItem value="MANAGER">Quản lý sự kiện</MenuItem>
            </Select>
          </FormControl>
          {roleDialog.newRole === "MANAGER" && <Alert severity="warning" sx={{ mt: 2, fontSize: "12px" }}>Người này sẽ có quyền quản lý <strong>chỉ sự kiện này</strong>.</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialog({ ...roleDialog, open: false })}>Hủy</Button>
          <Button variant="contained" onClick={handleRoleChange}>Xác nhận</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </ThreeColumnLayout>
  );
};

export default EventDetailManagement;
