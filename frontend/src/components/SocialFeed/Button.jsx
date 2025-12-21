import PropTypes from "prop-types";
import { Button as MuiButton } from "@mui/material";

// Map custom variants to MUI variants
const variantMap = {
  primary: "contained",
  secondary: "outlined",
  text: "text",
  icon: "text",
};

// Map custom sizes to MUI sizes
const sizeMap = {
  small: "small",
  medium: "medium",
  large: "large",
};

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  icon,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  sx = {},
  ...props
}) => {
  const muiVariant = variantMap[variant] || "contained";
  const muiSize = sizeMap[size] || "medium";

  return (
    <MuiButton
      type={type}
      variant={muiVariant}
      size={muiSize}
      onClick={onClick}
      disabled={disabled}
      className={className}
      startIcon={icon}
      sx={{
        ...(variant === "icon" && {
          minWidth: "auto",
          padding: "8px",
        }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(["primary", "secondary", "text", "icon"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  icon: PropTypes.node,
  onClick: PropTypes.func,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  sx: PropTypes.object,
};

export default Button;

