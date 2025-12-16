import PropTypes from "prop-types";
import { Box, Avatar, Typography, Chip, Button } from "@mui/material";

const Comment = ({ comment }) => {
  return (
    <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
      <Avatar
        src={comment.author.avatar}
        alt={comment.author.name}
        sx={{ width: 32, height: 32 }}
      />
      <Box sx={{ flex: 1 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" fontWeight={600}>
                {comment.author.name}
              </Typography>
              {comment.isAuthor && (
                <Chip
                  label="Author"
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
            <Typography variant="caption" color="text.secondary">
              {comment.author.bio}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {comment.timestamp}
          </Typography>
        </Box>

        {/* Content */}
        <Typography variant="body2" sx={{ my: 1, lineHeight: 1.5 }}>
          {comment.content}
        </Typography>

        {/* Actions */}
        <Button
          size="small"
          sx={{
            minWidth: "auto",
            p: 0,
            color: "text.secondary",
            fontSize: "12px",
            "&:hover": { backgroundColor: "transparent", color: "primary.main" },
          }}
        >
          Reply
        </Button>
      </Box>
    </Box>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    author: PropTypes.shape({
      name: PropTypes.string.isRequired,
      bio: PropTypes.string,
      avatar: PropTypes.string,
    }).isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    isAuthor: PropTypes.bool,
  }).isRequired,
};

export default Comment;

