import { Box, Typography, Link } from "@mui/material";

const FeedFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        textAlign: "center",
        py: 4,
        mt: 4,
        borderTop: "1px solid",
        borderColor: "grey.200",
        backgroundColor: "#fff",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 1 }}>
        <Link href="#about" underline="hover" color="text.secondary" fontSize={14}>
          About
        </Link>
        <Typography color="text.secondary" fontSize={14}>•</Typography>
        <Link href="#help" underline="hover" color="text.secondary" fontSize={14}>
          Help
        </Link>
        <Typography color="text.secondary" fontSize={14}>•</Typography>
        <Link href="#privacy" underline="hover" color="text.secondary" fontSize={14}>
          Privacy & Terms
        </Link>
      </Box>
      <Typography variant="caption" color="text.secondary">
        © {currentYear} VolunteerHub. All rights reserved.
      </Typography>
    </Box>
  );
};

export default FeedFooter;

