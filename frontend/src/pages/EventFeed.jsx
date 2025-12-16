import { useState, useMemo } from "react";
import { EventFilter, EventCard } from "../components/EventFeed";
import MainHeader from "../components/SocialFeed/MainHeader";
import { mockEvents } from "../data/mockEvents";
import { Box, Container, Typography, Button, Grid } from "@mui/material";
import { SearchOff } from "@mui/icons-material";

const EventFeed = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-asc");

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
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
      <MainHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
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
          <Typography variant="h5" fontWeight={600}>
            {filteredEvents.length} Event
            {filteredEvents.length !== 1 ? "s" : ""} Found
          </Typography>
          {(selectedCategory !== "all" ||
            selectedStatus !== "all" ||
            searchQuery) && (
            <Button
              variant="text"
              onClick={handleClearFilters}
              sx={{
                color: "primary.main",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "primary.light",
                  color: "#fff",
                },
              }}
            >
              Clear Filters
            </Button>
          )}
        </Box>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <Grid container spacing={3}>
            {filteredEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              backgroundColor: "#fff",
              borderRadius: "16px",
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <SearchOff sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
            <Typography variant="h6" fontWeight={600} gutterBottom>
              No events found
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your filters or search query to find more events.
            </Typography>
            <Button
              variant="contained"
              onClick={handleClearFilters}
              sx={{
                backgroundColor: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              Reset Filters
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default EventFeed;

