import React, { useState, useMemo } from "react";
import { EventFilter, EventCard } from "../components/EventFeed";
import MainHeader from "../components/SocialFeed/MainHeader";
import { mockEvents } from "../data/mockEvents";
import "../css/EventFeed.css";

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

  return (
    <div className="event-feed-page">
      <MainHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="event-feed-main">
        <div className="event-feed-container">
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
          <div className="events-results-header">
            <h2 className="results-title">
              {filteredEvents.length} Event
              {filteredEvents.length !== 1 ? "s" : ""} Found
            </h2>
            {(selectedCategory !== "all" ||
              selectedStatus !== "all" ||
              searchQuery) && (
              <button
                className="clear-filters-btn"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedStatus("all");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="events-grid">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="no-events">
              <div className="no-events-icon">🔍</div>
              <h3>No events found</h3>
              <p>
                Try adjusting your filters or search query to find more events.
              </p>
              <button
                className="reset-btn"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedStatus("all");
                  setSearchQuery("");
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EventFeed;
