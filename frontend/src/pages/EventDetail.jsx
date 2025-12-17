import { useState, useEffect, useCallback } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import WritePost from "../components/SocialFeed/WritePost";
import PostCard from "../components/SocialFeed/PostCard";
import { ThreeColumnLayout } from "../components/common";
import { eventService, myEventsService, postService, eventUserService } from "../api";
import { useAuth } from "../context/AuthContext";

import {
  Box,
  Tabs,
  Tab,
  Typography,
  Chip,
  Grid,
  Avatar,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Forum,
  Info,
  People,
  ArrowBack,
  CalendarMonth,
  LocationOn,
} from "@mui/icons-material";

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isManager } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  
  // API states
  const [event, setEvent] = useState(null);
  const [posts, setPosts] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);

  // Fetch event data
  const fetchEvent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const eventData = await eventService.getEventById(eventId);
      setEvent(eventData);
    } catch (err) {
      console.error("Failed to fetch event:", err);
      if (err.response?.status === 404) {
        setError("Sự kiện không tồn tại.");
      } else {
        setError("Không thể tải thông tin sự kiện.");
      }
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  // Fetch event posts
  const fetchPosts = useCallback(async () => {
    try {
      const response = await postService.getPostsByEvent(eventId);
      setPosts(response.content || []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  }, [eventId]);

  // Fetch participants (only for managers/admins - backend requires ADMIN/MANAGER role)
  const fetchParticipants = useCallback(async () => {
    if (!isManager) {
      // Regular users can't access event-users endpoint
      return;
    }
    try {
      const response = await eventUserService.getEventUsersByEventId(eventId);
      setParticipants(response.content || []);
    } catch (err) {
      console.error("Failed to fetch participants:", err);
    }
  }, [eventId, isManager]);

  useEffect(() => {
    fetchEvent();
    fetchPosts();
    fetchParticipants();
  }, [fetchEvent, fetchPosts, fetchParticipants]);


  // Handle event registration
  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate("/signin", { state: { from: { pathname: `/events/${eventId}` } } });
      return;
    }
    
    setRegistering(true);
    try {
      await myEventsService.registerForEvent(eventId, {});
      alert("Đăng ký thành công!");
      fetchParticipants();
    } catch (err) {
      console.error("Registration failed:", err);
      alert(err.response?.data?.message || "Đăng ký thất bại.");
    } finally {
      setRegistering(false);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading state
  if (loading) {
    return (
      <ThreeColumnLayout user={user} role="volunteer" showRightSidebar={false}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </ThreeColumnLayout>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <ThreeColumnLayout user={user} role="volunteer" showRightSidebar={false}>
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>{error || "Sự kiện không tồn tại."}</Alert>
          <Button variant="contained" onClick={() => navigate("/events")}>
            Quay lại danh sách sự kiện
          </Button>
        </Box>
      </ThreeColumnLayout>
    );
  }

  // Get display values from API format
  const attendeeCount = event.attendeeCount || participants.length || 0;
  const coverImage = event.coverImage || "/images/default-event.jpg";
  const statusDisplay = (event.status || "").toString();

  return (
    <ThreeColumnLayout user={user} role="volunteer" showRightSidebar={false} showSearch={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200", position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 10 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 1.5 }}>
          <Button
            variant="text"
            onClick={() => navigate(-1)}
            sx={{ minWidth: "auto", p: 1, borderRadius: "50%" }}
          >
            <ArrowBack />
          </Button>
          <Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
              {event.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {attendeeCount} tình nguyện viên
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Banner */}
      <Box
        sx={{
          height: 150,
          backgroundImage: `url(${coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#e0e0e0",
        }}
      />

      {/* Event Info */}
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Typography variant="h6" fontWeight={700}>
          {event.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {event.description || "Không có mô tả"}
        </Typography>
        
        {/* Event details */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarMonth sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {formatDate(event.startAt)} - {formatDate(event.endAt)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOn sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {event.location || "Địa điểm chưa xác định"}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: "flex", gap: 1, mt: 1.5, flexWrap: "wrap" }}>
          {event.category && <Chip label={event.category} size="small" color="primary" />}
          {statusDisplay && <Chip label={statusDisplay} size="small" variant="outlined" />}
        </Box>
        
        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleRegister}
            disabled={registering}
            sx={{ borderRadius: "9999px", textTransform: "none", fontWeight: 600 }}
          >
            {registering ? <CircularProgress size={20} /> : "Đăng ký tham gia"}
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, v) => setActiveTab(v)}
        sx={{
          borderBottom: "1px solid",
          borderColor: "grey.200",
          "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "14px", flex: 1 },
        }}
      >
        <Tab icon={<Forum sx={{ fontSize: 18 }} />} iconPosition="start" label="Feed" />
        <Tab icon={<Info sx={{ fontSize: 18 }} />} iconPosition="start" label="Chi tiết" />
        <Tab icon={<People sx={{ fontSize: 18 }} />} iconPosition="start" label="TNV" />
      </Tabs>

      {/* Feed Tab */}
      {activeTab === 0 && (
        <Box>
          {isAuthenticated && <WritePost currentUser={user} />}
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.postId || post.id} post={post} />
            ))
          ) : (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h2" sx={{ mb: 2 }}>💬</Typography>
              <Typography variant="h6" fontWeight={600}>Chưa có bài viết</Typography>
              <Typography color="text.secondary">Hãy là người đầu tiên chia sẻ!</Typography>
            </Box>
          )}
        </Box>
      )}

      {/* About Tab */}
      {activeTab === 1 && (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            Về sự kiện này
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.8 }}>
            {event.description || "Không có mô tả chi tiết."}
          </Typography>

          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            Thông tin sự kiện
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2"><strong>Thời gian bắt đầu:</strong> {formatDate(event.startAt)}</Typography>
            <Typography variant="body2"><strong>Thời gian kết thúc:</strong> {formatDate(event.endAt)}</Typography>
            <Typography variant="body2"><strong>Địa điểm:</strong> {event.location || "Chưa xác định"}</Typography>
            <Typography variant="body2"><strong>Số người tham gia:</strong> {attendeeCount}</Typography>
            <Typography variant="body2"><strong>Lượt thích:</strong> {event.likeCount || 0}</Typography>
          </Box>
        </Box>
      )}

      {/* Participants Tab */}
      {activeTab === 2 && (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            Tình nguyện viên ({participants.length})
          </Typography>
          {participants.length > 0 ? (
            <Grid container spacing={1}>
              {participants.map((participant) => (
                <Grid item xs={6} key={participant.accountId || participant.id}>
                  <Box
                    onClick={() => participant.username && navigate(`/profiles/${participant.username}`)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      p: 1,
                      borderRadius: "8px",
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "grey.50" },
                    }}
                  >
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {(participant.username || participant.firstName || "?").charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={500} noWrap>
                        {participant.firstName || participant.username || "Ẩn danh"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {participant.eventUserRole || "Tình nguyện viên"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              Chưa có tình nguyện viên nào đăng ký.
            </Typography>
          )}
        </Box>
      )}
    </ThreeColumnLayout>
  );
};

export default EventDetail;

