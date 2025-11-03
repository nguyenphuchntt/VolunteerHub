
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Button,
  MainHeader,
  FeedFooter,
} from "../components/SocialFeed";
import ParticipatedEventCard from "../components/EventFeed/ParticipatedEventCard";
import { mockUsers } from "../data/mockData";
import { mockEvents } from "../data/mockEvents";
import "../css/Profile.css";
import "../css/FeedHeader.css";
import "../css/FeedFooter.css";

const Profile = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("History");

  const user = mockUsers.find((u) => u.username === username);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (!user) {
    return <div>User not found</div>;
  }

  const participatedEvents = mockEvents
    .map((event) => {
      const participation = event.participants.find(
        (p) => p.user.id === user.id
      );
      return participation ? { ...event, role: participation.role } : null;
    })
    .filter(Boolean);

  return (
    <div className="profile-page">
      <MainHeader user={user} />
      <div className="profile-container">
        <div className="profile-header">
          <div className="cover-image">
            <img src={user.coverImage} alt="Cover" />
          </div>
          <div className="profile-info">
            <div className="profile-avatar">
              <Avatar src={user.avatar} alt={user.name} size="large" />
            </div>
            <div className="profile-details">
              <h2 className="profile-name">{user.name}</h2>
              <p className="profile-bio">{user.bio}</p>
              <div className="profile-stats">
                <span>
                  <strong>{participatedEvents.length}</strong> Events
                </span>
                <span>
                  <strong>5.8k</strong> Followers
                </span>
                <span>
                  <strong>2.1k</strong> Following
                </span>
              </div>
            </div>
            <div className="profile-actions">
              <Button className="follow-btn" variant="primary">
                Follow
              </Button>
              <Button className="message-btn" variant="secondary">
                Message
              </Button>
            </div>
          </div>
          <div className="profile-nav">
            <div className="nav-tabs">
              {["History", "Followers"].map((tab) => (
                <button
                  key={tab}
                  className={`nav-tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="profile-content">
          {activeTab === "History" && (
            <div className="participated-events-list">
              {participatedEvents.map((event) => (
                <ParticipatedEventCard
                  key={event.id}
                  event={event}
                  role={event.role}
                />
              ))}
            </div>
          )}
          {activeTab === "Followers" && (
            <div>
              <h2>Followers</h2>
            </div>
          )}
        </div>
        <div className="load-more-container">
          <Button className="load-more-btn" variant="secondary">
            Load More
          </Button>
        </div>
      </div>
      <FeedFooter />
    </div>
  );
};

export default Profile;

