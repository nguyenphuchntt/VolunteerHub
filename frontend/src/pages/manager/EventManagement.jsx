import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Chip, Avatar } from "@mui/material";
import { Add, Edit, Delete, Visibility, People } from "@mui/icons-material";
import { ThreeColumnLayout, DataTable, ConfirmDialog } from "../../components/common";
import { mockEvents } from "../../data/mockEvents";
import { mockUsers } from "../../data/mockData";

const EventManagement = () => {
  const navigate = useNavigate();
  const user = mockUsers[0];
  const [events, setEvents] = useState(mockEvents);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const columns = [
    {
      id: "title",
      label: "Tên sự kiện",
      render: (value, row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar variant="rounded" src={row.coverImage} alt={value} sx={{ width: 40, height: 40 }} />
          <Box>
            <Box sx={{ fontWeight: 600, fontSize: "14px" }}>{value}</Box>
            <Box sx={{ fontSize: "12px", color: "text.secondary" }}>{row.category}</Box>
          </Box>
        </Box>
      ),
    },
    {
      id: "date",
      label: "Ngày",
      render: (value) => {
        const date = new Date(value);
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "short" });
      },
    },
    {
      id: "participants",
      label: "TNV",
      render: (value) => <Chip label={value.length} size="small" sx={{ minWidth: 40 }} />,
    },
    {
      id: "status",
      label: "Trạng thái",
      render: (value) => {
        const colors = {
          upcoming: { bg: "#e3f2fd", color: "#1976d2" },
          ongoing: { bg: "#e8f5e9", color: "#388e3c" },
          completed: { bg: "#f3e5f5", color: "#7b1fa2" },
        };
        const labels = { upcoming: "Sắp diễn ra", ongoing: "Đang diễn ra", completed: "Hoàn thành" };
        const c = colors[value] || colors.upcoming;
        return (
          <Chip label={labels[value] || value} size="small" sx={{ backgroundColor: c.bg, color: c.color, fontWeight: 500, fontSize: "11px" }} />
        );
      },
    },
  ];

  const actions = [
    { label: "Xem", icon: <Visibility sx={{ fontSize: 18 }} />, onClick: (row) => navigate(`/events/${row.id}`) },
    { label: "Sửa", icon: <Edit sx={{ fontSize: 18 }} />, onClick: (row) => navigate(`/manage/events/${row.id}/edit`) },
    { label: "TNV", icon: <People sx={{ fontSize: 18 }} />, onClick: (row) => navigate(`/manage/events/${row.id}/participants`) },
    {
      label: "Xóa",
      icon: <Delete sx={{ fontSize: 18 }} />,
      color: "error.main",
      onClick: (row) => {
        setSelectedEvent(row);
        setDeleteDialogOpen(true);
      },
    },
  ];

  const handleDelete = () => {
    if (selectedEvent) {
      setEvents(events.filter((e) => e.id !== selectedEvent.id));
      setDeleteDialogOpen(false);
      setSelectedEvent(null);
    }
  };

  return (
    <ThreeColumnLayout user={user} role="manager" showRightSidebar={true} showSearch={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Quản lý sự kiện
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<Add />}
            onClick={() => navigate("/manage/events/new")}
            sx={{ borderRadius: "9999px", textTransform: "none", fontWeight: 600 }}
          >
            Tạo sự kiện
          </Button>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        <DataTable
          columns={columns}
          data={events}
          searchable
          searchPlaceholder="Tìm kiếm sự kiện..."
          actions={actions}
          onRowClick={(row) => navigate(`/events/${row.id}`)}
          emptyMessage="Bạn chưa có sự kiện nào"
        />
      </Box>

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Xóa sự kiện?"
        message={`Bạn có chắc chắn muốn xóa sự kiện "${selectedEvent?.title}"?`}
        confirmLabel="Xóa"
        variant="danger"
      />
    </ThreeColumnLayout>
  );
};

export default EventManagement;
