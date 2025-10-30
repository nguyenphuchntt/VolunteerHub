import React, { useState } from "react";
import FeedHeader from "../components/SocialFeed/FeedHeader";
import ProfileNav from "../components/SocialFeed/ProfileNav";
import WritePost from "../components/SocialFeed/WritePost";
import PostCard from "../components/SocialFeed/PostCard";
import SuggestedFriends from "../components/SocialFeed/SuggestedFriends";
import FeedFooter from "../components/SocialFeed/FeedFooter";
import { mockUser, mockPosts, mockSuggestedFriends } from "../data/mockData";
import "../css/SocialFeed.css";

const SocialFeed = () => {
  const [posts, setPosts] = useState(mockPosts);

  const handleAddFriend = (friendId) => {
    console.log(`Adding friend with ID: ${friendId}`);
    // TODO: Implement add friend functionality when backend is ready
  };

  return (
    <div className="social-feed-container">
      <FeedHeader />

      <main className="social-feed-main">
        {/* Left Sidebar - Profile/Navigation */}
        <aside className="feed-left-sidebar">
          <ProfileNav user={mockUser} />
        </aside>

        {/* Center Content - Feed */}
        <section className="feed-center-content">
          {/* Write Post Section */}
          <WritePost currentUser={mockUser} />

          {/* Posts Feed */}
          <div className="posts-feed">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Footer */}
          <FeedFooter />
        </section>

        {/* Right Sidebar - Suggested Friends */}
        <aside className="feed-right-sidebar">
          <SuggestedFriends
            friends={mockSuggestedFriends}
            onAddFriend={handleAddFriend}
          />
        </aside>
      </main>
    </div>
  );
};

export default SocialFeed;
