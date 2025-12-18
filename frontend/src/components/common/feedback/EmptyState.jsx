import { Box, Typography, Button } from "@mui/material";
import { SearchOff, Inbox, Add } from "@mui/icons-material";

/**
 * EmptyState component for displaying when there's no data
 */
const EmptyState = ({
  icon,
  title = "Không có dữ liệu",
  description,
  actionLabel,
  onAction,
  variant = "default",
}) => {
  const getIcon = () => {
    if (icon) return icon;
    switch (variant) {
      case "search":
        return <SearchOff sx={{ fontSize: 64, color: "grey.400" }} />;
      case "empty":
        return <Inbox sx={{ fontSize: 64, color: "grey.400" }} />;
      default:
        return <Inbox sx={{ fontSize: 64, color: "grey.400" }} />;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        py: 8,
        px: 4,
        backgroundColor: "#fff",
        borderRadius: "16px",
        border: "1px solid",
        borderColor: "grey.200",
      }}
    >
      {getIcon()}
      <Typography
        variant="h6"
        fontWeight={600}
        color="text.primary"
        sx={{ mt: 2, mb: 1 }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 400, mb: actionLabel ? 3 : 0 }}
        >
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAction}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
