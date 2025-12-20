import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import ConfirmJoinDialog from "../components/events/ConfirmJoinDialog";
import WritePost from "../components/SocialFeed/WritePost";
import PostCard from "../components/SocialFeed/PostCard";
import { ThreeColumnLayout, ConfirmDialog } from "../components/common";
import { eventService, myEventsService, postService, eventUserService, mediaService } from "../api";
import { useAuth } from "../context/AuthContext";
import { extractEventIdFromSlug, buildEventUrl } from "../utils/urlUtils";
import { getCategoryLabel } from "../constants/categories";

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
  Schedule,
  PlayCircle,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Groups,
  Category,
} from "@mui/icons-material";

const EventDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isManager } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  // Extract eventId from slug-id pattern (e.g., "chuong-trinh-123" -> "123")
  const eventId = useMemo(() => extractEventIdFromSlug(slug), [slug]);
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
      
      // Check if error is about being the last manager
      const errorMessage = err.response?.data?.message || "";
      let displayMessage = "Không thể hủy tham gia.";
      
      if (errorMessage.toLowerCase().includes("last manager")) {
        displayMessage = "Bạn là quản lý cuối cùng của sự kiện này. Vui lòng chỉ định quản lý khác trước khi rời đi.";
      } else if (errorMessage) {
        displayMessage = errorMessage;
      }
      
      setSnackbar({ 
        open: true, 
        message: displayMessage, 
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

  // Status Chip config for user participation
  const getParticipationConfig = (status) => {
    const configs = {
      APPROVED: { label: "Đã tham gia", bg: "#e8f5e9", color: "#2e7d32" },
      PENDING: { label: "Chờ duyệt", bg: "#fff3e0", color: "#f57c00" },
      REJECTED: { label: "Bị từ chối", bg: "#ffebee", color: "#c62828" },
      FINISHED: { label: "Đã hoàn thành", bg: "#f3e5f5", color: "#7b1fa2" },
    };
    return configs[status] || null;
  };

  // Event status config with Vietnamese translations
  const getEventStatusConfig = (status) => {
    const configs = {
      PENDING: { 
        label: "Chờ duyệt", 
        icon: <HourglassEmpty sx={{ fontSize: 16 }} />,
        bg: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
        bgLight: "rgba(255, 152, 0, 0.1)",
        color: "#f57c00",
        border: "rgba(255, 152, 0, 0.3)"
      },
      SCHEDULED: { 
        label: "Đã lên lịch", 
        icon: <Schedule sx={{ fontSize: 16 }} />,
        bg: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
        bgLight: "rgba(33, 150, 243, 0.1)",
        color: "#1976d2",
        border: "rgba(33, 150, 243, 0.3)"
      },
      STARTED: { 
        label: "Đang diễn ra", 
        icon: <PlayCircle sx={{ fontSize: 16 }} />,
        bg: "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
        bgLight: "rgba(76, 175, 80, 0.1)",
        color: "#388e3c",
        border: "rgba(76, 175, 80, 0.3)"
      },
      FINISHED: { 
        label: "Đã kết thúc", 
        icon: <CheckCircle sx={{ fontSize: 16 }} />,
        bg: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
        bgLight: "rgba(156, 39, 176, 0.1)",
        color: "#7b1fa2",
        border: "rgba(156, 39, 176, 0.3)"
      },
      CANCELLED: { 
        label: "Đã hủy", 
        icon: <Cancel sx={{ fontSize: 16 }} />,
        bg: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
        bgLight: "rgba(244, 67, 54, 0.1)",
        color: "#d32f2f",
        border: "rgba(244, 67, 54, 0.3)"
      },
    };
    return configs[status] || configs.SCHEDULED;
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
  const eventStatusConfig = getEventStatusConfig(statusDisplay);

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
          {/* Like Event Button - combined like Explore page */}
          <Box
            onClick={!likingEvent ? handleLikeEvent : undefined}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              ml: "auto",
              mr: 1,
              px: 1.5,
              py: 0.5,
              borderRadius: "9999px",
              cursor: likingEvent ? "default" : "pointer",
              backgroundColor: isEventLiked ? "rgba(239, 68, 68, 0.1)" : "transparent",
              border: "1px solid",
              borderColor: isEventLiked ? "rgba(239, 68, 68, 0.3)" : "grey.300",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: isEventLiked ? "rgba(239, 68, 68, 0.15)" : "grey.100",
              },
            }}
          >
            {isEventLiked ? (
              <Favorite sx={{ fontSize: 18, color: "#ef4444" }} />
            ) : (
              <FavoriteBorder sx={{ fontSize: 18, color: "text.secondary" }} />
            )}
            <Typography
              variant="caption"
              sx={{
                fontWeight: isEventLiked ? 600 : 400,
                color: isEventLiked ? "#ef4444" : "text.secondary",
              }}
            >
              {eventLikeCount}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Banner with gradient overlay */}
      <Box
        sx={{
          position: "relative",
          paddingTop: "min(50%, 280px)",
          backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          overflow: "hidden",
          maxHeight: 280,
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
        {/* Gradient overlay */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60%",
            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
          }}
        />
        {/* Status badge on banner */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            px: 1.5,
            py: 0.75,
            borderRadius: "20px",
            background: eventStatusConfig.bg,
            color: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          }}
        >
          {eventStatusConfig.icon}
          <Typography variant="caption" fontWeight={600}>
            {eventStatusConfig.label}
          </Typography>
        </Box>
      </Box>

      {/* Event Info Card */}
      <Box 
        sx={{ 
          p: 2.5, 
          mx: 2, 
          mt: -4,
          position: "relative",
          zIndex: 2,
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          border: "1px solid",
          borderColor: "grey.100",
        }}
      >
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1, lineHeight: 1.3 }}>
          {event.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
          {event.description || "Không có mô tả"}
        </Typography>
        
        {/* Event details with icons */}
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: 1.5, 
            p: 2,
            backgroundColor: "grey.50",
            borderRadius: "12px",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                backgroundColor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <CalendarMonth sx={{ fontSize: 18, color: "#fff" }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Thời gian
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatDate(event.startAt)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                đến {formatDate(event.endAt)}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                backgroundColor: "error.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <LocationOn sx={{ fontSize: 18, color: "#fff" }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Địa điểm
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {event.location || "Địa điểm chưa xác định"}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                backgroundColor: "success.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Groups sx={{ fontSize: 18, color: "#fff" }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Tình nguyện viên
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {attendeeCount} người tham gia
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Tags */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {event.category && (
            <Chip 
              icon={<Category sx={{ fontSize: 16 }} />}
              label={getCategoryLabel(event.category)} 
              size="small" 
              sx={{ 
                fontWeight: 600,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                "& .MuiChip-icon": { color: "#fff" },
              }} 
            />
          )}
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
          {isAuthenticated && participationStatus === 'APPROVED' && event?.status?.toUpperCase() !== 'FINISHED' && (
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
                disableInteraction={event?.status?.toUpperCase() === 'FINISHED' || participationStatus !== 'APPROVED'}
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
              <Grid size={6} key={participant.accountId || participant.id}>
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

