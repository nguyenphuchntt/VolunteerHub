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
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading, success, error, no-token
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  
  // Ref to prevent duplicate API calls (React StrictMode calls useEffect twice)
  const verificationAttempted = useRef(false);

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
    const verifyEmailToken = async () => {
      // Prevent duplicate calls from React StrictMode
      if (verificationAttempted.current) {
        return;
      }
      
      if (!token) {
        setStatus("no-token");
        setMessage("Không tìm thấy token xác nhận. Vui lòng kiểm tra lại link trong email.");
        return;
      }

      // Mark as attempted before making the API call
      verificationAttempted.current = true;

      try {
        const response = await emailService.verifyEmail(token);
        if (response.success) {
          setStatus("success");
          setMessage(response.message || "Email đã được xác nhận thành công! Bạn có thể đăng nhập ngay bây giờ.");
        } else {
          setStatus("error");
          setMessage(response.message || "Token không hợp lệ hoặc đã hết hạn.");
        }
      } catch (err) {
        // Check if the error response contains success: true (e.g., "already verified" case)
        const responseData = err.response?.data;
        if (responseData?.success) {
          setStatus("success");
          setMessage(responseData.message || "Email đã được xác nhận thành công!");
        } else {
          setStatus("error");
          const errorMsg = responseData?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
          setMessage(errorMsg);
        }
      }
    };

    verifyEmailToken();
  }, [token]);

  const handleResendEmail = async () => {
    if (!resendEmail) return;
    
    setResendLoading(true);
    setResendMessage("");
    try {
      const response = await emailService.resendVerificationEmail(resendEmail);
      setResendMessage(response.message || "Đã gửi lại email xác nhận.");
    } catch (err) {
      setResendMessage(err.response?.data?.message || "Không thể gửi email. Vui lòng thử lại.");
    } finally {
      setResendLoading(false);
    }
  };

  const renderContent = () => {
    if (status === "loading") {
      return (
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ color: colors.primary, mb: 3 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: colors.text }}>
            Đang xác nhận email...
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

    // Error or no-token state
    return (
      <Box sx={{ textAlign: "center" }}>
        <Error sx={{ fontSize: 80, color: "#ef4444", mb: 3 }} />
        <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text, mb: 2 }}>
          Xác nhận thất bại
        </Typography>
        <Typography sx={{ color: colors.textSecondary, mb: 4, fontSize: 16 }}>
          {message}
        </Typography>

        {/* Resend email section */}
        <Box sx={{ 
          mt: 4, 
          p: 3, 
          backgroundColor: "rgba(255, 255, 255, 0.8)", 
          borderRadius: "16px",
          maxWidth: 400,
          mx: "auto"
        }}>
          <Email sx={{ fontSize: 40, color: colors.primary, mb: 2 }} />
          <Typography sx={{ fontWeight: 600, color: colors.text, mb: 2 }}>
            Gửi lại email xác nhận
          </Typography>
          <TextField
            fullWidth
            type="email"
            label="Nhập email của bạn"
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            variant="outlined"
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#f8fdf8",
              },
            }}
          />
          {resendMessage && (
            <Alert 
              severity="info" 
              sx={{ mb: 2, borderRadius: "12px" }}
            >
              {resendMessage}
            </Alert>
          )}
          <Button
            variant="contained"
            fullWidth
            disabled={!resendEmail || resendLoading}
            onClick={handleResendEmail}
            sx={{
              height: 44,
              borderRadius: "50px",
              background: resendEmail
                ? `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.primary} 100%)`
                : "#e0e0e0",
              color: resendEmail ? colors.white : "#9e9e9e",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            {resendLoading ? <CircularProgress size={24} color="inherit" /> : "Gửi lại email"}
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
