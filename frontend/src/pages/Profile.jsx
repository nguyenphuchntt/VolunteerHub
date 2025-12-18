import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThreeColumnLayout } from "../components/common";
import { profileService, userService, myEventsService, postService } from "../api";
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
  const [likedEvents, setLikedEvents] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Followers/Following states
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

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

  // Fetch liked events (only for own profile)
  const fetchLikedEvents = useCallback(async () => {
    if (!isOwnProfile) return;
    try {
      const response = await myEventsService.getMyLikedEvents();
      setLikedEvents(response.content || []);
    } catch (err) {
      console.error("Failed to fetch liked events:", err);
    }
  }, [isOwnProfile]);

  // Fetch liked posts (only for own profile)
  const fetchLikedPosts = useCallback(async () => {
    if (!isOwnProfile) return;
    try {
      const response = await postService.getMyLikedPosts();
      setLikedPosts(response.content || []);
    } catch (err) {
      console.error("Failed to fetch liked posts:", err);
    }
  }, [isOwnProfile]);

  // Fetch followers/following counts
  const fetchFollowData = useCallback(async () => {
    if (!profileUser?.accountID) return;
    try {
      const [followers, following] = await Promise.all([
        userService.getFollowersCount(profileUser.accountID),
        userService.getFollowingCount(profileUser.accountID)
      ]);
      setFollowersCount(followers || 0);
      setFollowingCount(following || 0);

      // Check if current user is following this profile
      if (isAuthenticated && !isOwnProfile) {
        try {
          const isFollow = await userService.isFollowing(profileUser.accountID);
          setIsFollowing(isFollow);
        } catch {
          // User not authenticated or error
        }
      }
    } catch (err) {
      console.error("Failed to fetch follow data:", err);
    }
  }, [profileUser?.accountID, isAuthenticated, isOwnProfile]);

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }
    if (!profileUser?.accountID || followLoading) return;
    
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await userService.unfollowUser(profileUser.accountID);
        setIsFollowing(false);
        setFollowersCount(prev => Math.max(0, prev - 1));
      } else {
        await userService.followUser(profileUser.accountID);
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
      }
    } catch (err) {
      console.error("Failed to toggle follow:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profileUser?.accountID) {
      fetchFollowData();
    }
  }, [profileUser?.accountID, fetchFollowData]);

  useEffect(() => {
    if (isOwnProfile && isAuthenticated) {
      fetchEvents();
      fetchLikedEvents();
      fetchLikedPosts();
    }
  }, [isOwnProfile, isAuthenticated, fetchEvents, fetchLikedEvents, fetchLikedPosts]);


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
              variant={isFollowing ? "outlined" : "contained"}
              onClick={handleFollowToggle}
              disabled={followLoading}
              sx={{
                borderRadius: "9999px",
                textTransform: "none",
                fontWeight: 700,
                mt: 1,
                minWidth: 100,
              }}
            >
              {followLoading ? <CircularProgress size={20} /> : isFollowing ? "Đang theo dõi" : "Theo dõi"}
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
            <Box sx={{ display: "flex", gap: 0.5, cursor: "pointer" }}>
              <Typography variant="body2" fontWeight={700}>
                {followersCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                người theo dõi
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 0.5, cursor: "pointer" }}>
              <Typography variant="body2" fontWeight={700}>
                {followingCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                đang theo dõi
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Typography variant="body2" fontWeight={700}>
                {participatedEvents.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                sự kiện
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
          {isOwnProfile && <Tab label="Sự kiện đã thích" />}
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

      {/* Liked Events Tab */}
      {activeTab === 2 && isOwnProfile && (
        <Box>
          {likedEvents.length > 0 ? (
            likedEvents.map((event) => (
              <Box
                key={event.eventId || event.id}
                onClick={() => navigate(`/events/${event.eventId || event.id}`)}
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
                      backgroundImage: event.coverImage ? `url(${event.coverImage})` : "none",
                      backgroundSize: "cover",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {!event.coverImage && <CalendarMonth sx={{ fontSize: 32, color: "text.secondary" }} />}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body1" fontWeight={600}>
                      {event.title || `Sự kiện #${event.eventId || event.id}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                      {event.category || "Sự kiện"}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                      <LocationOn sx={{ fontSize: 14, color: "text.secondary" }} />
                      <Typography variant="caption" color="text.secondary">
                        {event.location || "Chưa xác định"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <CalendarMonth sx={{ fontSize: 14, color: "text.secondary" }} />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(event.startAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h2" sx={{ mb: 2 }}>❤️</Typography>
              <Typography variant="body1" color="text.secondary">
                Chưa thích sự kiện nào
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </ThreeColumnLayout>
  );
};

export default Profile;

