import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { mockUsers } from "../../../data/mockData";
import {
  AppBar,
  Toolbar,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,
  Button,
  Badge,
} from "@mui/material";
import {
  Search,
  Person,
  Notifications,
  Settings,
  Logout,
  Dashboard,
  Event,
  Login,
  PersonAdd,
} from "@mui/icons-material";

/**
 * Unified AppHeader component
 * - Consistent layout: Logo (left) | Search (center) | Avatar (right)
 * - For authenticated users: shows user menu with full options
 * - For guests: shows login/register buttons
 */
const AppHeader = ({
  user = null, // null = guest, object = authenticated
  searchQuery = "",
  onSearchChange,
  showSearch = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const isAuthenticated = !!user;

  const handleLogoClick = () => {
    navigate(isAuthenticated ? "/events" : "/");
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate(`/profiles/${user?.username || "me"}`);
    handleMenuClose();
  };

  const handleDashboardClick = () => {
    navigate("/dashboard");
    handleMenuClose();
  };

  const handleNotificationsClick = () => {
    navigate("/notifications");
    handleMenuClose();
  };

  const handleSettingsClick = () => {
    navigate("/settings");
    handleMenuClose();
  };

  const handleLogout = () => {
    navigate("/signin");
    handleMenuClose();
  };

  const handleLogin = () => navigate("/signin");
  const handleRegister = () => navigate("/signup");

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        borderBottom: "1px solid",
        borderColor: "grey.200",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: 1440,
          width: "100%",
          mx: "auto",
          px: { xs: 2, md: 4 },
          height: 70,
          justifyContent: "space-between",
        }}
      >
        {/* LEFT: Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
            minWidth: 180,
          }}
          onClick={handleLogoClick}
        >
          <Box
            component="img"
            src="/images/logo.png"
            alt="VolunteerHub"
            sx={{ width: 36, height: 36 }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              display: { xs: "none", sm: "block" },
            }}
          >
            VolunteerHub
          </Typography>
        </Box>

        {/* CENTER: Search */}
        {showSearch && (
          <Box sx={{ flex: 1, mx: 4, maxWidth: 500 }}>
            <TextField
              type="text"
              placeholder="Tìm kiếm sự kiện..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "grey.500" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "24px",
                  backgroundColor: "grey.50",
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "grey.300",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />
          </Box>
        )}

        {!showSearch && <Box sx={{ flex: 1 }} />}

        {/* RIGHT: User area */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 180, justifyContent: "flex-end" }}>
          {isAuthenticated ? (
            <>
              {/* Notifications Icon */}
              <IconButton
                onClick={handleNotificationsClick}
                sx={{
                  color: location.pathname === "/notifications" ? "primary.main" : "grey.600",
                }}
              >
                <Badge badgeContent={3} color="error" sx={{ "& .MuiBadge-badge": { fontSize: 10, height: 18, minWidth: 18 } }}>
                  <Notifications />
                </Badge>
              </IconButton>

              {/* User Avatar & Menu */}
              <IconButton
                onClick={handleMenuClick}
                size="small"
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  sx={{ width: 36, height: 36 }}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    minWidth: 240,
                    mt: 1.5,
                    borderRadius: "12px",
                    overflow: "visible",
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 16,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {/* User Info Header */}
                <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar src={user.avatar} alt={user.name} sx={{ width: 40, height: 40 }} />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      @{user.username}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                <MenuItem onClick={handleDashboardClick}>
                  <ListItemIcon>
                    <Dashboard fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Dashboard</ListItemText>
                </MenuItem>

                <MenuItem onClick={handleProfileClick}>
                  <ListItemIcon>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Hồ sơ của tôi</ListItemText>
                </MenuItem>

                <MenuItem onClick={handleNotificationsClick}>
                  <ListItemIcon>
                    <Notifications fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Thông báo</ListItemText>
                </MenuItem>

                <MenuItem onClick={handleSettingsClick}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Cài đặt</ListItemText>
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                  <ListItemIcon>
                    <Logout fontSize="small" sx={{ color: "error.main" }} />
                  </ListItemIcon>
                  <ListItemText>Đăng xuất</ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            /* Guest: Login/Register buttons */
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button
                variant="outlined"
                startIcon={<Login />}
                onClick={handleLogin}
                sx={{
                  borderRadius: "20px",
                  px: 2.5,
                  fontWeight: 600,
                  borderColor: "primary.main",
                  color: "primary.main",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "primary.dark",
                    backgroundColor: "rgba(136, 178, 139, 0.1)",
                  },
                }}
              >
                Đăng Nhập
              </Button>
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={handleRegister}
                sx={{
                  borderRadius: "20px",
                  px: 2.5,
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Đăng Ký
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
