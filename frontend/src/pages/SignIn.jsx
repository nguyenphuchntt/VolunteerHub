import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  TextField,
  IconButton,
  Divider,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Close, Google, Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";
import { keyframes } from "@mui/system";
import { useAuth } from "../context/AuthContext";
import { userService } from "../api";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [signInStep, setSignInStep] = useState(1); // 1: username, 2: password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Redirect if already authenticated
  const from = location.state?.from?.pathname || "/dashboard";


  // Handle Sign In
  const handleSignInOpen = () => {
    setSignInOpen(true);
    setSignInStep(1);
    setSignInData({ username: "", password: "" });
    setError("");
  };

  const handleSignInClose = () => {
    setSignInOpen(false);
    setSignInStep(1);
    setError("");
  };

  const handleSignInNext = async () => {
    if (signInStep === 1 && signInData.username) {
      // Move to password step
      setSignInStep(2);
    } else if (signInStep === 2 && signInData.password) {
      // Actually sign in
      setLoading(true);
      setError("");
      try {
        const profile = await login(signInData.username, signInData.password);
        handleSignInClose();
        
        // Role-based routing
        if (profile?.role === "ADMIN") {
          navigate("/admin", { replace: true });
        } else if (profile?.role === "MANAGER") {
          navigate("/manage", { replace: true });
        } else {
          // Regular users go to saved location or /explore
          navigate(from !== "/dashboard" ? from : "/explore", { replace: true });
        }


      } catch (err) {
        console.error("Sign in error:", err);
        // Better error messages for common cases
        const status = err.response?.status;
        const serverMessage = err.response?.data?.message || err.response?.data;
        
        // Check for banned account
        if (serverMessage === "Your account has been banned" || 
            (typeof serverMessage === "string" && serverMessage.toLowerCase().includes("banned"))) {
          setError("Tài khoản của bạn đã bị cấm. Xin liên hệ với admin để được hỗ trợ.");
        } else if (serverMessage === "Invalid username or password" || status === 401) {
          setError("Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.");
        } else if (status === 403) {
          setError("Tài khoản của bạn đã bị cấm. Xin liên hệ với admin để được hỗ trợ.");
        } else if (status === 404) {
          setError("Tài khoản không tồn tại. Vui lòng kiểm tra lại tên đăng nhập.");
        } else if (typeof serverMessage === "string" && serverMessage) {
          setError(serverMessage);
        } else if (err.message) {
          setError(err.message);
        } else {
          setError("Đăng nhập thất bại. Vui lòng thử lại sau.");
        }

      } finally {
        setLoading(false);
      }
    }
  };



  // Handle Sign Up
  const handleSignUpOpen = () => {
    setSignUpOpen(true);
    setError("");
  };

  const handleSignUpClose = () => {
    setSignUpOpen(false);
    setSignUpData({ username: "", email: "", password: "", confirmPassword: "" });
    setError("");
  };

  const handleSignUpSubmit = async () => {
    // Frontend validation
    if (signUpData.username.length < 3) {
      setError("Tên người dùng phải có ít nhất 3 ký tự.");
      return;
    }
    if (signUpData.password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }
    if (signUpData.password !== signUpData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      await userService.register({
        username: signUpData.username,
        email: signUpData.email,
        password: signUpData.password,
        confirmPassword: signUpData.confirmPassword,
      });
      // After successful registration, log them in
      await login(signUpData.username, signUpData.password);
      handleSignUpClose();
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Sign up error:", err);
      // Handle different error response formats
      const errorData = err.response?.data;
      let errorMessage = "Đăng ký thất bại. Vui lòng thử lại.";
      if (typeof errorData === "string") {
        errorMessage = errorData;
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.errors) {
        // Handle validation errors array
        errorMessage = Object.values(errorData.errors).join(", ");
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleAuth = () => {
    console.log("Google Auth");
  };

  // Light green theme colors
  const colors = {
    primary: "#43a047",
    primaryLight: "#66bb6a",
    primaryDark: "#2e7d32",
    bg: "#f0f9f1",
    bgGradient: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 30%, #a5d6a7 60%, #81c784 100%)",
    text: "#1b5e20",
    textSecondary: "#558b2f",
    white: "#ffffff",
    border: "#a5d6a7",
  };

  // Common button styles
  const outlinedButtonSx = {
    width: "100%",
    maxWidth: 300,
    height: 48,
    borderRadius: "50px",
    border: `2px solid ${colors.primary}`,
    color: colors.primary,
    fontWeight: 600,
    fontSize: 15,
    textTransform: "none",
    backgroundColor: "transparent",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: colors.primary,
      color: colors.white,
      border: `2px solid ${colors.primary}`,
      transform: "translateY(-2px)",
      boxShadow: "0 8px 20px rgba(67, 160, 71, 0.3)",
    },
  };

  const filledButtonSx = {
    width: "100%",
    maxWidth: 300,
    height: 48,
    borderRadius: "50px",
    backgroundColor: colors.white,
    color: "#333",
    fontWeight: 600,
    fontSize: 15,
    textTransform: "none",
    border: "1px solid #e0e0e0",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#f5f5f5",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
  };

  const greenFilledButtonSx = {
    width: "100%",
    maxWidth: 300,
    height: 48,
    borderRadius: "50px",
    background: `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.primary} 100%)`,
    color: colors.white,
    fontWeight: 700,
    fontSize: 15,
    textTransform: "none",
    transition: "all 0.3s ease",
    boxShadow: "0 6px 20px rgba(67, 160, 71, 0.35)",
    "&:hover": {
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
      transform: "translateY(-2px)",
      boxShadow: "0 10px 28px rgba(67, 160, 71, 0.4)",
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: colors.bgGradient,
        fontFamily: "'Outfit', 'Segoe UI', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Back to Home Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/")}
        sx={{
          position: "absolute",
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 32 },
          zIndex: 10,
          color: colors.text,
          fontWeight: 600,
          fontSize: 14,
          textTransform: "none",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(8px)",
          borderRadius: "50px",
          padding: "8px 20px",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            transform: "translateX(-4px)",
          },
        }}
      >
        Về trang chủ
      </Button>
      {/* Floating decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: "8%",
          left: "8%",
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.4)",
          animation: `${float} 6s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "12%",
          right: "5%",
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.3)",
          animation: `${float} 8s ease-in-out infinite 1s`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "45%",
          left: "3%",
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.5)",
          animation: `${float} 5s ease-in-out infinite 0.5s`,
        }}
      />

      {/* Left Section - Logo */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Green glow behind logo */}
        <Box
          sx={{
            position: "absolute",
            width: 450,
            height: 450,
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <Box
          component="img"
          src="/images/logo.png"
          alt="VolunteerHub Logo"
          sx={{
            width: { md: 280, lg: 350 },
            height: "auto",
            position: "relative",
            zIndex: 1,
            filter: "drop-shadow(0 20px 40px rgba(67, 160, 71, 0.2))",
          }}
        />
      </Box>

      {/* Right Section - Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: 4, md: 6 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
          }}
        >
        {/* Logo for mobile */}
        <Box
          component="img"
          src="/images/logo.png"
          alt="VolunteerHub Logo"
          sx={{
            display: { xs: "block", md: "none" },
            width: 80,
            height: "auto",
            mb: 4,
          }}
        />

        <Typography
          variant="h1"
          sx={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: { xs: 40, md: 52, lg: 60 },
            color: colors.text,
            lineHeight: 1.1,
            mb: 3,
            letterSpacing: "-2px",
          }}
        >
          Đang diễn ra
        </Typography>

        <Typography
          variant="h2"
          sx={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600,
            fontSize: { xs: 22, md: 28 },
            color: colors.textSecondary,
            mb: 4,
          }}
        >
          Tham gia ngay hôm nay.
        </Typography>

        {/* Auth buttons */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Google />}
            onClick={handleGoogleAuth}
            sx={filledButtonSx}
          >
            Đăng ký với Google
          </Button>
        </Box>

        <Divider sx={{ maxWidth: 300, my: 2 }}>
          <Typography sx={{ color: colors.textSecondary, fontSize: 14, fontWeight: 500 }}>hoặc</Typography>
        </Divider>

        <Button
          variant="contained"
          onClick={handleSignUpOpen}
          sx={greenFilledButtonSx}
        >
          Tạo tài khoản
        </Button>

        <Typography
          sx={{
            fontSize: 12,
            color: colors.textSecondary,
            maxWidth: 300,
            mt: 1.5,
            lineHeight: 1.5,
          }}
        >
          Khi đăng ký, bạn đồng ý với{" "}
          <Typography component="span" sx={{ color: colors.primary, cursor: "pointer", fontWeight: 500 }}>
            Điều khoản Dịch vụ
          </Typography>{" "}
          và{" "}
          <Typography component="span" sx={{ color: colors.primary, cursor: "pointer", fontWeight: 500 }}>
            Chính sách Quyền riêng tư
          </Typography>
          .
        </Typography>

        <Box sx={{ mt: 6 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 18, color: colors.text, mb: 2.5 }}>
            Đã có tài khoản?
          </Typography>
          <Button
            variant="outlined"
            onClick={handleSignInOpen}
            sx={outlinedButtonSx}
          >
            Đăng nhập
          </Button>
        </Box>
        </Box>
      </Box>

      {/* Sign In Modal */}
      <Dialog
        open={signInOpen}
        onClose={handleSignInClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: colors.white,
            borderRadius: "24px",
            maxWidth: 500,
            minHeight: 420,
            animation: `${fadeIn} 0.25s ease-out`,
            boxShadow: "0 25px 60px rgba(67, 160, 71, 0.2)",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(46, 125, 50, 0.15)",
            backdropFilter: "blur(4px)",
          },
        }}
      >
        <Box sx={{ position: "relative", p: 2.5 }}>
          <IconButton
            onClick={handleSignInClose}
            sx={{
              position: "absolute",
              left: 12,
              top: 12,
              color: colors.textSecondary,
              "&:hover": { backgroundColor: "rgba(67, 160, 71, 0.1)" },
            }}
          >
            <Close />
          </IconButton>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              component="img"
              src="/images/logo.png"
              alt="VolunteerHub Logo"
              sx={{ width: 48, height: "auto" }}
            />
          </Box>
        </Box>

        <DialogContent sx={{ px: { xs: 4, md: 8 }, pb: 5, pt: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: 28,
              color: colors.text,
              mb: 4,
              textAlign: "center",
            }}
          >
            Đăng nhập vào VolunteerHub
          </Typography>

          {signInStep === 1 ? (
            <Box sx={{ animation: `${slideUp} 0.3s ease-out` }}>
              <Button
                variant="contained"
                startIcon={<Google />}
                onClick={handleGoogleAuth}
                sx={{ ...filledButtonSx, maxWidth: "100%", mb: 3 }}
              >
                Đăng nhập với Google
              </Button>

              <Divider sx={{ my: 2.5 }}>
                <Typography sx={{ color: colors.textSecondary, fontSize: 14 }}>hoặc</Typography>
              </Divider>

              <TextField
                fullWidth
                label="Email hoặc tên người dùng"
                value={signInData.username}
                onChange={(e) => setSignInData({ ...signInData, username: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && signInData.username) {
                    handleSignInNext();
                  }
                }}
                variant="outlined"
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f8fdf8",
                    "& fieldset": { borderColor: colors.border },
                    "&:hover fieldset": { borderColor: colors.primary },
                    "&.Mui-focused fieldset": { borderColor: colors.primary, borderWidth: 2 },
                  },
                  "& .MuiInputLabel-root": { color: colors.textSecondary },
                  "& .MuiInputLabel-root.Mui-focused": { color: colors.primary },
                }}
              />

              <Button
                variant="contained"
                fullWidth
                disabled={!signInData.username}
                onClick={handleSignInNext}
                sx={{
                  height: 48,
                  borderRadius: "50px",
                  background: signInData.username 
                    ? `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.primary} 100%)`
                    : "#e0e0e0",
                  color: signInData.username ? colors.white : "#9e9e9e",
                  fontWeight: 700,
                  fontSize: 15,
                  textTransform: "none",
                  mb: 2,
                  boxShadow: signInData.username ? "0 6px 20px rgba(67, 160, 71, 0.35)" : "none",
                  "&:hover": {
                    background: signInData.username 
                      ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`
                      : "#e0e0e0",
                  },
                  "&.Mui-disabled": {
                    background: "#e0e0e0",
                    color: "#9e9e9e",
                  },
                }}
              >
                Tiếp theo
              </Button>

              <Button
                variant="outlined"
                fullWidth
                sx={{
                  height: 48,
                  borderRadius: "50px",
                  border: `2px solid ${colors.border}`,
                  color: colors.textSecondary,
                  fontWeight: 600,
                  fontSize: 15,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "rgba(67, 160, 71, 0.08)",
                    border: `2px solid ${colors.primary}`,
                    color: colors.primary,
                  },
                }}
              >
                Quên mật khẩu?
              </Button>
            </Box>
          ) : (
            <Box sx={{ animation: `${slideUp} 0.3s ease-out` }}>
              {/* Show username as readonly */}
              <TextField
                fullWidth
                label="Email hoặc tên người dùng"
                value={signInData.username}
                variant="outlined"
                disabled
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f5f5f5",
                    "& fieldset": { borderColor: "#e0e0e0" },
                  },
                  "& .MuiInputLabel-root": { color: "#9e9e9e" },
                }}
              />

              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                label="Mật khẩu"
                value={signInData.password}
                onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && signInData.password && !loading) {
                    handleSignInNext();
                  }
                }}
                variant="outlined"
                autoFocus
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        sx={{ color: colors.textSecondary }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f8fdf8",
                    "& fieldset": { borderColor: colors.border },
                    "&:hover fieldset": { borderColor: colors.primary },
                    "&.Mui-focused fieldset": { borderColor: colors.primary, borderWidth: 2 },
                  },
                  "& .MuiInputLabel-root": { color: colors.textSecondary },
                  "& .MuiInputLabel-root.Mui-focused": { color: colors.primary },
                }}
              />

              {/* Error display */}
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2, 
                    borderRadius: "12px",
                    "& .MuiAlert-message": { fontWeight: 500 }
                  }}
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}

              <Button

                variant="contained"
                fullWidth
                disabled={!signInData.password || loading}
                onClick={handleSignInNext}

                sx={{
                  height: 48,
                  borderRadius: "50px",
                  background: signInData.password 
                    ? `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.primary} 100%)`
                    : "#e0e0e0",
                  color: signInData.password ? colors.white : "#9e9e9e",
                  fontWeight: 700,
                  fontSize: 15,
                  textTransform: "none",
                  mb: 2,
                  boxShadow: signInData.password ? "0 6px 20px rgba(67, 160, 71, 0.35)" : "none",
                  "&:hover": {
                    background: signInData.password 
                      ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`
                      : "#e0e0e0",
                  },
                  "&.Mui-disabled": {
                    background: "#e0e0e0",
                    color: "#9e9e9e",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Đăng nhập"}
              </Button>
              <Typography
                sx={{
                  textAlign: "center",
                  color: colors.textSecondary,
                  fontSize: 14,
                }}
              >
                Quên mật khẩu?{" "}
                <Typography
                  component="span"
                  sx={{ color: colors.primary, cursor: "pointer", fontWeight: 500, "&:hover": { textDecoration: "underline" } }}
                >
                  Đặt lại
                </Typography>
              </Typography>
            </Box>
          )}

          <Typography
            sx={{
              textAlign: "center",
              color: colors.textSecondary,
              fontSize: 14,
              mt: 4,
            }}
          >
            Chưa có tài khoản?{" "}
            <Typography
              component="span"
              onClick={() => {
                handleSignInClose();
                handleSignUpOpen();
              }}
              sx={{ color: colors.primary, cursor: "pointer", fontWeight: 600, "&:hover": { textDecoration: "underline" } }}
            >
              Đăng ký
            </Typography>
          </Typography>
        </DialogContent>
      </Dialog>

      {/* Sign Up Modal */}
      <Dialog
        open={signUpOpen}
        onClose={handleSignUpClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: colors.white,
            borderRadius: "24px",
            maxWidth: 500,
            minHeight: 500,
            animation: `${fadeIn} 0.25s ease-out`,
            boxShadow: "0 25px 60px rgba(67, 160, 71, 0.2)",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(46, 125, 50, 0.15)",
            backdropFilter: "blur(4px)",
          },
        }}
      >
        <Box sx={{ position: "relative", p: 2.5 }}>
          <IconButton
            onClick={handleSignUpClose}
            sx={{
              position: "absolute",
              left: 12,
              top: 12,
              color: colors.textSecondary,
              "&:hover": { backgroundColor: "rgba(67, 160, 71, 0.1)" },
            }}
          >
            <Close />
          </IconButton>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              component="img"
              src="/images/logo.png"
              alt="VolunteerHub Logo"
              sx={{ width: 48, height: "auto" }}
            />
          </Box>
        </Box>

        <DialogContent sx={{ px: { xs: 4, md: 8 }, pb: 5, pt: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: 28,
              color: colors.text,
              mb: 4,
              textAlign: "center",
            }}
          >
            Tạo tài khoản của bạn
          </Typography>

          <Box sx={{ animation: `${slideUp} 0.3s ease-out` }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>
                {error}
              </Alert>
            )}
            
            <TextField
              fullWidth
              label="Tên người dùng"
              value={signUpData.username}
              onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  document.getElementById("signup-email")?.focus();
                }
              }}
              variant="outlined"
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#f8fdf8",
                  "& fieldset": { borderColor: colors.border },
                  "&:hover fieldset": { borderColor: colors.primary },
                  "&.Mui-focused fieldset": { borderColor: colors.primary, borderWidth: 2 },
                },
                "& .MuiInputLabel-root": { color: colors.textSecondary },
                "& .MuiInputLabel-root.Mui-focused": { color: colors.primary },
              }}
            />

            <TextField
              fullWidth
              id="signup-email"
              type="email"
              label="Email"
              value={signUpData.email}
              onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  document.getElementById("signup-password")?.focus();
                }
              }}
              variant="outlined"
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#f8fdf8",
                  "& fieldset": { borderColor: colors.border },
                  "&:hover fieldset": { borderColor: colors.primary },
                  "&.Mui-focused fieldset": { borderColor: colors.primary, borderWidth: 2 },
                },
                "& .MuiInputLabel-root": { color: colors.textSecondary },
                "& .MuiInputLabel-root.Mui-focused": { color: colors.primary },
              }}
            />

            <TextField
              fullWidth
              id="signup-password"
              type={showPassword ? "text" : "password"}
              label="Mật khẩu"
              value={signUpData.password}
              onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  document.getElementById("signup-confirm-password")?.focus();
                }
              }}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{ color: colors.textSecondary }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#f8fdf8",
                  "& fieldset": { borderColor: colors.border },
                  "&:hover fieldset": { borderColor: colors.primary },
                  "&.Mui-focused fieldset": { borderColor: colors.primary, borderWidth: 2 },
                },
                "& .MuiInputLabel-root": { color: colors.textSecondary },
                "& .MuiInputLabel-root.Mui-focused": { color: colors.primary },
              }}
            />

            <TextField
              fullWidth
              id="signup-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              label="Xác nhận mật khẩu"
              value={signUpData.confirmPassword}
              onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter" && signUpData.username && signUpData.email && signUpData.password && signUpData.confirmPassword && !loading) {
                  handleSignUpSubmit();
                }
              }}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      sx={{ color: colors.textSecondary }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#f8fdf8",
                  "& fieldset": { borderColor: colors.border },
                  "&:hover fieldset": { borderColor: colors.primary },
                  "&.Mui-focused fieldset": { borderColor: colors.primary, borderWidth: 2 },
                },
                "& .MuiInputLabel-root": { color: colors.textSecondary },
                "& .MuiInputLabel-root.Mui-focused": { color: colors.primary },
              }}
            />


            <Button
              variant="contained"
              fullWidth
              disabled={!signUpData.username || !signUpData.email || !signUpData.password || !signUpData.confirmPassword || loading}
              onClick={handleSignUpSubmit}
              sx={{
                height: 48,
                borderRadius: "50px",
                background: (signUpData.username && signUpData.email && signUpData.password && signUpData.confirmPassword) 
                  ? `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.primary} 100%)`
                  : "#e0e0e0",
                color: (signUpData.username && signUpData.email && signUpData.password && signUpData.confirmPassword) ? colors.white : "#9e9e9e",
                fontWeight: 700,
                fontSize: 15,
                textTransform: "none",
                mb: 3,
                boxShadow: (signUpData.username && signUpData.email && signUpData.password && signUpData.confirmPassword) 
                  ? "0 6px 20px rgba(67, 160, 71, 0.35)" 
                  : "none",
                "&:hover": {
                  background: (signUpData.username && signUpData.email && signUpData.password && signUpData.confirmPassword) 
                    ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`
                    : "#e0e0e0",
                },
                "&.Mui-disabled": {
                  background: "#e0e0e0",
                  color: "#9e9e9e",
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Đăng ký"}
            </Button>

          </Box>

          <Divider sx={{ my: 2.5 }}>
            <Typography sx={{ color: colors.textSecondary, fontSize: 14 }}>hoặc</Typography>
          </Divider>

          <Button
            variant="contained"
            fullWidth
            startIcon={<Google />}
            onClick={handleGoogleAuth}
            sx={{ ...filledButtonSx, maxWidth: "100%" }}
          >
            Đăng ký với Google
          </Button>

          <Typography
            sx={{
              textAlign: "center",
              color: colors.textSecondary,
              fontSize: 14,
              mt: 4,
            }}
          >
            Đã có tài khoản?{" "}
            <Typography
              component="span"
              onClick={() => {
                handleSignUpClose();
                handleSignInOpen();
              }}
              sx={{ color: colors.primary, cursor: "pointer", fontWeight: 600, "&:hover": { textDecoration: "underline" } }}
            >
              Đăng nhập
            </Typography>
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SignIn;
