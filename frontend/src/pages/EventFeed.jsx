import { useState, useMemo, useEffect, useCallback } from "react";
import { EventFilter, EventCard } from "../components/EventFeed";
import { ThreeColumnLayout } from "../components/common";
import { eventService } from "../api";
import { useAuth } from "../context/AuthContext";
import { Box, Typography, Button, Grid, CircularProgress, Alert } from "@mui/material";
import { SearchOff } from "@mui/icons-material";

const EventFeed = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-asc");

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedCategory !== "all") {
        params.category = selectedCategory;
      }
      if (selectedStatus !== "all") {
        params.status = selectedStatus;
      }
      if (searchQuery.trim()) {
        params.title = searchQuery;
      }
      
      const response = await eventService.searchEvents(params);
      setEvents(response.content || []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Không thể tải danh sách sự kiện. Vui lòng thử lại.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedStatus, searchQuery]);

  // Initial fetch and refetch when filters change
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Sort and filter events - hide PENDING and CANCELLED from public view
  const filteredEvents = useMemo(() => {
    // Filter out PENDING and CANCELLED events for public explore page
    let publicEvents = events.filter(event => {
      const status = (event.status || "").toUpperCase();
      return status !== "PENDING" && status !== "CANCELLED";
    });

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
              <EventCard key={event.eventId} event={event} />
            ))}
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
