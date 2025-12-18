import { Card, CardContent, Box, Typography, Avatar } from "@mui/material";
import { TrendingUp, TrendingDown, Remove } from "@mui/icons-material";

/**
 * StatsCard component for displaying statistics on dashboards
 */
const StatsCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = "primary",
  sx,
  ...other
}) => {
  const colorMap = {
    primary: { main: "#88b28b", light: "rgba(136, 178, 139, 0.1)" },
    secondary: { main: "#036b30", light: "rgba(3, 107, 48, 0.1)" },
    info: { main: "#3b82f6", light: "rgba(59, 130, 246, 0.1)" },
    warning: { main: "#f59e0b", light: "rgba(245, 158, 11, 0.1)" },
    error: { main: "#ef4444", light: "rgba(239, 68, 68, 0.1)" },
    success: { main: "#22c55e", light: "rgba(34, 197, 94, 0.1)" },
  };

  const colors = colorMap[color] || colorMap.primary;

  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp sx={{ fontSize: 16, color: "success.main" }} />;
    if (trend === "down") return <TrendingDown sx={{ fontSize: 16, color: "error.main" }} />;
    return <Remove sx={{ fontSize: 16, color: "grey.500" }} />;
  };

  const getTrendColor = () => {
    if (trend === "up") return "success.main";
    if (trend === "down") return "error.main";
    return "grey.500";
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid",
        borderColor: "grey.200",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          transform: "translateY(-2px)",
        },
        ...sx,
      }}
      {...other}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={500}
              sx={{ mb: 0.5 }}
            >
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              {value}
            </Typography>
          </Box>
          {icon && (
            <Avatar
              sx={{
                width: 48,
                height: 48,
                backgroundColor: colors.light,
                color: colors.main,
              }}
            >
              {icon}
            </Avatar>
          )}
        </Box>

        {/* Subtitle and Trend */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {trend && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {getTrendIcon()}
              <Typography variant="caption" color={getTrendColor()} fontWeight={600}>
                {trendValue}
              </Typography>
            </Box>
          )}
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
