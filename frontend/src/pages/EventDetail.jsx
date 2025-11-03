import React, { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { EventDetailBanner } from "../components/EventFeed";
import MainHeader from "../components/SocialFeed/MainHeader";
import WritePost from "../components/SocialFeed/WritePost";
import PostCard from "../components/SocialFeed/PostCard";
import { mockEvents, getEventPosts } from "../data/mockEvents";
import { mockUsers } from "../data/mockData";
import "../css/EventDetail.css";

const EventDetail = () => {
  const { eventId } = useParams();
  const [activeTab, setActiveTab] = useState("feed");

  // Find the event
  const event = mockEvents.find((e) => e.id === parseInt(eventId));

  // Get event-specific posts
  const eventPosts = getEventPosts(parseInt(eventId));
  const [posts, setPosts] = useState(eventPosts);

  // If event not found, redirect to events page
  if (!event) {
    return <Navigate to="/events" replace />;
  }

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleComment = (postId, commentText) => {
    const newComment = {
      id: Date.now(),
      author: mockUsers[0],
      content: commentText,
      timestamp: "Just now",
      isAuthor: true,
    };

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
  };

  const tabs = [
    { id: "feed", name: "Feed", icon: "💬" },
    { id: "about", name: "About", icon: "ℹ️" },
    { id: "participants", name: "Participants", icon: "👥" },
    { id: "photos", name: "Photos", icon: "📸" },
  ];

  return (
    <div className="event-detail-page">
      <MainHeader />
      <EventDetailBanner event={event} />

      <main className="event-detail-main">
        <div className="event-detail-container">
          {/* Tabs Navigation */}
          <div className="event-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`event-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-name">{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Feed Tab */}
            {activeTab === "feed" && (
              <div className="feed-tab">
                <div className="feed-content">
                  {/* Write Post Section */}
                  <WritePost currentUser={mockUsers[0]} />

                  {/* Posts Feed */}
                  <div className="posts-feed">
                    {posts.length > 0 ? (
                      posts.map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          onLike={handleLike}
                          onComment={handleComment}
                        />
                      ))
                    ) : (
                      <div className="no-posts">
                        <div className="no-posts-icon">💬</div>
                        <h3>No posts yet</h3>
                        <p>Be the first to share something about this event!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Event Sidebar */}
                <aside className="event-sidebar">
                  <div className="sidebar-card">
                    <h3 className="sidebar-title">Event Details</h3>
                    <div className="sidebar-content">
                      <div className="detail-row">
                        <span className="detail-label">Category:</span>
                        <span className="detail-value">{event.category}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Status:</span>
                        <span className={`detail-value status-${event.status}`}>
                          {event.status.charAt(0).toUpperCase() +
                            event.status.slice(1)}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Participants:</span>
                        <span className="detail-value">
                          {event.participants.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sidebar-card">
                    <h3 className="sidebar-title">Tags</h3>
                    <div className="sidebar-tags">
                      {event.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>
            )}

            {/* About Tab */}
            {activeTab === "about" && (
              <div className="about-tab">
                <div className="about-content">
                  <h2>About This Event</h2>
                  <p>{event.fullDescription || event.description}</p>

                  <h3>What to Expect</h3>
                  <ul>
                    <li>
                      Meet like-minded volunteers passionate about making a
                      difference
                    </li>
                    <li>Hands-on activities that create real impact</li>
                    <li>
                      Professional guidance and all necessary supplies provided
                    </li>
                    <li>Opportunity to develop new skills and connections</li>
                  </ul>

                  <h3>What to Bring</h3>
                  <ul>
                    <li>Comfortable clothing appropriate for the activity</li>
                    <li>Water bottle to stay hydrated</li>
                    <li>Sunscreen and hat (for outdoor events)</li>
                    <li>Positive attitude and willingness to help!</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Participants Tab */}
            {activeTab === "participants" && (
              <div className="participants-tab">
                <h2>Participants ({event.participants.length})</h2>
                <div className="participants-grid">
                  {event.participants.map((participant) => (
                    <div key={participant.user.id} className="participant-card">
                      <img src={participant.user.avatar} alt={participant.user.name} />
                      <span>{participant.user.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photos Tab */}
            {activeTab === "photos" && (
              <div className="photos-tab">
                <h2>Event Photos</h2>
                <div className="photos-grid">
                  <div className="photo-placeholder">
                    <span>📸</span>
                    <p>Photos will be added soon</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetail;
