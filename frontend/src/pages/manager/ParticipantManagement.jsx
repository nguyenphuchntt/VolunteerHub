import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box, Typography, Button, Chip, Avatar, Tabs, Tab, CircularProgress, Alert, Snackbar,
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import { CheckCircle, Cancel, Refresh, TaskAlt, PersonRemove, AdminPanelSettings } from "@mui/icons-material";
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

  // Tabs: 0 = Chờ duyệt, 1 = Đã duyệt (merged with mark complete), 2 = Quản lý role
  const [activeTab, setActiveTab] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null, participant: null });

  // Batch selection states
  const [selectedIds, setSelectedIds] = useState([]);
  const [batchConfirmOpen, setBatchConfirmOpen] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);

  // Role change dialog
  const [roleDialog, setRoleDialog] = useState({ open: false, participant: null, newRole: "ATTENDEE" });

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

  // Fetch ALL participants once (not per tab)
  const fetchParticipants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (eventId) {
        // Fetch all participants for this event
        response = await eventUserService.getEventUsersByEventId(eventId, {});
      } else {
        response = await managerService.getPendingUsers();
      }

      setParticipants(response.content || []);
    } catch (err) {
      console.error("Failed to fetch participants:", err);
      setError("Không thể tải danh sách đăng ký.");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  // Clear selection when switching tabs
  useEffect(() => {
    setSelectedIds([]);
  }, [activeTab]);

  // Filter participants based on active tab (client-side filtering)
  const filteredParticipants = useMemo(() => {
    if (!eventId) return participants;

    const currentUserId = user?.accountID;

    switch (activeTab) {
      case 0: // Chờ duyệt
        return participants.filter(p => p.status?.toUpperCase() === "PENDING");
      case 1: // Thành viên (APPROVED + FINISHED + UNFINISHED), exclude current user
        return participants.filter(
          p => (p.status?.toUpperCase() === "APPROVED" || p.status?.toUpperCase() === "FINISHED" || p.status?.toUpperCase() === "UNFINISHED") &&
            p.accountId !== currentUserId
        );
      case 2: // Quản lý vai trò - show all members
        return participants.filter(
          p => p.status?.toUpperCase() !== "REJECTED" &&
            p.status?.toUpperCase() !== "PENDING"
        );
      default:
        return participants;
    }
  }, [participants, activeTab, eventId, user]);

  // Status helpers
  const getStatusColor = (status) => {
    const statusUpper = (status || "PENDING").toUpperCase();
    const colors = {
      PENDING: { bg: "#fff3e0", color: "#f57c00" },
      APPROVED: { bg: "#e8f5e9", color: "#388e3c" },
      FINISHED: { bg: "#e3f2fd", color: "#1976d2" },
      UNFINISHED: { bg: "#fff3e0", color: "#e65100" }, // Orange/Brown for incomplete
      REJECTED: { bg: "#ffebee", color: "#d32f2f" },
    };
    return colors[statusUpper] || colors.PENDING;
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDING: "Chờ duyệt",
      APPROVED: "Đã duyệt",
      FINISHED: "Hoàn thành",
      UNFINISHED: "Chưa hoàn thành",
      REJECTED: "Từ chối"
    };
    return labels[(status || "PENDING").toUpperCase()] || status;
  };

  const getRoleLabel = (role) => {
    const labels = {
      ATTENDEE: "Thành viên",
      MANAGER: "Quản lý sự kiện"
    };
    return labels[(role || "ATTENDEE").toUpperCase()] || role;
  };

  // Handle approve/reject/finish/delete
  const handleConfirmAction = async () => {
    const { action, participant } = confirmDialog;
    if (!participant) return;

    try {
      if (action === "delete") {
        await eventUserService.deleteEventUser(participant.eventId, participant.accountId);
        setSnackbar({ open: true, message: "Đã xóa người dùng khỏi sự kiện!", severity: "success" });
      } else {
        const statusMap = { approve: "APPROVED", reject: "REJECTED", finish: "FINISHED", unfinish: "UNFINISHED" };
        const actionLabelMap = { approve: "duyệt", reject: "từ chối", finish: "đánh dấu hoàn thành", unfinish: "đánh dấu không hoàn thành" };

        await eventUserService.updateEventUserStatus(participant.eventId, participant.accountId, statusMap[action]);
        setSnackbar({ open: true, message: `Đã ${actionLabelMap[action]} đăng ký thành công!`, severity: "success" });
      }
      fetchParticipants();
    } catch (err) {
      console.error("Failed to perform action:", err);
      setSnackbar({ open: true, message: err.response?.data?.message || "Không thể thực hiện thao tác.", severity: "error" });
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
      const participant = filteredParticipants.find(p => p.accountId === accountId);
      if (!participant || participant.status?.toUpperCase() === "FINISHED") continue;

      try {
        await eventUserService.updateEventUserStatus(participant.eventId, participant.accountId, "FINISHED");
        successCount++;
      } catch (err) {
        console.error(`Failed to update status for ${accountId}:`, err);
        failCount++;
      }
    }

    setBatchLoading(false);
    setBatchConfirmOpen(false);
    setSelectedIds([]);

    setSnackbar({
      open: true,
      message: failCount === 0
        ? `Đã đánh dấu hoàn thành ${successCount} tình nguyện viên!`
        : `Thành công: ${successCount}, Thất bại: ${failCount}`,
      severity: failCount === 0 ? "success" : "warning"
    });

    fetchParticipants();
  };

  // Handle role change
  const handleRoleChange = async () => {
    const { participant, newRole } = roleDialog;
    if (!participant || !newRole) return;

    try {
      await eventUserService.updateEventUserRole(participant.eventId, participant.accountId, newRole);
      setSnackbar({ open: true, message: `Đã đổi vai trò thành ${getRoleLabel(newRole)}!`, severity: "success" });
      fetchParticipants();
    } catch (err) {
      console.error("Failed to update role:", err);
      setSnackbar({ open: true, message: err.response?.data?.message || "Không thể đổi vai trò.", severity: "error" });
    }

    setRoleDialog({ open: false, participant: null, newRole: "ATTENDEE" });
  };

  // Columns configuration
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
    // Chỉ hiển thị cột "Tên sự kiện" khi không có eventId cụ thể
    ...(!eventId ? [{
      id: "title",
      label: "Tên sự kiện",
      render: (value) => (
        <Typography variant="body2" sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value || "—"}
        </Typography>
      ),
    }] : []),
    {
      id: "role",
      label: "Vai trò",
      render: (value) => (
        <Chip
          label={getRoleLabel(value)}
          size="small"
          color={value?.toUpperCase() === "MANAGER" ? "primary" : "default"}
          sx={{ fontSize: "11px" }}
        />
      )
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

  // Actions based on active tab
  const getActions = () => {
    if (activeTab === 0) {
      // Tab Pending: Approve/Reject only
      return [
        {
          label: "Duyệt",
          icon: <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />,
          onClick: (row) => setConfirmDialog({ open: true, action: "approve", participant: row }),
        },
        {
          label: "Từ chối",
          icon: <Cancel sx={{ fontSize: 16 }} />,
          color: "error.main",
          onClick: (row) => setConfirmDialog({ open: true, action: "reject", participant: row }),
        },
      ];
    } else if (activeTab === 1) {
      // Tab Approved: Mark complete + Delete
      return [
        {
          label: "Hoàn thành",
          icon: <TaskAlt sx={{ fontSize: 16, color: "info.main" }} />,
          onClick: (row) => (row.status?.toUpperCase() === "APPROVED" || row.status?.toUpperCase() === "UNFINISHED") && setConfirmDialog({ open: true, action: "finish", participant: row }),
          disabled: (row) => row.status?.toUpperCase() === "FINISHED"
        },
        {
          label: "Chưa hoàn thành",
          icon: <Cancel sx={{ fontSize: 16, color: "warning.main" }} />,
          onClick: (row) => (row.status?.toUpperCase() === "APPROVED" || row.status?.toUpperCase() === "FINISHED") && setConfirmDialog({ open: true, action: "unfinish", participant: row }),
          disabled: (row) => row.status?.toUpperCase() === "UNFINISHED"
        },
        {
          label: "Xóa khỏi sự kiện",
          icon: <PersonRemove sx={{ fontSize: 16 }} />,
          color: "error.main",
          onClick: (row) => setConfirmDialog({ open: true, action: "delete", participant: row }),
        },
      ];
    } else {
      // Tab Role Management: Change role
      return [
        {
          label: "Đổi vai trò",
          icon: <AdminPanelSettings sx={{ fontSize: 16 }} />,
          onClick: (row) => setRoleDialog({ open: true, participant: row, newRole: row.role?.toUpperCase() === "MANAGER" ? "ATTENDEE" : "MANAGER" }),
        },
      ];
    }
  };

  // Counts
  const pendingCount = participants.filter((p) => p.status?.toUpperCase() === "PENDING").length;
  const approvedCount = participants.filter((p) => ["APPROVED", "FINISHED", "UNFINISHED"].includes(p.status?.toUpperCase())).length;

  return (
    <ThreeColumnLayout user={user} role="manager" showRightSidebar={true} showSearch={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            {eventId ? (event ? `TNV - ${event.title}` : "Quản lý tình nguyện viên") : "Danh sách tnv chờ duyệt"}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {activeTab === 1 && selectedIds.length > 0 && (
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

        {/* Tabs */}
        {eventId && (
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            sx={{ px: 2, "& .MuiTab-root": { textTransform: "none", fontWeight: 500, fontSize: "14px" } }}
          >
            <Tab label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                Chờ duyệt
                <Chip label={pendingCount} size="small" color="warning" sx={{ height: 18, fontSize: "10px" }} />
              </Box>
            } />
            <Tab label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                Thành viên
                <Chip label={approvedCount} size="small" color="success" sx={{ height: 18, fontSize: "10px" }} />
              </Box>
            } />
            <Tab label="Quản lý vai trò" />
          </Tabs>
        )}
      </Box>

      <Box sx={{ p: 2 }}>
        {activeTab === 1 && (
          <Alert severity="info" sx={{ mb: 2, borderRadius: "12px" }}>
            Chọn các tình nguyện viên để đánh dấu hoàn thành hàng loạt, hoặc sử dụng nút "Xóa khỏi sự kiện" để loại người dùng.
          </Alert>
        )}

        {activeTab === 2 && (
          <Alert severity="info" sx={{ mb: 2, borderRadius: "12px" }}>
            Đổi vai trò của thành viên thành <strong>Quản lý sự kiện</strong> để họ có quyền quản lý chỉ sự kiện này.
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: "12px" }}>{error}</Alert>
        ) : filteredParticipants.length > 0 ? (
          <DataTable
            columns={columns}
            data={filteredParticipants}
            searchable
            searchPlaceholder="Tìm kiếm..."
            actions={getActions()}
            rowKey="accountId"
            selectable={activeTab === 1}
            onSelectionChange={(ids) => setSelectedIds(ids)}
          />
        ) : (
          <EmptyState
            title={
              activeTab === 0 ? "Không có yêu cầu chờ duyệt" :
                activeTab === 1 ? "Không có thành viên" :
                  "Không có thành viên để quản lý"
            }
            description={
              activeTab === 0 ? "Không có tình nguyện viên nào đang chờ duyệt." :
                activeTab === 1 ? "Chưa có thành viên nào được duyệt tham gia sự kiện." :
                  "Duyệt thành viên trước để quản lý vai trò của họ."
            }
          />
        )}
      </Box>

      {/* Single action confirm dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, action: null, participant: null })}
        onConfirm={handleConfirmAction}
        title={
          confirmDialog.action === "approve" ? "Duyệt đăng ký?" :
            confirmDialog.action === "finish" ? "Đánh dấu hoàn thành?" :
              confirmDialog.action === "unfinish" ? "Đánh dấu chưa hoàn thành?" :
                confirmDialog.action === "delete" ? "Xóa khỏi sự kiện?" :
                  "Từ chối đăng ký?"
        }
        message={
          confirmDialog.action === "delete"
            ? `Bạn có chắc chắn muốn xóa "${confirmDialog.participant?.firstName || confirmDialog.participant?.username}" khỏi sự kiện này?`
            : `Bạn có chắc chắn muốn ${confirmDialog.action === "approve" ? "duyệt" : confirmDialog.action === "finish" ? "đánh dấu hoàn thành" : confirmDialog.action === "unfinish" ? "đánh dấu không hoàn thành" : "từ chối"} đăng ký của "${confirmDialog.participant?.firstName || confirmDialog.participant?.username}"?`
        }
        confirmLabel={
          confirmDialog.action === "approve" ? "Duyệt" :
            confirmDialog.action === "finish" ? "Hoàn thành" :
              confirmDialog.action === "unfinish" ? "Xác nhận" :
                confirmDialog.action === "delete" ? "Xóa" :
                  "Từ chối"
        }
        variant={
          confirmDialog.action === "approve" ? "success" :
            confirmDialog.action === "finish" ? "info" :
              confirmDialog.action === "unfinish" ? "warning" :
                "danger"
        }
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

      {/* Role change dialog */}
      <Dialog open={roleDialog.open} onClose={() => setRoleDialog({ ...roleDialog, open: false })} maxWidth="xs" fullWidth>
        <DialogTitle>Đổi vai trò</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Đổi vai trò của <strong>{roleDialog.participant?.firstName || roleDialog.participant?.username}</strong>:
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Vai trò</InputLabel>
            <Select
              value={roleDialog.newRole}
              label="Vai trò"
              onChange={(e) => setRoleDialog({ ...roleDialog, newRole: e.target.value })}
            >
              <MenuItem value="ATTENDEE">Thành viên</MenuItem>
              <MenuItem value="MANAGER">Quản lý sự kiện</MenuItem>
            </Select>
          </FormControl>
          {roleDialog.newRole === "MANAGER" && (
            <Alert severity="warning" sx={{ mt: 2, fontSize: "12px" }}>
              Người này sẽ có quyền quản lý <strong>chỉ sự kiện này</strong>: duyệt TNV, đánh dấu hoàn thành, v.v.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialog({ ...roleDialog, open: false })}>Hủy</Button>
          <Button variant="contained" onClick={handleRoleChange}>Xác nhận</Button>
        </DialogActions>
      </Dialog>

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
