import { useState } from "react";
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
} from "@mui/material";
import {
  FavoriteBorder,
  Favorite,
  ChatBubbleOutline,
  MoreHoriz,
} from "@mui/icons-material";

const PostCard = ({ post, onLike, onComment }) => {
  const [showComments, setShowComments] = useState(post.comments.length > 0);
  const [commentText, setCommentText] = useState("");

  const handleComment = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText("");
    }
  };

  return (
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
          <Avatar src={post.author.avatar} alt={post.author.name} />
        }
        action={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton size="small">
              <MoreHoriz />
            </IconButton>
          </Box>
        }
        title={
          <Typography variant="subtitle2" fontWeight={600}>
            {post.author.name}
          </Typography>
        }
        subheader={
          <Box>
            <Typography variant="caption" color="text.secondary">
              {post.author.bio}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
              {post.timestamp}
            </Typography>
          </Box>
        }
        sx={{ pb: 1 }}
      />

      <Divider />

      {/* Post Content */}
      <CardContent sx={{ py: 2 }}>
        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
          {post.content}
        </Typography>
      </CardContent>

      {/* Post Media */}
      {post.media && (
        <CardMedia
          component="img"
          image={post.media}
          alt="Post media"
          sx={{ maxHeight: 400, objectFit: "cover" }}
        />
      )}

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
          Comment
        </Button>
        <IconButton
          size="small"
          onClick={() => onLike(post.id)}
          sx={{
            color: post.isLiked ? "error.main" : "text.secondary",
          }}
        >
          {post.isLiked ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
      </CardActions>

      {/* Comments Section */}
      <Collapse in={showComments}>
        <Divider />
        <Box sx={{ p: 2 }}>
          {/* Comments List */}
          {post.comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}

          {/* Write Comment */}
          <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
            <Avatar
              src="https://i.pravatar.cc/150?img=12"
              sx={{ width: 32, height: 32 }}
            />
            <TextField
              fullWidth
              size="small"
              placeholder="Share your thoughts here..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleComment()}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  backgroundColor: "grey.50",
                },
              }}
            />
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    author: PropTypes.shape({
      name: PropTypes.string.isRequired,
      bio: PropTypes.string,
      avatar: PropTypes.string,
    }).isRequired,
    content: PropTypes.string.isRequired,
    media: PropTypes.string,
    timestamp: PropTypes.string.isRequired,
    likes: PropTypes.number,
    isLiked: PropTypes.bool,
    comments: PropTypes.array,
  }).isRequired,
  onLike: PropTypes.func,
  onComment: PropTypes.func,
};

export default PostCard;

