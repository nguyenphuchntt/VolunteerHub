import PropTypes from "prop-types";
import { Card, CardMedia, Box, Typography, Chip } from "@mui/material";
import { LocationOn, AccessTime } from "@mui/icons-material";

const ParticipatedEventCard = ({ event, role }) => {
  return (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        borderRadius: "16px",
        border: "1px solid",
        borderColor: "grey.200",
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        },
      }}
    >
      <CardMedia
        component="img"
        image={event.coverImage}
        alt={event.title}
        sx={{
          width: { xs: "100%", sm: 180 },
          height: { xs: 140, sm: "auto" },
          objectFit: "cover",
        }}
      />
      <Box sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
            {event.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {event.description}
          </Typography>
        </Box>

        <Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOn sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                {event.location}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <AccessTime sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                {event.time} - {event.endTime}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Role:
            </Typography>
            <Chip
              label={role}
              size="small"
              sx={{
                height: 22,
                fontSize: "11px",
                backgroundColor: "primary.light",
                color: "#fff",
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

ParticipatedEventCard.propTypes = {
  event: PropTypes.object.isRequired,
  role: PropTypes.string.isRequired,
};

export default ParticipatedEventCard;

