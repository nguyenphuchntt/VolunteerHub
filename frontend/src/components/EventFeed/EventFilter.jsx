import PropTypes from "prop-types";
import { CATEGORY_LIST } from "../../constants/categories";
import {
  Box,
  Paper,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { FilterList, Whatshot, Schedule } from "@mui/icons-material";

const EventFilter = ({
  selectedCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange,
}) => {
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
      {/* View Mode Toggle */}
      <Box sx={{ mb: 2.5 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, newValue) => {
            if (newValue !== null) {
              onViewModeChange(newValue);
            }
          }}
          aria-label="view mode"
          sx={{
            "& .MuiToggleButton-root": {
              borderRadius: "20px",
              px: 2.5,
              py: 0.75,
              border: "none",
              fontWeight: 600,
              fontSize: "14px",
              textTransform: "none",
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              },
              "&:not(.Mui-selected)": {
                backgroundColor: "grey.100",
                color: "text.primary",
                "&:hover": {
                  backgroundColor: "grey.200",
                },
              },
            },
          }}
        >
          <ToggleButton value="hot" aria-label="hot events">
            <Whatshot sx={{ mr: 0.5, fontSize: 18 }} />
            Nổi bật
          </ToggleButton>
          <ToggleButton value="newest" aria-label="newest events">
            <Schedule sx={{ mr: 0.5, fontSize: 18 }} />
            Mới nhất
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Categories */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <FilterList sx={{ fontSize: 20, color: "text.secondary" }} />
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            Danh mục
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {CATEGORY_LIST.map((category) => (
            <Chip
              key={category.key}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                </Box>
              }
              onClick={() => onCategoryChange(category.key)}
              sx={{
                borderRadius: "20px",
                fontWeight: 500,
                fontSize: "13px",
                py: 0.5,
                backgroundColor:
                  selectedCategory === category.key ? "primary.main" : "grey.100",
                color:
                  selectedCategory === category.key ? "#fff" : "text.primary",
                "&:hover": {
                  backgroundColor:
                    selectedCategory === category.key
                      ? "primary.dark"
                      : "grey.200",
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

EventFilter.propTypes = {
  selectedCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  viewMode: PropTypes.oneOf(["hot", "newest"]).isRequired,
  onViewModeChange: PropTypes.func.isRequired,
};

export default EventFilter;
