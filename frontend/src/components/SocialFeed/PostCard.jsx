import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Comment from "./Comment";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Avatar,
  Typography,
  IconButton,
  Button,
  Box,
  Divider,
  TextField,
  Collapse,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  FavoriteBorder,
  Favorite,
  ChatBubbleOutline,
  MoreHoriz,
  Edit,
  Delete,
} from "@mui/icons-material";
import { postService, commentService, mediaService } from "../../api";
import { useAuth } from "../../context/AuthContext";

const PostCard = ({ post, onPostUpdated, onPostDeleted }) => {
  const { user, isAuthenticated } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  // API states
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  // Menu and dialog states
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);

  // Get post ID (handle both postId and id)
  const postId = post.postId || post.id;

  // Check if current user is the owner
  const isOwner = user?.username === post.ownerUsername;

  // Format timestamp helper
  const formatTimestamp = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  // Fetch post metadata
  const fetchPostMetadata = useCallback(async () => {
    if (!postId) return;
    try {
      // Fetch like count
      const likeData = await postService.getLikeCount(postId);
      setLikeCount(likeData.count || 0);

      // Fetch comment count
      const commentData = await postService.getCommentCount(postId);
      setCommentCount(commentData.count || 0);

      // Check if current user liked this post
      if (isAuthenticated) {
        try {
          const likedData = await postService.checkIsLiked(postId);
          setIsLiked(likedData.isLiked || false);
        } catch {
          // Ignore error if not liked
        }
      }

      // Fetch media
      try {
        const mediaData = await mediaService.getMediaByPost(postId);
        setMediaItems(mediaData.content || []);
      } catch {
        // No media
      }
    } catch (err) {
      console.error("Failed to fetch post metadata:", err);
    }
  }, [postId, isAuthenticated]);

  useEffect(() => {
    fetchPostMetadata();
  }, [fetchPostMetadata]);

  // Fetch comments when expanded
  const fetchComments = useCallback(async () => {
    if (!postId) return;
    setLoadingComments(true);
    try {
      const response = await postService.getComments(postId, { page: 0, size: 20 });
      setComments(response.content || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoadingComments(false);
    }
  }, [postId]);

  useEffect(() => {
    if (showComments && comments.length === 0) {
      fetchComments();
    }
  }, [showComments, fetchComments, comments.length]);

  // Handle like toggle
  const handleLike = async () => {
    if (!isAuthenticated || !user) return;
    setLoadingLike(true);
    try {
      const result = await postService.toggleLike(postId, user.accountID);
      setIsLiked(result.isLiked);
      setLikeCount(prev => result.isLiked ? prev + 1 : prev - 1);
      if (onPostUpdated) onPostUpdated();
    } catch (err) {
      console.error("Failed to toggle like:", err);
    } finally {
      setLoadingLike(false);
    }
  };

  // Handle comment submit
  const handleComment = async () => {
    if (!commentText.trim() || !isAuthenticated) return;
    setLoadingComment(true);
    try {
      const newComment = await commentService.createComment({
        postId: postId,
        content: commentText,
      });
      // Add new comment to list
      setComments(prev => [newComment, ...prev]);
      setCommentCount(prev => prev + 1);
      setCommentText("");
      if (onPostUpdated) onPostUpdated();
    } catch (err) {
      console.error("Failed to create comment:", err);
    } finally {
      setLoadingComment(false);
    }
  };

  // Handle comment deleted
  const handleCommentDeleted = () => {
    setCommentCount(prev => Math.max(0, prev - 1));
    fetchComments();
  };

  // Menu handlers
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Edit handlers
  const handleEditOpen = () => {
    setEditContent(post.content || "");
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditContent("");
  };

  const handleEditSave = async () => {
    if (!editContent.trim()) return;
    setSaving(true);
    try {
      await postService.updatePostContent(postId, editContent);
      handleEditClose();
      if (onPostUpdated) onPostUpdated();
    } catch (err) {
      console.error("Failed to update post:", err);
    } finally {
      setSaving(false);
    }
  };

  // Delete handlers
  const handleDeleteOpen = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    setSaving(true);
    try {
      await postService.deletePost(postId);
      handleDeleteClose();
      if (onPostDeleted) onPostDeleted(postId);
      if (onPostUpdated) onPostUpdated();
    } catch (err) {
      console.error("Failed to delete post:", err);
    } finally {
      setSaving(false);
    }
  };

  // Get author info (handle backend format)
  const authorName = post.ownerUsername || post.author?.name || "Người dùng";
  const authorBio = post.author?.bio || "";
  const authorAvatar = post.author?.avatar || null;
  const timestamp = formatTimestamp(post.createdAt || post.timestamp);
  const content = post.content || "";

  // Get first media item for display
  const primaryMedia = mediaItems.length > 0 ? mediaItems[0] : null;

  return (
    <>
      <Card
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "grey.200",
          mb: 2,
        }}
      >
        {/* Post Header */}
        <CardHeader
          avatar={
            <Avatar src={authorAvatar} alt={authorName}>
              {authorName.charAt(0).toUpperCase()}
            </Avatar>
          }
          action={
            isOwner && (
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreHoriz />
              </IconButton>
            )
          }
          title={
            <Typography variant="subtitle2" fontWeight={600}>
              {authorName}
            </Typography>
          }
          subheader={
            <Box>
              {authorBio && (
                <Typography variant="caption" color="text.secondary">
                  {authorBio}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                {timestamp}
              </Typography>
            </Box>
          }
          sx={{ pb: 1 }}
        />

        <Divider />

        {/* Post Content */}
        <CardContent sx={{ py: 2 }}>
          <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {content}
          </Typography>
        </CardContent>

        {/* Post Media */}
        {primaryMedia && (
          <CardMedia
            component="img"
            image={primaryMedia.url || `/api/media/download/${primaryMedia.filename}`}
            alt="Post media"
            sx={{ maxHeight: 400, objectFit: "cover" }}
          />
        )}

        {/* Stats */}
        <Box sx={{ px: 2, py: 1, display: "flex", gap: 2 }}>
          <Typography variant="caption" color="text.secondary">
            {likeCount} lượt thích
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {commentCount} bình luận
          </Typography>
        </Box>

        {/* Post Actions */}
        <CardActions sx={{ px: 2, py: 1, justifyContent: "flex-start", gap: 1 }}>
          <Button
            size="small"
            startIcon={<ChatBubbleOutline />}
            onClick={() => setShowComments(!showComments)}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              "&:hover": { backgroundColor: "grey.100" },
            }}
          >
            Bình luận
          </Button>
          <IconButton
            size="small"
            onClick={handleLike}
            disabled={!isAuthenticated || loadingLike}
            sx={{
              color: isLiked ? "error.main" : "text.secondary",
            }}
          >
            {loadingLike ? (
              <CircularProgress size={18} />
            ) : isLiked ? (
              <Favorite />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
        </CardActions>

        {/* Comments Section */}
        <Collapse in={showComments}>
          <Divider />
          <Box sx={{ p: 2 }}>
            {/* Comments List */}
            {loadingComments ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <Comment 
                  key={comment.commentId || comment.id} 
                  comment={comment}
                  postId={postId}
                  onReplyCreated={fetchComments}
                  onCommentDeleted={handleCommentDeleted}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
                Chưa có bình luận nào
              </Typography>
            )}

            {/* Write Comment */}
            {isAuthenticated && (
              <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
                <Avatar sx={{ width: 32, height: 32 }}>
                  {(user?.username || "?").charAt(0).toUpperCase()}
                </Avatar>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Viết bình luận..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleComment()}
                  disabled={loadingComment}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                      backgroundColor: "grey.50",
                    },
                  }}
                />
                {loadingComment && <CircularProgress size={20} sx={{ alignSelf: "center" }} />}
              </Box>
            )}
          </Box>
        </Collapse>
      </Card>

      {/* Menu Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleEditOpen}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Chỉnh sửa bài viết</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteOpen} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Xóa bài viết</ListItemText>
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Nội dung bài viết..."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} disabled={saving}>
            Hủy
          </Button>
          <Button 
            onClick={handleEditSave} 
            variant="contained" 
            disabled={saving || !editContent.trim()}
          >
            {saving ? <CircularProgress size={20} /> : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose}>
        <DialogTitle>Xóa bài viết?</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} disabled={saving}>
            Hủy
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={saving}
          >
            {saving ? <CircularProgress size={20} /> : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    postId: PropTypes.number,
    id: PropTypes.number,
    ownerUsername: PropTypes.string,
    author: PropTypes.shape({
      name: PropTypes.string,
      bio: PropTypes.string,
      avatar: PropTypes.string,
    }),
    content: PropTypes.string,
    createdAt: PropTypes.string,
    timestamp: PropTypes.string,
  }).isRequired,
  onPostUpdated: PropTypes.func,
  onPostDeleted: PropTypes.func,
};

export default PostCard;
