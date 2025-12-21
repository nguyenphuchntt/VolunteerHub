import React from "react";
import "../../css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-logo">VolunteerHub</h3>
            <p className="footer-tagline">Nhiệt huyết tình nguyện viên</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 VolunteerHub. All rights reserved.</p>
          <div className="footer-legal">
            <a>Chính sách bảo mật</a>
            <span>|</span>
            <a>Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
