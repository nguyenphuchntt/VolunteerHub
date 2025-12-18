import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { 
  Box, 
  Avatar, 
  Typography, 
  Chip, 
  Button, 
  TextField,
  Collapse,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Reply, ExpandMore, ExpandLess, Delete } from "@mui/icons-material";
import { commentService } from "../../api";
import { useAuth } from "../../context/AuthContext";

const Comment = ({ comment, postId, onReplyCreated, onCommentDeleted, level = 0 }) => {
  const { user, isAuthenticated } = useAuth();
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [loadingReply, setLoadingReply] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const maxLevel = 3;

  // Get comment data (handle both backend and mock format)
  const commentId = comment.commentId || comment.id;
  const authorName = comment.ownerUsername || comment.author?.name || "Người dùng";
  const authorBio = comment.author?.bio || "";
  const authorAvatar = comment.author?.avatar || null;
  const content = comment.content || "";
  const createdAt = comment.createAt || comment.createdAt || comment.timestamp;
  const isAuthor = comment.isAuthor || (user && comment.ownerUsername === user.username);
  const replyCount = comment.replyCount || 0;

  // Format timestamp
  const formatTimestamp = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút`;
    if (diffHours < 24) return `${diffHours} giờ`;
    if (diffDays < 7) return `${diffDays} ngày`;
    return date.toLocaleDateString("vi-VN");
  };

  // Fetch replies
  const fetchReplies = useCallback(async () => {
    if (!commentId) return;
    setLoadingReplies(true);
    try {
      const response = await commentService.getReplies(commentId, { page: 0, size: 20 });
      setReplies(response.content || []);
    } catch (err) {
      console.error("Failed to fetch replies:", err);
    } finally {
      setLoadingReplies(false);
    }
  }, [commentId]);

  // Toggle replies visibility
  const handleToggleReplies = () => {
    if (!showReplies && replies.length === 0 && replyCount > 0) {
      fetchReplies();
    }
    setShowReplies(!showReplies);
  };

  // Submit reply
  const handleReply = async () => {
    if (!replyText.trim() || !isAuthenticated) return;
    setLoadingReply(true);
    try {
      const newReply = await commentService.createComment({
        postId: postId,
        content: replyText,
        parentCommentId: commentId,
      });
      setReplies(prev => [...prev, newReply]);
      setReplyText("");
      setShowReplyInput(false);
      setShowReplies(true);
      if (onReplyCreated) onReplyCreated();
    } catch (err) {
      console.error("Failed to create reply:", err);
    } finally {
      setLoadingReply(false);
    }
  };

  // Delete comment
  const handleDelete = async () => {
    if (!commentId) return;
    setDeleting(true);
    try {
      await commentService.deleteComment(commentId);
      if (onCommentDeleted) onCommentDeleted();
    } catch (err) {
      console.error("Failed to delete comment:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1.5, mb: 2, ml: level * 3 }}>
      <Avatar
        src={authorAvatar}
        alt={authorName}
        sx={{ width: 32, height: 32 }}
      >
        {authorName.charAt(0).toUpperCase()}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" fontWeight={600}>
                {authorName}
              </Typography>
              {isAuthor && (
                <Chip
                  label="Tác giả"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "10px",
                    backgroundColor: "primary.light",
                    color: "#fff",
                  }}
                />
              )}
            </Box>
            {authorBio && (
              <Typography variant="caption" color="text.secondary">
                {authorBio}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {formatTimestamp(createdAt)}
            </Typography>
            {isAuthor && (
              <IconButton 
                size="small" 
                onClick={handleDelete}
                disabled={deleting}
                sx={{ color: "text.secondary" }}
              >
                {deleting ? <CircularProgress size={14} /> : <Delete fontSize="small" />}
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Content */}
        <Typography variant="body2" sx={{ my: 1, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
          {content}
        </Typography>

        {/* Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isAuthenticated && level < maxLevel && (
            <Button
              size="small"
              startIcon={<Reply sx={{ fontSize: 14 }} />}
              onClick={() => setShowReplyInput(!showReplyInput)}
              sx={{
                minWidth: "auto",
                p: 0,
                color: "text.secondary",
                fontSize: "12px",
                textTransform: "none",
                "&:hover": { backgroundColor: "transparent", color: "primary.main" },
              }}
            >
              Trả lời
            </Button>
          )}
          
          {(replyCount > 0 || replies.length > 0) && (
            <Button
              size="small"
              startIcon={showReplies ? <ExpandLess sx={{ fontSize: 14 }} /> : <ExpandMore sx={{ fontSize: 14 }} />}
              onClick={handleToggleReplies}
              sx={{
                minWidth: "auto",
                p: 0,
                color: "primary.main",
                fontSize: "12px",
                textTransform: "none",
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              {showReplies ? "Ẩn" : `${replyCount || replies.length} phản hồi`}
            </Button>
          )}
        </Box>

        {/* Reply Input */}
        <Collapse in={showReplyInput}>
          <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
              {(user?.username || "?").charAt(0).toUpperCase()}
            </Avatar>
            <TextField
              fullWidth
              size="small"
              placeholder="Viết phản hồi..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleReply()}
              disabled={loadingReply}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  backgroundColor: "grey.50",
                  "& input": { py: 1, fontSize: "0.875rem" },
                },
              }}
            />
            {loadingReply && <CircularProgress size={20} sx={{ alignSelf: "center" }} />}
          </Box>
        </Collapse>

        {/* Replies List */}
        <Collapse in={showReplies}>
          <Box sx={{ mt: 2 }}>
            {loadingReplies ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
                <CircularProgress size={20} />
              </Box>
            ) : (
              replies.map((reply) => (
                <Comment
                  key={reply.commentId || reply.id}
                  comment={reply}
                  postId={postId}
                  level={level + 1}
                  onReplyCreated={fetchReplies}
                  onCommentDeleted={fetchReplies}
                />
              ))
            )}
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    commentId: PropTypes.number,
    id: PropTypes.number,
    ownerUsername: PropTypes.string,
    author: PropTypes.shape({
      name: PropTypes.string,
      bio: PropTypes.string,
      avatar: PropTypes.string,
    }),
    content: PropTypes.string,
    createAt: PropTypes.string,
    createdAt: PropTypes.string,
    timestamp: PropTypes.string,
    isAuthor: PropTypes.bool,
    replyCount: PropTypes.number,
  }).isRequired,
  postId: PropTypes.number,
  onReplyCreated: PropTypes.func,
  onCommentDeleted: PropTypes.func,
  level: PropTypes.number,
};

export default Comment;
