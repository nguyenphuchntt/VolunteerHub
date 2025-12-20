import { useState, useEffect, useCallback } from "react";
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
  CircularProgress,
  Alert,
  Pagination,
} from "@mui/material";
import {
  CheckCircle,
  Event,
  Person,
  Circle,
  Delete,
  Visibility,
  Notifications as NotificationsIcon,
  Comment,
  ThumbUp,
  PersonAdd,
  Campaign,
} from "@mui/icons-material";
import { ThreeColumnLayout } from "../../components/common";
import { notificationService } from "../../api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Pagination state
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // Fetch notifications based on activeTab
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      if (activeTab === 0) {
        // Tất cả
        result = await notificationService.getMyNotifications(page, pageSize);
      } else if (activeTab === 1) {
        // Chưa đọc
        result = await notificationService.searchNotifications({
          isRead: false,
          page,
          size: pageSize,
        });
      } else {
        // Đã đọc
        result = await notificationService.searchNotifications({
          isRead: true,
          page,
          size: pageSize,
        });
      }
      setNotifications(result.content || []);
      setTotalPages(result.totalPages || 0);
      setTotalElements(result.totalElements || 0);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Không thể tải thông báo. Vui lòng thử lại sau.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, pageSize]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const result = await notificationService.getUnreadCount();
      setUnreadCount(result.unreadCount || 0);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Reset page when tab changes
  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
    setPage(0);
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage - 1); // MUI Pagination is 1-indexed, API is 0-indexed
  };

  const handleMarkAsRead = async (id) => {
    try {
      const result = await notificationService.toggleReadStatus(id);
      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === id ? { ...n, isRead: result.isRead } : n
        )
      );
      // Update unread count
      if (result.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } else {
        setUnreadCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Failed to toggle read status:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      // Refetch notifications after marking all as read
      fetchNotifications();
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "EVENT_JOIN_APPROVED":
      case "EVENT_APPROVED":
      case "ROLE_REQUEST_APPROVED":
        return (
          <Avatar sx={{ bgcolor: "success.light", width: 40, height: 40 }}>
            <CheckCircle sx={{ color: "success.main", fontSize: 24 }} />
          </Avatar>
        );
      case "EVENT_START_REMINDER":
      case "EVENT_END_REMINDER":
        return (
          <Avatar sx={{ bgcolor: "warning.light", width: 40, height: 40 }}>
            <Event sx={{ color: "warning.main", fontSize: 24 }} />
          </Avatar>
        );
      case "EVENT_JOIN_REJECTED":
      case "EVENT_REJECTED":
      case "ROLE_REQUEST_REJECTED":
        return (
          <Avatar sx={{ bgcolor: "error.light", width: 40, height: 40 }}>
            <Event sx={{ color: "error.main", fontSize: 24 }} />
          </Avatar>
        );
      case "POST_LIKE":
        return (
          <Avatar sx={{ bgcolor: "primary.light", width: 40, height: 40 }}>
            <ThumbUp sx={{ color: "primary.main", fontSize: 24 }} />
          </Avatar>
        );
      case "POST_COMMENT":
      case "COMMENT_REPLY":
        return (
          <Avatar sx={{ bgcolor: "info.light", width: 40, height: 40 }}>
            <Comment sx={{ color: "info.main", fontSize: 24 }} />
          </Avatar>
        );
      case "NEW_FOLLOWER":
        return (
          <Avatar sx={{ bgcolor: "secondary.light", width: 40, height: 40 }}>
            <PersonAdd sx={{ color: "secondary.main", fontSize: 24 }} />
          </Avatar>
        );
      case "SYSTEM_ANNOUNCEMENT":
        return (
          <Avatar sx={{ bgcolor: "warning.light", width: 40, height: 40 }}>
            <Campaign sx={{ color: "warning.main", fontSize: 24 }} />
          </Avatar>
        );
      default:
        return (
          <Avatar sx={{ bgcolor: "grey.200", width: 40, height: 40 }}>
            <NotificationsIcon sx={{ color: "grey.600", fontSize: 24 }} />
          </Avatar>
        );
    }
  };

  const formatNotificationTitle = (type) => {
    const titles = {
      POST_LIKE: "Lượt thích mới",
      POST_COMMENT: "Bình luận mới",
      COMMENT_REPLY: "Phản hồi bình luận",
      EVENT_START_REMINDER: "Nhắc nhở sự kiện",
      EVENT_END_REMINDER: "Sự kiện kết thúc",
      EVENT_JOIN_APPROVED: "Đăng ký được duyệt",
      EVENT_JOIN_REJECTED: "Đăng ký bị từ chối",
      EVENT_APPROVED: "Sự kiện được duyệt",
      EVENT_REJECTED: "Sự kiện bị từ chối",
      EVENT_JOIN_REQUEST: "Yêu cầu tham gia",
      MANAGER_ROLE_REQUEST: "Yêu cầu quyền quản lý",
      ROLE_REQUEST_APPROVED: "Yêu cầu được duyệt",
      ROLE_REQUEST_REJECTED: "Yêu cầu bị từ chối",
      NEW_FOLLOWER: "Người theo dõi mới",
      SYSTEM_ANNOUNCEMENT: "Thông báo hệ thống",
      OTHER: "Thông báo",
      NORMAL: "Thông báo",
    };
    return titles[type] || "Thông báo";
  };

  return (
    <ThreeColumnLayout role="volunteer" showRightSidebar={true} showSearch={false}>
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
          onChange={handleTabChange}
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

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && !loading && (
        <Box sx={{ p: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {/* Empty State */}
      {!loading && !error && notifications.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <NotificationsIcon sx={{ fontSize: 64, color: "grey.300", mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Không có thông báo
          </Typography>
        </Box>
      )}

      {/* Notifications List */}
      {!loading && !error && notifications.length > 0 && (
        <>
          {notifications.map((notification) => (
            <Box key={notification.notificationId}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  p: 2,
                  backgroundColor: notification.isRead ? "transparent" : "rgba(136, 178, 139, 0.05)",
                  "&:hover": { backgroundColor: "grey.50" },
                  cursor: "pointer",
                }}
              >
                {/* Unread indicator */}
                <Box sx={{ width: 8, display: "flex", alignItems: "flex-start", pt: 1.5 }}>
                  {!notification.isRead && (
                    <Circle sx={{ fontSize: 8, color: "primary.main" }} />
                  )}
                </Box>

                {/* Icon */}
                {getNotificationIcon(notification.type)}

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={notification.isRead ? 400 : 600}>
                    {formatNotificationTitle(notification.type)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {notification.content}
                  </Typography>
                </Box>

                {/* Actions */}
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notification.notificationId);
                    }}
                    title={notification.isRead ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc"}
                  >
                    <Visibility sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </Box>
              <Divider />
            </Box>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </ThreeColumnLayout>
  );
};

export default Notifications;
