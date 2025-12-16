import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ParticipatedEventCard from "../components/EventFeed/ParticipatedEventCard";
import { ThreeColumnLayout } from "../components/common";
import { mockUsers } from "../data/mockData";
import { mockEvents } from "../data/mockEvents";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Tabs,
  Tab,
  Grid,
  Divider,
} from "@mui/material";
import { CalendarMonth, LocationOn, Edit } from "@mui/icons-material";

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const user = mockUsers.find((u) => u.username === username) || mockUsers[0];
  const currentUser = mockUsers[0]; // Logged in user
  const isOwnProfile = user.id === currentUser.id;

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const participatedEvents = mockEvents
    .map((event) => {
      const participation = event.participants.find((p) => p.user.id === user.id);
      return participation ? { ...event, role: participation.role } : null;
    })
    .filter(Boolean);

  return (
    <ThreeColumnLayout user={currentUser} role="volunteer" showRightSidebar={true} showSearch={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ p: 2, position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 10 }}
        >
          {user.name}
        </Typography>
      </Box>

      {/* Cover Image */}
      <Box
        sx={{
          height: 150,
          backgroundImage: `url(${user.coverImage || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Profile Info */}
      <Box sx={{ px: 2, pb: 2 }}>
        {/* Avatar & Actions */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Avatar
            src={user.avatar}
            alt={user.name}
            sx={{
              width: 100,
              height: 100,
              border: "4px solid white",
              mt: -6,
            }}
          />
          {isOwnProfile ? (
            <Button
              variant="outlined"
              startIcon={<Edit />}
              sx={{
                borderRadius: "9999px",
                textTransform: "none",
                fontWeight: 700,
                mt: 1,
              }}
            >
              Chỉnh sửa hồ sơ
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{
                borderRadius: "9999px",
                textTransform: "none",
                fontWeight: 700,
                mt: 1,
              }}
            >
              Theo dõi
            </Button>
          )}
        </Box>

        {/* User Info */}
        <Box sx={{ mt: 1 }}>
          <Typography variant="h6" fontWeight={700}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            @{user.username}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {user.bio}
          </Typography>

          {/* Stats */}
          <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Typography variant="body2" fontWeight={700}>
                {participatedEvents.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                sự kiện
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Typography variant="body2" fontWeight={700}>
                5.8k
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đang theo dõi
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Typography variant="body2" fontWeight={700}>
                2.1k
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Người theo dõi
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            mt: 2,
            borderBottom: "1px solid",
            borderColor: "grey.200",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "14px",
              flex: 1,
            },
          }}
        >
          <Tab label="Lịch sử tham gia" />
          <Tab label="Người theo dõi" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          {participatedEvents.length > 0 ? (
            participatedEvents.map((event) => (
              <Box
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                sx={{
                  p: 2,
                  borderBottom: "1px solid",
                  borderColor: "grey.200",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "grey.50" },
                }}
              >
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <Box
                    component="img"
                    src={event.coverImage}
                    alt={event.title}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "12px",
                      objectFit: "cover",
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body1" fontWeight={600}>
                      {event.title}
                    </Typography>
                    <Typography variant="caption" color="primary.main" fontWeight={500}>
                      {event.role}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                      <CalendarMonth sx={{ fontSize: 14, color: "text.secondary" }} />
                      <Typography variant="caption" color="text.secondary">
                        {event.date}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <LocationOn sx={{ fontSize: 14, color: "text.secondary" }} />
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {event.location}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="body1" color="text.secondary">
                Chưa tham gia sự kiện nào
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {activeTab === 1 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            Danh sách người theo dõi sẽ sớm được cập nhật
          </Typography>
        </Box>
      )}
    </ThreeColumnLayout>
  );
};

export default Profile;
