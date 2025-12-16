import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Avatar,
  AvatarGroup,
  Chip,
  Divider,
} from "@mui/material";
import { Search, TrendingUp, CalendarMonth, LocationOn } from "@mui/icons-material";
import { mockEvents } from "../../../data/mockEvents";

const RIGHT_WIDTH = 350;

/**
 * Right Sidebar with search and trending events
 */
const RightSidebar = ({ showSearch = true, searchQuery = "", onSearchChange }) => {
  const navigate = useNavigate();

  // Get trending events (most participants)
  const trendingEvents = [...mockEvents]
    .sort((a, b) => b.stats.going - a.stats.going)
    .slice(0, 4);

  // Get upcoming events
  const upcomingEvents = mockEvents
    .filter((e) => e.status === "upcoming")
    .slice(0, 3);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", { day: "numeric", month: "short" });
  };

  return (
    <Box
      sx={{
        width: RIGHT_WIDTH,
        height: "100vh",
        position: "sticky",
        top: 0,
        borderLeft: "1px solid",
        borderColor: "grey.200",
        px: 3,
        py: 2,
        overflowY: "auto",
        "&::-webkit-scrollbar": { width: 0 },
      }}
    >
      {/* Search Bar */}
      {showSearch && (
        <TextField
          placeholder="Tìm kiếm"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "grey.500" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "9999px",
              backgroundColor: "grey.100",
              "& fieldset": { borderColor: "transparent" },
              "&:hover fieldset": { borderColor: "grey.300" },
              "&.Mui-focused fieldset": { borderColor: "primary.main" },
            },
          }}
        />
      )}

      {/* Trending Events */}
      <Card
        elevation={0}
        sx={{
          borderRadius: "16px",
          backgroundColor: "grey.50",
          mb: 2,
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <TrendingUp sx={{ color: "primary.main" }} />
            <Typography variant="h6" fontWeight={700}>
              Sự kiện nổi bật
            </Typography>
          </Box>

          {trendingEvents.map((event, index) => (
            <Box key={event.id}>
              <Box
                onClick={() => navigate(`/events/${event.id}`)}
                sx={{
                  py: 1.5,
                  cursor: "pointer",
                  "&:hover": { opacity: 0.8 },
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary">
                      {event.category} · #{index + 1} Trending
                    </Typography>
                    <Typography variant="body2" fontWeight={700} noWrap>
                      {event.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {event.stats.going} người tham gia
                    </Typography>
                  </Box>
                  <Box
                    component="img"
                    src={event.coverImage}
                    alt={event.title}
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "12px",
                      objectFit: "cover",
                      ml: 1,
                    }}
                  />
                </Box>
              </Box>
              {index < trendingEvents.length - 1 && <Divider />}
            </Box>
          ))}

          <Typography
            variant="body2"
            color="primary.main"
            sx={{
              mt: 1,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={() => navigate("/events")}
          >
            Xem thêm
          </Typography>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card
        elevation={0}
        sx={{
          borderRadius: "16px",
          backgroundColor: "grey.50",
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <CalendarMonth sx={{ color: "primary.main" }} />
            <Typography variant="h6" fontWeight={700}>
              Sắp diễn ra
            </Typography>
          </Box>

          {upcomingEvents.map((event, index) => (
            <Box key={event.id}>
              <Box
                onClick={() => navigate(`/events/${event.id}`)}
                sx={{
                  py: 1.5,
                  cursor: "pointer",
                  "&:hover": { opacity: 0.8 },
                }}
              >
                <Typography variant="body2" fontWeight={600} noWrap>
                  {event.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                  <CalendarMonth sx={{ fontSize: 14, color: "text.secondary" }} />
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(event.date)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mx: 0.5 }}>
                    ·
                  </Typography>
                  <LocationOn sx={{ fontSize: 14, color: "text.secondary" }} />
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {event.location.split(",")[0]}
                  </Typography>
                </Box>
                <AvatarGroup
                  max={4}
                  sx={{
                    mt: 1,
                    "& .MuiAvatar-root": { width: 24, height: 24, fontSize: 11 },
                  }}
                >
                  {event.participants.slice(0, 4).map((p) => (
                    <Avatar key={p.user.id} src={p.user.avatar} alt={p.user.name} />
                  ))}
                </AvatarGroup>
              </Box>
              {index < upcomingEvents.length - 1 && <Divider />}
            </Box>
          ))}

          <Typography
            variant="body2"
            color="primary.main"
            sx={{
              mt: 1,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={() => navigate("/events")}
          >
            Xem tất cả sự kiện
          </Typography>
        </CardContent>
      </Card>

      {/* Footer Links */}
      <Box sx={{ mt: 3, px: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 2 }}>
          Điều khoản sử dụng · Chính sách bảo mật · Cookie · Trợ giúp
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
          © 2024 VolunteerHub
        </Typography>
      </Box>
    </Box>
  );
};

export default RightSidebar;
