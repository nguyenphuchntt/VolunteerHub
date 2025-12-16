import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { EventDetailBanner } from "../components/EventFeed";
import MainHeader from "../components/SocialFeed/MainHeader";
import WritePost from "../components/SocialFeed/WritePost";
import PostCard from "../components/SocialFeed/PostCard";
import { mockEvents, getEventPosts } from "../data/mockEvents";
import { mockUsers } from "../data/mockData";
import {
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Avatar,
} from "@mui/material";
import {
  Forum,
  Info,
  People,
  PhotoLibrary,
} from "@mui/icons-material";

const EventDetail = () => {
  const { eventId } = useParams();
  const [activeTab, setActiveTab] = useState(0);

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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
      <MainHeader />
      <EventDetailBanner event={event} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Tabs Navigation */}
        <Card sx={{ borderRadius: "16px", mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "14px",
                minHeight: 56,
              },
            }}
          >
            <Tab icon={<Forum />} iconPosition="start" label="Feed" />
            <Tab icon={<Info />} iconPosition="start" label="About" />
            <Tab icon={<People />} iconPosition="start" label="Participants" />
            <Tab icon={<PhotoLibrary />} iconPosition="start" label="Photos" />
          </Tabs>
        </Card>

        {/* Tab Content */}
        {/* Feed Tab */}
        {activeTab === 0 && (
          <Box sx={{ display: "flex", gap: 3 }}>
            {/* Main Feed */}
            <Box sx={{ flex: 1 }}>
              <WritePost currentUser={mockUsers[0]} />
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
                <Card sx={{ borderRadius: "16px", textAlign: "center", py: 6 }}>
                  <Typography variant="h2" sx={{ mb: 2 }}>💬</Typography>
                  <Typography variant="h6" fontWeight={600}>No posts yet</Typography>
                  <Typography color="text.secondary">
                    Be the first to share something about this event!
                  </Typography>
                </Card>
              )}
            </Box>

            {/* Sidebar */}
            <Box sx={{ width: 300, display: { xs: "none", md: "block" } }}>
              <Card sx={{ borderRadius: "16px", mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                    Event Details
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">Category:</Typography>
                      <Typography variant="body2" fontWeight={500}>{event.category}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">Status:</Typography>
                      <Chip label={event.status} size="small" color="primary" />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">Participants:</Typography>
                      <Typography variant="body2" fontWeight={500}>{event.participants.length}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: "16px" }}>
                <CardContent>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                    Tags
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {event.tags.map((tag, index) => (
                      <Chip key={index} label={`#${tag}`} size="small" variant="outlined" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}

        {/* About Tab */}
        {activeTab === 1 && (
          <Card sx={{ borderRadius: "16px" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                About This Event
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                {event.fullDescription || event.description}
              </Typography>

              <Typography variant="h6" fontWeight={600} sx={{ mb: 1.5 }}>
                What to Expect
              </Typography>
              <Box component="ul" sx={{ pl: 2, mb: 3 }}>
                <li>Meet like-minded volunteers passionate about making a difference</li>
                <li>Hands-on activities that create real impact</li>
                <li>Professional guidance and all necessary supplies provided</li>
                <li>Opportunity to develop new skills and connections</li>
              </Box>

              <Typography variant="h6" fontWeight={600} sx={{ mb: 1.5 }}>
                What to Bring
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <li>Comfortable clothing appropriate for the activity</li>
                <li>Water bottle to stay hydrated</li>
                <li>Sunscreen and hat (for outdoor events)</li>
                <li>Positive attitude and willingness to help!</li>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Participants Tab */}
        {activeTab === 2 && (
          <Card sx={{ borderRadius: "16px" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
                Participants ({event.participants.length})
              </Typography>
              <Grid container spacing={2}>
                {event.participants.map((participant) => (
                  <Grid item xs={6} sm={4} md={3} key={participant.user.id}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 2,
                        borderRadius: "12px",
                        border: "1px solid",
                        borderColor: "grey.200",
                        "&:hover": { backgroundColor: "grey.50" },
                      }}
                    >
                      <Avatar
                        src={participant.user.avatar}
                        alt={participant.user.name}
                        sx={{ width: 56, height: 56, mb: 1 }}
                      />
                      <Typography variant="body2" fontWeight={500} textAlign="center">
                        {participant.user.name}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Photos Tab */}
        {activeTab === 3 && (
          <Card sx={{ borderRadius: "16px", textAlign: "center", py: 8 }}>
            <Typography variant="h2" sx={{ mb: 2 }}>📸</Typography>
            <Typography variant="h6" fontWeight={600}>Photos will be added soon</Typography>
            <Typography color="text.secondary">
              Check back later for event photos
            </Typography>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default EventDetail;

