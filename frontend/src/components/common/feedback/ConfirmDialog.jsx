import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { Close, Warning, Info, CheckCircle, Error } from "@mui/icons-material";

/**
 * ConfirmDialog component for confirmation modals
 */
const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Xác nhận",
  message,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  variant = "default",
  loading = false,
}) => {
  const variantConfig = {
    default: {
      icon: <Info sx={{ fontSize: 48, color: "primary.main" }} />,
      confirmColor: "primary",
    },
    warning: {
      icon: <Warning sx={{ fontSize: 48, color: "warning.main" }} />,
      confirmColor: "warning",
    },
    danger: {
      icon: <Error sx={{ fontSize: 48, color: "error.main" }} />,
      confirmColor: "error",
    },
    success: {
      icon: <CheckCircle sx={{ fontSize: 48, color: "success.main" }} />,
      confirmColor: "success",
    },
  };

  const config = variantConfig[variant] || variantConfig.default;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          p: 1,
        },
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: "grey.500",
        }}
      >
        <Close />
      </IconButton>

      {/* Icon */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          pt: 3,
          pb: 1,
        }}
      >
        {config.icon}
      </Box>

      {/* Title */}
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 600,
          pb: 1,
        }}
      >
        {title}
      </DialogTitle>

      {/* Message */}
      {message && (
        <DialogContent>
          <DialogContentText sx={{ textAlign: "center" }}>
            {message}
          </DialogContentText>
        </DialogContent>
      )}

      {/* Actions */}
      <DialogActions sx={{ px: 3, pb: 3, justifyContent: "center", gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{
            borderRadius: "8px",
            px: 4,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={config.confirmColor}
          disabled={loading}
          sx={{
            borderRadius: "8px",
            px: 4,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {loading ? "Đang xử lý..." : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
