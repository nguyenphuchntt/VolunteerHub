import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  Chip,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import {
  CalendarMonth,
  LocationOn,
  People,
} from "@mui/icons-material";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/events/${event.id}`);
  };

  const getStatusColor = (status) => {
    const colors = {
      upcoming: { bg: "#e3f2fd", color: "#1976d2" },
      ongoing: { bg: "#e8f5e9", color: "#388e3c" },
      completed: { bg: "#f3e5f5", color: "#7b1fa2" },
    };
    return colors[status] || colors.upcoming;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const getParticipantText = () => {
    const count = event.participants.length;
    return `${count} joined`;
  };

  const statusColor = getStatusColor(event.status);

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
      {/* Image Section */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="180"
          image={event.coverImage}
          alt={event.title}
          sx={{ objectFit: "cover" }}
        />
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
          <Chip
            label={event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            size="small"
            sx={{
              backgroundColor: statusColor.bg,
              color: statusColor.color,
              fontWeight: 600,
              fontSize: "11px",
            }}
          />
          <Chip
            label={event.category}
            size="small"
            sx={{
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "#fff",
              fontSize: "11px",
            }}
          />
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
          {event.description}
        </Typography>

        {/* Event Details */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarMonth sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {formatDate(event.date)} • {event.time}
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
              {event.location}
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
            <AvatarGroup
              max={3}
              sx={{
                "& .MuiAvatar-root": {
                  width: 24,
                  height: 24,
                  fontSize: "10px",
                  border: "2px solid white",
                },
              }}
            >
              {event.participants.slice(0, 3).map((participant) => (
                <Avatar
                  key={participant.user.id}
                  src={participant.user.avatar}
                  alt={participant.user.name}
                />
              ))}
            </AvatarGroup>
            <Typography variant="caption" color="text.secondary">
              {getParticipantText()}
            </Typography>
          </Box>

          {/* Host */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              src={event.host.avatar}
              alt={event.host.name}
              sx={{ width: 24, height: 24 }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {event.host.name}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    coverImage: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["upcoming", "ongoing", "completed"]).isRequired,
    category: PropTypes.string.isRequired,
    host: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
      type: PropTypes.string,
    }).isRequired,
    participants: PropTypes.arrayOf(
      PropTypes.shape({
        user: PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          avatar: PropTypes.string.isRequired,
        }).isRequired,
        role: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default EventCard;

