import { useState } from "react";
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
} from "@mui/material";
import {
  Lock,
  LockOpen,
  Visibility,
  Email,
  CalendarMonth,
  Event,
  AccessTime,
  Person,
  AdminPanelSettings,
} from "@mui/icons-material";
import { ThreeColumnLayout, DataTable, ConfirmDialog } from "../../components/common";
import { mockUsers as currentUser } from "../../data/mockData";
import { mockAllUsers } from "../../data/mockAdminData";

const UserManagement = () => {
  const navigate = useNavigate();
  const user = currentUser[0];
  
  const [users, setUsers] = useState(mockAllUsers);
  const [selectedTab, setSelectedTab] = useState(0);
  const [lockDialogOpen, setLockDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const tabFilters = ["all", "volunteer", "manager", "locked"];

  const filteredUsers = (() => {
    switch (selectedTab) {
      case 1:
        return users.filter((u) => u.role === "volunteer" && u.status === "active");
      case 2:
        return users.filter((u) => u.role === "manager" && u.status === "active");
      case 3:
        return users.filter((u) => u.status === "locked");
      default:
        return users;
    }
  })();

  const columns = [
    {
      id: "name",
      label: "Người dùng",
      render: (value, row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar src={row.avatar} alt={value} sx={{ width: 40, height: 40 }} />
          <Box>
            <Box sx={{ fontWeight: 600, fontSize: "14px" }}>{value}</Box>
            <Box sx={{ fontSize: "12px", color: "text.secondary" }}>@{row.username}</Box>
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
        const config = {
          volunteer: { label: "TNV", bg: "#e3f2fd", color: "#1976d2", icon: <Person sx={{ fontSize: 12 }} /> },
          manager: { label: "Quản lý", bg: "#f3e5f5", color: "#7b1fa2", icon: <AdminPanelSettings sx={{ fontSize: 12 }} /> },
        };
        const c = config[value] || config.volunteer;
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
        const config = {
          active: { label: "Hoạt động", bg: "#edf7ed", color: "#2e7d32" },
          locked: { label: "Đã khóa", bg: "#fdeded", color: "#d32f2f" },
        };
        const c = config[value] || config.active;
        return (
          <Chip
            label={c.label}
            size="small"
            sx={{ backgroundColor: c.bg, color: c.color, fontWeight: 600, fontSize: "11px" }}
          />
        );
      },
    },
    {
      id: "lastActive",
      label: "Hoạt động",
      render: (value) => (
        <Typography variant="caption" color="text.secondary">
          {new Date(value).toLocaleDateString("vi-VN")}
        </Typography>
      ),
    },
  ];

  const handleToggleLock = () => {
    if (selectedUser) {
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? { ...u, status: u.status === "active" ? "locked" : "active" }
            : u
        )
      );
      setLockDialogOpen(false);
      setSelectedUser(null);
    }
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
      label: "Khóa",
      icon: <Lock sx={{ fontSize: 18 }} />,
      color: "error.main",
      onClick: (row) => {
        setSelectedUser(row);
        setLockDialogOpen(true);
      },
      show: (row) => row.status === "active",
    },
    {
      label: "Mở khóa",
      icon: <LockOpen sx={{ fontSize: 18 }} />,
      color: "success.main",
      onClick: (row) => {
        setSelectedUser(row);
        setLockDialogOpen(true);
      },
      show: (row) => row.status === "locked",
    },
  ];

  const volunteerCount = users.filter((u) => u.role === "volunteer" && u.status === "active").length;
  const managerCount = users.filter((u) => u.role === "manager" && u.status === "active").length;
  const lockedCount = users.filter((u) => u.status === "locked").length;

  return (
    <ThreeColumnLayout user={user} role="admin" showRightSidebar={true} showSearch={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Quản lý người dùng
          </Typography>
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
        <DataTable
          columns={columns}
          data={filteredUsers}
          searchable
          searchPlaceholder="Tìm kiếm người dùng..."
          actions={actions}
          emptyMessage="Không có người dùng nào"
        />
      </Box>

      {/* Lock/Unlock Confirm Dialog */}
      <ConfirmDialog
        open={lockDialogOpen}
        onClose={() => setLockDialogOpen(false)}
        onConfirm={handleToggleLock}
        title={selectedUser?.status === "active" ? "Khóa tài khoản?" : "Mở khóa tài khoản?"}
        message={
          selectedUser?.status === "active"
            ? `Bạn có chắc chắn muốn khóa tài khoản "${selectedUser?.name}"? Người dùng này sẽ không thể đăng nhập cho đến khi được mở khóa.`
            : `Bạn có chắc chắn muốn mở khóa tài khoản "${selectedUser?.name}"?`
        }
        confirmLabel={selectedUser?.status === "active" ? "Khóa" : "Mở khóa"}
        variant={selectedUser?.status === "active" ? "danger" : "primary"}
      />

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
            <Avatar src={selectedUser?.avatar} sx={{ width: 56, height: 56 }} />
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {selectedUser?.name}
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
              <CalendarMonth sx={{ color: "text.secondary", fontSize: 20 }} />
              <Typography variant="body2">
                Đăng ký: {selectedUser?.registeredAt && new Date(selectedUser.registeredAt).toLocaleDateString("vi-VN")}
              </Typography>
            </Box>
            
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <AccessTime sx={{ color: "text.secondary", fontSize: 20 }} />
              <Typography variant="body2">
                Hoạt động lần cuối: {selectedUser?.lastActive && new Date(selectedUser.lastActive).toLocaleDateString("vi-VN")}
              </Typography>
            </Box>

            <Divider />

            {selectedUser?.role === "volunteer" ? (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Event sx={{ color: "text.secondary", fontSize: 20 }} />
                  <Typography variant="body2">
                    Sự kiện đã tham gia: <strong>{selectedUser?.eventsJoined}</strong>
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <AccessTime sx={{ color: "text.secondary", fontSize: 20 }} />
                  <Typography variant="body2">
                    Giờ tình nguyện: <strong>{selectedUser?.hoursVolunteered}h</strong>
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Event sx={{ color: "text.secondary", fontSize: 20 }} />
                  <Typography variant="body2">
                    Sự kiện đã tạo: <strong>{selectedUser?.eventsCreated}</strong>
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Person sx={{ color: "text.secondary", fontSize: 20 }} />
                  <Typography variant="body2">
                    Tổng TNV: <strong>{selectedUser?.totalParticipants}</strong>
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDetailDialogOpen(false)} sx={{ textTransform: "none" }}>
            Đóng
          </Button>
          <Button
            variant="contained"
            color={selectedUser?.status === "active" ? "error" : "success"}
            startIcon={selectedUser?.status === "active" ? <Lock /> : <LockOpen />}
            onClick={() => {
              setDetailDialogOpen(false);
              setLockDialogOpen(true);
            }}
            sx={{ textTransform: "none", borderRadius: "9999px" }}
          >
            {selectedUser?.status === "active" ? "Khóa tài khoản" : "Mở khóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </ThreeColumnLayout>
  );
};

export default UserManagement;
