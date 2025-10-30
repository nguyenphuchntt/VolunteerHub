import React, { useState } from "react";
import PropTypes from "prop-types";
import Avatar from "./Avatar";
import Input from "./Input";
import Button from "./Button";
import "../../css/WritePost.css";

const WritePost = ({ user, onPost }) => {
  const [postContent, setPostContent] = useState("");

  const handlePost = () => {
    if (postContent.trim()) {
      onPost(postContent);
      setPostContent("");
    }
  };

  const MediaIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect
        x="2.5"
        y="2.5"
        width="15"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
      <path
        d="M17.5 13.33L13.33 9.17L5.83 16.67"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="write-post feed-card">
      <div className="write-post-input">
        <Avatar
          src={user?.avatar || "/images/google-icon.png"}
          alt={user?.name}
          size="x-small"
        />
        <div className="write-post-textarea input-borderless">
          <Input
            multiline
            rows={2}
            placeholder="What's on your mind?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
        </div>
      </div>

      <div className="write-post-actions">
        <button className="add-media-btn">
          <MediaIcon />
          <span>Add Media</span>
        </button>
        <Button
          variant="primary"
          size="small"
          onClick={handlePost}
          disabled={!postContent.trim()}
        >
          Post
        </Button>
      </div>
    </div>
  );
};

WritePost.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    avatar: PropTypes.string,
  }),
  onPost: PropTypes.func,
};

export default WritePost;
