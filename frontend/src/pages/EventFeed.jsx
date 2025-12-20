import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { EventFilter, EventCard } from "../components/EventFeed";
import { ThreeColumnLayout } from "../components/common";
import { eventService, myEventsService } from "../api";
import { useAuth } from "../context/AuthContext";
import { Box, Typography, Button, CircularProgress, Alert } from "@mui/material";
import { SearchOff } from "@mui/icons-material";

const EventFeed = () => {
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [userEventStatuses, setUserEventStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("hot"); // "hot" or "newest"
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch user's registered events to show status
  const fetchUserStatuses = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const output = await myEventsService.getMyEvents(0, 50);
      const statusMap = {};
      if (output && output.content) {
        output.content.forEach(item => {
           if (item.eventId && item.status) {
            statusMap[item.eventId] = item.status;
          }
        });
      }
      setUserEventStatuses(statusMap);
    } catch (err) {
      console.error("Failed to fetch user event statuses:", err);
    }
  }, [isAuthenticated]);

  // Fetch events from API based on viewMode
  const fetchEvents = useCallback(async (pageIndex = 0) => {
    if (pageIndex === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);
    
    try {
      let response;
      
      // Build params with category filter
      const params = { 
        page: pageIndex, 
        size: 10 
      };
      
      if (selectedCategory !== "all") {
        params.category = selectedCategory;
      }
      if (debouncedSearchQuery.trim()) {
        params.title = debouncedSearchQuery;
      }
      
      if (viewMode === "hot") {
        // Fetch hot events sorted by likeCount
        params.sort = "likeCount,desc";
        response = await eventService.searchEvents(params);
      } else {
        // Fetch newest events sorted by startAt desc
        params.sort = "startAt,desc";
        response = await eventService.searchEvents(params);
      }
      
      // Frontend filter to exclude FINISHED and CANCELLED events
      const newEvents = (response.content || [])
        .filter(event => event.status !== 'FINISHED' && event.status !== 'CANCELLED');
      
      if (pageIndex === 0) {
        setEvents(newEvents);
      } else {
        setEvents(prev => [...prev, ...newEvents]);
      }
      
      const isEndOfPage = newEvents.length === 0 || response.last;
      setHasMore(!isEndOfPage);
      setPage(pageIndex);

    } catch (err) {
      console.error("Failed to fetch events:", err);
      if (pageIndex === 0) {
        setError("Không thể tải danh sách sự kiện. Vui lòng thử lại.");
        setEvents([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      if (pageIndex === 0) {
         fetchUserStatuses();
      }
    }
  }, [selectedCategory, viewMode, debouncedSearchQuery, fetchUserStatuses]);

  // Initial fetch and refetch when filters change (reset to page 0)
  useEffect(() => {
    setPage(0);
    fetchEvents(0);
  }, [selectedCategory, viewMode, debouncedSearchQuery]);
  
  // Infinite Scroll with Intersection Observer
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
           if (!loading && !loadingMore && hasMore) {
             fetchEvents(page + 1);
           }
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loading, loadingMore, hasMore, page, fetchEvents]);

  // Filter out PENDING and CANCELLED events for public view
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const status = (event.status || "").toUpperCase();
      return status !== "PENDING" && status !== "CANCELLED";
    });
  }, [events]);

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
  };

  return (
    <ThreeColumnLayout
      user={user}
      role="volunteer"
      showRightSidebar={true}
      showSearch={true}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ p: 2, position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 10 }}
        >
          Khám phá
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* Filter Section */}
        <EventFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Results Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          {(selectedCategory !== "all" || searchQuery) && (
            <Button
              variant="text"
              size="small"
              onClick={handleClearFilters}
              sx={{
                color: "primary.main",
                fontWeight: 500,
                textTransform: "none",
              }}
            >
              Xóa bộ lọc
            </Button>
          )}
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}

        {/* Events List - 1 per row */}
        {!loading && !error && filteredEvents.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filteredEvents.map((event) => (
              <EventCard 
                key={event.eventId} 
                event={{
                  ...event,
                  participationStatus: userEventStatuses[event.eventId]
                }} 
              />
            ))}
            {loadingMore && (
              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
            {/* Sentinel element for infinite scroll */}
            {hasMore && (
              <div ref={observerTarget} style={{ height: "10px", width: "100%" }} />
            )}
            {/* End of list message */}
            {!hasMore && filteredEvents.length > 0 && (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  — Đã hết sự kiện —
                </Typography>
              </Box>
            )}
          </Box>

        ) : !loading && !error && (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              backgroundColor: "grey.50",
              borderRadius: "16px",
            }}
          >
            <SearchOff sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Không tìm thấy sự kiện
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Hãy điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.
            </Typography>
            <Button
              variant="contained"
              onClick={handleClearFilters}
              sx={{ borderRadius: "9999px", textTransform: "none" }}
            >
              Xóa bộ lọc
            </Button>
          </Box>
        )}
      </Box>
    </ThreeColumnLayout>
  );
};


export default EventFeed;
