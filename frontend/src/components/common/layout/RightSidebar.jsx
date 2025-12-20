import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Avatar,
  Divider,
  Skeleton,
} from "@mui/material";
import { Search, TrendingUp, CalendarMonth, LocationOn } from "@mui/icons-material";
import { eventService } from "../../../api";
import { buildEventUrl } from "../../../utils/urlUtils";
import { getCategoryLabel } from "../../../constants/categories";

const RIGHT_WIDTH = 350;

/**
 * Right Sidebar with search and trending events
 */
const RightSidebar = ({ showSearch = true, searchQuery = "", onSearchChange }) => {
  const navigate = useNavigate();
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [hotResponse, upcomingResponse] = await Promise.all([
          eventService.getHotEvents(0, 8), // Fetch more to account for filtering
          eventService.getUpcomingEvents(0, 3)
        ]);
        // Filter out FINISHED and CANCELLED events from hot events
        const activeHotEvents = (hotResponse.content || [])
          .filter(event => event.status !== 'FINISHED' && event.status !== 'CANCELLED')
          .slice(0, 4);
        setTrendingEvents(activeHotEvents);
        setUpcomingEvents(upcomingResponse.content || []);
      } catch (err) {
        console.error("Failed to fetch sidebar events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", { day: "numeric", month: "short" });
  };

  // Loading skeleton for events
  const EventSkeleton = () => (
    <Box sx={{ py: 1.5 }}>
      <Skeleton variant="text" width="40%" height={16} />
      <Skeleton variant="text" width="90%" height={20} />
      <Skeleton variant="text" width="30%" height={14} />
    </Box>
  );

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

          {loading ? (
            <>
              <EventSkeleton />
              <Divider />
              <EventSkeleton />
              <Divider />
              <EventSkeleton />
            </>
          ) : trendingEvents.length > 0 ? (
            trendingEvents.map((event, index) => (
              <Box key={event.eventId}>
                <Box
                  onClick={() => navigate(buildEventUrl(event))}
                  sx={{
                    py: 1.5,
                    cursor: "pointer",
                    "&:hover": { opacity: 0.8 },
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary">
                        {getCategoryLabel(event.category) || "Sự kiện"} · #{index + 1} Trending
                      </Typography>
                      <Typography variant="body2" fontWeight={700} noWrap>
                        {event.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {event.attendeeCount || 0} người tham gia
                      </Typography>
                    </Box>
                    {event.coverImageUrl && (
                      <Box
                        component="img"
                        src={event.coverImageUrl}
                        alt={event.title}
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: "12px",
                          objectFit: "cover",
                          ml: 1,
                        }}
                      />
                    )}
                  </Box>
                </Box>
                {index < trendingEvents.length - 1 && <Divider />}
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              Chưa có sự kiện nổi bật
            </Typography>
          )}
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

          {loading ? (
            <>
              <EventSkeleton />
              <Divider />
              <EventSkeleton />
            </>
          ) : upcomingEvents.length > 0 ? (
            upcomingEvents.map((event, index) => (
              <Box key={event.eventId}>
                <Box
                  onClick={() => navigate(buildEventUrl(event))}
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
                      {formatDate(event.startAt)}
                    </Typography>
                    {event.location && (
                      <>
                        <Typography variant="caption" color="text.secondary" sx={{ mx: 0.5 }}>
                          ·
                        </Typography>
                        <LocationOn sx={{ fontSize: 14, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {event.location.split(",")[0]}
                        </Typography>
                      </>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                    <Avatar 
                      sx={{ width: 20, height: 20, fontSize: 10, bgcolor: "primary.main" }}
                    >
                      {event.attendeeCount || 0}
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">
                      người đã đăng ký
                    </Typography>
                  </Box>
                </Box>
                {index < upcomingEvents.length - 1 && <Divider />}
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              Chưa có sự kiện sắp tới
            </Typography>
          )}
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
