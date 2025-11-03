import React from "react";
import PropTypes from "prop-types";
import { eventCategories } from "../../data/mockEvents";
import "../../css/EventFilter.css";

const EventFilter = ({
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  const statuses = [
    { id: "all", name: "All Status" },
    { id: "upcoming", name: "Upcoming" },
    { id: "ongoing", name: "Ongoing" },
    { id: "completed", name: "Completed" },
  ];

  const sortOptions = [
    { id: "date-asc", name: "Date (Earliest)" },
    { id: "date-desc", name: "Date (Latest)" },
    { id: "popular", name: "Most Popular" },
    { id: "participants", name: "Most Joined" },
  ];

  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 19L14.65 14.65"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const FilterIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M18 3H2L8.5 10.7V16L11.5 18V10.7L18 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="event-filter">
      {/* Search Bar */}
      {/* <div className="event-filter-search">
        <div className="search-input-wrapper">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
      </div> */}

      {/* Filter Bar */}
      <div className="event-filter-bar">
        {/* Categories */}
        <div className="filter-section">
          <div className="filter-label">
            <FilterIcon />
            <span>Categories</span>
          </div>
          <div className="filter-chips">
            {eventCategories.map((category) => (
              <button
                key={category.id}
                className={`filter-chip ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                onClick={() => onCategoryChange(category.id)}
              >
                <span className="chip-icon">{category.icon}</span>
                <span className="chip-text">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Status & Sort Filters */}
        <div className="filter-controls">
          {/* Status Filter */}
          <div className="filter-dropdown">
            <label htmlFor="status-filter">Status:</label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="filter-select"
            >
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="filter-dropdown">
            <label htmlFor="sort-filter">Sort by:</label>
            <select
              id="sort-filter"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="filter-select"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

EventFilter.propTypes = {
  selectedCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  selectedStatus: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
};

export default EventFilter;
