import { Box, Typography, Breadcrumbs, Link, Button } from "@mui/material";
import { NavigateNext, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

/**
 * PageHeader component for consistent page titles with optional breadcrumbs and actions
 */
const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  primaryAction,
  secondaryAction,
}) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 4 }}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 1 }}
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return isLast ? (
              <Typography key={crumb.label} variant="body2" color="text.primary">
                {crumb.label}
              </Typography>
            ) : (
              <Link
                key={crumb.label}
                underline="hover"
                color="text.secondary"
                href={crumb.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(crumb.path);
                }}
                sx={{ fontSize: 14 }}
              >
                {crumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}

      {/* Title and Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Actions */}
        {(primaryAction || secondaryAction) && (
          <Box sx={{ display: "flex", gap: 1.5 }}>
            {secondaryAction && (
              <Button
                variant="outlined"
                startIcon={secondaryAction.icon}
                onClick={secondaryAction.onClick}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button
                variant="contained"
                startIcon={primaryAction.icon || <Add />}
                onClick={primaryAction.onClick}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {primaryAction.label}
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;
