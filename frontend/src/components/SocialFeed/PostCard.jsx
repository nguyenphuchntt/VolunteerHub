import React, { useState } from "react";
import PropTypes from "prop-types";
import Avatar from "./Avatar";
import Comment from "./Comment";
import "../../css/PostCard.css";

const PostCard = ({ post, onLike, onComment }) => {
  const [showComments, setShowComments] = useState(post.comments.length > 0);
  const [commentText, setCommentText] = useState("");

  const handleComment = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText("");
    }
  };

  const LikeIcon = ({ filled }) => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
    >
      <path
        d="M17.37 3.66C16.96 3.25 16.48 2.92 15.94 2.68C15.41 2.44 14.84 2.32 14.26 2.32C13.68 2.32 13.11 2.44 12.58 2.68C12.04 2.92 11.56 3.25 11.15 3.66L10 4.81L8.85 3.66C8.03 2.84 6.92 2.38 5.74 2.38C4.56 2.38 3.45 2.84 2.63 3.66C1.81 4.48 1.35 5.59 1.35 6.77C1.35 7.95 1.81 9.06 2.63 9.88L3.78 11.03L10 17.25L16.22 11.03L17.37 9.88C17.78 9.47 18.11 8.99 18.35 8.45C18.59 7.92 18.71 7.35 18.71 6.77C18.71 6.19 18.59 5.62 18.35 5.08C18.11 4.55 17.78 4.07 17.37 3.66Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const CommentIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M17.5 12.5C17.5 13 17.31 13.46 16.98 13.79C16.65 14.12 16.21 14.31 15.75 14.31H5.83L2.5 17.64V4.31C2.5 3.85 2.69 3.41 3.02 3.08C3.35 2.75 3.79 2.56 4.25 2.56H15.75C16.21 2.56 16.65 2.75 16.98 3.08C17.31 3.41 17.5 3.85 17.5 4.31V12.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const MoreIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="1.5" fill="currentColor" />
      <circle cx="15" cy="10" r="1.5" fill="currentColor" />
      <circle cx="5" cy="10" r="1.5" fill="currentColor" />
    </svg>
  );

  return (
    <div className="post-card feed-card">
      {/* Post Header */}
      <div className="post-header">
        <div className="post-author">
          <Avatar
            src={post.author.avatar}
            alt={post.author.name}
            size="default"
          />
          <div className="post-author-info">
            <h4 className="post-author-name">{post.author.name}</h4>
            <p className="post-author-bio">{post.author.bio}</p>
          </div>
        </div>
        <div className="post-meta">
          <button className="post-more-btn">
            <MoreIcon />
          </button>
          <span className="post-timestamp">{post.timestamp}</span>
        </div>
      </div>

      <div className="post-divider" />

      {/* Post Content */}
      <div className="post-content">
        <p className="post-text">{post.content}</p>
        {post.media && (
          <div className="post-media">
            <img src={post.media} alt="Post media" />
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="post-actions">
        <button
          className="post-action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <CommentIcon />
          <span>Comment</span>
        </button>
        <button
          className={`post-action-btn ${post.isLiked ? "liked" : ""}`}
          onClick={() => onLike(post.id)}
        >
          <LikeIcon filled={post.isLiked} />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="post-comments">
          <div className="comments-list">
            {post.comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>

          {/* Write Comment */}
          <div className="write-comment">
            <Avatar src="https://i.pravatar.cc/150?img=12" size="small" />
            <div className="write-comment-input">
              <input
                type="text"
                placeholder="Share your thoughts here..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleComment()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
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
