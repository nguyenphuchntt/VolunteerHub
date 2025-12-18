import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Collapse,
  Avatar,
  Button,
} from "@mui/material";
import {
  Dashboard,
  Event,
  People,
  Assessment,
  Settings,
  ExpandLess,
  ExpandMore,
  Add,
  History,
  Notifications,
  Person,
  AdminPanelSettings,
  FileDownload,
  CheckCircle,
  Login,
  PersonAdd,
  Home,
  Explore,
} from "@mui/icons-material";

const DRAWER_WIDTH = 260;

/**
 * Sidebar navigation component with role-based menu items
 * @param {string} role - "guest" | "volunteer" | "manager" | "admin"
 * @param {object} user - User object (null for guests)
 */
const Sidebar = ({ role = "guest", user = null, open = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({});

  const handleToggle = (key) => {
    setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (path) => location.pathname === path;

  // Menu items based on role
  const menuConfig = {
    guest: [
      { label: "Trang chủ", icon: <Home />, path: "/" },
      { label: "Khám phá sự kiện", icon: <Explore />, path: "/events" },
    ],
    volunteer: [
      { label: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
      { label: "Khám phá sự kiện", icon: <Explore />, path: "/events" },
      { label: "Lịch sử tham gia", icon: <History />, path: "/history" },
      { label: "Thông báo", icon: <Notifications />, path: "/notifications" },
      { label: "Hồ sơ", icon: <Person />, path: `/profiles/${user?.username || "me"}` },
    ],
    manager: [
      { label: "Dashboard", icon: <Dashboard />, path: "/manage" },
      {
        label: "Quản lý sự kiện",
        icon: <Event />,
        children: [
          { label: "Danh sách sự kiện", path: "/manage/events" },
          { label: "Tạo sự kiện mới", path: "/manage/events/new", icon: <Add /> },
        ],
      },
      { label: "Tình nguyện viên", icon: <People />, path: "/manage/participants" },
      { label: "Báo cáo", icon: <Assessment />, path: "/manage/reports" },
    ],
    admin: [
      { label: "Dashboard", icon: <Dashboard />, path: "/admin" },
      { label: "Duyệt sự kiện", icon: <CheckCircle />, path: "/admin/events" },
      { label: "Quản lý người dùng", icon: <People />, path: "/admin/users" },
      { label: "Xuất dữ liệu", icon: <FileDownload />, path: "/admin/export" },
      { label: "Cài đặt hệ thống", icon: <Settings />, path: "/admin/settings" },
    ],
  };

  const menuItems = menuConfig[role] || menuConfig.guest;

  const renderMenuItem = (item, index) => {
    if (item.children) {
      const isExpanded = expandedItems[item.label];
      const isChildActive = item.children.some((child) => isActive(child.path));

      return (
        <Box key={item.label}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleToggle(item.label)}
              sx={{
                borderRadius: "8px",
                mx: 1,
                mb: 0.5,
                backgroundColor: isChildActive ? "rgba(136, 178, 139, 0.1)" : "transparent",
              }}
            >
              <ListItemIcon sx={{ color: isChildActive ? "primary.main" : "grey.600", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: isChildActive ? 600 : 500,
                  color: isChildActive ? "primary.main" : "text.primary",
                }}
              />
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => (
                <ListItem key={child.path} disablePadding>
                  <ListItemButton
                    onClick={() => navigate(child.path)}
                    sx={{
                      pl: 6,
                      borderRadius: "8px",
                      mx: 1,
                      mb: 0.5,
                      backgroundColor: isActive(child.path) ? "primary.main" : "transparent",
                      "&:hover": {
                        backgroundColor: isActive(child.path) ? "primary.main" : "grey.100",
                      },
                    }}
                  >
                    {child.icon && (
                      <ListItemIcon sx={{ color: isActive(child.path) ? "#fff" : "grey.600", minWidth: 32 }}>
                        {child.icon}
                      </ListItemIcon>
                    )}
                    <ListItemText
                      primary={child.label}
                      primaryTypographyProps={{
                        fontSize: 13,
                        fontWeight: isActive(child.path) ? 600 : 400,
                        color: isActive(child.path) ? "#fff" : "text.secondary",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Box>
      );
    }

    return (
      <ListItem key={item.path} disablePadding>
        <ListItemButton
          onClick={() => navigate(item.path)}
          sx={{
            borderRadius: "8px",
            mx: 1,
            mb: 0.5,
            backgroundColor: isActive(item.path) ? "primary.main" : "transparent",
            "&:hover": {
              backgroundColor: isActive(item.path) ? "primary.main" : "grey.100",
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: isActive(item.path) ? "#fff" : "grey.600",
              minWidth: 40,
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: isActive(item.path) ? 600 : 500,
              color: isActive(item.path) ? "#fff" : "text.primary",
            }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  const roleLabels = {
    guest: "Khách",
    volunteer: "Tình nguyện viên",
    manager: "Quản lý sự kiện",
    admin: "Quản trị viên",
  };

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: open ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          borderRight: "1px solid",
          borderColor: "grey.200",
          top: 70,
          height: "calc(100% - 70px)",
        },
      }}
    >
      {/* User Info - for authenticated users */}
      {user ? (
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              borderRadius: "12px",
              backgroundColor: "grey.50",
            }}
          >
            <Avatar src={user.avatar} alt={user.name} sx={{ width: 40, height: 40 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {roleLabels[role]}
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        /* Guest: Login prompt */
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: "12px",
              backgroundColor: "rgba(136, 178, 139, 0.1)",
              textAlign: "center",
            }}
          >
            <Typography variant="body2" fontWeight={500} color="text.secondary" sx={{ mb: 1.5 }}>
              Đăng nhập để trải nghiệm đầy đủ tính năng
            </Typography>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Login />}
              onClick={() => navigate("/signin")}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                mb: 1,
              }}
            >
              Đăng nhập
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<PersonAdd />}
              onClick={() => navigate("/signup")}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Đăng ký
            </Button>
          </Box>
        </Box>
      )}

      <Divider />

      {/* Menu Items */}
      <List sx={{ pt: 1 }}>{menuItems.map(renderMenuItem)}</List>

      {/* Settings at bottom - only for authenticated */}
      {user && (
        <Box sx={{ mt: "auto", p: 2 }}>
          <Divider sx={{ mb: 1 }} />
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate("/settings")}
              sx={{
                borderRadius: "8px",
                backgroundColor: isActive("/settings") ? "primary.main" : "transparent",
              }}
            >
              <ListItemIcon
                sx={{ color: isActive("/settings") ? "#fff" : "grey.600", minWidth: 40 }}
              >
                <Settings />
              </ListItemIcon>
              <ListItemText
                primary="Cài đặt"
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: isActive("/settings") ? 600 : 500,
                  color: isActive("/settings") ? "#fff" : "text.primary",
                }}
              />
            </ListItemButton>
          </ListItem>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;
