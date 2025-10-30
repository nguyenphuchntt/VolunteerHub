import React from "react";
import PropTypes from "prop-types";
import Avatar from "./Avatar";
import "../../css/ProfileNav.css";

const ProfileNav = ({ user }) => {
  const navItems = [
    { id: "home", label: "Home", icon: <HomeIcon />, active: true },
    { id: "profile", label: "Profile", icon: <UserIcon />, active: false },
    { id: "messages", label: "Messages", icon: <MessageIcon />, active: false },
    {
      id: "notifications",
      label: "Notifications",
      icon: <NotificationIcon />,
      active: false,
    },
  ];

  const handleNavClick = (itemId) => {
    console.log("Navigate to:", itemId);
  };

  return (
    <div className="profile-nav feed-card">
      <div className="profile-cover">
        <img
          src={user?.coverImage || "/images/hero-decoration.svg"}
          alt="Cover"
        />
      </div>

      <div className="profile-avatar">
        <Avatar
          src={user?.avatar || "/images/google-icon.png"}
          alt={user?.name}
          size="large"
          bordered={true}
        />
      </div>

      <div className="profile-info">
        <h3 className="profile-name">{user?.name || "Robert Fox"}</h3>
        <p className="profile-bio">{user?.bio || "Software Engineer"}</p>
      </div>

      {/* Navigation */}
      <nav className="profile-navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${item.active ? "nav-item-active" : ""}`}
            onClick={() => handleNavClick(item.id)}
          >
            <span className="nav-item-icon">{item.icon}</span>
            <span className="nav-item-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

// Icons
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M2.5 7.5L10 1.67L17.5 7.5V16.67C17.5 17.13 17.31 17.57 16.98 17.89C16.65 18.22 16.21 18.41 15.75 18.41H4.25C3.79 18.41 3.35 18.22 3.02 17.89C2.69 17.57 2.5 17.13 2.5 16.67V7.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 18.33V10H12.5V18.33"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M4 18c0-3.314 2.686-6 6-6s6 2.686 6 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const MessageIcon = () => (
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

const NotificationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M15 6.67C15 5.34 14.47 4.07 13.54 3.14C12.61 2.21 11.34 1.67 10 1.67C8.67 1.67 7.39 2.21 6.46 3.14C5.53 4.07 5 5.34 5 6.67C5 12.5 2.5 14.17 2.5 14.17H17.5C17.5 14.17 15 12.5 15 6.67Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.44 17.5C11.29 17.77 11.07 17.99 10.81 18.14C10.54 18.29 10.24 18.37 9.94 18.37C9.64 18.37 9.34 18.29 9.08 18.14C8.81 17.99 8.6 17.77 8.45 17.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

ProfileNav.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    bio: PropTypes.string,
    avatar: PropTypes.string,
    coverImage: PropTypes.string,
  }),
};

export default ProfileNav;
