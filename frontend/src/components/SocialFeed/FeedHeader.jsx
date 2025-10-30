import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "./Input";
import "../../css/FeedHeader.css";

const FeedHeader = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logging out...");
    navigate("/signin");
  };

  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M13.5 13.5L17 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
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

  return (
    <header className="feed-header">
      <div className="feed-header-content">
        <div className="feed-header-logo">
          <img
            src="/images/logo.png"
            alt="VolunteerHub"
            className="logo-icon"
          />
          <span className="logo-text">VolunteerHub</span>
        </div>

        <div className="feed-header-search">
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            hasIcon={true}
            icon={<SearchIcon />}
          />
        </div>

        <div className="feed-header-actions">
          <button className="header-action-btn" onClick={handleLogout}>
            <span className="action-text">Logout</span>
          </button>
          <button className="header-action-btn">
            <UserIcon />
          </button>
        </div>
      </div>
    </header>
  );
};

export default FeedHeader;
