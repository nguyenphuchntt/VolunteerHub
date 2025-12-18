import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Card, CardContent
} from "@mui/material";
import { Person, Lock, ChevronRight, SupervisorAccount } from "@mui/icons-material";
import { ThreeColumnLayout } from "../../components/common";
import { useAuth } from "../../context/AuthContext";
import ChangePassword from "./ChangePassword";
import ProfileSettings from "./ProfileSettings";
import ManagerRequest from "./ManagerRequest";

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Base menu items
  const baseMenuItems = [
    { 
      label: "Thông tin cá nhân", 
      path: "/settings/profile", 
      icon: <Person />,
      description: "Cập nhật họ tên, email, và thông tin khác"
    },
    { 
      label: "Đổi mật khẩu", 
      path: "/settings/change-password", 
      icon: <Lock />,
      description: "Thay đổi mật khẩu đăng nhập"
    },
  ];

  // Add manager request option only for regular users
  const menuItems = user?.role === "USER" 
    ? [
        ...baseMenuItems,
        { 
          label: "Yêu cầu làm Quản lý", 
          path: "/settings/manager-request", 
          icon: <SupervisorAccount />,
          description: "Gửi yêu cầu để trở thành quản lý sự kiện"
        },
      ]
    : baseMenuItems;

  const isActive = (path) => location.pathname === path;

  // Determine which sub-component to render
  const renderContent = () => {
    if (location.pathname === "/settings/profile") {
      return <ProfileSettings />;
    }
    if (location.pathname === "/settings/change-password") {
      return <ChangePassword />;
    }
    if (location.pathname === "/settings/manager-request") {
      return <ManagerRequest />;
    }
    // Main settings menu
    return (
      <Card elevation={0} sx={{ borderRadius: "16px", border: "1px solid", borderColor: "grey.200" }}>
        <CardContent sx={{ p: 0 }}>
          <List disablePadding>
            {menuItems.map((item, index) => (
              <ListItem 
                key={item.path} 
                disablePadding
                divider={index < menuItems.length - 1}
              >
                <ListItemButton 
                  onClick={() => navigate(item.path)}
                  sx={{ 
                    py: 2, 
                    px: 2.5,
                    "&:hover": { backgroundColor: "grey.50" }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 44, color: isActive(item.path) ? "primary.main" : "text.secondary" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    secondary={item.description}
                    primaryTypographyProps={{ fontWeight: 600 }}
                    secondaryTypographyProps={{ variant: "caption" }}
                  />
                  <ChevronRight sx={{ color: "text.secondary" }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  };

  return (
    <ThreeColumnLayout user={user} role="volunteer" showRightSidebar={false} showSearch={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ p: 2, position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 10 }}
        >
          Cài đặt
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        {renderContent()}
      </Box>
    </ThreeColumnLayout>
  );
};

export default Settings;

