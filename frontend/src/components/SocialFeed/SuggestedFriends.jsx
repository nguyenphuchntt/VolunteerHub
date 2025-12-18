import React from "react";
import PropTypes from "prop-types";
import Avatar from "./Avatar";
import "../../css/SuggestedFriends.css";

const SuggestedFriends = ({ friends, onAddFriend }) => {
  const AddIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 4.17V15.83"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.17 10H15.83"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="suggested-friends feed-card">
      <div className="suggested-friends-divider" />
      <h3 className="suggested-friends-title">Suggested Friends</h3>

      <div className="friends-list">
        {friends.map((friend) => (
          <div key={friend.id} className="friend-item">
            <div className="friend-info">
              <Avatar src={friend.avatar} alt={friend.name} size="default" />
              <div className="friend-details">
                <h4 className="friend-name">{friend.name}</h4>
                <p className="friend-bio">{friend.bio}</p>
              </div>
            </div>
            <button
              className="add-friend-btn"
              onClick={() => onAddFriend(friend.id)}
              aria-label={`Add ${friend.name}`}
            >
              <AddIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

SuggestedFriends.propTypes = {
  friends: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      bio: PropTypes.string,
      avatar: PropTypes.string,
    })
  ).isRequired,
  onAddFriend: PropTypes.func,
};

export default SuggestedFriends;
