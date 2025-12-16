import { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { EventDetailBanner } from "../components/EventFeed";
import WritePost from "../components/SocialFeed/WritePost";
import PostCard from "../components/SocialFeed/PostCard";
import { ThreeColumnLayout } from "../components/common";
import { mockEvents, getEventPosts } from "../data/mockEvents";
import { mockUsers } from "../data/mockData";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Avatar,
  Button,
} from "@mui/material";
import {
  Forum,
  Info,
  People,
  PhotoLibrary,
  ArrowBack,
} from "@mui/icons-material";

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const user = mockUsers[0];
  const event = mockEvents.find((e) => e.id === parseInt(eventId));
  const eventPosts = getEventPosts(parseInt(eventId));
  const [posts, setPosts] = useState(eventPosts);

  if (!event) {
    return <Navigate to="/events" replace />;
  }

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const handleComment = (postId, commentText) => {
    const newComment = {
      id: Date.now(),
      author: user,
      content: commentText,
      timestamp: "Just now",
      isAuthor: true,
    };
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
      )
    );
  };

  return (
    <ThreeColumnLayout user={user} role="volunteer" showRightSidebar={false} showSearch={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200", position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 10 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 1.5 }}>
          <Button
            variant="text"
            onClick={() => navigate(-1)}
            sx={{ minWidth: "auto", p: 1, borderRadius: "50%" }}
          >
            <ArrowBack />
          </Button>
          <Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
              {event.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {event.participants.length} tình nguyện viên
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Banner */}
      <Box
        sx={{
          height: 150,
          backgroundImage: `url(${event.coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Event Info */}
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Typography variant="h6" fontWeight={700}>
          {event.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {event.description}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 1.5, flexWrap: "wrap" }}>
          <Chip label={event.category} size="small" color="primary" />
          <Chip label={event.status} size="small" variant="outlined" />
          <Chip label={event.date} size="small" variant="outlined" />
        </Box>
        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <Button variant="contained" fullWidth sx={{ borderRadius: "9999px", textTransform: "none", fontWeight: 600 }}>
            Đăng ký tham gia
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, v) => setActiveTab(v)}
        sx={{
          borderBottom: "1px solid",
          borderColor: "grey.200",
          "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "14px", flex: 1 },
        }}
      >
        <Tab icon={<Forum sx={{ fontSize: 18 }} />} iconPosition="start" label="Feed" />
        <Tab icon={<Info sx={{ fontSize: 18 }} />} iconPosition="start" label="Chi tiết" />
        <Tab icon={<People sx={{ fontSize: 18 }} />} iconPosition="start" label="TNV" />
      </Tabs>

      {/* Feed Tab */}
      {activeTab === 0 && (
        <Box>
          <WritePost currentUser={user} />
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.id} post={post} onLike={handleLike} onComment={handleComment} />
            ))
          ) : (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h2" sx={{ mb: 2 }}>💬</Typography>
              <Typography variant="h6" fontWeight={600}>Chưa có bài viết</Typography>
              <Typography color="text.secondary">Hãy là người đầu tiên chia sẻ!</Typography>
            </Box>
          )}
        </Box>
      )}

      {/* About Tab */}
      {activeTab === 1 && (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            Về sự kiện này
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.8 }}>
            {event.fullDescription || event.description}
          </Typography>

          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            Những gì bạn sẽ làm
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 3, "& li": { mb: 0.5 } }}>
            <li>Gặp gỡ những tình nguyện viên cùng đam mê</li>
            <li>Hoạt động thực tế tạo ra tác động thực sự</li>
            <li>Được hướng dẫn chuyên nghiệp và cung cấp vật tư</li>
          </Box>

          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            Cần mang theo
          </Typography>
          <Box component="ul" sx={{ pl: 2, "& li": { mb: 0.5 } }}>
            <li>Trang phục thoải mái</li>
            <li>Bình nước</li>
            <li>Tinh thần tích cực!</li>
          </Box>
        </Box>
      )}

      {/* Participants Tab */}
      {activeTab === 2 && (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            Tình nguyện viên ({event.participants.length})
          </Typography>
          <Grid container spacing={1}>
            {event.participants.map((participant) => (
              <Grid item xs={6} key={participant.user.id}>
                <Box
                  onClick={() => navigate(`/profiles/${participant.user.username}`)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1,
                    borderRadius: "8px",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "grey.50" },
                  }}
                >
                  <Avatar src={participant.user.avatar} alt={participant.user.name} sx={{ width: 32, height: 32 }} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={500} noWrap>
                      {participant.user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {participant.role}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </ThreeColumnLayout>
  );
};

export default EventDetail;
