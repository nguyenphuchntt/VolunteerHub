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
import { eventService, mediaService } from "../../api";
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({ open: true, message: "Kích thước tệp quá lớn (tối đa 5MB)", severity: "error" });
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);
      
    // Cleanup previous object URL to avoid memory leaks
    return () => URL.revokeObjectURL(objectUrl);
  };
  
  // Cleanup preview URL on unmount or new selection
  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  // Existing coverImage logic remains for "Edit" mode initial display or if we choose not to change it.
  // Display priority: filePreview (new selection) > formData.coverImage (existing)

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
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
        // coverImage field is no longer sent in create/update payload directly, handled via separate upload
      };

      // Rename maxParticipants to attendeeCount for API compatibility if needed
      if (eventData.maxParticipants !== null) {
        eventData.attendeeCount = eventData.maxParticipants;
        delete eventData.maxParticipants;
      }

      let eventIdToUse = eventId;

      if (isEdit) {
        await eventService.updateEvent(eventId, eventData);
        setSnackbar({ open: true, message: "Cập nhật thông tin sự kiện thành công!", severity: "success" });
      } else {
        const newEvent = await eventService.registerEvent(eventData);
        eventIdToUse = newEvent.eventId;
        setSnackbar({ open: true, message: "Tạo sự kiện thành công!", severity: "success" });
      }

      // Step 2: Upload image if selected
      if (selectedFile && eventIdToUse) {
        setUploading(true); // Re-use uploading state for UI feedback
        try {
          await mediaService.uploadEventMedia(selectedFile, eventIdToUse);
          setSnackbar(prev => ({ ...prev, message: prev.message + " Đã tải ảnh bìa lên." }));
        } catch (uploadErr) {
          console.error("Image upload failed:", uploadErr);
          setSnackbar(prev => ({ 
            ...prev, 
            severity: "warning",
            message: prev.message + " Tuy nhiên, tải ảnh lỗi. Vui lòng cập nhật lại." 
          }));
        } finally {
            setUploading(false);
        }
      }
      
      // Navigate after short delay
      setTimeout(() => navigate("/manage/events"), 1500);
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

            <Box sx={{ mb: 3 }}>
              <InputLabel sx={{ mb: 1 }}>Ảnh bìa sự kiện</InputLabel>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box 
                  sx={{ 
                    position: "relative",
                    width: 200, 
                    height: 120, 
                    borderRadius: "12px", 
                    overflow: "hidden",
                    border: "1px dashed",
                    borderColor: "grey.300",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "grey.50",
                  }}
                >
                  {(filePreview || formData.coverImage) ? (
                    <Box
                      component="img"
                      src={filePreview || formData.coverImage}
                      alt="Cover preview"
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <ImageIcon sx={{ color: "grey.400", fontSize: 40 }} />
                  )}
                  
                  {uploading && (
                    <Box 
                      sx={{ 
                        position: "absolute", 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0, 
                        backgroundColor: "rgba(255,255,255,0.7)", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center" 
                      }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  )}
                </Box>
                
                <Box>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<ImageIcon />}
                    disabled={uploading}
                    sx={{ mb: 1, textTransform: "none", borderRadius: "8px" }}
                  >
                    Chọn ảnh
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                  </Button>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Hỗ trợ định dạng JPG, PNG. Kích thước tối đa 5MB.
                  </Typography>
                </Box>
              </Box>
              {errors.coverImage && <FormHelperText error>{errors.coverImage}</FormHelperText>}
            </Box>

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
