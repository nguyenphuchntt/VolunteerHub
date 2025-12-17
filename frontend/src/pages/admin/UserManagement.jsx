import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Lock,
  LockOpen,
  Visibility,
  Email,
  CalendarMonth,
  Refresh,
  Person,
  AdminPanelSettings,
  SupervisorAccount,
} from "@mui/icons-material";
import { ThreeColumnLayout, DataTable, ConfirmDialog } from "../../components/common";
import { userService } from "../../api";
import { useAuth } from "../../context/AuthContext";

const UserManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // API states
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  const [selectedTab, setSelectedTab] = useState(0);
  const [lockDialogOpen, setLockDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Build params based on selected tab
      const params = {};
      if (selectedTab === 1) params.role = "USER";
      else if (selectedTab === 2) params.role = "MANAGER";
      else if (selectedTab === 3) params.status = "INACTIVE";
      
      const response = await userService.searchUsers(params);
      setUsers(response.content || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  }, [selectedTab]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Backend UserRole: USER, MANAGER, ADMIN
  // Backend AccountStatus: ACTIVE, INACTIVE
  const getRoleConfig = (role) => {
    const roleUpper = (role || "USER").toUpperCase();
    const configs = {
      USER: { label: "TNV", bg: "#e3f2fd", color: "#1976d2", icon: <Person sx={{ fontSize: 12 }} /> },
      MANAGER: { label: "Quản lý", bg: "#f3e5f5", color: "#7b1fa2", icon: <SupervisorAccount sx={{ fontSize: 12 }} /> },
      ADMIN: { label: "Admin", bg: "#fff3e0", color: "#f57c00", icon: <AdminPanelSettings sx={{ fontSize: 12 }} /> },
    };
    return configs[roleUpper] || configs.USER;
  };

  const getStatusConfig = (status) => {
    const statusUpper = (status || "ACTIVE").toUpperCase();
    const configs = {
      ACTIVE: { label: "Hoạt động", bg: "#edf7ed", color: "#2e7d32" },
      INACTIVE: { label: "Đã khóa", bg: "#fdeded", color: "#d32f2f" },
    };
    return configs[statusUpper] || configs.ACTIVE;
  };

  const columns = [
    {
      id: "username",
      label: "Người dùng",
      render: (value, row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main" }}>
            {(row.firstName || row.username || "?").charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Box sx={{ fontWeight: 600, fontSize: "14px" }}>
              {row.firstName && row.lastName ? `${row.firstName} ${row.lastName}` : value}
            </Box>
            <Box sx={{ fontSize: "12px", color: "text.secondary" }}>@{value}</Box>
          </Box>
        </Box>
      ),
    },
    {
      id: "email",
      label: "Email",
      render: (value) => (
        <Typography variant="body2" color="text.secondary">
          {value}
        </Typography>
      ),
    },
    {
      id: "role",
      label: "Vai trò",
      render: (value) => {
        const c = getRoleConfig(value);
        return (
          <Chip
            icon={c.icon}
            label={c.label}
            size="small"
            sx={{
              backgroundColor: c.bg,
              color: c.color,
              fontWeight: 600,
              fontSize: "11px",
              "& .MuiChip-icon": { color: c.color },
            }}
          />
        );
      },
    },
    {
      id: "status",
      label: "Trạng thái",
      render: (value) => {
        const c = getStatusConfig(value);
        return (
          <Chip
            label={c.label}
            size="small"
            sx={{ backgroundColor: c.bg, color: c.color, fontWeight: 600, fontSize: "11px" }}
          />
        );
      },
    },
  ];

  // Handle role change
  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;
    
    try {
      await userService.updateUserRole(selectedUser.accountID, newRole);
      setSnackbar({ open: true, message: "Đã thay đổi vai trò thành công!", severity: "success" });
      fetchUsers();
    } catch (err) {
      console.error("Failed to update role:", err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || "Không thể thay đổi vai trò.", 
        severity: "error" 
      });
    }
    setRoleDialogOpen(false);
    setSelectedUser(null);
  };

  // Handle lock/unlock
  const handleToggleLock = async () => {
    if (!selectedUser) return;
    
    const newStatus = selectedUser.status?.toUpperCase() === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    
    try {
      await userService.updateUserStatus(selectedUser.accountID, newStatus);
      setSnackbar({ 
        open: true, 
        message: `Đã ${newStatus === "ACTIVE" ? "mở khóa" : "khóa"} tài khoản thành công!`, 
        severity: "success" 
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to toggle lock:", err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || "Không thể thay đổi trạng thái.", 
        severity: "error" 
      });
    }
    setLockDialogOpen(false);
    setSelectedUser(null);
  };

  const actions = [
    {
      label: "Xem",
      icon: <Visibility sx={{ fontSize: 18 }} />,
      onClick: (row) => {
        setSelectedUser(row);
        setDetailDialogOpen(true);
      },
    },
    {
      label: "Đổi role",
      icon: <SupervisorAccount sx={{ fontSize: 18 }} />,
      onClick: (row) => {
        setSelectedUser(row);
        setNewRole(row.role || "USER");
        setRoleDialogOpen(true);
      },
    },
    {
      label: "Khóa",
      icon: <Lock sx={{ fontSize: 18 }} />,
      color: "error.main",
      onClick: (row) => {
        setSelectedUser(row);
        setLockDialogOpen(true);
      },
      show: (row) => row.status?.toUpperCase() === "ACTIVE",
    },
    {
      label: "Mở khóa",
      icon: <LockOpen sx={{ fontSize: 18 }} />,
      color: "success.main",
      onClick: (row) => {
        setSelectedUser(row);
        setLockDialogOpen(true);
      },
      show: (row) => row.status?.toUpperCase() !== "ACTIVE",
    },
  ];

  const volunteerCount = users.filter((u) => u.role?.toUpperCase() === "USER").length;
  const managerCount = users.filter((u) => u.role?.toUpperCase() === "MANAGER").length;
  const lockedCount = users.filter((u) => u.status?.toUpperCase() !== "ACTIVE").length;

  return (
    <ThreeColumnLayout user={user} role="admin" showRightSidebar={true} showSearch={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Quản lý người dùng
          </Typography>
          <Button 
            size="small" 
            startIcon={<Refresh />} 
            onClick={fetchUsers}
            sx={{ textTransform: "none" }}
          >
            Làm mới
          </Button>
        </Box>

        {/* Tabs */}
        <Tabs
          value={selectedTab}
          onChange={(e, v) => setSelectedTab(v)}
          sx={{
            px: 2,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minHeight: 48,
            },
          }}
        >
          <Tab label={`Tất cả (${users.length})`} />
          <Tab label={`Tình nguyện viên (${volunteerCount})`} />
          <Tab label={`Quản lý sự kiện (${managerCount})`} />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                Đã khóa
                {lockedCount > 0 && (
                  <Chip label={lockedCount} size="small" color="error" sx={{ height: 20 }} />
                )}
              </Box>
            }
          />
        </Tabs>
      </Box>

      <Box sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: "12px" }}>{error}</Alert>
        ) : (
          <DataTable
            columns={columns}
            data={users}
            searchable
            searchPlaceholder="Tìm kiếm người dùng..."
            actions={actions}
            emptyMessage="Không có người dùng nào"
          />
        )}
      </Box>

      {/* Lock/Unlock Confirm Dialog */}
      <ConfirmDialog
        open={lockDialogOpen}
        onClose={() => setLockDialogOpen(false)}
        onConfirm={handleToggleLock}
        title={selectedUser?.status?.toUpperCase() === "ACTIVE" ? "Khóa tài khoản?" : "Mở khóa tài khoản?"}
        message={
          selectedUser?.status?.toUpperCase() === "ACTIVE"
            ? `Bạn có chắc chắn muốn khóa tài khoản "${selectedUser?.firstName || selectedUser?.username}"?`
            : `Bạn có chắc chắn muốn mở khóa tài khoản "${selectedUser?.firstName || selectedUser?.username}"?`
        }
        confirmLabel={selectedUser?.status?.toUpperCase() === "ACTIVE" ? "Khóa" : "Mở khóa"}
        variant={selectedUser?.status?.toUpperCase() === "ACTIVE" ? "danger" : "primary"}
      />

      {/* Role Change Dialog */}
      <Dialog
        open={roleDialogOpen}
        onClose={() => setRoleDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Thay đổi vai trò</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Chọn vai trò mới cho <strong>{selectedUser?.firstName || selectedUser?.username}</strong>
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Vai trò</InputLabel>
            <Select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              label="Vai trò"
            >
              <MenuItem value="USER">Tình nguyện viên (USER)</MenuItem>
              <MenuItem value="MANAGER">Quản lý sự kiện (MANAGER)</MenuItem>
              <MenuItem value="ADMIN">Admin (ADMIN)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRoleDialogOpen(false)} sx={{ textTransform: "none" }}>
            Hủy
          </Button>
          <Button 
            variant="contained" 
            onClick={handleRoleChange}
            sx={{ textTransform: "none", borderRadius: "9999px" }}
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main" }}>
              {(selectedUser?.firstName || selectedUser?.username || "?").charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {selectedUser?.firstName && selectedUser?.lastName 
                  ? `${selectedUser.firstName} ${selectedUser.lastName}` 
                  : selectedUser?.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{selectedUser?.username}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Email sx={{ color: "text.secondary", fontSize: 20 }} />
              <Typography variant="body2">{selectedUser?.email}</Typography>
            </Box>
            
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {getRoleConfig(selectedUser?.role).icon}
              <Typography variant="body2">
                Vai trò: <strong>{getRoleConfig(selectedUser?.role).label}</strong>
              </Typography>
            </Box>
            
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <CalendarMonth sx={{ color: "text.secondary", fontSize: 20 }} />
              <Typography variant="body2">
                Trạng thái: <strong>{getStatusConfig(selectedUser?.status).label}</strong>
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDetailDialogOpen(false)} sx={{ textTransform: "none" }}>
            Đóng
          </Button>
          <Button
            variant="outlined"
            startIcon={<SupervisorAccount />}
            onClick={() => {
              setDetailDialogOpen(false);
              setNewRole(selectedUser?.role || "USER");
              setRoleDialogOpen(true);
            }}
            sx={{ textTransform: "none", borderRadius: "9999px" }}
          >
            Đổi vai trò
          </Button>
          <Button
            variant="contained"
            color={selectedUser?.status?.toUpperCase() === "ACTIVE" ? "error" : "success"}
            startIcon={selectedUser?.status?.toUpperCase() === "ACTIVE" ? <Lock /> : <LockOpen />}
            onClick={() => {
              setDetailDialogOpen(false);
              setLockDialogOpen(true);
            }}
            sx={{ textTransform: "none", borderRadius: "9999px" }}
          >
            {selectedUser?.status?.toUpperCase() === "ACTIVE" ? "Khóa tài khoản" : "Mở khóa"}
          </Button>
        </DialogActions>
      </Dialog>

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

export default UserManagement;
