import { useState } from "react";
import { useParams } from "react-router-dom";
import { MainHeader, FeedFooter } from "../components/SocialFeed";
import ParticipatedEventCard from "../components/EventFeed/ParticipatedEventCard";
import { mockUsers } from "../data/mockData";
import { mockEvents } from "../data/mockEvents";
import {
  Box,
  Container,
  Avatar,
  Typography,
  Button,
  Tabs,
  Tab,
  Grid,
} from "@mui/material";

const Profile = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState(0);

  const user = mockUsers.find((u) => u.username === username);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Typography variant="h6">User not found</Typography>
      </Box>
    );
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
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
      <MainHeader user={user} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Cover & Profile Info */}
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            mb: 3,
          }}
        >
          {/* Cover Image */}
          <Box
            sx={{
              height: 200,
              backgroundImage: `url(${user.coverImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Profile Info */}
          <Box sx={{ position: "relative", px: 4, pb: 3 }}>
            {/* Avatar */}
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{
                width: 120,
                height: 120,
                border: "4px solid white",
                position: "absolute",
                top: -60,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            />

            {/* Actions */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 2, gap: 1.5 }}>
              <Button
                variant="contained"
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  px: 3,
                  fontWeight: 600,
                }}
              >
                Follow
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  px: 3,
                  fontWeight: 600,
                }}
              >
                Message
              </Button>
            </Box>

            {/* User Info */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h5" fontWeight={700}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                {user.bio}
              </Typography>

              {/* Stats */}
              <Box sx={{ display: "flex", gap: 4 }}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {participatedEvents.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Events
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    5.8k
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Followers
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    2.1k
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Following
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                mt: 3,
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                },
              }}
            >
              <Tab label="History" />
              <Tab label="Followers" />
            </Tabs>
          </Box>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Grid container spacing={2}>
            {participatedEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <ParticipatedEventCard event={event} role={event.role} />
              </Grid>
            ))}
          </Grid>
        )}

        {activeTab === 1 && (
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Followers list coming soon
            </Typography>
          </Box>
        )}

        {/* Load More */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: "20px",
              textTransform: "none",
              px: 4,
              fontWeight: 600,
            }}
          >
            Load More
          </Button>
        </Box>
      </Container>

      <FeedFooter />
    </Box>
  );
};

export default Profile;
