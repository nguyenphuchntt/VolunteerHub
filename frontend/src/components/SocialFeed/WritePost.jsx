import { useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Box,
  Avatar,
  TextField,
  Button,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Image, Close } from "@mui/icons-material";
import { postService, mediaService } from "../../api";

const WritePost = ({ currentUser, eventId, onPostCreated }) => {
  const [postContent, setPostContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type (images and videos)
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
      if (!validTypes.includes(file.type)) {
        setError("Chỉ hỗ trợ file ảnh (JPEG, PNG, GIF, WebP) hoặc video (MP4, WebM)");
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("File không được vượt quá 10MB");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePost = async () => {
    if (!postContent.trim() && !selectedFile) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Step 1: Create the post
      const postData = {
        content: postContent,
        eventId: eventId,
        postType: "DISCUSSION", // Use postType enum (DISCUSSION, ANNOUNCEMENT, etc.)
        createByAccountId: currentUser?.accountID, 
      };
      
      console.log("Creating post with data:", postData); // Debug log
      
      const newPost = await postService.createPost(postData);
      
      // Step 2: Upload media if selected
      if (selectedFile && newPost.postId) {
        try {
          await mediaService.uploadPostMedia(selectedFile, newPost.postId);
        } catch (mediaError) {
          console.error("Failed to upload media:", mediaError);
          // Post was created, but media failed - still notify success with warning
        }
      }
      
      // Reset form
      setPostContent("");
      handleRemoveFile();
      
      // Notify parent component
      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (err) {
      console.error("Failed to create post:", err);
      console.error("Error response:", err.response?.data); // Debug log
      setError(err.response?.data?.message || err.response?.data?.error || "Không thể đăng bài. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid",
        borderColor: "grey.200",
        p: 2,
        mb: 2,
      }}
    >
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Input Area */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Avatar
          src={currentUser?.avatar || "/images/google-icon.png"}
          alt={currentUser?.name || currentUser?.username}
          sx={{ width: 40, height: 40 }}
        >
          {(currentUser?.username || "?").charAt(0).toUpperCase()}
        </Avatar>
        <TextField
          fullWidth
          multiline
          rows={2}
          placeholder="Chia sẻ suy nghĩ của bạn..."
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          disabled={loading}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "grey.50",
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: "grey.300",
              },
              "&.Mui-focused fieldset": {
                borderColor: "primary.main",
              },
            },
          }}
        />
      </Box>

      {/* Media Preview */}
      {previewUrl && (
        <Box sx={{ position: "relative", mb: 2 }}>
          {selectedFile?.type.startsWith("video/") ? (
            <video
              src={previewUrl}
              controls
              style={{
                width: "100%",
                maxHeight: 300,
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />
          ) : (
            <Box
              component="img"
              src={previewUrl}
              alt="Preview"
              sx={{
                width: "100%",
                maxHeight: 300,
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />
          )}
          <IconButton
            size="small"
            onClick={handleRemoveFile}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              color: "white",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,video/*"
            style={{ display: "none" }}
          />
          <Button
            startIcon={<Image />}
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              "&:hover": { backgroundColor: "grey.100" },
            }}
          >
            Thêm Media
          </Button>
        </Box>
        <Button
          variant="contained"
          size="small"
          onClick={handlePost}
          disabled={loading || (!postContent.trim() && !selectedFile)}
          sx={{
            borderRadius: "20px",
            px: 3,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Đăng"}
        </Button>
      </Box>
    </Card>
  );
};

WritePost.propTypes = {
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    username: PropTypes.string,
    avatar: PropTypes.string,
  }),
  eventId: PropTypes.number,
  onPostCreated: PropTypes.func,
};

export default WritePost;
