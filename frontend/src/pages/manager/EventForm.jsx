import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import {
  ArrowBack,
  CloudUpload,
  DeleteOutline,
  Add,
} from "@mui/icons-material";
import { ThreeColumnLayout } from "../../components/common";
import { eventService, mediaService } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { buildEventUrl } from "../../utils/urlUtils";

const categories = [
  "Environment",
  "Community Service", 
  "Education",
  "Health & Wellness",
  "Animal Welfare",
  "Other",
];

const EventForm = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startAt: "",
    endAt: "",
    location: "",
    category: "",
  });
  
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Add new files to selected images
    setSelectedImages(prev => [...prev, ...files]);
    
    // Generate preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(imagePreviewUrls[index]);
    
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const formatDateForApi = (dateTimeLocal) => {
    if (!dateTimeLocal) return null;
    // Convert from datetime-local format to ISO 8601 with timezone
    return new Date(dateTimeLocal).toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate dates
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today
    const startDate = new Date(formData.startAt);
    const endDate = formData.endAt ? new Date(formData.endAt) : null;

    // 1. startAt must be >= today
    if (startDate < now) {
      setError("Thời gian bắt đầu phải từ hôm nay trở đi.");
      setLoading(false);
      return;
    }

    // 2. endAt must be >= startAt (if endAt is provided)
    if (endDate && endDate < startDate) {
      setError("Thời gian kết thúc phải sau thời gian bắt đầu.");
      setLoading(false);
      return;
    }

    try {
      // Prepare event data with attendeeCount = 0 (auto set)
      const eventData = {
        title: formData.title,
        description: formData.description,
        startAt: formatDateForApi(formData.startAt),
        endAt: formatDateForApi(formData.endAt),
        location: formData.location,
        category: formData.category,
        attendeeCount: 0, // Auto set to 0
      };

      // Step 1: Create the event
      let createdEvent;
      if (isAdmin) {
        createdEvent = await eventService.createEvent(eventData);
      } else {
        createdEvent = await eventService.registerEvent(eventData);
      }
      
      const eventId = createdEvent.eventId;
      
      // Step 2: Upload images if any
      if (selectedImages.length > 0 && eventId) {
        setUploadingImages(true);
        
        for (const imageFile of selectedImages) {
          try {
            await mediaService.uploadEventMedia(imageFile, eventId);
          } catch (uploadErr) {
            console.error("Failed to upload image:", uploadErr);
            // Continue uploading other images even if one fails
          }
        }
        
        setUploadingImages(false);
      }

      setSnackbar({ 
        open: true, 
        message: isAdmin ? "Tạo sự kiện thành công!" : "Đăng ký sự kiện thành công! Đang chờ phê duyệt.", 
        severity: "success" 
      });
      
      // Navigate to the event detail or management page
      setTimeout(() => {
        navigate(buildEventUrl(createdEvent));
      }, 1500);
      
    } catch (err) {
      console.error("Failed to create event:", err);
      setError(err.response?.data?.message || "Không thể tạo sự kiện. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.title && formData.startAt;

  return (
    <ThreeColumnLayout user={user} role="manager" showRightSidebar={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200", position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 10 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 1.5 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" fontWeight={700}>
            Tạo sự kiện mới
          </Typography>
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
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
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
              name="startAt"
              label="Thời gian bắt đầu *"
              type="datetime-local"
              value={formData.startAt}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="endAt"
              label="Thời gian kết thúc"
              type="datetime-local"
              value={formData.endAt}
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

        {/* Cover Images */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: "16px", border: "1px solid", borderColor: "grey.200" }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            Ảnh bìa
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Tải lên một hoặc nhiều ảnh bìa cho sự kiện (không bắt buộc)
          </Typography>
          
          {/* Image Previews */}
          {imagePreviewUrls.length > 0 && (
            <ImageList sx={{ mb: 2 }} cols={3} rowHeight={120}>
              {imagePreviewUrls.map((url, index) => (
                <ImageListItem key={index}>
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    loading="lazy"
                    style={{ height: "100%", objectFit: "cover", borderRadius: "8px" }}
                  />
                  <ImageListItemBar
                    sx={{ background: "transparent" }}
                    position="top"
                    actionIcon={
                      <IconButton
                        sx={{ color: "white", backgroundColor: "rgba(0,0,0,0.5)", m: 0.5, "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" } }}
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    }
                    actionPosition="right"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
          
          {/* Upload Button */}
          <Button
            component="label"
            variant="outlined"
            startIcon={imagePreviewUrls.length > 0 ? <Add /> : <CloudUpload />}
            sx={{ borderRadius: "9999px", textTransform: "none" }}
          >
            {imagePreviewUrls.length > 0 ? "Thêm ảnh" : "Chọn ảnh"}
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageSelect}
            />
          </Button>
        </Paper>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading || !isFormValid}
          sx={{ 
            borderRadius: "9999px", 
            textTransform: "none", 
            fontWeight: 600, 
            height: 48,
            fontSize: 16 
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
              {uploadingImages ? "Đang tải ảnh..." : "Đang tạo sự kiện..."}
            </>
          ) : (
            isAdmin ? "Tạo sự kiện" : "Gửi yêu cầu tạo sự kiện"
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

export default EventForm;
