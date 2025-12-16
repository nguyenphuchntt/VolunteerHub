import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Chip,
  Tabs,
  Tab,
  IconButton,
  Divider,
} from "@mui/material";
import {
  CheckCircle,
  Event,
  Person,
  Circle,
  Delete,
  Visibility,
} from "@mui/icons-material";
import { ThreeColumnLayout } from "../../components/common";
import { mockUsers } from "../../data/mockData";

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: "registration_approved",
    title: "Đăng ký được duyệt",
    message: 'Đăng ký tham gia sự kiện "Beach Cleanup Drive" đã được duyệt.',
    eventId: 1,
    timestamp: "2 giờ trước",
    read: false,
  },
  {
    id: 2,
    type: "event_reminder",
    title: "Nhắc nhở sự kiện",
    message: 'Sự kiện "Food Bank Distribution" sẽ diễn ra trong 2 ngày nữa.',
    eventId: 2,
    timestamp: "5 giờ trước",
    read: false,
  },
  {
    id: 3,
    type: "completion",
    title: "Hoàn thành sự kiện",
    message: 'Bạn đã hoàn thành sự kiện "Senior Care Visit". Cảm ơn bạn đã tham gia!',
    eventId: 4,
    timestamp: "1 ngày trước",
    read: true,
  },
  {
    id: 4,
    type: "new_post",
    title: "Bài viết mới",
    message: 'Có bài viết mới trong sự kiện "Beach Cleanup Drive".',
    eventId: 1,
    timestamp: "2 ngày trước",
    read: true,
  },
];

const Notifications = () => {
  const user = mockUsers[0];
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState(0);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications =
    activeTab === 0
      ? notifications
      : activeTab === 1
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.read);

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "registration_approved":
        return (
          <Avatar sx={{ bgcolor: "success.light", width: 40, height: 40 }}>
            <CheckCircle sx={{ color: "success.main", fontSize: 24 }} />
          </Avatar>
        );
      case "event_reminder":
        return (
          <Avatar sx={{ bgcolor: "warning.light", width: 40, height: 40 }}>
            <Event sx={{ color: "warning.main", fontSize: 24 }} />
          </Avatar>
        );
      case "completion":
        return (
          <Avatar sx={{ bgcolor: "primary.light", width: 40, height: 40 }}>
            <CheckCircle sx={{ color: "#fff", fontSize: 24 }} />
          </Avatar>
        );
      default:
        return (
          <Avatar sx={{ bgcolor: "grey.200", width: 40, height: 40 }}>
            <Event sx={{ color: "grey.600", fontSize: 24 }} />
          </Avatar>
        );
    }
  };

  return (
    <ThreeColumnLayout user={user} role="volunteer" showRightSidebar={true} showSearch={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Thông báo
          </Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              onClick={handleMarkAllAsRead}
              sx={{ textTransform: "none", fontWeight: 500 }}
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          sx={{
            px: 2,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "14px",
              minWidth: "auto",
              px: 2,
            },
          }}
        >
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                Tất cả
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                Chưa đọc
                {unreadCount > 0 && (
                  <Chip
                    label={unreadCount}
                    size="small"
                    color="primary"
                    sx={{ height: 18, fontSize: "11px" }}
                  />
                )}
              </Box>
            }
          />
          <Tab label="Đã đọc" />
        </Tabs>
      </Box>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            Không có thông báo
          </Typography>
        </Box>
      ) : (
        filteredNotifications.map((notification) => (
          <Box key={notification.id}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                p: 2,
                backgroundColor: notification.read ? "transparent" : "rgba(136, 178, 139, 0.05)",
                "&:hover": { backgroundColor: "grey.50" },
                cursor: "pointer",
              }}
            >
              {/* Unread indicator */}
              <Box sx={{ width: 8, display: "flex", alignItems: "flex-start", pt: 1.5 }}>
                {!notification.read && (
                  <Circle sx={{ fontSize: 8, color: "primary.main" }} />
                )}
              </Box>

              {/* Icon */}
              {getNotificationIcon(notification.type)}

              {/* Content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={notification.read ? 400 : 600}>
                  {notification.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                  {notification.timestamp}
                </Typography>
              </Box>

              {/* Actions */}
              <Box sx={{ display: "flex", gap: 0.5 }}>
                {!notification.read && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notification.id);
                    }}
                    title="Đánh dấu đã đọc"
                  >
                    <Visibility sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notification.id);
                  }}
                  title="Xóa"
                >
                  <Delete sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </Box>
            <Divider />
          </Box>
        ))
      )}
    </ThreeColumnLayout>
  );
};

export default Notifications;
