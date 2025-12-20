import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          py: 4,
        }}
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: 120,
            color: "error.main",
            mb: 2,
          }}
        />
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "4rem", md: "6rem" },
            fontWeight: 700,
            color: "text.primary",
            mb: 1,
          }}
        >
          404
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "text.secondary",
            mb: 2,
          }}
        >
          Trang không tồn tại
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            mb: 4,
            maxWidth: 400,
          }}
        >
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/")}
          >
            Về trang chủ
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;
