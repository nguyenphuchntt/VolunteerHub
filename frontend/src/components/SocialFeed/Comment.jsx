import React from "react";
import PropTypes from "prop-types";
import Avatar from "./Avatar";
import "../../css/Comment.css";

const Comment = ({ comment }) => {
  return (
    <div className="comment">
      <div className="comment-header">
        <div className="comment-author">
          <Avatar
            src={comment.author.avatar}
            alt={comment.author.name}
            size="small"
          />
          <div className="comment-author-info">
            <div className="comment-author-name-badge">
              <h5 className="comment-author-name">{comment.author.name}</h5>
              {comment.isAuthor && <span className="author-badge">Author</span>}
            </div>
            <p className="comment-author-bio">{comment.author.bio}</p>
          </div>
        </div>
        <span className="comment-timestamp">{comment.timestamp}</span>
      </div>

      <p className="comment-text">{comment.content}</p>

      <div className="comment-actions">
        <button className="comment-reply-btn">Reply</button>
      </div>
    </div>
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
