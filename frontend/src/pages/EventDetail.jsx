import { useState, useEffect, useCallback } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import ConfirmJoinDialog from "../components/events/ConfirmJoinDialog";
import WritePost from "../components/SocialFeed/WritePost";
import PostCard from "../components/SocialFeed/PostCard";
import { ThreeColumnLayout, ConfirmDialog } from "../components/common";
import { eventService, myEventsService, postService, eventUserService, mediaService } from "../api";
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
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Forum,
  Info,
  People,
  ArrowBack,
  CalendarMonth,
  LocationOn,
  FavoriteBorder,
  Favorite,
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
  const [confirmJoinOpen, setConfirmJoinOpen] = useState(false);
  const [confirmUnregisterOpen, setConfirmUnregisterOpen] = useState(false);
  const [participationStatus, setParticipationStatus] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  // Like event states
  const [isEventLiked, setIsEventLiked] = useState(false);
  const [eventLikeCount, setEventLikeCount] = useState(0);
  const [likingEvent, setLikingEvent] = useState(false);
  
  // Event media for cover image
  const [eventMedia, setEventMedia] = useState([]);

  // Fetch event data
  const fetchEvent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const eventData = await eventService.getEventById(eventId);
      setEvent(eventData);
      setEventLikeCount(eventData.likeCount || 0);
      
      // Check if user liked this event
      if (isAuthenticated) {
        try {
          const likedData = await eventService.isEventLiked(eventId);
          setIsEventLiked(likedData || false);
        } catch {
          // Ignore error
        }
      }
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
  }, [eventId, isAuthenticated]);

  // Fetch event posts
  const fetchPosts = useCallback(async () => {
    try {
      const response = await postService.getPostsByEvent(eventId);
      setPosts(response.content || []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  }, [eventId]);

  // Fetch event media for cover image
  const fetchEventMedia = useCallback(async () => {
    try {
      const response = await mediaService.getMediaByEvent(eventId);
      setEventMedia(response.content || []);
    } catch (err) {
      console.error("Failed to fetch event media:", err);
    }
  }, [eventId]);

  // Fetch participants (publicly visible approved participants)
  const fetchParticipants = useCallback(async () => {
    try {
      // Use the new public endpoint in eventService instead of eventUserService (which was admin only)
      const response = await eventService.getEventParticipants(eventId);
      setParticipants(response.content || []);
    } catch (err) {
      console.error("Failed to fetch participants:", err);
    }
  }, [eventId]);

  // Fetch participation status for current user
  const fetchParticipationStatus = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await myEventsService.getMyEvent(eventId);
      if (data && data.status) {
        setParticipationStatus(data.status);
      } else {
        setParticipationStatus(null);
      }
    } catch (err) {
      if (err.response?.status !== 404) {
         console.error("Failed to fetch participation status:", err);
      }
      setParticipationStatus(null);
    }
  }, [eventId, isAuthenticated]);

  useEffect(() => {
    fetchEvent();
    fetchPosts();
    fetchParticipants();
    fetchParticipationStatus();
    fetchEventMedia();
  }, [fetchEvent, fetchPosts, fetchParticipants, fetchParticipationStatus, fetchEventMedia]);

  // Handle like event
  const handleLikeEvent = async () => {
    if (!isAuthenticated) {
      navigate("/signin", { state: { from: { pathname: `/events/${eventId}` } } });
      return;
    }
    setLikingEvent(true);
    try {
      const result = await eventService.likeEvent(eventId);
      if (result) {
        // Backend returns: { eventId, accountId, liked, likesCount }
        setIsEventLiked(result.liked);
        setEventLikeCount(result.likesCount);
      }
    } catch (err) {
      console.error("Failed to like event:", err);
    } finally {
      setLikingEvent(false);
    }
  };

  // Handle post created callback
  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    setSnackbar({ open: true, message: "Đăng bài thành công!", severity: "success" });
  };


  // Handle register click - open dialog
  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      navigate("/signin", { state: { from: { pathname: `/events/${eventId}` } } });
      return;
    }
    setConfirmJoinOpen(true);
  };

  // Handle confirm register
  const handleConfirmRegister = async () => {
    setRegistering(true);
    try {
      await myEventsService.registerForEvent(eventId, {});
      setConfirmJoinOpen(false);
      setSnackbar({ open: true, message: "Đăng ký thành công!", severity: "success" });
      fetchParticipationStatus();
      fetchParticipants();
    } catch (err) {
      console.error("Registration failed:", err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || "Đăng ký thất bại.", 
        severity: "error" 
      });
      setConfirmJoinOpen(false);
    } finally {
      setRegistering(false);
    }
  };

  // Handle unregister
  const handleUnregister = async () => {
    try {
      await myEventsService.unregisterFromEvent(eventId);
      setSnackbar({ open: true, message: "Đã hủy tham gia sự kiện.", severity: "success" });
      setParticipationStatus(null);
      fetchParticipants();
    } catch (err) {
      console.error("Unregister failed:", err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || "Không thể hủy tham gia.", 
        severity: "error" 
      });
    } finally {
      setConfirmUnregisterOpen(false);
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

  // Status Chip config
  const getParticipationConfig = (status) => {
    const configs = {
      APPROVED: { label: "Đã tham gia", bg: "#e8f5e9", color: "#2e7d32" },
      PENDING: { label: "Chờ duyệt", bg: "#fff3e0", color: "#f57c00" },
      REJECTED: { label: "Bị từ chối", bg: "#ffebee", color: "#c62828" },
      FINISHED: { label: "Đã hoàn thành", bg: "#f3e5f5", color: "#7b1fa2" },
    };
    return configs[status] || null;
  };
  
  const participationConfig = getParticipationConfig(participationStatus);

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
  
  // Determine cover image: 1) Event media, 2) Latest post with image, 3) Default
  const getCoverImage = () => {
    // First priority: Event media (cover images uploaded by organizer)
    if (eventMedia.length > 0 && eventMedia[0].url) {
      return eventMedia[0].url;
    }
    // Fallback: Use first post's media if available
    const postWithImage = posts.find(post => {
      if (post.mediaUrls && post.mediaUrls.length > 0) return true;
      if (post.media && post.media.length > 0) return true;
      return false;
    });
    if (postWithImage) {
      if (postWithImage.mediaUrls && postWithImage.mediaUrls.length > 0) {
        return postWithImage.mediaUrls[0];
      }
      if (postWithImage.media && postWithImage.media.length > 0) {
        return postWithImage.media[0].url || postWithImage.media[0];
      }
    }
    // Final fallback: default placeholder
    return "/images/default-event.jpg";
  };
  
  const coverImage = getCoverImage();
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
          {/* Like Event Button */}
          <IconButton
            onClick={handleLikeEvent}
            disabled={likingEvent}
            sx={{
              color: isEventLiked ? "error.main" : "text.secondary",
              ml: "auto",
            }}
          >
            {isEventLiked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
            {eventLikeCount}
          </Typography>
        </Box>
      </Box>

      {/* Banner */}
      <Box
        sx={{
          position: "relative",
          paddingTop: "min(42.86%, 220px)", /* 21:9 aspect ratio, max 220px */
          backgroundColor: "#f0f0f0",
          overflow: "hidden",
          maxHeight: 220,
        }}
      >
        <Box
          component="img"
          src={coverImage}
          alt={event.title}
          onError={(e) => {
            e.target.style.display = "none";
          }}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

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
        
        {/* Participation Status or Register Button */}
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {participationStatus ? (
             <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
               <Box sx={{ 
                 p: 2, 
                 borderRadius: "12px", 
                 backgroundColor: participationConfig?.bg || "grey.100",
                 border: "1px solid",
                 borderColor: participationConfig?.color ? `${participationConfig.color}40` : "grey.300",
                 display: "flex",
                 alignItems: "center",
                 justifyContent: "space-between",
                 gap: 2
               }}>
                 <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                   <Chip 
                     label={participationConfig?.label || participationStatus} 
                     sx={{ 
                       fontWeight: 700, 
                       backgroundColor: participationConfig?.color, 
                       color: "white" 
                     }} 
                   />
                   <Typography variant="body2" fontWeight={500} sx={{ color: participationConfig?.color }}>
                     {participationStatus === "PENDING" 
                       ? "Đang chờ duyệt."
                       : participationStatus === "APPROVED"
                       ? "Bạn đã tham gia sự kiện này."
                       : participationStatus === "REJECTED"
                       ? "Yêu cầu của bạn đã bị từ chối."
                       : ""}
                   </Typography>
                 </Box>
                 
                {(participationStatus === "PENDING" || participationStatus === "APPROVED") && 
                 event.status !== "FINISHED" && 
                 event.status !== "CANCELLED" && 
                 new Date(event.startAt) > new Date() && (
                   <Button 
                     size="small" 
                     color="error"
                     sx={{ textTransform: "none", minWidth: "auto" }}
                     onClick={() => setConfirmUnregisterOpen(true)}
                   >
                     Hủy tham gia
                   </Button>
                 )}
                 
                 {participationStatus === "REJECTED" && 
                 event.status !== "FINISHED" && 
                 event.status !== "CANCELLED" && (
                   <Button 
                     size="small" 
                     variant="contained"
                     color="primary"
                     sx={{ textTransform: "none", borderRadius: "9999px" }}
                     onClick={handleRegisterClick}
                   >
                     Gửi lại yêu cầu
                   </Button>
                 )}
               </Box>
             </Box>
          ) : (
            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleRegisterClick}
              disabled={registering || event.status === "FINISHED" || event.status === "CANCELLED"}
              sx={{ 
                borderRadius: "9999px", 
                textTransform: "none", 
                fontWeight: 600,
                height: 48,
                fontSize: 16
              }}
            >
              Đăng ký tham gia
            </Button>
          )}
        </Box>
        
        {/* Confirm Dialogs */}
        <ConfirmJoinDialog
          open={confirmJoinOpen}
          onClose={() => setConfirmJoinOpen(false)}
          onConfirm={handleConfirmRegister}
          event={event}
          loading={registering}
        />

        <ConfirmDialog
          open={confirmUnregisterOpen}
          onClose={() => setConfirmUnregisterOpen(false)}
          onConfirm={handleUnregister}
          title="Hủy tham gia?"
          message={`Bạn có chắc chắn muốn hủy tham gia sự kiện "${event.title}" không?`}
          confirmLabel="Hủy tham gia"
          variant="danger"
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: "100%", fontWeight: 500, borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
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
        <Box sx={{ p: 2 }}>
          {isAuthenticated && participationStatus === 'APPROVED' && (
            <WritePost 
              currentUser={user} 
              eventId={parseInt(eventId)} 
              onPostCreated={handlePostCreated} 
            />
          )}
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard 
                key={post.postId || post.id} 
                post={post} 
                onPostUpdated={fetchPosts}
              />
            ))
          ) : (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h2" sx={{ mb: 2 }}>💬</Typography>
              <Typography variant="h6" fontWeight={600}>Chưa có bài viết</Typography>
              {/* <Typography color="text.secondary">Hãy là người đầu tiên chia sẻ!</Typography> */}
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

