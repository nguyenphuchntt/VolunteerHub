import { Box, Skeleton, Grid } from "@mui/material";

/**
 * LoadingState component for displaying loading skeletons
 */
const LoadingState = ({ variant = "cards", count = 3 }) => {
  if (variant === "cards") {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: count }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              sx={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                border: "1px solid",
                borderColor: "grey.200",
                overflow: "hidden",
              }}
            >
              <Skeleton variant="rectangular" height={180} animation="wave" />
              <Box sx={{ p: 2 }}>
                <Skeleton variant="text" width="80%" height={28} animation="wave" />
                <Skeleton variant="text" width="100%" height={20} animation="wave" />
                <Skeleton variant="text" width="60%" height={20} animation="wave" />
                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  <Skeleton variant="circular" width={24} height={24} animation="wave" />
                  <Skeleton variant="circular" width={24} height={24} animation="wave" />
                  <Skeleton variant="circular" width={24} height={24} animation="wave" />
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (variant === "table") {
    return (
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "grey.200",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            gap: 2,
            borderBottom: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Skeleton variant="rectangular" width={200} height={36} animation="wave" sx={{ borderRadius: 1 }} />
        </Box>
        {/* Table Header */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            gap: 2,
            backgroundColor: "grey.50",
          }}
        >
          <Skeleton variant="text" width="20%" height={24} animation="wave" />
          <Skeleton variant="text" width="25%" height={24} animation="wave" />
          <Skeleton variant="text" width="20%" height={24} animation="wave" />
          <Skeleton variant="text" width="15%" height={24} animation="wave" />
          <Skeleton variant="text" width="15%" height={24} animation="wave" />
        </Box>
        {/* Table Rows */}
        {Array.from({ length: count }).map((_, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              display: "flex",
              gap: 2,
              alignItems: "center",
              borderBottom: index < count - 1 ? "1px solid" : "none",
              borderColor: "grey.200",
            }}
          >
            <Skeleton variant="text" width="20%" height={20} animation="wave" />
            <Skeleton variant="text" width="25%" height={20} animation="wave" />
            <Skeleton variant="text" width="20%" height={20} animation="wave" />
            <Skeleton variant="rounded" width={60} height={24} animation="wave" />
            <Skeleton variant="circular" width={28} height={28} animation="wave" />
          </Box>
        ))}
      </Box>
    );
  }

  if (variant === "stats") {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: count }).map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box
              sx={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                border: "1px solid",
                borderColor: "grey.200",
                p: 3,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Box>
                  <Skeleton variant="text" width={100} height={20} animation="wave" />
                  <Skeleton variant="text" width={60} height={40} animation="wave" />
                </Box>
                <Skeleton variant="circular" width={48} height={48} animation="wave" />
              </Box>
              <Skeleton variant="text" width={120} height={16} animation="wave" />
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }

  return null;
};

export default LoadingState;
