import React from "react";
import PropTypes from "prop-types";
import "../../css/Button.css";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  icon,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} btn-${size} ${className}`}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
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
};

export default Button;
