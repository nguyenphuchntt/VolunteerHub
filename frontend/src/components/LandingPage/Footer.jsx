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

          <div className="footer-links">
            <div className="footer-column">
              <h4>Về Chúng Tôi</h4>
              <ul>
                <li>
                  <a>Giới thiệu</a>
                </li>
                <li>
                  <a>Sứ mệnh</a>
                </li>
                <li>
                  <a>Đội ngũ</a>
                </li>
                <li>
                  <a>Liên hệ</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Hoạt Động</h4>
              <ul>
                <li>
                  <a>Sự kiện</a>
                </li>
                <li>
                  <a>Chiến dịch</a>
                </li>
                <li>
                  <a>Dự án</a>
                </li>
                <li>
                  <a>Tình nguyện</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Tài Nguyên</h4>
              <ul>
                <li>
                  <a>Blog</a>
                </li>
                <li>
                  <a>Tin tức</a>
                </li>
                <li>
                  <a>Thư viện</a>
                </li>
                <li>
                  <a>FAQ</a>
                </li>
              </ul>
            </div>
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
