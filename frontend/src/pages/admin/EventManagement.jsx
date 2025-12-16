import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  CheckCircle,
  Block,
  Delete,
  Visibility,
  FilterList,
} from "@mui/icons-material";
import { ThreeColumnLayout, DataTable, ConfirmDialog } from "../../components/common";
import { mockUsers } from "../../data/mockData";
import { mockEvents } from "../../data/mockEvents";
import { mockPendingEvents } from "../../data/mockAdminData";

const AdminEventManagement = () => {
  const navigate = useNavigate();
  const user = mockUsers[0];
  
  // Combine mockEvents and mockPendingEvents for full list
  const allEvents = [
    ...mockPendingEvents,
    ...mockEvents.map((e) => ({ ...e, approvalStatus: "approved" })),
  ];
  
  const [events, setEvents] = useState(allEvents);
  const [selectedTab, setSelectedTab] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const tabFilters = ["all", "pending", "approved", "rejected"];

  const filteredEvents =
    selectedTab === 0
      ? events
      : events.filter((e) => e.approvalStatus === tabFilters[selectedTab]);

  const columns = [
    {
      id: "title",
      label: "Sự kiện",
      render: (value, row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            variant="rounded"
            src={row.coverImage}
            alt={value}
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Box sx={{ fontWeight: 600, fontSize: "14px" }}>{value}</Box>
            <Box sx={{ fontSize: "12px", color: "text.secondary" }}>{row.category}</Box>
          </Box>
        </Box>
      ),
    },
    {
      id: "host",
      label: "Người tạo",
      render: (value) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar src={value?.avatar} sx={{ width: 24, height: 24 }} />
          <Typography variant="body2">{value?.name}</Typography>
        </Box>
      ),
    },
    {
      id: "date",
      label: "Ngày",
      render: (value) => {
        const date = new Date(value);
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "short", year: "numeric" });
      },
    },
    {
      id: "approvalStatus",
      label: "Trạng thái",
      render: (value) => {
        const config = {
          pending: { label: "Chờ duyệt", bg: "#fff4e5", color: "#ed6c02" },
          approved: { label: "Đã duyệt", bg: "#edf7ed", color: "#2e7d32" },
          rejected: { label: "Từ chối", bg: "#fdeded", color: "#d32f2f" },
        };
        const c = config[value] || config.pending;
        return (
          <Chip
            label={c.label}
            size="small"
            sx={{ backgroundColor: c.bg, color: c.color, fontWeight: 600, fontSize: "11px" }}
          />
        );
      },
    },
  ];

  const handleApprove = (event) => {
    setEvents(
      events.map((e) => (e.id === event.id ? { ...e, approvalStatus: "approved" } : e))
    );
  };

  const handleReject = () => {
    if (selectedEvent) {
      setEvents(
        events.map((e) =>
          e.id === selectedEvent.id ? { ...e, approvalStatus: "rejected" } : e
        )
      );
      setRejectDialogOpen(false);
      setSelectedEvent(null);
      setRejectReason("");
    }
  };

  const handleDelete = () => {
    if (selectedEvent) {
      setEvents(events.filter((e) => e.id !== selectedEvent.id));
      setDeleteDialogOpen(false);
      setSelectedEvent(null);
    }
  };

  const actions = [
    {
      label: "Xem",
      icon: <Visibility sx={{ fontSize: 18 }} />,
      onClick: (row) => navigate(`/events/${row.id}`),
    },
    {
      label: "Duyệt",
      icon: <CheckCircle sx={{ fontSize: 18 }} />,
      color: "success.main",
      onClick: (row) => handleApprove(row),
      show: (row) => row.approvalStatus === "pending",
    },
    {
      label: "Từ chối",
      icon: <Block sx={{ fontSize: 18 }} />,
      color: "warning.main",
      onClick: (row) => {
        setSelectedEvent(row);
        setRejectDialogOpen(true);
      },
      show: (row) => row.approvalStatus === "pending",
    },
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

  const pendingCount = events.filter((e) => e.approvalStatus === "pending").length;
  const approvedCount = events.filter((e) => e.approvalStatus === "approved").length;
  const rejectedCount = events.filter((e) => e.approvalStatus === "rejected").length;

  return (
    <ThreeColumnLayout user={user} role="admin" showRightSidebar={true} showSearch={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Quản lý sự kiện
          </Typography>
        </Box>

        {/* Tabs */}
        <Tabs
          value={selectedTab}
          onChange={(e, v) => setSelectedTab(v)}
          sx={{
            px: 2,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minHeight: 48,
            },
          }}
        >
          <Tab label={`Tất cả (${events.length})`} />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                Chờ duyệt
                {pendingCount > 0 && (
                  <Chip label={pendingCount} size="small" color="warning" sx={{ height: 20 }} />
                )}
              </Box>
            }
          />
          <Tab label={`Đã duyệt (${approvedCount})`} />
          <Tab label={`Từ chối (${rejectedCount})`} />
        </Tabs>
      </Box>

      <Box sx={{ p: 2 }}>
        <DataTable
          columns={columns}
          data={filteredEvents}
          searchable
          searchPlaceholder="Tìm kiếm sự kiện..."
          actions={actions}
          onRowClick={(row) => navigate(`/events/${row.id}`)}
          emptyMessage="Không có sự kiện nào"
        />
      </Box>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Từ chối sự kiện</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Vui lòng nhập lý do từ chối sự kiện "{selectedEvent?.title}"
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Lý do từ chối..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setRejectDialogOpen(false)} sx={{ textTransform: "none" }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleReject}
            sx={{ textTransform: "none", borderRadius: "9999px" }}
          >
            Từ chối
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Xóa sự kiện?"
        message={`Bạn có chắc chắn muốn xóa sự kiện "${selectedEvent?.title}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        variant="danger"
      />
    </ThreeColumnLayout>
  );
};

export default AdminEventManagement;
