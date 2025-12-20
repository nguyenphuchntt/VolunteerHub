import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import {
  CalendarMonth,
  LocationOn,
  People,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import { eventService } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { buildEventUrl } from "../../utils/urlUtils";


const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Local state for like count (optimistic update)
  const [likeCount, setLikeCount] = useState(event.likeCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  // Handle both API format (eventId) and mock format (id)
  const eventId = event.eventId || event.id;

  // Fetch initial like status when component mounts
  useEffect(() => {
    if (!isAuthenticated || !eventId) return;
    
    const checkLikeStatus = async () => {
      try {
        const isLiked = await eventService.isEventLiked(eventId);
        setHasLiked(isLiked);
      } catch (err) {
        // Ignore error - user may not have liked this event
      }
    };
    
    checkLikeStatus();
  }, [eventId, isAuthenticated]);

  const handleCardClick = () => {
    navigate(buildEventUrl(event));
  };

  const handleLike = async (e) => {
    e.stopPropagation(); // Prevent card click
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const result = await eventService.likeEvent(eventId);
      if (result) {
        // Backend returns: { eventId, accountId, liked, likesCount }
        setHasLiked(result.liked);
        setLikeCount(result.likesCount);
      }
    } catch (err) {
      console.error("Failed to like event:", err);
    } finally {
      setIsLiking(false);
    }
  };


  // Backend EventStatus: PENDING, SCHEDULED, STARTED, FINISHED, CANCELLED
  const getStatusConfig = (status) => {
    const statusUpper = (status || "PENDING").toUpperCase();
    const configs = {
      PENDING: { label: "Chờ duyệt", bg: "#fff3e0", color: "#f57c00" },
      SCHEDULED: { label: "Đã lên lịch", bg: "#e3f2fd", color: "#1976d2" },
      STARTED: { label: "Đang diễn ra", bg: "#e8f5e9", color: "#388e3c" },
      FINISHED: { label: "Đã kết thúc", bg: "#f3e5f5", color: "#7b1fa2" },
      CANCELLED: { label: "Đã hủy", bg: "#ffebee", color: "#d32f2f" },
    };
    return configs[statusUpper] || configs.PENDING;
  };



  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("vi-VN", options);
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  // Handle both API format (startAt) and mock format (date)
  const eventDate = event.startAt || event.date;
  const eventTime = event.startAt ? formatTime(event.startAt) : event.time;
  
  // Handle attendee count - API returns attendeeCount, mock returns participants array
  const attendeeCount = event.attendeeCount || event.participants?.length || 0;
  
  // Check if image exists 
  const coverImage = event.coverImageUrl ;
  const hasImage = !!coverImage;
  
  // Generate gradient based on category for variety
  const getGradient = (category) => {
    const gradients = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    ];
    const hash = (category || "default").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };
  
  // Status display - use backend status
  const statusConfig = getStatusConfig(event.status);


  // Participation Status Config
  const getParticipationConfig = (status) => {
    const configs = {
      APPROVED: { label: "Đã tham gia", bg: "#e8f5e9", color: "#2e7d32" },
      PENDING: { label: "Chờ duyệt", bg: "#fff3e0", color: "#ef6c00" },
      REJECTED: { label: "Bị từ chối", bg: "#ffebee", color: "#c62828" },
      FINISHED: { label: "Đã hoàn thành", bg: "#f3e5f5", color: "#6a1b9a" },
    };
    return configs[status?.toUpperCase()] || null;
  };

  const participationConfig = getParticipationConfig(event.participationStatus);

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        cursor: "pointer",
        borderRadius: "16px",
        overflow: "hidden",
        transition: "all 0.3s ease",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        {hasImage ? (
          <Box sx={{ 
            position: "relative",
            paddingTop: "56.25%", /* 16:9 aspect ratio */
            backgroundColor: "#f0f0f0",
            overflow: "hidden",
          }}>
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
        ) : (
          <Box
            sx={{
              paddingTop: "56.25%", /* 16:9 aspect ratio */
              position: "relative",
              background: getGradient(event.category),
            }}
          >
            <Box sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}>
              <Typography variant="h4" sx={{ color: "white", opacity: 0.6 }}>
                🎯
              </Typography>
            </Box>
          </Box>
        )}

        {/* Overlay with badges */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            right: 12,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Chip
              label={statusConfig.label}
              size="small"
              sx={{
                backgroundColor: statusConfig.bg,
                color: statusConfig.color,
                fontWeight: 600,
                fontSize: "11px",
              }}
            />
            {participationConfig && (
              <Chip
                label={participationConfig.label}
                size="small"
                sx={{
                  backgroundColor: participationConfig.bg,
                  color: participationConfig.color,
                  fontWeight: 700,
                  fontSize: "11px",
                  border: `1px solid ${participationConfig.color}40`
                }}
              />
            )}
          </Box>

          {event.category && (
            <Chip
              label={event.category}
              size="small"
              sx={{
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "#fff",
                fontSize: "11px",
              }}
            />
          )}
        </Box>
      </Box>

      <CardContent sx={{ p: 2.5 }}>

        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "16px",
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {event.title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.5,
            minHeight: "42px",
          }}
        >
          {event.description || "Không có mô tả"}
        </Typography>

        {/* Event Details */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarMonth sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {formatDate(eventDate)} {eventTime && `• ${eventTime}`}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOn sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {event.location || "Địa điểm chưa xác định"}
            </Typography>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pt: 2,
            borderTop: "1px solid",
            borderColor: "grey.200",
          }}
        >
          {/* Participants */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <People sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {attendeeCount} người tham gia
            </Typography>
          </Box>

          {/* Likes - button with count */}
          <Box
            onClick={handleLike}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              cursor: "pointer",
              padding: "4px 10px",
              borderRadius: "20px",
              backgroundColor: hasLiked ? "rgba(244, 67, 54, 0.08)" : "transparent",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: hasLiked ? "rgba(244, 67, 54, 0.15)" : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            {hasLiked ? (
              <Favorite sx={{ fontSize: 18, color: "error.main" }} />
            ) : (
              <FavoriteBorder sx={{ fontSize: 18, color: "text.secondary" }} />
            )}
            <Typography
              variant="caption"
              sx={{
                color: hasLiked ? "error.main" : "text.secondary",
                fontWeight: hasLiked ? 600 : 400,
                minWidth: "16px",
              }}
            >
              {likeCount}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};


EventCard.propTypes = {
  event: PropTypes.shape({
    // API format
    eventId: PropTypes.number,
    startAt: PropTypes.string,
    endAt: PropTypes.string,
    attendeeCount: PropTypes.number,
    likeCount: PropTypes.number,
    accountId: PropTypes.string,
    // Common fields
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    coverImageUrl: PropTypes.string, // API format
    coverImage: PropTypes.string, // Legacy mock format
    location: PropTypes.string,
    status: PropTypes.string,
    category: PropTypes.string,
    // Mock format (legacy)
    id: PropTypes.number,
    date: PropTypes.string,
    time: PropTypes.string,
    participants: PropTypes.array,
    host: PropTypes.object,
  }).isRequired,
};

export default EventCard;


