import { useState, useMemo } from "react";
import { EventFilter, EventCard } from "../components/EventFeed";
import { ThreeColumnLayout } from "../components/common";
import { mockEvents } from "../data/mockEvents";
import { mockUsers } from "../data/mockData";
import { Box, Typography, Button, Grid } from "@mui/material";
import { SearchOff } from "@mui/icons-material";

const EventFeed = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-asc");

  // For demo: use first mock user as authenticated user
  const user = mockUsers[0];

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let events = [...mockEvents];

    // Filter by category
    if (selectedCategory !== "all") {
      events = events.filter(
        (event) =>
          event.category.toLowerCase().replace(/\s+/g, "-") === selectedCategory
      );
    }

    // Filter by status
    if (selectedStatus !== "all") {
      events = events.filter((event) => event.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      events = events.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query) ||
          event.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Sort events
    events.sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.date) - new Date(b.date);
        case "date-desc":
          return new Date(b.date) - new Date(a.date);
        case "popular":
          return b.stats.shares - a.stats.shares;
        case "participants":
          return b.participants.length - a.participants.length;
        default:
          return 0;
      }
    });

    return events;
  }, [selectedCategory, selectedStatus, searchQuery, sortBy]);

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
          <Typography variant="body1" fontWeight={600}>
            {filteredEvents.length} sự kiện tìm thấy
          </Typography>
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

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <Grid container spacing={2}>
            {filteredEvents.map((event) => (
              <Grid item xs={12} sm={6} key={event.id}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        ) : (
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
