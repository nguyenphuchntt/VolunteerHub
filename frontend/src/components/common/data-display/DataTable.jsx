import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Checkbox,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from "@mui/material";
import { Search, MoreVert, FilterList } from "@mui/icons-material";

/**
 * Reusable DataTable component with sorting, pagination, selection, and search
 */
const DataTable = ({
  columns = [],
  data = [],
  selectable = false,
  searchable = true,
  searchPlaceholder = "Tìm kiếm...",
  onRowClick,
  onSelectionChange,
  actions = [],
  emptyMessage = "Không có dữ liệu",
  rowKey = "id", // Custom key field for rows
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [actionRow, setActionRow] = useState(null);

  // Helper to get unique key for each row
  const getRowKey = (row, index) => {
    if (typeof rowKey === 'function') {
      return rowKey(row);
    }
    return row[rowKey] || row.id || row.eventId || row.accountId || index;
  };

  // Sorting
  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
  };

  // Selection
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = filteredData.map((row) => row.id);
      setSelected(newSelected);
      onSelectionChange?.(newSelected);
    } else {
      setSelected([]);
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((s) => s !== id);
    }

    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Search
  const filteredData = data.filter((row) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return columns.some((col) => {
      const value = row[col.id];
      return value && String(value).toLowerCase().includes(query);
    });
  });

  // Sort
  const sortedData = [...filteredData].sort((a, b) => {
    if (!orderBy) return 0;
    const aVal = a[orderBy];
    const bVal = b[orderBy];
    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Actions menu
  const handleActionClick = (event, row) => {
    event.stopPropagation();
    setActionAnchorEl(event.currentTarget);
    setActionRow(row);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
    setActionRow(null);
  };

  const handleActionSelect = (action) => {
    action.onClick(actionRow);
    handleActionClose();
  };

  // Render cell value
  const renderCellValue = (column, row) => {
    const value = row[column.id];

    if (column.render) {
      return column.render(value, row);
    }

    if (column.type === "chip") {
      const chipColors = {
        success: { bg: "#e8f5e9", color: "#388e3c" },
        warning: { bg: "#fff3e0", color: "#f57c00" },
        error: { bg: "#ffebee", color: "#d32f2f" },
        info: { bg: "#e3f2fd", color: "#1976d2" },
        default: { bg: "#f5f5f5", color: "#616161" },
      };
      const chipColor = column.getChipColor?.(value) || "default";
      const colors = chipColors[chipColor] || chipColors.default;

      return (
        <Chip
          label={value}
          size="small"
          sx={{
            backgroundColor: colors.bg,
            color: colors.color,
            fontWeight: 500,
            fontSize: "12px",
          }}
        />
      );
    }

    return value;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid",
        borderColor: "grey.200",
        overflow: "hidden",
      }}
    >
      {/* Search Bar */}
      {searchable && (
        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "grey.200" }}>
          <TextField
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "grey.500" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "grey.50" }}>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 && selected.length < filteredData.length
                    }
                    checked={
                      filteredData.length > 0 && selected.length === filteredData.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sortDirection={orderBy === column.id ? order : false}
                  sx={{
                    fontWeight: 600,
                    fontSize: "13px",
                    color: "text.secondary",
                    width: column.width,
                  }}
                >
                  {column.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              {actions.length > 0 && (
                <TableCell sx={{ width: 60 }} />
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  sx={{ textAlign: "center", py: 8, color: "text.secondary" }}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => {
                const rowId = getRowKey(row, index);
                const isItemSelected = isSelected(rowId);
                return (
                  <TableRow
                    key={rowId}
                    hover
                    onClick={() => onRowClick?.(row)}
                    selected={isItemSelected}
                    sx={{
                      cursor: onRowClick ? "pointer" : "default",
                      "&:last-child td": { borderBottom: 0 },
                    }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectRow(rowId);
                          }}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.id} sx={{ fontSize: "14px" }}>
                        {renderCellValue(column, row)}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => handleActionClick(e, row)}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}

          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Số hàng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} trong ${count}`
        }
      />

      {/* Actions Menu */}
      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl)}
        onClose={handleActionClose}
        PaperProps={{
          elevation: 2,
          sx: { borderRadius: "8px", minWidth: 150 },
        }}
      >
        {actionRow && actions.filter(action => !action.show || action.show(actionRow)).map((action) => (
          <MenuItem
            key={action.label}
            onClick={() => handleActionSelect(action)}
            sx={{
              fontSize: "14px",
              color: action.color || "text.primary",
            }}
          >
            {action.icon && (
              <Box component="span" sx={{ mr: 1.5, display: "flex" }}>
                {action.icon}
              </Box>
            )}
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
};

export default DataTable;
