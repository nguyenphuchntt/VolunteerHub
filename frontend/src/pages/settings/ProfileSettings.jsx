import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, TextField, Button, Card, CardContent, Alert, IconButton,
  CircularProgress, Avatar, Grid
} from "@mui/material";
import { ArrowBack, PhotoCamera } from "@mui/icons-material";
import { profileService } from "../../api";
import { useAuth } from "../../context/AuthContext";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: ""
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await profileService.getMyProfile();
        setFormData({
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          email: profile.email || "",
          phone: profile.phone || "",
          bio: profile.bio || ""
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Không thể tải thông tin hồ sơ.");
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!formData.firstName?.trim() || !formData.lastName?.trim()) {
      setError("Họ và tên không được để trống.");
      return;
    }

    setLoading(true);
    try {
      await profileService.updateProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone?.trim() || null,
        bio: formData.bio?.trim() || null
      });
      setSuccess(true);
      // Refresh user context if available
      if (refreshUser) {
        await refreshUser();
      }
    } catch (err) {
      console.error("Update profile failed:", err);
      setError(err.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const displayName = formData.firstName && formData.lastName 
    ? `${formData.firstName} ${formData.lastName}` 
    : user?.username || "?";

  if (fetching) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Back button */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <IconButton onClick={() => navigate("/settings")} size="small">
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" fontWeight={700}>Thông tin cá nhân</Typography>
      </Box>

      <Card elevation={0} sx={{ borderRadius: "16px", border: "1px solid", borderColor: "grey.200" }}>
        <CardContent sx={{ p: 3 }}>
          {/* Avatar Section */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Box sx={{ position: "relative" }}>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  fontSize: 40, 
                  bgcolor: "primary.main" 
                }}
              >
                {displayName.charAt(0).toUpperCase()}
              </Avatar>
            </Box>
          </Box>

          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: "12px" }}>
              Cập nhật thông tin thành công!
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Họ"
                  value={formData.lastName}
                  onChange={handleChange("lastName")}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tên"
                  value={formData.firstName}
                  onChange={handleChange("firstName")}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.email}
                  disabled
                  helperText="Email không thể thay đổi"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  value={formData.phone}
                  onChange={handleChange("phone")}
                  placeholder="Nhập số điện thoại"
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ 
                mt: 3,
                borderRadius: "9999px", 
                py: 1.5, 
                textTransform: "none", 
                fontWeight: 600 
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Lưu thay đổi"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfileSettings;
