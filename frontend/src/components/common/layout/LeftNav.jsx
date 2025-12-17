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
} from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const NAV_WIDTH = 280;

/**
 * X-style Left Navigation component
 * Now uses AuthContext directly for user and role info
 */
const LeftNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Get user and auth state from context
  const { user, isAuthenticated, isAdmin, isManager, logout } = useAuth();

  const isActive = (path) => {
    if (path === "/explore") return location.pathname === "/explore" || location.pathname.startsWith("/events/");
    return location.pathname.startsWith(path);
  };


  // Get display name from API format
  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.username || "Người dùng";

  // Determine role string for display
  const getRoleForDisplay = () => {
    if (isAdmin) return "admin";
    if (isManager) return "manager";
    return "volunteer";
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
      badge: 3,
    },
    {
      label: "Sự kiện của tôi",
      path: "/my-events",
      icon: <EventNoteOutlined />,
      activeIcon: <EventNote />,
      show: isAuthenticated,
    },
    {
      label: "Hồ sơ",
      path: `/profiles/${user?.username || "me"}`,
      icon: <PersonOutline />,
      activeIcon: <Person />,
      show: isAuthenticated,
    },
    {
      label: "Quản lý",
      path: "/manage",
      icon: <AdminPanelSettingsOutlined />,
      activeIcon: <AdminPanelSettings />,
      show: isManager && !isAdmin,
    },
    {
      label: "Admin",
      path: "/admin",
      icon: <AdminPanelSettingsOutlined />,
      activeIcon: <AdminPanelSettings />,
      show: isAdmin,
    },
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
        width: NAV_WIDTH,
        height: "100vh",
        position: "sticky",
        top: 0,
        borderRight: "1px solid",
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
        onClick={() => navigate("/")}
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
                    {active ? item.activeIcon : item.icon}
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

