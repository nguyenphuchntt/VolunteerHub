import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "./Input";
import Avatar from "./Avatar";
import { mockUsers } from "../../data/mockData";
import "../../css/FeedHeader.css";

const MainHeader = ({ user = mockUsers[0], searchQuery = "", onSearchChange }) => {
  const navigate = useNavigate();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sync local search query with prop
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleLogoClick = () => {
    navigate("/events");
  };

  const handleProfileClick = () => {
    navigate(`/profiles/${user.username}`);
    setIsDropdownOpen(false);
  };

  const handleNotificationsClick = () => {
    console.log("Notifications clicked");
    setIsDropdownOpen(false);
  };

  const handleSettingsClick = () => {
    console.log("Settings clicked");
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/signin");
    setIsDropdownOpen(false);
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

  const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.1667 12.5C16.0555 12.7513 16.0228 13.0301 16.0727 13.3006C16.1226 13.5711 16.2528 13.8203 16.4467 14.0167L16.4917 14.0617C16.6467 14.2165 16.7695 14.4005 16.8532 14.6028C16.9369 14.8051 16.98 15.0218 16.98 15.2405C16.98 15.4592 16.9369 15.6758 16.8532 15.8781C16.7695 16.0804 16.6467 16.2645 16.4917 16.4192C16.3369 16.5742 16.1529 16.697 15.9506 16.7807C15.7483 16.8644 15.5316 16.9075 15.3129 16.9075C15.0942 16.9075 14.8776 16.8644 14.6753 16.7807C14.473 16.697 14.2889 16.5742 14.1342 16.4192L14.0892 16.3742C13.8928 16.1803 13.6436 16.0501 13.3731 16.0002C13.1026 15.9503 12.8238 15.983 12.5725 16.0942C12.3262 16.2002 12.1179 16.3771 11.975 16.6032C11.8321 16.8292 11.7612 17.0942 11.7717 17.3625V17.5C11.7717 17.942 11.5961 18.366 11.2835 18.6785C10.971 18.9911 10.547 19.1667 10.105 19.1667C9.66302 19.1667 9.23898 18.9911 8.92642 18.6785C8.61386 18.366 8.43833 17.942 8.43833 17.5V17.4292C8.42245 17.1511 8.33978 16.8812 8.19779 16.6443C8.0558 16.4073 7.85877 16.2104 7.6225 16.0717C7.37117 15.9604 7.09235 15.9277 6.82184 15.9776C6.55134 16.0275 6.30212 16.1578 6.10583 16.3517L6.06083 16.3967C5.90615 16.5516 5.72207 16.6744 5.51978 16.7582C5.31748 16.8419 5.10084 16.885 4.88213 16.885C4.66343 16.885 4.44678 16.8419 4.24449 16.7582C4.04219 16.6744 3.85811 16.5516 3.70344 16.3967C3.54845 16.242 3.42565 16.0579 3.34196 15.8556C3.25826 15.6533 3.21516 15.4367 3.21516 15.218C3.21516 14.9993 3.25826 14.7826 3.34196 14.5803C3.42565 14.378 3.54845 14.194 3.70344 14.0392L3.74844 13.9942C3.94236 13.7979 4.07256 13.5487 4.12247 13.2782C4.17239 13.0077 4.13968 12.7289 4.02844 12.4775C3.92241 12.2312 3.74553 12.0229 3.51948 11.88C3.29344 11.737 3.02845 11.6662 2.76011 11.6767H2.62511C2.18313 11.6767 1.7591 11.5011 1.44654 11.1885C1.13397 10.876 0.958447 10.4519 0.958447 10.01C0.958447 9.56799 1.13397 9.14396 1.44654 8.83139C1.7591 8.51883 2.18313 8.3433 2.62511 8.3433H2.69594C2.97399 8.32742 3.24393 8.24475 3.48088 8.10276C3.71783 7.96077 3.91486 7.76374 4.05344 7.52747C4.16468 7.27614 4.19739 6.99732 4.14748 6.72682C4.09756 6.45631 3.96736 6.20709 3.77344 6.0108L3.72844 5.9658C3.57345 5.81113 3.45065 5.62705 3.36696 5.42475C3.28326 5.22246 3.24016 5.00581 3.24016 4.78711C3.24016 4.5684 3.28326 4.35176 3.36696 4.14946C3.45065 3.94717 3.57345 3.76309 3.72844 3.60842C3.88311 3.45343 4.06719 3.33063 4.26949 3.24693C4.47178 3.16324 4.68843 3.12014 4.90713 3.12014C5.12584 3.12014 5.34248 3.16324 5.54478 3.24693C5.74707 3.33063 5.93115 3.45343 6.08583 3.60842L6.13083 3.65342C6.32712 3.84733 6.57634 3.97753 6.84684 4.02745C7.11735 4.07737 7.39617 4.04466 7.6475 3.93342H7.6925C7.93878 3.82739 8.14708 3.65051 8.29003 3.42446C8.43297 3.19842 8.50379 2.93343 8.49333 2.6651V2.53009C8.49333 2.08812 8.66885 1.66408 8.98142 1.35152C9.29398 1.03896 9.71802 0.863434 10.16 0.863434C10.602 0.863434 11.026 1.03896 11.3386 1.35152C11.6511 1.66408 11.8267 2.08812 11.8267 2.53009V2.60092C11.8371 2.86926 11.908 3.13425 12.0509 3.36029C12.1939 3.58634 12.4022 3.76322 12.6484 3.86925C12.8997 3.98049 13.1785 4.01321 13.449 3.96329C13.7195 3.91337 13.9688 3.78317 14.165 3.58925L14.21 3.54425C14.3647 3.38926 14.5488 3.26646 14.7511 3.18277C14.9534 3.09907 15.17 3.05597 15.3887 3.05597C15.6074 3.05597 15.8241 3.09907 16.0264 3.18277C16.2287 3.26646 16.4127 3.38926 16.5674 3.54425C16.7224 3.69892 16.8452 3.883 16.9289 4.0853C17.0126 4.28759 17.0557 4.50424 17.0557 4.72294C17.0557 4.94165 17.0126 5.1583 16.9289 5.36059C16.8452 5.56289 16.7224 5.74697 16.5674 5.90164L16.5224 5.94664C16.3285 6.14293 16.1983 6.39215 16.1484 6.66266C16.0985 6.93316 16.1312 7.21198 16.2424 7.46331V7.5083C16.3485 7.75459 16.5253 7.96289 16.7514 8.10583C16.9774 8.24878 17.2424 8.3196 17.5107 8.30914H17.6457C18.0877 8.30914 18.5118 8.48467 18.8243 8.79723C19.1369 9.10979 19.3124 9.53383 19.3124 9.9758C19.3124 10.4178 19.1369 10.8418 18.8243 11.1544C18.5118 11.467 18.0877 11.6425 17.6457 11.6425H17.5749C17.3066 11.653 17.0416 11.7238 16.8155 11.8667C16.5895 12.0097 16.4126 12.218 16.3066 12.4642V12.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const LogoutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3333 14.1667L17.5 10L13.3333 5.83334"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 10H7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <header className="feed-header">
      <div className="feed-header-content">
        <div className="feed-header-logo" onClick={handleLogoClick}>
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
            placeholder="Search events..."
            value={localSearchQuery}
            onChange={handleSearchChange}
            hasIcon={true}
            icon={<SearchIcon />}
          />
        </div>

        <div className="feed-header-actions">
          <div className="user-dropdown-wrapper" ref={dropdownRef}>
            <button
              className="user-avatar-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label="User menu"
            >
              <Avatar src={user.avatar} alt={user.name} size="small" />
            </button>

            {isDropdownOpen && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <Avatar src={user.avatar} alt={user.name} size="default" />
                  <div className="dropdown-user-info">
                    <span className="dropdown-user-name">{user.name}</span>
                    <span className="dropdown-user-bio">{user.bio}</span>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <div className="dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={handleProfileClick}
                  >
                    <UserIcon />
                    <span>Profile</span>
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={handleNotificationsClick}
                  >
                    <NotificationIcon />
                    <span>Notifications</span>
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={handleSettingsClick}
                  >
                    <SettingsIcon />
                    <span>Settings</span>
                  </button>
                </div>

                <div className="dropdown-divider"></div>

                <div className="dropdown-menu">
                  <button
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    <LogoutIcon />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
