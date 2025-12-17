import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThreeColumnLayout } from "../components/common";
import { profileService, userService, myEventsService } from "../api";
import { useAuth } from "../context/AuthContext";

import {
  Box,
  Avatar,
  Typography,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from "@mui/material";
import { CalendarMonth, LocationOn, Edit } from "@mui/icons-material";

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  // API states
  const [profileUser, setProfileUser] = useState(null);
  const [participatedEvents, setParticipatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwnProfile = currentUser?.username === username;

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (isOwnProfile) {
        // Fetch own profile
        const profile = await profileService.getMyProfile();
        setProfileUser(profile);
      } else {
        // Fetch other user's profile by username
        const response = await userService.searchUsers({ username });
        if (response.content && response.content.length > 0) {
          setProfileUser(response.content[0]);
        } else {
          setError("Không tìm thấy người dùng.");
        }
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Không thể tải thông tin hồ sơ.");
    } finally {
      setLoading(false);
    }
  }, [username, isOwnProfile]);

  // Fetch participated events (only for own profile using myEventsService)
  const fetchEvents = useCallback(async () => {
    if (!isOwnProfile) {
      // For other users' profiles, we can't access their events without ADMIN/MANAGER role
      return;
    }
    try {
      const response = await myEventsService.getMyEvents();
      setParticipatedEvents(response.content || []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  }, [isOwnProfile]);



  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (isOwnProfile && isAuthenticated) {
      fetchEvents();
    }
  }, [isOwnProfile, isAuthenticated, fetchEvents]);


  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Loading state
  if (loading) {
    return (
      <ThreeColumnLayout user={currentUser} role="volunteer" showRightSidebar={true}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </ThreeColumnLayout>
    );
  }

  // Error state
  if (error || !profileUser) {
    return (
      <ThreeColumnLayout user={currentUser} role="volunteer" showRightSidebar={true}>
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>{error || "Người dùng không tồn tại."}</Alert>
          <Button variant="contained" onClick={() => navigate("/events")}>
            Quay lại
          </Button>
        </Box>
      </ThreeColumnLayout>
    );
  }

  // Get display values from API format
  const displayName = profileUser.firstName && profileUser.lastName 
    ? `${profileUser.firstName} ${profileUser.lastName}` 
    : profileUser.username || "Người dùng";

  return (
    <ThreeColumnLayout user={currentUser} role="volunteer" showRightSidebar={true} showSearch={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ p: 2, position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 10 }}
        >
          {displayName}
        </Typography>
      </Box>

      {/* Cover Image */}
      <Box
        sx={{
          height: 150,
          backgroundColor: "#e0e0e0",
          backgroundImage: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Profile Info */}
      <Box sx={{ px: 2, pb: 2 }}>
        {/* Avatar & Actions */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              border: "4px solid white",
              mt: -6,
              bgcolor: "primary.main",
              fontSize: "2rem",
            }}
          >
            {(displayName || "?").charAt(0).toUpperCase()}
          </Avatar>
          {isOwnProfile ? (
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => navigate("/settings/profile")}
              sx={{
                borderRadius: "9999px",
                textTransform: "none",
                fontWeight: 700,
                mt: 1,
              }}
            >
              Chỉnh sửa hồ sơ
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{
                borderRadius: "9999px",
                textTransform: "none",
                fontWeight: 700,
                mt: 1,
              }}
            >
              Theo dõi
            </Button>
          )}
        </Box>

        {/* User Info */}
        <Box sx={{ mt: 1 }}>
          <Typography variant="h6" fontWeight={700}>
            {displayName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            @{profileUser.username}
          </Typography>
          {profileUser.email && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {profileUser.email}
            </Typography>
          )}

          {/* Stats */}
          <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Typography variant="body2" fontWeight={700}>
                {participatedEvents.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                sự kiện
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                vai trò
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {profileUser.role || "USER"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            mt: 2,
            borderBottom: "1px solid",
            borderColor: "grey.200",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "14px",
              flex: 1,
            },
          }}
        >
          <Tab label="Lịch sử tham gia" />
          <Tab label="Thông tin" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          {participatedEvents.length > 0 ? (
            participatedEvents.map((eventUser) => (
              <Box
                key={eventUser.eventId || eventUser.id}
                onClick={() => navigate(`/events/${eventUser.eventId}`)}
                sx={{
                  p: 2,
                  borderBottom: "1px solid",
                  borderColor: "grey.200",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "grey.50" },
                }}
              >
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "12px",
                      backgroundColor: "#e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CalendarMonth sx={{ fontSize: 32, color: "text.secondary" }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body1" fontWeight={600}>
                      {eventUser.eventTitle || `Sự kiện #${eventUser.eventId}`}
                    </Typography>
                    <Typography variant="caption" color="primary.main" fontWeight={500}>
                      {eventUser.eventUserRole || "Tình nguyện viên"}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                      <CalendarMonth sx={{ fontSize: 14, color: "text.secondary" }} />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(eventUser.startAt)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Trạng thái: {eventUser.status || "PENDING"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="body1" color="text.secondary">
                Chưa tham gia sự kiện nào
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {activeTab === 1 && (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            Thông tin tài khoản
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="body2">
              <strong>Tên người dùng:</strong> {profileUser.username}
            </Typography>
            <Typography variant="body2">
              <strong>Email:</strong> {profileUser.email || "Chưa cung cấp"}
            </Typography>
            <Typography variant="body2">
              <strong>Họ:</strong> {profileUser.firstName || "Chưa cung cấp"}
            </Typography>
            <Typography variant="body2">
              <strong>Tên:</strong> {profileUser.lastName || "Chưa cung cấp"}
            </Typography>
            <Typography variant="body2">
              <strong>Vai trò:</strong> {profileUser.role || "USER"}
            </Typography>
            <Typography variant="body2">
              <strong>Trạng thái:</strong> {profileUser.status || "ACTIVE"}
            </Typography>
          </Box>
        </Box>
      )}
    </ThreeColumnLayout>
  );
};

export default Profile;

