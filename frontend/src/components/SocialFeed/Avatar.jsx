import React from "react";
import PropTypes from "prop-types";
import "../../css/Avatar.css";

const Avatar = ({
  src,
  alt = "User avatar",
  size = "default",
  hasBadge = false,
  bordered = false,
}) => {
  const sizeClass = `avatar-${size}`;
  const borderedClass = bordered ? "avatar-bordered" : "";

  return (
    <div className={`avatar ${sizeClass} ${borderedClass}`}>
      <div className="avatar-img">
        <img src={src} alt={alt} />
      </div>
      {hasBadge && <div className="avatar-badge" />}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  size: PropTypes.oneOf(["x-small", "small", "default", "large"]),
  hasBadge: PropTypes.bool,
  bordered: PropTypes.bool,
};

export default Avatar;
