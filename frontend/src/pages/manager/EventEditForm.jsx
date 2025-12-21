import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Skeleton,
  Chip,
} from "@mui/material";
import {
  ArrowBack,
  Save,
} from "@mui/icons-material";
import { ThreeColumnLayout } from "../../components/common";
import { eventService } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { buildEventUrl, extractEventIdFromSlug } from "../../utils/urlUtils";
import { CATEGORY_OPTIONS } from "../../constants/categories";

const EventEditForm = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const eventId = useMemo(() => extractEventIdFromSlug(slug), [slug]);
  const { user } = useAuth();

  // Loading and error states
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Original event data
  const [originalEvent, setOriginalEvent] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    category: "",
  });

  // Parse ISO datetime to separate date and time strings
  const parseDateTime = (isoString) => {
    if (!isoString) return { date: "", time: "" };
    const dt = new Date(isoString);
    // Format date as YYYY-MM-DD
    const year = dt.getFullYear();
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    const date = `${year}-${month}-${day}`;
    // Format time as HH:mm
    const hours = String(dt.getHours()).padStart(2, '0');
    const minutes = String(dt.getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}`;
    return { date, time };
  };

  // Fetch event data on mount
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setError("Không tìm thấy sự kiện.");
        setLoadingEvent(false);
        return;
      }

      try {
        const event = await eventService.getEventById(eventId);
        console.log("Fetched event:", event); // Debug log
        setOriginalEvent(event);

        // Parse dates
        const start = parseDateTime(event.startAt);
        const end = parseDateTime(event.endAt);

        setFormData({
          title: event.title || "",
          description: event.description || "",
          startDate: start.date,
          startTime: start.time,
          endDate: end.date,
          endTime: end.time,
          location: event.location || "",
          category: event.category || "",
        });
      } catch (err) {
        console.error("Failed to fetch event:", err);
        setError("Không thể tải thông tin sự kiện.");
      } finally {
        setLoadingEvent(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Combine date and time into ISO string for API
  const formatDateTimeForApi = (date, time) => {
    if (!date) return null;
    const timeStr = time || "00:00";
    const dateTimeStr = `${date}T${timeStr}`;
    return new Date(dateTimeStr).toISOString();
  };

  // Combine date and time into Date object for validation
  const combineDateTime = (date, time) => {
    if (!date) return null;
    const timeStr = time || "00:00";
    return new Date(`${date}T${timeStr}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const startDateTime = combineDateTime(formData.startDate, formData.startTime);
    const endDateTime = combineDateTime(formData.endDate, formData.endTime);

    // Validate: endDateTime must be >= startDateTime
    if (endDateTime && startDateTime && endDateTime < startDateTime) {
      setError("Thời gian kết thúc phải sau thời gian bắt đầu.");
      setSaving(false);
      return;
    }

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        startAt: formatDateTimeForApi(formData.startDate, formData.startTime),
        endAt: formatDateTimeForApi(formData.endDate, formData.endTime),
        location: formData.location,
        category: formData.category,
        attendeeCount: originalEvent?.attendeeCount || 0, // Keep original value
      };


      const updatedEvent = await eventService.updateEvent(eventId, updateData);

      setSnackbar({
        open: true,
        message: "Cập nhật sự kiện thành công!",
        severity: "success"
      });

      // Navigate back to event detail after short delay
      setTimeout(() => {
        navigate(buildEventUrl(updatedEvent));
      }, 1500);

    } catch (err) {
      console.error("Failed to update event:", err);
      setError(err.response?.data?.message || "Không thể cập nhật sự kiện. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const isFormValid = formData.title && formData.startDate;

  // Check if form has changes
  const hasChanges = useMemo(() => {
    if (!originalEvent) return false;

    const origStart = parseDateTime(originalEvent.startAt);
    const origEnd = parseDateTime(originalEvent.endAt);

    return (
      formData.title !== (originalEvent.title || "") ||
      formData.description !== (originalEvent.description || "") ||
      formData.startDate !== origStart.date ||
      formData.startTime !== origStart.time ||
      formData.endDate !== origEnd.date ||
      formData.endTime !== origEnd.time ||
      formData.location !== (originalEvent.location || "") ||
      formData.category !== (originalEvent.category || "")
    );
  }, [formData, originalEvent]);

  // Get status label
  const getStatusLabel = (status) => {
    const labels = {
      PENDING: "Chờ duyệt",
      SCHEDULED: "Đã lên lịch",
      APPROVED: "Đã duyệt",
      STARTED: "Đang diễn ra",
      FINISHED: "Đã kết thúc",
      CANCELLED: "Đã hủy",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "warning",
      SCHEDULED: "info",
      APPROVED: "success",
      STARTED: "info",
      FINISHED: "default",
      CANCELLED: "error",
    };
    return colors[status] || "default";
  };

  if (loadingEvent) {
    return (
      <ThreeColumnLayout user={user} role="manager" showRightSidebar={false}>
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="rectangular" height={200} sx={{ mt: 2, borderRadius: 2 }} />
          <Skeleton variant="rectangular" height={150} sx={{ mt: 2, borderRadius: 2 }} />
        </Box>
      </ThreeColumnLayout>
    );
  }

  if (error && !originalEvent) {
    return (
      <ThreeColumnLayout user={user} role="manager" showRightSidebar={false}>
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ borderRadius: "12px" }}>{error}</Alert>
          <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Quay lại</Button>
        </Box>
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout user={user} role="manager" showRightSidebar={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200", position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 10 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 1.5 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              Chỉnh sửa sự kiện
            </Typography>
            {originalEvent && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  ID: {originalEvent.eventId}
                </Typography>
                <Chip 
                  label={getStatusLabel(originalEvent.status)} 
                  size="small" 
                  color={getStatusColor(originalEvent.status)}
                  sx={{ fontSize: "10px", height: 20 }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}

        {/* Basic Info */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: "16px", border: "1px solid", borderColor: "grey.200" }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            Thông tin cơ bản
          </Typography>

          <TextField
            name="title"
            label="Tên sự kiện *"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            name="description"
            label="Mô tả sự kiện"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Danh mục</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Danh mục"
            >
              <MenuItem value="">
                <em>Chọn danh mục</em>
              </MenuItem>
              {CATEGORY_OPTIONS.map(cat => (
                <MenuItem key={cat.key} value={cat.key}>{cat.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {/* Date & Location */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: "16px", border: "1px solid", borderColor: "grey.200" }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            Thời gian & Địa điểm
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              name="startDate"
              label="Ngày bắt đầu *"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="startTime"
              label="Giờ bắt đầu"
              type="time"
              value={formData.startTime}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              name="endDate"
              label="Ngày kết thúc"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="endTime"
              label="Giờ kết thúc"
              type="time"
              value={formData.endTime}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <TextField
            name="location"
            label="Địa điểm"
            value={formData.location}
            onChange={handleChange}
            fullWidth
          />
        </Paper>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={saving || !isFormValid || !hasChanges}
          startIcon={saving ? null : <Save />}
          sx={{
            borderRadius: "9999px",
            textTransform: "none",
            fontWeight: 600,
            height: 48,
            fontSize: 16
          }}
        >
          {saving ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
              Đang lưu...
            </>
          ) : (
            hasChanges ? "Lưu thay đổi" : "Không có thay đổi"
          )}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%", fontWeight: 500, borderRadius: "8px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThreeColumnLayout>
  );
};

export default EventEditForm;
