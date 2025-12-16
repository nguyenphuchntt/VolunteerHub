import PropTypes from "prop-types";
import { eventCategories } from "../../data/mockEvents";
import {
  Box,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { FilterList } from "@mui/icons-material";

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

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mb: 3,
        borderRadius: "16px",
        backgroundColor: "#fff",
        border: "1px solid",
        borderColor: "grey.200",
      }}
    >
      {/* Categories */}
      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <FilterList sx={{ fontSize: 20, color: "text.secondary" }} />
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            Categories
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {eventCategories.map((category) => (
            <Chip
              key={category.id}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </Box>
              }
              onClick={() => onCategoryChange(category.id)}
              sx={{
                borderRadius: "20px",
                fontWeight: 500,
                fontSize: "13px",
                py: 0.5,
                backgroundColor:
                  selectedCategory === category.id ? "primary.main" : "grey.100",
                color:
                  selectedCategory === category.id ? "#fff" : "text.primary",
                "&:hover": {
                  backgroundColor:
                    selectedCategory === category.id
                      ? "primary.dark"
                      : "grey.200",
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Status & Sort Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {/* Status Filter */}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={selectedStatus}
            label="Status"
            onChange={(e) => onStatusChange(e.target.value)}
            sx={{
              borderRadius: "8px",
              backgroundColor: "#fff",
            }}
          >
            {statuses.map((status) => (
              <MenuItem key={status.id} value={status.id}>
                {status.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort Filter */}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="sort-filter-label">Sort by</InputLabel>
          <Select
            labelId="sort-filter-label"
            id="sort-filter"
            value={sortBy}
            label="Sort by"
            onChange={(e) => onSortChange(e.target.value)}
            sx={{
              borderRadius: "8px",
              backgroundColor: "#fff",
            }}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Paper>
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

