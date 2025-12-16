import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import { KeyboardArrowDown, Google } from "@mui/icons-material";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement signup logic
    console.log("Sign up data:", formData);
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google Sign In
    console.log("Google Sign In");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: { xs: 2, md: 5 },
        background: "linear-gradient(199deg, rgba(139, 178, 139, 1) 0%, rgba(136, 178, 139, 1) 100%)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          maxWidth: 1152,
          width: "100%",
          minHeight: { xs: "auto", md: 700 },
          borderRadius: "30px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Left Section */}
        <Box
          sx={{
            flex: { xs: "0 0 auto", md: 1 },
            maxWidth: { xs: "100%", md: 412 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: { xs: 4, md: "0 60px" },
            background: "linear-gradient(199deg, rgba(139, 178, 139, 0.95) 0%, rgba(136, 178, 139, 0.95) 100%)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 600,
              fontSize: { xs: 28, md: 34 },
              lineHeight: 1.176,
              color: "#fdf6ec",
              mb: 2.5,
            }}
          >
            Kết Nối & Lan Tỏa Yêu Thương
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 400,
              fontSize: 16,
              lineHeight: 1.563,
              color: "#fdf6ec",
            }}
          >
            Mỗi hành động nhỏ – góp phần tạo nên thay đổi lớn.
          </Typography>
        </Box>

        {/* Right Section */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            padding: { xs: "40px 30px", md: "22px 60px" },
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Language Selector */}
          <Box
            sx={{
              position: "absolute",
              top: 22,
              right: { xs: 30, md: 60 },
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <Typography sx={{ fontSize: 12, color: "#a1a1a1" }}>
              English (UK)
            </Typography>
            <KeyboardArrowDown sx={{ fontSize: 16, color: "#989898" }} />
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => setAnchorEl(null)}>English (UK)</MenuItem>
            <MenuItem onClick={() => setAnchorEl(null)}>Tiếng Việt</MenuItem>
          </Menu>

          {/* Form Container */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              maxWidth: 464,
              margin: "auto",
              width: "100%",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                fontSize: 28,
                color: "#525252",
                mb: 5,
              }}
            >
              Create Account
            </Typography>

            {/* Google Button */}
            <Button
              variant="outlined"
              onClick={handleGoogleSignIn}
              startIcon={<Google />}
              sx={{
                width: 220,
                height: 40,
                borderColor: "#e8e8e8",
                color: "#a1a1a1",
                fontWeight: 600,
                fontSize: 12,
                textTransform: "none",
                margin: "0 auto",
                "&:hover": {
                  backgroundColor: "#f8f8f8",
                  borderColor: "#d0d0d0",
                },
              }}
            >
              Continue with Google
            </Button>

            <Divider sx={{ my: 3, color: "#a1a1a1", fontSize: 14 }}>
              - OR -
            </Divider>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                type="text"
                name="fullName"
                label="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                fullWidth
                variant="standard"
                sx={{
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "#e8e8e8",
                  },
                  "& .MuiInput-underline:hover:before": {
                    borderBottomColor: "#88b28b",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#a1a1a1",
                    fontWeight: 500,
                    fontSize: 14,
                  },
                }}
              />

              <TextField
                type="email"
                name="email"
                label="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
                variant="standard"
                sx={{
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "#e8e8e8",
                  },
                  "& .MuiInput-underline:hover:before": {
                    borderBottomColor: "#88b28b",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#a1a1a1",
                    fontWeight: 500,
                    fontSize: 14,
                  },
                }}
              />

              <TextField
                type="password"
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
                variant="standard"
                sx={{
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "#e8e8e8",
                  },
                  "& .MuiInput-underline:hover:before": {
                    borderBottomColor: "#88b28b",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#a1a1a1",
                    fontWeight: 500,
                    fontSize: 14,
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  height: 40,
                  backgroundColor: "#88b28b",
                  fontWeight: 600,
                  fontSize: 16,
                  textTransform: "none",
                  mt: 1,
                  "&:hover": {
                    backgroundColor: "#7aa07d",
                    boxShadow: "0 4px 8px rgba(136, 178, 139, 0.3)",
                  },
                }}
              >
                Create Account
              </Button>
            </Box>

            <Typography
              sx={{
                fontSize: 14,
                color: "#a1a1a1",
                mt: 3,
                textAlign: "center",
              }}
            >
              Already have an account?{" "}
              <Typography
                component={Link}
                to="/signin"
                sx={{
                  color: "#88b28b",
                  fontWeight: 500,
                  textDecoration: "none",
                  "&:hover": {
                    color: "#7aa07d",
                    textDecoration: "underline",
                  },
                }}
              >
                Login
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignUp;

