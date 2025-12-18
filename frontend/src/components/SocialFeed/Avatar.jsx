import PropTypes from "prop-types";
import { Avatar as MuiAvatar, Badge } from "@mui/material";

// Map custom sizes to pixel values
const sizeMap = {
  "x-small": 24,
  small: 32,
  default: 40,
  large: 56,
};

const Avatar = ({
  src,
  alt = "User avatar",
  size = "default",
  hasBadge = false,
  bordered = false,
  sx = {},
  ...props
}) => {
  const pixelSize = sizeMap[size] || 40;

  const avatarComponent = (
    <MuiAvatar
      src={src}
      alt={alt}
      sx={{
        width: pixelSize,
        height: pixelSize,
        ...(bordered && {
          border: "2px solid",
          borderColor: "primary.main",
        }),
        ...sx,
      }}
      {...props}
    />
  );

  if (hasBadge) {
    return (
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant="dot"
        color="success"
        sx={{
          "& .MuiBadge-badge": {
            width: 12,
            height: 12,
            borderRadius: "50%",
            border: "2px solid white",
          },
        }}
      >
        {avatarComponent}
      </Badge>
    );
  }

  return avatarComponent;
};

Avatar.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  size: PropTypes.oneOf(["x-small", "small", "default", "large"]),
  hasBadge: PropTypes.bool,
  bordered: PropTypes.bool,
  sx: PropTypes.object,
};

export default Avatar;

