import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";
import { CheckCircle, Error, Email } from "@mui/icons-material";
import { keyframes } from "@mui/system";
import { emailService } from "../api";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email");

  const [email, setEmail] = useState(emailParam || "");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("input"); // input, verifying, success, error
  const [message, setMessage] = useState("");
  const [remainingAttempts, setRemainingAttempts] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const cooldownTimerRef = useRef(null);

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
  };

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current);
      }
    };
  }, []);

  const startCooldownTimer = (seconds) => {
    setResendCooldown(seconds);
    if (cooldownTimerRef.current) {
      clearInterval(cooldownTimerRef.current);
    }
    cooldownTimerRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOtp = async () => {
    if (!email || !otp) return;

    setStatus("verifying");
    setMessage("");
    try {
      const response = await emailService.verifyOtp(email, otp);
      if (response.success) {
        setStatus("success");
        setMessage(response.message || "Email đã được xác nhận thành công!");
      } else {
        setStatus("error");
        setMessage(response.message || "Mã xác nhận không hợp lệ.");
        setRemainingAttempts(response.remainingAttempts);
      }
    } catch (err) {
      const responseData = err.response?.data;
      setStatus("error");
      setMessage(responseData?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
      setRemainingAttempts(responseData?.remainingAttempts);
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;

    setResendLoading(true);
    setResendMessage("");
    try {
      const response = await emailService.resendOtp(email);
      setResendMessage(response.message || "Đã gửi lại mã xác nhận.");
      if (response.resendCooldownSeconds) {
        startCooldownTimer(response.resendCooldownSeconds);
      }
    } catch (err) {
      const errorData = err.response?.data;
      setResendMessage(errorData?.message || "Không thể gửi mã. Vui lòng thử lại.");
      if (errorData?.resendCooldownSeconds) {
        startCooldownTimer(errorData.resendCooldownSeconds);
      }
    } finally {
      setResendLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && email && otp && status !== "verifying") {
      handleVerifyOtp();
    }
  };

  const renderContent = () => {
    if (status === "verifying") {
      return (
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ color: colors.primary, mb: 3 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: colors.text }}>
            Đang xác nhận...
          </Typography>
        </Box>
      );
    }

    if (status === "success") {
      return (
        <Box sx={{ textAlign: "center" }}>
          <CheckCircle sx={{ fontSize: 80, color: colors.primary, mb: 3 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text, mb: 2 }}>
            Xác nhận thành công!
          </Typography>
          <Typography sx={{ color: colors.textSecondary, mb: 4, fontSize: 16 }}>
            {message}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/signin")}
            sx={{
              height: 48,
              borderRadius: "50px",
              background: `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.primary} 100%)`,
              color: colors.white,
              fontWeight: 700,
              fontSize: 15,
              textTransform: "none",
              px: 5,
              boxShadow: "0 6px 20px rgba(67, 160, 71, 0.35)",
              "&:hover": {
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
              },
            }}
          >
            Đăng nhập ngay
          </Button>
        </Box>
      );
    }

    // Input or error state
    return (
      <Box sx={{ textAlign: "center" }}>
        <Email sx={{ fontSize: 80, color: colors.primary, mb: 3 }} />
        <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text, mb: 2 }}>
          Xác nhận email
        </Typography>
        <Typography sx={{ color: colors.textSecondary, mb: 4, fontSize: 16 }}>
          Nhập mã xác nhận đã được gửi tới email của bạn
        </Typography>

        <Box sx={{
          mt: 4,
          p: 3,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "16px",
          maxWidth: 400,
          mx: "auto"
        }}>
          <TextField
            fullWidth
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#f8fdf8",
              },
            }}
          />
          <TextField
            fullWidth
            label="Mã xác nhận (6 chữ số)"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 6) {
                setOtp(value);
              }
            }}
            onKeyPress={handleKeyPress}
            variant="outlined"
            inputProps={{
              maxLength: 6,
              pattern: "\\d{6}",
              style: {
                fontSize: "24px",
                letterSpacing: "8px",
                textAlign: "center",
                fontFamily: "'Courier New', monospace"
              }
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#f8fdf8",
              },
            }}
          />
          {message && status === "error" && (
            <Alert
              severity="error"
              sx={{ mb: 2, borderRadius: "12px" }}
            >
              {message}
              {remainingAttempts !== null && remainingAttempts > 0 && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Còn {remainingAttempts} lần thử
                </Typography>
              )}
            </Alert>
          )}
          <Button
            variant="contained"
            fullWidth
            disabled={!email || !otp || otp.length !== 6}
            onClick={handleVerifyOtp}
            sx={{
              height: 48,
              borderRadius: "50px",
              background: (email && otp && otp.length === 6)
                ? `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.primary} 100%)`
                : "#e0e0e0",
              color: (email && otp && otp.length === 6) ? colors.white : "#9e9e9e",
              fontWeight: 600,
              textTransform: "none",
              mb: 2,
            }}
          >
            Xác nhận
          </Button>

          {resendMessage && (
            <Alert
              severity="info"
              sx={{ mb: 2, borderRadius: "12px" }}
            >
              {resendMessage}
            </Alert>
          )}
          <Button
            variant="text"
            fullWidth
            disabled={!email || resendLoading || resendCooldown > 0}
            onClick={handleResendOtp}
            sx={{
              color: colors.primary,
              fontWeight: 600,
              textTransform: "none"
            }}
          >
            {resendLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : resendCooldown > 0 ? (
              `Gửi lại sau ${resendCooldown}s`
            ) : (
              "Gửi lại mã"
            )}
          </Button>
        </Box>

        <Button
          variant="text"
          onClick={() => navigate("/signin")}
          sx={{ mt: 3, color: colors.primary, fontWeight: 600 }}
        >
          Quay lại đăng nhập
        </Button>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: colors.bgGradient,
        fontFamily: "'Roboto', 'Inter', sans-serif",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Box
        sx={{
          backgroundColor: colors.white,
          borderRadius: "24px",
          padding: { xs: 4, md: 6 },
          maxWidth: 500,
          width: "100%",
          animation: `${fadeIn} 0.4s ease-out`,
          boxShadow: "0 25px 60px rgba(67, 160, 71, 0.2)",
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Box
            component="img"
            src="/images/logo.png"
            alt="VolunteerHub Logo"
            sx={{ width: 60, height: "auto" }}
          />
        </Box>

        {renderContent()}
      </Box>
    </Box>
  );
};

export default VerifyEmail;
