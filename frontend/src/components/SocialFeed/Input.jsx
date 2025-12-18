import PropTypes from "prop-types";
import { TextField, InputAdornment } from "@mui/material";

const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  hasIcon = false,
  multiline = false,
  rows = 3,
  className = "",
  label,
  error = false,
  helperText,
  fullWidth = true,
  sx = {},
  ...props
}) => {
  return (
    <TextField
      type={multiline ? undefined : type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      className={className}
      label={label}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      variant="outlined"
      size="small"
      InputProps={{
        ...(hasIcon && icon && {
          startAdornment: (
            <InputAdornment position="start">
              {icon}
            </InputAdornment>
          ),
        }),
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          backgroundColor: "white",
        },
        ...sx,
      }}
      {...props}
    />
  );
};

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  icon: PropTypes.node,
  hasIcon: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  className: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  fullWidth: PropTypes.bool,
  sx: PropTypes.object,
};

export default Input;

