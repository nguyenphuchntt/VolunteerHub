import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Button, Chip, Avatar, Tabs, Tab } from "@mui/material";
import { CheckCircle, Cancel, Email, Download } from "@mui/icons-material";
import { ThreeColumnLayout, DataTable, ConfirmDialog, EmptyState } from "../../components/common";
import { mockEvents } from "../../data/mockEvents";
import { mockUsers, mockSuggestedFriends } from "../../data/mockData";

const allUsers = [...mockUsers, ...mockSuggestedFriends];

const ParticipantManagement = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const user = mockUsers[0];

  const event = eventId ? mockEvents.find((e) => e.id === parseInt(eventId)) : null;

  const [participants, setParticipants] = useState(
    allUsers.map((u, index) => ({
      ...u,
      eventId: mockEvents[index % mockEvents.length]?.id,
      eventTitle: mockEvents[index % mockEvents.length]?.title,
      registeredAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: ["pending", "approved", "completed", "rejected"][Math.floor(Math.random() * 4)],
      role: ["Volunteer", "Team Leader"][Math.floor(Math.random() * 2)],
    }))
  );

  const [activeTab, setActiveTab] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null, participant: null });

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: "#fff3e0", color: "#f57c00" },
      approved: { bg: "#e8f5e9", color: "#388e3c" },
      completed: { bg: "#e3f2fd", color: "#1976d2" },
      rejected: { bg: "#ffebee", color: "#d32f2f" },
    };
    return colors[status] || colors.pending;
  };

  const getStatusLabel = (status) => {
    const labels = { pending: "Chờ duyệt", approved: "Đã duyệt", completed: "Hoàn thành", rejected: "Từ chối" };
    return labels[status] || status;
  };

  const filteredParticipants = event
    ? participants.filter((p) => p.eventId === event.id)
    : activeTab === 0
    ? participants
    : participants.filter((p) => {
        if (activeTab === 1) return p.status === "pending";
        if (activeTab === 2) return p.status === "approved";
        return true;
      });

  const columns = [
    {
      id: "name",
      label: "Tình nguyện viên",
      render: (value, row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar src={row.avatar} alt={value} sx={{ width: 32, height: 32 }} />
          <Typography variant="body2" fontWeight={500}>{value}</Typography>
        </Box>
      ),
    },
    { id: "role", label: "Vai trò" },
    {
      id: "status",
      label: "Trạng thái",
      render: (value) => {
        const c = getStatusColor(value);
        return <Chip label={getStatusLabel(value)} size="small" sx={{ backgroundColor: c.bg, color: c.color, fontWeight: 500, fontSize: "11px" }} />;
      },
    },
  ];

  const actions = [
    { label: "Duyệt", icon: <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />, onClick: (row) => row.status === "pending" && setConfirmDialog({ open: true, action: "approve", participant: row }) },
    { label: "Từ chối", icon: <Cancel sx={{ fontSize: 16 }} />, color: "error.main", onClick: (row) => row.status === "pending" && setConfirmDialog({ open: true, action: "reject", participant: row }) },
  ];

  const handleConfirmAction = () => {
    const { action, participant } = confirmDialog;
    if (!participant) return;
    const newStatus = action === "approve" ? "approved" : "rejected";
    setParticipants(participants.map((p) => (p.id === participant.id ? { ...p, status: newStatus } : p)));
    setConfirmDialog({ open: false, action: null, participant: null });
  };

  const pendingCount = participants.filter((p) => p.status === "pending").length;

  return (
    <ThreeColumnLayout user={user} role="manager" showRightSidebar={true} showSearch={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Typography variant="h6" fontWeight={700} sx={{ p: 2 }}>
          {event ? `TNV - ${event.title}` : "Quản lý tình nguyện viên"}
        </Typography>

        {!event && (
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            sx={{ px: 2, "& .MuiTab-root": { textTransform: "none", fontWeight: 500, fontSize: "14px" } }}
          >
            <Tab label="Tất cả" />
            <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Chờ duyệt <Chip label={pendingCount} size="small" color="warning" sx={{ height: 18, fontSize: "10px" }} /></Box>} />
            <Tab label="Đã duyệt" />
          </Tabs>
        )}
      </Box>

      <Box sx={{ p: 2 }}>
        {filteredParticipants.length > 0 ? (
          <DataTable columns={columns} data={filteredParticipants} searchable searchPlaceholder="Tìm kiếm..." actions={actions} />
        ) : (
          <EmptyState title="Chưa có đăng ký" description="Chưa có ai đăng ký tham gia." />
        )}
      </Box>

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, action: null, participant: null })}
        onConfirm={handleConfirmAction}
        title={confirmDialog.action === "approve" ? "Duyệt đăng ký?" : "Từ chối đăng ký?"}
        message={`Bạn có chắc chắn muốn ${confirmDialog.action === "approve" ? "duyệt" : "từ chối"} đăng ký của "${confirmDialog.participant?.name}"?`}
        confirmLabel={confirmDialog.action === "approve" ? "Duyệt" : "Từ chối"}
        variant={confirmDialog.action === "approve" ? "success" : "danger"}
      />
    </ThreeColumnLayout>
  );
};

export default ParticipantManagement;
