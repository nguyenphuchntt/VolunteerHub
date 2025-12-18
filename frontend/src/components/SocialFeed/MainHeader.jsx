import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockUsers } from "../../data/mockData";
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
} from "@mui/material";
import {
  Search,
  Person,
  Notifications,
  Settings,
  Logout,
} from "@mui/icons-material";

const MainHeader = ({ user = mockUsers[0], searchQuery = "", onSearchChange }) => {
  const navigate = useNavigate();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Sync local search query with prop
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleLogoClick = () => {
    navigate("/events");
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate(`/profiles/${user.username}`);
    handleMenuClose();
  };

  const handleNotificationsClick = () => {
    console.log("Notifications clicked");
    handleMenuClose();
  };

  const handleSettingsClick = () => {
    console.log("Settings clicked");
    handleMenuClose();
  };

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/signin");
    handleMenuClose();
  };

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
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
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

        {/* Search */}
        <Box sx={{ flex: 1, mx: 4, maxWidth: 500 }}>
          <TextField
            type="text"
            placeholder="Search events..."
            value={localSearchQuery}
            onChange={handleSearchChange}
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

        {/* User Menu */}
        <Box>
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
                  {user.bio}
                </Typography>
              </Box>
            </Box>

            <Divider />

            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>

            <MenuItem onClick={handleNotificationsClick}>
              <ListItemIcon>
                <Notifications fontSize="small" />
              </ListItemIcon>
              <ListItemText>Notifications</ListItemText>
            </MenuItem>

            <MenuItem onClick={handleSettingsClick}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              <ListItemIcon>
                <Logout fontSize="small" sx={{ color: "error.main" }} />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MainHeader;

