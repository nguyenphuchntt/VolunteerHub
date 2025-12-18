import { useState } from "react";
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
  Avatar,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Download,
  Event,
  People,
  TableChart,
  Code,
  CalendarMonth,
  CheckCircle,
} from "@mui/icons-material";
import { ThreeColumnLayout } from "../../components/common";
import { mockUsers as currentUser } from "../../data/mockData";
import { mockEvents } from "../../data/mockEvents";
import { mockAllUsers } from "../../data/mockAdminData";

const DataExport = () => {
  const user = currentUser[0];
  
  const [exportType, setExportType] = useState("events");
  const [exportFormat, setExportFormat] = useState("csv");
  const [showSuccess, setShowSuccess] = useState(false);

  // Prepare data for preview
  const eventsData = mockEvents.map((e) => ({
    id: e.id,
    title: e.title,
    category: e.category,
    date: e.date,
    location: e.location,
    status: e.status,
    participants: e.participants.length,
    interested: e.stats.interested,
    going: e.stats.going,
  }));

  const volunteersData = mockAllUsers
    .filter((u) => u.role === "volunteer")
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      status: u.status,
      eventsJoined: u.eventsJoined,
      hoursVolunteered: u.hoursVolunteered,
      registeredAt: u.registeredAt,
      lastActive: u.lastActive,
    }));

  const previewData = exportType === "events" ? eventsData : volunteersData;

  const handleExport = () => {
    const data = exportType === "events" ? eventsData : volunteersData;
    let content = "";
    let filename = "";
    let mimeType = "";

    if (exportFormat === "csv") {
      // Convert to CSV
      const headers = Object.keys(data[0]).join(",");
      const rows = data.map((row) => Object.values(row).join(",")).join("\n");
      content = `${headers}\n${rows}`;
      filename = `${exportType}_export_${new Date().toISOString().split("T")[0]}.csv`;
      mimeType = "text/csv";
    } else {
      // Convert to JSON
      content = JSON.stringify(data, null, 2);
      filename = `${exportType}_export_${new Date().toISOString().split("T")[0]}.json`;
      mimeType = "application/json";
    }

    // Create download link
    const blob = new Blob([content], { type: mimeType });
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

  return (
    <ThreeColumnLayout user={user} role="admin" showRightSidebar={true} showSearch={false}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Xuất dữ liệu
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
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
                    variant={exportType === "volunteers" ? "contained" : "outlined"}
                    startIcon={<People />}
                    onClick={() => setExportType("volunteers")}
                    sx={{
                      flex: 1,
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.5,
                    }}
                  >
                    Tình nguyện viên
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
                  {previewData.length} {exportType === "events" ? "sự kiện" : "tình nguyện viên"}
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
                        <TableCell sx={{ fontWeight: 700 }}>Tên sự kiện</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Danh mục</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Ngày</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Tham gia</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell sx={{ fontWeight: 700 }}>Tên</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Sự kiện</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Giờ TN</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewData.slice(0, 5).map((row, index) => (
                    <TableRow key={index}>
                      {exportType === "events" ? (
                        <>
                          <TableCell>{row.title}</TableCell>
                          <TableCell>
                            <Chip label={row.category} size="small" />
                          </TableCell>
                          <TableCell>{new Date(row.date).toLocaleDateString("vi-VN")}</TableCell>
                          <TableCell>
                            <Chip
                              label={row.status}
                              size="small"
                              color={row.status === "upcoming" ? "primary" : "default"}
                            />
                          </TableCell>
                          <TableCell>{row.going}</TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>
                            <Chip
                              label={row.status === "active" ? "Hoạt động" : "Đã khóa"}
                              size="small"
                              color={row.status === "active" ? "success" : "error"}
                            />
                          </TableCell>
                          <TableCell>{row.eventsJoined}</TableCell>
                          <TableCell>{row.hoursVolunteered}h</TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

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
