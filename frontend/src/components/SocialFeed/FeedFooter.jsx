import React from "react";
import "../../css/FeedFooter.css";

const FeedFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="feed-footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="#about" className="footer-link">
            About
          </a>
          <span className="footer-divider">•</span>
          <a href="#help" className="footer-link">
            Help
          </a>
          <span className="footer-divider">•</span>
          <a href="#privacy" className="footer-link">
            Privacy & Terms
          </a>
        </div>
        <p className="footer-copyright">
          © {currentYear} VolunteerHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default FeedFooter;
