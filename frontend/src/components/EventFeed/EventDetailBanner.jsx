import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  CalendarMonth,
  AccessTime,
  LocationOn,
  People,
  Share,
  ArrowBack,
} from "@mui/icons-material";

const EventDetailBanner = ({ event }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const getStatusColor = (status) => {
    const colors = {
      upcoming: { bg: "#e3f2fd", color: "#1976d2" },
      ongoing: { bg: "#e8f5e9", color: "#388e3c" },
      completed: { bg: "#f3e5f5", color: "#7b1fa2" },
    };
    return colors[status] || colors.upcoming;
  };

  const statusColor = getStatusColor(event.status);

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: 400,
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${event.coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3))",
          },
        }}
      />

      {/* Banner Content */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/events")}
          sx={{
            color: "#fff",
            mb: 3,
            "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
          }}
        >
          Back to Events
        </Button>

        {/* Event Info */}
        <Box>
          {/* Badges */}
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Chip
              label={event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              size="small"
              sx={{
                backgroundColor: statusColor.bg,
                color: statusColor.color,
                fontWeight: 600,
              }}
            />
            <Chip
              label={event.category}
              size="small"
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "#fff",
              }}
            />
          </Box>

          {/* Title & Description */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#fff",
              mb: 2,
              fontSize: { xs: "1.75rem", md: "2.5rem" },
            }}
          >
            {event.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255,255,255,0.85)",
              maxWidth: 700,
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            {event.fullDescription || event.description}
          </Typography>

          {/* Meta Info */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#fff" }}>
              <CalendarMonth sx={{ fontSize: 20 }} />
              <Typography variant="body2">{formatDate(event.date)}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#fff" }}>
              <AccessTime sx={{ fontSize: 20 }} />
              <Typography variant="body2">{event.time}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#fff" }}>
              <LocationOn sx={{ fontSize: 20 }} />
              <Typography variant="body2">{event.location}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#fff" }}>
              <People sx={{ fontSize: 20 }} />
              <Typography variant="body2">
                {event.participants.length || event.participants.count} participants
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<People />}
              sx={{
                borderRadius: "24px",
                px: 3,
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Join Event
            </Button>
            <Button
              variant="outlined"
              startIcon={<Share />}
              sx={{
                borderRadius: "24px",
                px: 3,
                fontWeight: 600,
                textTransform: "none",
                color: "#fff",
                borderColor: "rgba(255,255,255,0.5)",
                "&:hover": {
                  borderColor: "#fff",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Share
            </Button>
          </Box>

          {/* Host Info */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar src={event.host.avatar} alt={event.host.name} sx={{ width: 40, height: 40 }} />
            <Box>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                Hosted by
              </Typography>
              <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600 }}>
                {event.host.name}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

EventDetailBanner.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    fullDescription: PropTypes.string,
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
    }).isRequired,
    participants: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.shape({
        count: PropTypes.number.isRequired,
        limit: PropTypes.number,
      }),
    ]).isRequired,
  }).isRequired,
};

export default EventDetailBanner;

