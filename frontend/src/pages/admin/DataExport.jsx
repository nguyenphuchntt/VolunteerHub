import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
  TextField,
} from "@mui/material";
import {
  Download,
  Event,
  People,
  TableChart,
  Code,
  CheckCircle,
  Refresh,
} from "@mui/icons-material";
import { ThreeColumnLayout } from "../../components/common";
import { useAuth } from "../../context/AuthContext";
import { adminService } from "../../api";
import { getCategoryLabel } from "../../constants/categories";

const DataExport = () => {
  const { user } = useAuth();
  
  const [exportType, setExportType] = useState("events"); // events, eventUsers
  const [exportFormat, setExportFormat] = useState("csv");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data states
  const [eventsData, setEventsData] = useState([]);
  const [eventUsersData, setEventUsersData] = useState([]);
  
  // Filter states
  const [filterEventId, setFilterEventId] = useState("");
  const [filterAccountId, setFilterAccountId] = useState("");

  // Fetch all events
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAllEvents();
      setEventsData(data || []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Không thể tải dữ liệu sự kiện.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch event users based on filter
  const fetchEventUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (filterEventId) {
        data = await adminService.getAllEventUsersByEvent(filterEventId);
      } else if (filterAccountId) {
        data = await adminService.getAllEventUsersByAccount(filterAccountId);
      } else {
        data = await adminService.getAllEventUsers();
      }
      setEventUsersData(data || []);
    } catch (err) {
      console.error("Failed to fetch event users:", err);
      setError("Không thể tải dữ liệu đăng ký.");
    } finally {
      setLoading(false);
    }
  }, [filterEventId, filterAccountId]);

  // Initial fetch based on export type
  useEffect(() => {
    if (exportType === "events") {
      fetchEvents();
    } else {
      fetchEventUsers();
    }
  }, [exportType, fetchEvents, fetchEventUsers]);

  // Get preview data
  const previewData = exportType === "events" ? eventsData : eventUsersData;

  // Prepare export data with proper columns
  const prepareEventsExport = () => {
    return eventsData.map((e) => ({
      eventId: e.eventId,
      title: e.title,
      category: e.category,
      location: e.location,
      status: e.status,
      startAt: e.startAt,
      endAt: e.endAt,
      attendeeCount: e.attendeeCount || 0,
      likeCount: e.likeCount || 0,
      createdAt: e.createAt,
    }));
  };

  const prepareEventUsersExport = () => {
    return eventUsersData.map((eu) => ({
      eventId: eu.eventId,
      eventTitle: eu.title,
      accountId: eu.accountId,
      username: eu.username,
      firstName: eu.firstName,
      lastName: eu.lastName,
      role: eu.role,
      status: eu.status,
      registeredAt: eu.registeredAt,
    }));
  };

  const handleExport = () => {
    const data = exportType === "events" ? prepareEventsExport() : prepareEventUsersExport();
    
    if (data.length === 0) {
      setError("Không có dữ liệu để xuất.");
      return;
    }

    let content = "";
    let filename = "";
    let mimeType = "";

    if (exportFormat === "csv") {
      // Convert to CSV
      const headers = Object.keys(data[0]).join(",");
      const rows = data.map((row) => 
        Object.values(row).map(val => {
          // Escape commas and quotes in CSV
          if (typeof val === "string" && (val.includes(",") || val.includes('"'))) {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val ?? "";
        }).join(",")
      ).join("\n");
      content = `${headers}\n${rows}`;
      filename = `${exportType}_export_${new Date().toISOString().split("T")[0]}.csv`;
      mimeType = "text/csv;charset=utf-8";
    } else {
      // Convert to JSON
      content = JSON.stringify(data, null, 2);
      filename = `${exportType}_export_${new Date().toISOString().split("T")[0]}.json`;
      mimeType = "application/json";
    }

    // Create download link with BOM for UTF-8 CSV
    const bom = exportFormat === "csv" ? "\uFEFF" : "";
    const blob = new Blob([bom + content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setShowSuccess(true);
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDING: "Chờ duyệt",
      SCHEDULED: "Đã duyệt",
      STARTED: "Đang diễn ra",
      FINISHED: "Hoàn thành",
      CANCELLED: "Đã hủy",
      APPROVED: "Đã duyệt",
      REJECTED: "Từ chối",
    };
    return labels[status?.toUpperCase()] || status;
  };

  return (
    <ThreeColumnLayout user={user} role="admin" showRightSidebar={true} showSearch={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Xuất dữ liệu
          </Typography>
          <Button
            size="small"
            startIcon={<Refresh />}
            onClick={exportType === "events" ? fetchEvents : fetchEventUsers}
            disabled={loading}
            sx={{ textTransform: "none" }}
          >
            Làm mới
          </Button>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Export Options */}
        <Card
          elevation={0}
          sx={{ borderRadius: "16px", border: "1px solid", borderColor: "grey.200", mb: 3 }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>
              Tùy chọn xuất dữ liệu
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
              {/* Export Type */}
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                  Loại dữ liệu
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant={exportType === "events" ? "contained" : "outlined"}
                    startIcon={<Event />}
                    onClick={() => setExportType("events")}
                    sx={{
                      flex: 1,
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.5,
                    }}
                  >
                    Sự kiện
                  </Button>
                  <Button
                    variant={exportType === "eventUsers" ? "contained" : "outlined"}
                    startIcon={<People />}
                    onClick={() => setExportType("eventUsers")}
                    sx={{
                      flex: 1,
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.5,
                    }}
                  >
                    Đăng ký SK
                  </Button>
                </Box>
              </Box>

              {/* Export Format */}
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                  Định dạng
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant={exportFormat === "csv" ? "contained" : "outlined"}
                    startIcon={<TableChart />}
                    onClick={() => setExportFormat("csv")}
                    sx={{
                      flex: 1,
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.5,
                    }}
                  >
                    CSV
                  </Button>
                  <Button
                    variant={exportFormat === "json" ? "contained" : "outlined"}
                    startIcon={<Code />}
                    onClick={() => setExportFormat("json")}
                    sx={{
                      flex: 1,
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.5,
                    }}
                  >
                    JSON
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Filters for Event Users */}
            {exportType === "eventUsers" && (
              <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                <TextField
                  label="Lọc theo Event ID"
                  size="small"
                  value={filterEventId}
                  onChange={(e) => {
                    setFilterEventId(e.target.value);
                    setFilterAccountId("");
                  }}
                  sx={{ minWidth: 180 }}
                />
                <Button
                  variant="outlined"
                  onClick={fetchEventUsers}
                  disabled={loading}
                  sx={{ textTransform: "none" }}
                >
                  Áp dụng
                </Button>
              </Box>
            )}

            {/* Export Summary */}
            <Box
              sx={{
                p: 2,
                borderRadius: "12px",
                backgroundColor: "rgba(136, 178, 139, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Sẽ xuất
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary.main">
                  {loading ? "Đang tải..." : `${previewData.length} ${exportType === "events" ? "sự kiện" : "bản ghi"}`}
                </Typography>
              </Box>
              <Chip
                label={exportFormat.toUpperCase()}
                sx={{
                  backgroundColor: "primary.main",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Data Preview */}
        <Card
          elevation={0}
          sx={{ borderRadius: "16px", border: "1px solid", borderColor: "grey.200", mb: 3 }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Xem trước dữ liệu
            </Typography>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : previewData.length > 0 ? (
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{ border: "1px solid", borderColor: "grey.200", borderRadius: "12px" }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {exportType === "events" ? (
                        <>
                          <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Tên sự kiện</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Danh mục</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>TNV</TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell sx={{ fontWeight: 700 }}>Event ID</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Sự kiện</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Người dùng</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Vai trò</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                        </>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {previewData.slice(0, 5).map((row, index) => (
                      <TableRow key={index}>
                        {exportType === "events" ? (
                          <>
                            <TableCell>{row.eventId}</TableCell>
                            <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {row.title}
                            </TableCell>
                            <TableCell>
                              <Chip label={getCategoryLabel(row.category)} size="small" />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={getStatusLabel(row.status)}
                                size="small"
                                color={row.status === "SCHEDULED" || row.status === "STARTED" ? "primary" : "default"}
                              />
                            </TableCell>
                            <TableCell>{row.attendeeCount || 0}</TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>{row.eventId}</TableCell>
                            <TableCell sx={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {row.title}
                            </TableCell>
                            <TableCell>{row.firstName} {row.lastName || row.username}</TableCell>
                            <TableCell>
                              <Chip
                                label={row.role === "MANAGER" ? "Quản lý" : "Thành viên"}
                                size="small"
                                color={row.role === "MANAGER" ? "primary" : "default"}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={getStatusLabel(row.status)}
                                size="small"
                                color={row.status === "APPROVED" ? "success" : row.status === "PENDING" ? "warning" : "default"}
                              />
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                Không có dữ liệu
              </Typography>
            )}

            {previewData.length > 5 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                Hiển thị 5/{previewData.length} bản ghi
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Export Button */}
        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={<Download />}
          onClick={handleExport}
          disabled={loading || previewData.length === 0}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 700,
            py: 1.5,
            fontSize: "16px",
          }}
        >
          Tải xuống {exportFormat.toUpperCase()}
        </Button>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          icon={<CheckCircle />}
          severity="success"
          sx={{ borderRadius: "12px" }}
          onClose={() => setShowSuccess(false)}
        >
          Xuất dữ liệu thành công!
        </Alert>
      </Snackbar>
    </ThreeColumnLayout>
  );
};

export default DataExport;
