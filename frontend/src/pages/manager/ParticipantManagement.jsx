import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Button, Chip, Avatar, Tabs, Tab, CircularProgress, Alert, Snackbar } from "@mui/material";
import { CheckCircle, Cancel, Refresh, TaskAlt } from "@mui/icons-material";
import { ThreeColumnLayout, DataTable, ConfirmDialog, EmptyState } from "../../components/common";
import { eventUserService, eventService, managerService } from "../../api";
import { useAuth } from "../../context/AuthContext";

const ParticipantManagement = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { user } = useAuth();

  // API states
  const [participants, setParticipants] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [activeTab, setActiveTab] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null, participant: null });
  
  // Batch selection states
  const [selectedIds, setSelectedIds] = useState([]);
  const [batchConfirmOpen, setBatchConfirmOpen] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);

  // Fetch event details if eventId provided
  const fetchEvent = useCallback(async () => {
    if (!eventId) return;
    try {
      const eventData = await eventService.getEventById(eventId);
      setEvent(eventData);
    } catch (err) {
      console.error("Failed to fetch event:", err);
    }
  }, [eventId]);

  // Fetch participants
  const fetchParticipants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (eventId) {
        // Event specific view
        const params = activeTab === 1 
            ? { status: "PENDING" } 
            : activeTab === 2 
              ? { status: "APPROVED" }
              : activeTab === 3
                ? { status: "APPROVED" } // Tab "Đánh dấu hoàn thành hàng loạt" - show APPROVED only
                : {};
        response = await eventUserService.getEventUsersByEventId(eventId, params);
      } else {
        // General "Pending Volunteers" view
        response = await managerService.getPendingUsers();
      }
      
      // Filter out MANAGER role - managers should not appear in participant list
      const filteredParticipants = (response.content || []).filter(
        p => p.eventUserRole?.toUpperCase() !== "MANAGER"
      );
      
      setParticipants(filteredParticipants);
    } catch (err) {
      console.error("Failed to fetch participants:", err);
      setError("Không thể tải danh sách đăng ký.");
    } finally {
      setLoading(false);
    }
  }, [eventId, activeTab]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  useEffect(() => {
    fetchParticipants();
    // Clear selection when switching tabs
    setSelectedIds([]);
  }, [fetchParticipants]);

  // Backend EventUserStatus: APPROVED, REJECTED, PENDING, FINISHED
  const getStatusColor = (status) => {
    const statusUpper = (status || "PENDING").toUpperCase();
    const colors = {
      PENDING: { bg: "#fff3e0", color: "#f57c00" },
      APPROVED: { bg: "#e8f5e9", color: "#388e3c" },
      FINISHED: { bg: "#e3f2fd", color: "#1976d2" },
      REJECTED: { bg: "#ffebee", color: "#d32f2f" },
    };
    return colors[statusUpper] || colors.PENDING;
  };

  const getStatusLabel = (status) => {
    const statusUpper = (status || "PENDING").toUpperCase();
    const labels = { 
      PENDING: "Chờ duyệt", 
      APPROVED: "Đã duyệt", 
      FINISHED: "Hoàn thành", 
      REJECTED: "Từ chối" 
    };
    return labels[statusUpper] || status;
  };

  // Handle approve/reject/finish
  const handleConfirmAction = async () => {
    const { action, participant } = confirmDialog;
    if (!participant) return;
    
    const statusMap = {
      approve: "APPROVED",
      reject: "REJECTED",
      finish: "FINISHED"
    };
    const newStatus = statusMap[action];
    
    const actionLabelMap = {
      approve: "duyệt",
      reject: "từ chối",
      finish: "đánh dấu hoàn thành"
    };
    const actionLabel = actionLabelMap[action];
    
    try {
      await eventUserService.updateEventUserStatus(
        participant.eventId, 
        participant.accountId, 
        newStatus
      );
      
      setSnackbar({
        open: true,
        message: `Đã ${actionLabel} đăng ký thành công!`,
        severity: "success"
      });
      
      // Refresh the list
      fetchParticipants();
    } catch (err) {
      console.error("Failed to update status:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || `Không thể ${actionLabel} đăng ký.`,
        severity: "error"
      });
    }
    
    setConfirmDialog({ open: false, action: null, participant: null });
  };

  // Handle batch mark as finished
  const handleBatchFinish = async () => {
    if (selectedIds.length === 0) return;
    
    setBatchLoading(true);
    let successCount = 0;
    let failCount = 0;
    
    for (const accountId of selectedIds) {
      const participant = participants.find(p => p.accountId === accountId);
      if (!participant) continue;
      
      try {
        await eventUserService.updateEventUserStatus(
          participant.eventId,
          participant.accountId,
          "FINISHED"
        );
        successCount++;
      } catch (err) {
        console.error(`Failed to update status for ${accountId}:`, err);
        failCount++;
      }
    }
    
    setBatchLoading(false);
    setBatchConfirmOpen(false);
    setSelectedIds([]);
    
    if (failCount === 0) {
      setSnackbar({
        open: true,
        message: `Đã đánh dấu hoàn thành ${successCount} tình nguyện viên!`,
        severity: "success"
      });
    } else {
      setSnackbar({
        open: true,
        message: `Thành công: ${successCount}, Thất bại: ${failCount}`,
        severity: failCount === selectedIds.length ? "error" : "warning"
      });
    }
    
    fetchParticipants();
  };

  const columns = [
    {
      id: "username",
      label: "Tình nguyện viên",
      render: (value, row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
            {(row.firstName || row.username || "?").charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {row.firstName && row.lastName ? `${row.firstName} ${row.lastName}` : value}
            </Typography>
            <Typography variant="caption" color="text.secondary">@{value}</Typography>
          </Box>
        </Box>
      ),
    },
    // Always show Event column, especially important for general view
    {
      id: "title",
      label: "Sự kiện",
      render: (value, row) => (
        <Typography variant="body2" sx={{ maxWidth: 200 }} noWrap title={row.title || value}>
          {row.title || value}
        </Typography>
      )
    },
    { 
      id: "eventUserRole", 
      label: "Vai trò",
      render: (value) => value || "PARTICIPANT"
    },
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
    { 
      label: "Duyệt", 
      icon: <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />, 
      onClick: (row) => row.status?.toUpperCase() === "PENDING" && setConfirmDialog({ open: true, action: "approve", participant: row }),
      disabled: (row) => row.status?.toUpperCase() !== "PENDING"
    },
    { 
      label: "Từ chối", 
      icon: <Cancel sx={{ fontSize: 16 }} />, 
      color: "error.main", 
      onClick: (row) => row.status?.toUpperCase() === "PENDING" && setConfirmDialog({ open: true, action: "reject", participant: row }),
      disabled: (row) => row.status?.toUpperCase() !== "PENDING"
    },
    { 
      label: "Đánh dấu hoàn thành", 
      icon: <TaskAlt sx={{ fontSize: 16, color: "info.main" }} />, 
      onClick: (row) => row.status?.toUpperCase() === "APPROVED" && setConfirmDialog({ open: true, action: "finish", participant: row }),
      disabled: (row) => row.status?.toUpperCase() !== "APPROVED"
    },
  ];

  const pendingCount = participants.filter((p) => p.status?.toUpperCase() === "PENDING").length;
  const approvedCount = participants.filter((p) => p.status?.toUpperCase() === "APPROVED").length;
  
  // Check if we are in batch selection mode (tab 3)
  const isBatchMode = activeTab === 3;

  return (
    <ThreeColumnLayout user={user} role="manager" showRightSidebar={true} showSearch={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            {eventId ? (event ? `TNV - ${event.title}` : "Quản lý tình nguyện viên") : "Danh sách tnv chờ duyệt"}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {isBatchMode && selectedIds.length > 0 && (
              <Button 
                size="small" 
                variant="contained"
                color="info"
                startIcon={<TaskAlt />} 
                onClick={() => setBatchConfirmOpen(true)}
                disabled={batchLoading}
                sx={{ textTransform: "none" }}
              >
                Đánh dấu hoàn thành ({selectedIds.length})
              </Button>
            )}
            <Button 
              size="small" 
              startIcon={<Refresh />} 
              onClick={fetchParticipants}
              sx={{ textTransform: "none" }}
            >
              Làm mới
            </Button>
          </Box>
        </Box>

        {/* Only show tabs in Event context */}
        {eventId && (
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            sx={{ px: 2, "& .MuiTab-root": { textTransform: "none", fontWeight: 500, fontSize: "14px" } }}
          >
            <Tab label="Tất cả" />
            <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Chờ duyệt <Chip label={pendingCount} size="small" color="warning" sx={{ height: 18, fontSize: "10px" }} /></Box>} />
            <Tab label="Đã duyệt" />
            <Tab label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                Đánh dấu hoàn thành 
                <Chip label={approvedCount} size="small" color="info" sx={{ height: 18, fontSize: "10px" }} />
              </Box>
            } />
          </Tabs>
        )}
      </Box>

      <Box sx={{ p: 2 }}>
        {isBatchMode && (
          <Alert severity="info" sx={{ mb: 2, borderRadius: "12px" }}>
            Chọn các tình nguyện viên bạn muốn đánh dấu hoàn thành, sau đó nhấn nút "Đánh dấu hoàn thành" ở trên.
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: "12px" }}>{error}</Alert>
        ) : participants.length > 0 ? (
          <DataTable 
            columns={columns} 
            data={participants} 
            searchable 
            searchPlaceholder="Tìm kiếm..." 
            actions={isBatchMode ? [] : actions}  // Hide individual actions in batch mode
            rowKey="accountId" 
            selectable={isBatchMode}
            onSelectionChange={(ids) => setSelectedIds(ids)}
          />
        ) : (
          <EmptyState 
            title={isBatchMode ? "Không có TNV cần đánh dấu" : "Chưa có đăng ký"} 
            description={
              isBatchMode 
                ? "Không có tình nguyện viên nào đã duyệt cần đánh dấu hoàn thành." 
                : eventId 
                  ? "Chưa có ai đăng ký tham gia." 
                  : "Không có yêu cầu chờ duyệt nào."
            } 
          />
        )}
      </Box>

      {/* Single action confirm dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, action: null, participant: null })}
        onConfirm={handleConfirmAction}
        title={confirmDialog.action === "approve" ? "Duyệt đăng ký?" : confirmDialog.action === "finish" ? "Đánh dấu hoàn thành?" : "Từ chối đăng ký?"}
        message={`Bạn có chắc chắn muốn ${confirmDialog.action === "approve" ? "duyệt" : confirmDialog.action === "finish" ? "đánh dấu hoàn thành" : "từ chối"} đăng ký của "${confirmDialog.participant?.firstName || confirmDialog.participant?.username}"?`}
        confirmLabel={confirmDialog.action === "approve" ? "Duyệt" : confirmDialog.action === "finish" ? "Hoàn thành" : "Từ chối"}
        variant={confirmDialog.action === "approve" ? "success" : confirmDialog.action === "finish" ? "info" : "danger"}
      />

      {/* Batch confirm dialog */}
      <ConfirmDialog
        open={batchConfirmOpen}
        onClose={() => setBatchConfirmOpen(false)}
        onConfirm={handleBatchFinish}
        title="Đánh dấu hoàn thành hàng loạt?"
        message={`Bạn có chắc chắn muốn đánh dấu hoàn thành cho ${selectedIds.length} tình nguyện viên đã chọn?`}
        confirmLabel={batchLoading ? "Đang xử lý..." : "Xác nhận"}
        variant="info"
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThreeColumnLayout>
  );
};

export default ParticipantManagement;
