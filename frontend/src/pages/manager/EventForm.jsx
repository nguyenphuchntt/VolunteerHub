import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Snackbar,
  FormHelperText,
} from "@mui/material";
import { Save, ArrowBack, Image as ImageIcon } from "@mui/icons-material";
import { ThreeColumnLayout } from "../../components/common";
import { eventService } from "../../api";
import { useAuth } from "../../context/AuthContext";

// Backend uses English values: ENVIRONMENT, EDUCATION, HEALTHCARE, COMMUNITY, CHARITY, OTHER
// We map them to Vietnamese labels
const eventCategories = [
  { id: "ENVIRONMENT", name: "Môi trường" },
  { id: "EDUCATION", name: "Giáo dục" },
  { id: "HEALTHCARE", name: "Sức khỏe" },
  { id: "COMMUNITY", name: "Cộng đồng" },
  { id: "CHARITY", name: "Từ thiện" },
  { id: "OTHER", name: "Khác" },
];

const EventForm = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { user, isAdmin } = useAuth(); // Get isAdmin to allow admins to edit
  const isEdit = !!eventId;

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startAt: "",
    endAt: "",
    location: "",
    category: "",
    coverImage: "",
    maxParticipants: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingEvent, setFetchingEvent] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [isOwner, setIsOwner] = useState(true);

  // Fetch event data when editing
  useEffect(() => {
    const fetchEvent = async () => {
      if (!isEdit || !eventId) return;
      
      setFetchingEvent(true);
      try {
        const event = await eventService.getEventById(eventId);
        
        // Check ownership
        if (user?.accountID && event.accountId && event.accountId !== user.accountID && !isAdmin) {
          setIsOwner(false);
          setSubmitError("Bạn không có quyền chỉnh sửa sự kiện này.");
        }

        // Format dates for input fields
        const formatDateTime = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
        };

        setFormData({
          title: event.title || "",
          description: event.description || "",
          startAt: formatDateTime(event.startAt),
          endAt: formatDateTime(event.endAt),
          location: event.location || "",
          category: (event.category || "").toUpperCase(), // Normalize to uppercase
          coverImage: event.coverImage || "",
          maxParticipants: event.maxParticipants?.toString() || "",
        });
      } catch (err) {
        console.error("Failed to fetch event:", err);
        setSubmitError("Không thể tải thông tin sự kiện.");
      } finally {
        setFetchingEvent(false);
      }
    };

    fetchEvent();
  }, [isEdit, eventId, user?.accountID, isAdmin]);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title || formData.title.length < 5) {
      newErrors.title = "Tên sự kiện phải có ít nhất 5 ký tự";
    }
    if (!formData.description || formData.description.length < 20) {
      newErrors.description = "Mô tả phải có ít nhất 20 ký tự";
    }
    if (!formData.startAt) {
      newErrors.startAt = "Thời gian bắt đầu là bắt buộc";
    }
    if (!formData.endAt) {
      newErrors.endAt = "Thời gian kết thúc là bắt buộc";
    }
    if (formData.startAt && formData.endAt && new Date(formData.startAt) >= new Date(formData.endAt)) {
      newErrors.endAt = "Thời gian kết thúc phải sau thời gian bắt đầu";
    }
    if (!formData.location) {
      newErrors.location = "Địa điểm là bắt buộc";
    }
    if (!formData.category) {
      newErrors.category = "Danh mục là bắt buộc";
    }
    // coverImage validation removed
    if (!formData.maxParticipants) {
      newErrors.maxParticipants = "Số lượng TNV là bắt buộc";
    } else if (isNaN(formData.maxParticipants) || parseInt(formData.maxParticipants) <= 0) {
      newErrors.maxParticipants = "Số lượng TNV phải là số dương";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        startAt: formData.startAt ? new Date(formData.startAt).toISOString() : null,
        endAt: formData.endAt ? new Date(formData.endAt).toISOString() : null,
        location: formData.location,
        category: formData.category,
        coverImage: formData.coverImage,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
      };

      // Rename maxParticipants to attendeeCount for API compatibility if needed
      if (eventData.maxParticipants !== null) {
        eventData.attendeeCount = eventData.maxParticipants;
        delete eventData.maxParticipants;
      }

      if (isEdit) {
        await eventService.updateEvent(eventId, eventData);
        setSnackbar({ open: true, message: "Cập nhật sự kiện thành công!", severity: "success" });
      } else {
        await eventService.registerEvent(eventData);
        setSnackbar({ open: true, message: "Tạo sự kiện thành công!", severity: "success" });
      }
      
      // Navigate after short delay to show success message
      setTimeout(() => navigate("/manage/events"), 1000);
    } catch (err) {
      console.error("Failed to save event:", err);
      setSubmitError(err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingEvent) {
    return (
      <ThreeColumnLayout user={user} role="manager" showRightSidebar={false} showSearch={false}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </ThreeColumnLayout>
    );
  }

  return (
    <>
      <ThreeColumnLayout user={user} role="manager" showRightSidebar={false} showSearch={false}>
        {/* Header */}
        <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
            <Button
              variant="text"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/manage/events")}
              sx={{ minWidth: "auto", p: 1 }}
            />
            <Typography variant="h6" fontWeight={700}>
              {isEdit ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}

            <TextField
              fullWidth
              label="Tên sự kiện"
              value={formData.title}
              onChange={handleChange("title")}
              error={!!errors.title}
              helperText={errors.title}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Mô tả"
              value={formData.description}
              onChange={handleChange("description")}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Thời gian bắt đầu"
                  type="datetime-local"
                  value={formData.startAt}
                  onChange={handleChange("startAt")}
                  error={!!errors.startAt}
                  helperText={errors.startAt}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Thời gian kết thúc"
                  type="datetime-local"
                  value={formData.endAt}
                  onChange={handleChange("endAt")}
                  error={!!errors.endAt}
                  helperText={errors.endAt}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Địa điểm"
              value={formData.location}
              onChange={handleChange("location")}
              error={!!errors.location}
              helperText={errors.location}
              sx={{ mb: 2 }}
            />

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>Danh mục</InputLabel>
                  <Select 
                    value={formData.category} 
                    onChange={handleChange("category")} 
                    label="Danh mục"
                  >
                    {eventCategories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                    ))}
                  </Select>
                  {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Số TNV tối đa"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={handleChange("maxParticipants")}
                  error={!!errors.maxParticipants}
                  helperText={errors.maxParticipants}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="URL ảnh bìa (Tùy chọn)"
              value={formData.coverImage}
              onChange={handleChange("coverImage")}
              error={!!errors.coverImage}
              helperText={errors.coverImage}
              sx={{ mb: 3 }}
              InputProps={{ startAdornment: <ImageIcon sx={{ mr: 1, color: "grey.500" }} /> }}
            />

            {formData.coverImage && (
              <Box
                component="img"
                src={formData.coverImage}
                alt="Cover preview"
                onError={(e) => e.target.style.display = 'none'}
                sx={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: "12px", mb: 3 }}
              />
            )}

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate("/manage/events")} 
                disabled={loading} 
                sx={{ borderRadius: "9999px", textTransform: "none" }}
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Save />} 
                disabled={loading || !isOwner} 
                sx={{ borderRadius: "9999px", textTransform: "none", fontWeight: 600 }}
              >
                {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo sự kiện"}
              </Button>
            </Box>
          </form>
        </Box>
      </ThreeColumnLayout>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EventForm;
