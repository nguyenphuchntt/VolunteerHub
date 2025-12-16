import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { Save, ArrowBack, Image as ImageIcon } from "@mui/icons-material";
import { ThreeColumnLayout } from "../../components/common";
import { mockEvents, eventCategories } from "../../data/mockEvents";
import { mockUsers } from "../../data/mockData";
import * as yup from "yup";

const eventSchema = yup.object().shape({
  title: yup.string().required("Tên sự kiện là bắt buộc").min(5, "Tên phải có ít nhất 5 ký tự"),
  description: yup.string().required("Mô tả là bắt buộc").min(20, "Mô tả phải có ít nhất 20 ký tự"),
  date: yup.string().required("Ngày là bắt buộc"),
  location: yup.string().required("Địa điểm là bắt buộc"),
  category: yup.string().required("Danh mục là bắt buộc"),
});

const EventForm = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const user = mockUsers[0];
  const isEdit = !!eventId;
  const existingEvent = isEdit ? mockEvents.find((e) => e.id === parseInt(eventId)) : null;

  const [formData, setFormData] = useState({
    title: existingEvent?.title || "",
    description: existingEvent?.description || "",
    date: existingEvent?.date || "",
    time: existingEvent?.time || "",
    location: existingEvent?.location || "",
    category: existingEvent?.category || "",
    coverImage: existingEvent?.coverImage || "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const validateForm = async () => {
    try {
      await eventSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((error) => (newErrors[error.path] = error.message));
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const isValid = await validateForm();
    if (!isValid) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/manage/events");
    } catch (err) {
      setSubmitError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const categories = eventCategories.filter((c) => c.id !== "all");

  return (
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
            rows={3}
            sx={{ mb: 2 }}
          />

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ngày"
                type="date"
                value={formData.date}
                onChange={handleChange("date")}
                error={!!errors.date}
                helperText={errors.date}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Giờ"
                type="time"
                value={formData.time}
                onChange={handleChange("time")}
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

          <FormControl fullWidth error={!!errors.category} sx={{ mb: 2 }}>
            <InputLabel>Danh mục</InputLabel>
            <Select value={formData.category} onChange={handleChange("category")} label="Danh mục">
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.name}>{cat.icon} {cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="URL ảnh bìa"
            value={formData.coverImage}
            onChange={handleChange("coverImage")}
            sx={{ mb: 3 }}
            InputProps={{ startAdornment: <ImageIcon sx={{ mr: 1, color: "grey.500" }} /> }}
          />

          {formData.coverImage && (
            <Box
              component="img"
              src={formData.coverImage}
              alt="Cover preview"
              sx={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: "12px", mb: 3 }}
            />
          )}

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={() => navigate("/manage/events")} disabled={loading} sx={{ borderRadius: "9999px", textTransform: "none" }}>
              Hủy
            </Button>
            <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading} sx={{ borderRadius: "9999px", textTransform: "none", fontWeight: 600 }}>
              {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo sự kiện"}
            </Button>
          </Box>
        </form>
      </Box>
    </ThreeColumnLayout>
  );
};

export default EventForm;
