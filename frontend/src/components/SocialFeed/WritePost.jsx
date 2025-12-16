import { useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Box,
  Avatar,
  TextField,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import { Image } from "@mui/icons-material";

const WritePost = ({ currentUser, onPost }) => {
  const [postContent, setPostContent] = useState("");

  const handlePost = () => {
    if (postContent.trim()) {
      onPost(postContent);
      setPostContent("");
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
      {/* Input Area */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Avatar
          src={currentUser?.avatar || "/images/google-icon.png"}
          alt={currentUser?.name}
          sx={{ width: 40, height: 40 }}
        />
        <TextField
          fullWidth
          multiline
          rows={2}
          placeholder="What's on your mind?"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
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

      {/* Actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button
          startIcon={<Image />}
          sx={{
            color: "text.secondary",
            textTransform: "none",
            "&:hover": { backgroundColor: "grey.100" },
          }}
        >
          Add Media
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handlePost}
          disabled={!postContent.trim()}
          sx={{
            borderRadius: "20px",
            px: 3,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Post
        </Button>
      </Box>
    </Card>
  );
};

WritePost.propTypes = {
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    avatar: PropTypes.string,
  }),
  onPost: PropTypes.func,
};

export default WritePost;

