import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Lock, CheckCircle, Error, Visibility, VisibilityOff } from "@mui/icons-material";
import { keyframes } from "@mui/system";
import { passwordService } from "../api";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading, valid, success, error, no-token
  const [message, setMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setStatus("no-token");
        setMessage("Không tìm thấy token đặt lại mật khẩu. Vui lòng kiểm tra lại link trong email.");
        return;
      }

      try {
        const response = await passwordService.validateToken(token);
        if (response.success) {
          setStatus("valid");
        } else {
          setStatus("error");
          setMessage(response.message || "Token không hợp lệ hoặc đã hết hạn.");
        }
      } catch (err) {
        setStatus("error");
        const errorMsg = err.response?.data?.message || "Token không hợp lệ hoặc đã hết hạn.";
        setMessage(errorMsg);
      }
    };

    validateToken();
  }, [token]);

  const handleResetPassword = async () => {
    setError("");

    // Validation
    if (newPassword.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      const response = await passwordService.resetPassword(token, newPassword, confirmPassword);
      if (response.success) {
        setStatus("success");
        setMessage(response.message || "Mật khẩu đã được đặt lại thành công!");
      } else {
        setError(response.message || "Không thể đặt lại mật khẩu. Vui lòng thử lại.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (status === "loading") {
      return (
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ color: colors.primary, mb: 3 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: colors.text }}>
            Đang kiểm tra...
          </Typography>
        </Box>
      );
    }

    if (status === "success") {
      return (
        <Box sx={{ textAlign: "center" }}>
          <CheckCircle sx={{ fontSize: 80, color: colors.primary, mb: 3 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text, mb: 2 }}>
            Thành công!
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

    if (status === "error" || status === "no-token") {
      return (
        <Box sx={{ textAlign: "center" }}>
          <Error sx={{ fontSize: 80, color: "#ef4444", mb: 3 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text, mb: 2 }}>
            Không hợp lệ
          </Typography>
          <Typography sx={{ color: colors.textSecondary, mb: 4, fontSize: 16 }}>
            {message}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/auth")}
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
            Quay lại đăng nhập
          </Button>
        </Box>
      );
    }

    // Valid token - show password reset form
    return (
      <Box>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Lock sx={{ fontSize: 60, color: colors.primary, mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text, mb: 1 }}>
            Đặt lại mật khẩu
          </Typography>
          <Typography sx={{ color: colors.textSecondary, fontSize: 15 }}>
            Nhập mật khẩu mới cho tài khoản của bạn
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          label="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: colors.textSecondary }}>
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
          type={showConfirmPassword ? "text" : "password"}
          label="Xác nhận mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newPassword && confirmPassword && !loading) {
              handleResetPassword();
            }
          }}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} sx={{ color: colors.textSecondary }}>
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
          disabled={!newPassword || !confirmPassword || loading}
          onClick={handleResetPassword}
          sx={{
            height: 48,
            borderRadius: "50px",
            background: newPassword && confirmPassword
              ? `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.primary} 100%)`
              : "#e0e0e0",
            color: newPassword && confirmPassword ? colors.white : "#9e9e9e",
            fontWeight: 700,
            fontSize: 15,
            textTransform: "none",
            boxShadow: newPassword && confirmPassword ? "0 6px 20px rgba(67, 160, 71, 0.35)" : "none",
            "&:hover": {
              background: newPassword && confirmPassword
                ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`
                : "#e0e0e0",
            },
            "&.Mui-disabled": {
              background: "#e0e0e0",
              color: "#9e9e9e",
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Đặt lại mật khẩu"}
        </Button>

        <Button
          variant="text"
          fullWidth
          onClick={() => navigate("/auth")}
          sx={{ mt: 2, color: colors.primary, fontWeight: 600, textTransform: "none" }}
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
          maxWidth: 460,
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

export default ResetPassword;
