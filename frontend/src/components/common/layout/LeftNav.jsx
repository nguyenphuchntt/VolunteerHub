import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Badge,
} from "@mui/material";
import {
  Explore,
  ExploreOutlined,
  Notifications,
  NotificationsOutlined,
  Person,
  PersonOutline,
  Dashboard,
  DashboardOutlined,
  Settings,
  SettingsOutlined,
  MoreHoriz,
  Logout,
  Add,
  EventNote,
  EventNoteOutlined,
  AdminPanelSettings,
  AdminPanelSettingsOutlined,
  KeyboardArrowDown,
  Event,
  People,
  Download,
  SupervisorAccount,
} from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNotificationContext } from "../../../contexts/NotificationContext";

const NAV_WIDTH = 280;

/**
 * X-style Left Navigation component
 * Now uses AuthContext directly for user and role info
 */
const LeftNav = ({ isMobile = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [adminAnchorEl, setAdminAnchorEl] = useState(null);
  const [managerAnchorEl, setManagerAnchorEl] = useState(null);

  // Get user and auth state from context
  const { user, isAuthenticated, isAdmin, isManager, isEventManager, logout } = useAuth();

  // Get unread notification count from context
  const { unreadCount } = useNotificationContext();

  // Get display name from API format
  const displayName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.username || "Người dùng";

  const isActive = (path) => {
    if (path === "/explore") return location.pathname === "/explore" || location.pathname.startsWith("/events/");
    return location.pathname.startsWith(path);
  };


  // Determine role string for display
  const getRoleForDisplay = () => {
    if (isAdmin) return "admin";
    if (isManager) return "manager";
    return "volunteer";
  };

  // Admin dropdown items
  const adminDropdownItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: <Dashboard />,
      description: "Tổng quan hệ thống",
    },
    {
      label: "Quản lý sự kiện",
      path: "/admin/events",
      icon: <Event />,
      description: "Duyệt/xóa/quản lý sự kiện",
    },
    {
      label: "Quản lý người dùng",
      path: "/admin/users",
      icon: <People />,
      description: "Thay đổi role, khóa/mở tài khoản",
    },
    {
      label: "Quản lý yêu cầu",
      path: "/admin/requests",
      icon: <SupervisorAccount />,
      description: "Duyệt yêu cầu làm manager",
    },
    {
      label: "Xuất dữ liệu",
      path: "/admin/export",
      icon: <Download />,
      description: "Export CSV/JSON",
    },
  ];

  const handleAdminClick = (event) => {
    setAdminAnchorEl(event.currentTarget);
  };

  const handleAdminClose = () => {
    setAdminAnchorEl(null);
  };

  const handleAdminItemClick = (path) => {
    navigate(path);
    handleAdminClose();
  };

  // Manager dropdown items - filter based on role
  const managerDropdownItems = [
    // Dashboard and Create Event only for users with MANAGER role
    ...(isManager ? [
      {
        label: "Dashboard",
        path: "/manage",
        icon: <Dashboard />,
        description: "Tổng quan sự kiện",
      },
    ] : []),
    {
      label: "Sự kiện của tôi",
      path: "/manage/events",
      icon: <Event />,
      description: "Quản lý sự kiện đang quản lý",
    },
    // Create event only for MANAGER role
    ...(isManager ? [
      {
        label: "Tạo sự kiện mới",
        path: "/manage/events/new",
        icon: <Add />,
        description: "Thêm sự kiện mới",
      },
    ] : []),
    {
      label: "Duyệt TNV",
      path: "/manage/participants",
      icon: <People />,
      description: "Duyệt/huỷ đăng ký TNV",
    },
  ];

  const handleManagerClick = (event) => {
    setManagerAnchorEl(event.currentTarget);
  };

  const handleManagerClose = () => {
    setManagerAnchorEl(null);
  };

  const handleManagerItemClick = (path) => {
    navigate(path);
    handleManagerClose();
  };

  // Navigation items
  const navItems = [
    {
      label: "Khám phá",
      path: "/explore",
      icon: <ExploreOutlined />,
      activeIcon: <Explore />,
      show: true,
    },

    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <DashboardOutlined />,
      activeIcon: <Dashboard />,
      show: true,
    },
    {
      label: "Thông báo",
      path: "/notifications",
      icon: <NotificationsOutlined />,
      activeIcon: <Notifications />,
      show: isAuthenticated,
      badge: unreadCount, // Lấy số thông báo chưa đọc từ context
    },
    {
      label: "Hồ sơ",
      path: `/profiles/${user?.username || "me"}`,
      icon: <PersonOutline />,
      activeIcon: <Person />,
      show: isAuthenticated,
    },
    // Manager item is handled separately with dropdown
    // Admin item is handled separately with dropdown
  ];

  const handleMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMoreClose();
    navigate("/signin");
  };

  return (
    <Box
      sx={{
        width: isMobile ? "100%" : NAV_WIDTH,
        height: isMobile ? "100%" : "100vh",
        position: isMobile ? "static" : "sticky",
        top: 0,
        borderRight: isMobile ? "none" : "1px solid",
        borderColor: "grey.200",
        display: "flex",
        flexDirection: "column",
        px: 2,
        py: 1,
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: 1.5,
          cursor: "pointer",
          "&:hover": { backgroundColor: "rgba(136, 178, 139, 0.1)", borderRadius: "50%" },
          width: 50,
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => navigate("/explore")}
      >
        <Box
          component="img"
          src="/images/logo.png"
          alt="VolunteerHub"
          sx={{ width: 32, height: 32 }}
        />
      </Box>

      {/* Navigation Items */}
      <List sx={{ flex: 1, py: 1 }}>
        {navItems
          .filter((item) => item.show)
          .map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: "9999px",
                    py: 1.5,
                    px: 2,
                    "&:hover": {
                      backgroundColor: "rgba(136, 178, 139, 0.1)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: active ? "primary.main" : "text.primary",
                    }}
                  >
                    {item.badge > 0 ? (
                      <Badge
                        badgeContent={item.badge}
                        color="error"
                        sx={{
                          "& .MuiBadge-badge": {
                            fontSize: 10,
                            height: 18,
                            minWidth: 18
                          }
                        }}
                      >
                        {active ? item.activeIcon : item.icon}
                      </Badge>
                    ) : (
                      active ? item.activeIcon : item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 18,
                      fontWeight: active ? 700 : 400,
                      color: active ? "primary.main" : "text.primary",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}

        {/* Manager Dropdown - for manager users or event managers */}
        {(isManager || isEventManager) && (
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={handleManagerClick}
              sx={{
                borderRadius: "9999px",
                py: 1.5,
                px: 2,
                backgroundColor: location.pathname.startsWith("/manage") ? "rgba(136, 178, 139, 0.1)" : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(136, 178, 139, 0.1)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: location.pathname.startsWith("/manage") ? "primary.main" : "text.primary",
                }}
              >
                {location.pathname.startsWith("/manage") ? <AdminPanelSettings /> : <AdminPanelSettingsOutlined />}
              </ListItemIcon>
              <ListItemText
                primary="Quản lý"
                primaryTypographyProps={{
                  fontSize: 18,
                  fontWeight: location.pathname.startsWith("/manage") ? 700 : 400,
                  color: location.pathname.startsWith("/manage") ? "primary.main" : "text.primary",
                }}
              />
              <KeyboardArrowDown
                sx={{
                  color: "text.secondary",
                  transform: Boolean(managerAnchorEl) ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            </ListItemButton>
          </ListItem>
        )}

        {/* Manager Dropdown Menu */}
        <Menu
          anchorEl={managerAnchorEl}
          open={Boolean(managerAnchorEl)}
          onClose={handleManagerClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: "16px",
              minWidth: 240,
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              mt: 1,
            },
          }}
        >
          {managerDropdownItems.map((item) => (
            <MenuItem
              key={item.path}
              onClick={() => handleManagerItemClick(item.path)}
              selected={location.pathname === item.path}
              sx={{
                py: 1.5,
                px: 2,
                borderRadius: "8px",
                mx: 1,
                my: 0.5,
                "&.Mui-selected": {
                  backgroundColor: "rgba(136, 178, 139, 0.15)",
                  "&:hover": {
                    backgroundColor: "rgba(136, 178, 139, 0.25)",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: location.pathname === item.path ? "primary.main" : "text.secondary" }}>
                {item.icon}
              </ListItemIcon>
              <Box>
                <Typography variant="body2" fontWeight={location.pathname === item.path ? 700 : 500}>
                  {item.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.description}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>

        {/* Admin Dropdown - for admin users */}
        {isAdmin && (
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={handleAdminClick}
              sx={{
                borderRadius: "9999px",
                py: 1.5,
                px: 2,
                backgroundColor: location.pathname.startsWith("/admin") ? "rgba(136, 178, 139, 0.1)" : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(136, 178, 139, 0.1)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: location.pathname.startsWith("/admin") ? "primary.main" : "text.primary",
                }}
              >
                {location.pathname.startsWith("/admin") ? <AdminPanelSettings /> : <AdminPanelSettingsOutlined />}
              </ListItemIcon>
              <ListItemText
                primary="Admin"
                primaryTypographyProps={{
                  fontSize: 18,
                  fontWeight: location.pathname.startsWith("/admin") ? 700 : 400,
                  color: location.pathname.startsWith("/admin") ? "primary.main" : "text.primary",
                }}
              />
              <KeyboardArrowDown
                sx={{
                  color: "text.secondary",
                  transform: Boolean(adminAnchorEl) ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            </ListItemButton>
          </ListItem>
        )}

        {/* Admin Dropdown Menu */}
        <Menu
          anchorEl={adminAnchorEl}
          open={Boolean(adminAnchorEl)}
          onClose={handleAdminClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: "16px",
              minWidth: 240,
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              mt: 1,
            },
          }}
        >
          {adminDropdownItems.map((item) => (
            <MenuItem
              key={item.path}
              onClick={() => handleAdminItemClick(item.path)}
              selected={location.pathname === item.path}
              sx={{
                py: 1.5,
                px: 2,
                borderRadius: "8px",
                mx: 1,
                my: 0.5,
                "&.Mui-selected": {
                  backgroundColor: "rgba(136, 178, 139, 0.15)",
                  "&:hover": {
                    backgroundColor: "rgba(136, 178, 139, 0.25)",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: location.pathname === item.path ? "primary.main" : "text.secondary" }}>
                {item.icon}
              </ListItemIcon>
              <Box>
                <Typography variant="body2" fontWeight={location.pathname === item.path ? 700 : 500}>
                  {item.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.description}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>

        {/* Settings - for authenticated users */}
        {isAuthenticated && (
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => navigate("/settings")}
              sx={{
                borderRadius: "9999px",
                py: 1.5,
                px: 2,
                "&:hover": {
                  backgroundColor: "rgba(136, 178, 139, 0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isActive("/settings") ? "primary.main" : "text.primary" }}>
                {isActive("/settings") ? <Settings /> : <SettingsOutlined />}
              </ListItemIcon>
              <ListItemText
                primary="Cài đặt"
                primaryTypographyProps={{
                  fontSize: 18,
                  fontWeight: isActive("/settings") ? 700 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
      </List>


      {/* Create Event Button (for managers) */}
      {isManager && (
        <Button
          variant="contained"
          fullWidth
          startIcon={<Add />}
          onClick={() => navigate("/manage/events/new")}
          sx={{
            borderRadius: "9999px",
            py: 1.5,
            mb: 2,
            fontSize: 16,
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          Tạo sự kiện
        </Button>
      )}

      {/* User Section */}
      {isAuthenticated ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            borderRadius: "9999px",
            cursor: "pointer",
            "&:hover": { backgroundColor: "grey.100" },
          }}
          onClick={handleMoreClick}
        >
          <Avatar
            sx={{ width: 40, height: 40, bgcolor: "primary.main" }}
          >
            {(displayName || "?").charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={700} noWrap>
              {displayName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              @{user?.username}
            </Typography>
          </Box>
          <MoreHoriz sx={{ color: "text.secondary" }} />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/signin")}
            sx={{
              borderRadius: "9999px",
              py: 1.5,
              fontSize: 15,
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Đăng nhập
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate("/signup")}
            sx={{
              borderRadius: "9999px",
              py: 1.5,
              fontSize: 15,
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Đăng ký
          </Button>
        </Box>
      )}

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMoreClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: "16px",
            minWidth: 250,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          },
        }}
      >
        <MenuItem
          onClick={handleLogout}
          sx={{ py: 1.5, fontWeight: 700 }}
        >
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          Đăng xuất @{user?.username}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default LeftNav;

