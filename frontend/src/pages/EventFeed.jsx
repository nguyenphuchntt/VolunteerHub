import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { EventFilter, EventCard } from "../components/EventFeed";
import { ThreeColumnLayout } from "../components/common";
import { eventService, myEventsService } from "../api";
import { useAuth } from "../context/AuthContext";
import { Box, Typography, Button, Grid, CircularProgress, Alert } from "@mui/material";
import { SearchOff } from "@mui/icons-material";

const EventFeed = () => {
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [userEventStatuses, setUserEventStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-asc");
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
      // Fetch user's events (assuming page size 50 covers most active ones)
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

  // Fetch events from API
  const fetchEvents = useCallback(async (pageIndex = 0) => {
    if (pageIndex === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);
    try {
      const params = { page: pageIndex, size: 10 }; // Default size 10
      if (selectedCategory !== "all") {
        params.category = selectedCategory;
      }
      if (selectedStatus !== "all") {
        params.status = selectedStatus;
      }
      if (debouncedSearchQuery.trim()) {
        params.title = debouncedSearchQuery;
      }
      
      const response = await eventService.searchEvents(params);
      const newEvents = response.content || [];
      
      if (pageIndex === 0) {
        setEvents(newEvents);
      } else {
        setEvents(prev => [...prev, ...newEvents]);
      }
      
      setHasMore(!response.last);
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
  }, [selectedCategory, selectedStatus, debouncedSearchQuery, fetchUserStatuses]);

  // Initial fetch and refetch when filters change (reset to page 0)
  useEffect(() => {
    setPage(0);
    fetchEvents(0);
  }, [selectedCategory, selectedStatus, debouncedSearchQuery]); // Removing fetchEvents from dep to avoid loop if not memoized correctly, but it is useCallback with these deps.
  // Actually, fetchEvents depends on these deps. So it changes when they change.
  // We want to run ONLY when these change.
  // Correct usage: useEffect(() => { fetchEvents(0); }, [fetchEvents]); -> fetchEvents updates when filters update.
  
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

  // Sort and filter events - hide PENDING and CANCELLED from public view
  const filteredEvents = useMemo(() => {
    // Filter out PENDING and CANCELLED events for public explore page
    // Note: server side filtering is preferred but we already fetched pages. 
    // If a page has only PENDING events, user might see empty space until scroll.
    // For now we assume server returns mostly public events or we accept this.
    let publicEvents = events.filter(event => {
      const status = (event.status || "").toUpperCase();
      return status !== "PENDING" && status !== "CANCELLED";
    });
    
    // ... sorting logic ...


    // Sort events locally
    publicEvents.sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.startAt) - new Date(b.startAt);
        case "date-desc":
          return new Date(b.startAt) - new Date(a.startAt);
        case "popular":
          return (b.likeCount || 0) - (a.likeCount || 0);
        case "participants":
          return (b.attendeeCount || 0) - (a.attendeeCount || 0);
        default:
          return 0;
      }
    });

    return publicEvents;
  }, [events, sortBy]);



  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSelectedStatus("all");
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
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
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
          {(selectedCategory !== "all" ||
            selectedStatus !== "all" ||
            searchQuery) && (
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
            <div ref={observerTarget} style={{ height: "10px", width: "100%" }} />
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
