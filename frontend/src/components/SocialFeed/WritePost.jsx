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
  const [selectedFiles, setSelectedFiles] = useState([]); // Array of files
  const [previewUrls, setPreviewUrls] = useState([]); // Array of preview URLs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_FILES = 10; // Maximum number of files

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Check total count
    const totalCount = selectedFiles.length + files.length;
    if (totalCount > MAX_FILES) {
      setError(`Tối đa ${MAX_FILES} files. Bạn đã chọn ${selectedFiles.length}, thêm ${files.length} sẽ vượt quá.`);
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
    const validFiles = [];
    const newPreviews = [];

    for (const file of files) {
      // Validate file type
      if (!validTypes.includes(file.type)) {
        setError(`File "${file.name}" không hỗ trợ. Chỉ hỗ trợ ảnh (JPEG, PNG, GIF, WebP) hoặc video (MP4, WebM)`);
        continue;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError(`File "${file.name}" vượt quá 10MB`);
        continue;
      }
      validFiles.push(file);
      newPreviews.push({ url: URL.createObjectURL(file), type: file.type });
    }

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      setPreviewUrls(prev => [...prev, ...newPreviews]);
      if (validFiles.length === files.length) {
        setError(null);
      }
    }
  };

  const handleRemoveFile = (index) => {
    // Revoke the preview URL to free memory
    URL.revokeObjectURL(previewUrls[index].url);
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveAllFiles = () => {
    previewUrls.forEach(p => URL.revokeObjectURL(p.url));
    setSelectedFiles([]);
    setPreviewUrls([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePost = async () => {
    if (!postContent.trim() && selectedFiles.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Step 1: Create the post
      const postData = {
        content: postContent,
        eventId: eventId,
        postType: "DISCUSSION",
        createByAccountId: currentUser?.accountID, 
      };
      
      console.log("Creating post with data:", postData);
      
      const newPost = await postService.createPost(postData);
      
      // Step 2: Upload all media files
      if (selectedFiles.length > 0 && newPost.postId) {
        const uploadPromises = selectedFiles.map(file => 
          mediaService.uploadPostMedia(file, newPost.postId).catch(err => {
            console.error(`Failed to upload ${file.name}:`, err);
            return null; // Continue with other files
          })
        );
        await Promise.all(uploadPromises);
      }
      
      // Reset form
      setPostContent("");
      handleRemoveAllFiles();
      
      // Notify parent component
      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (err) {
      console.error("Failed to create post:", err);
      console.error("Error response:", err.response?.data);
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
          src={currentUser?.avatar}
          alt={currentUser?.name || currentUser?.username}
          sx={{ 
            width: 40, 
            height: 40,
            bgcolor: !currentUser?.avatar ? "primary.main" : undefined,
          }}
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

      {/* Media Previews - Grid Layout */}
      {previewUrls.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {selectedFiles.length} file(s) đã chọn
            </Typography>
            <Button size="small" color="error" onClick={handleRemoveAllFiles}>
              Xóa tất cả
            </Button>
          </Box>
          <Box 
            sx={{ 
              display: "grid", 
              gridTemplateColumns: previewUrls.length === 1 ? "1fr" : "repeat(auto-fill, minmax(100px, 1fr))",
              gap: 1,
            }}
          >
            {previewUrls.map((preview, index) => (
              <Box key={index} sx={{ position: "relative", aspectRatio: "1", overflow: "hidden", borderRadius: "8px" }}>
                {preview.type.startsWith("video/") ? (
                  <video
                    src={preview.url}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Box
                    component="img"
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
                <IconButton
                  size="small"
                  onClick={() => handleRemoveFile(index)}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    padding: 0.5,
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
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
            multiple
            style={{ display: "none" }}
          />
          <Button
            startIcon={<Image />}
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || selectedFiles.length >= MAX_FILES}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              "&:hover": { backgroundColor: "grey.100" },
            }}
          >
            Thêm Media {selectedFiles.length > 0 && `(${selectedFiles.length}/${MAX_FILES})`}
          </Button>
        </Box>
        <Button
          variant="contained"
          size="small"
          onClick={handlePost}
          disabled={loading || (!postContent.trim() && selectedFiles.length === 0)}
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

