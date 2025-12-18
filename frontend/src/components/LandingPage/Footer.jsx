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
                  <a href="#about">Giới thiệu</a>
                </li>
                <li>
                  <a href="#mission">Sứ mệnh</a>
                </li>
                <li>
                  <a href="#team">Đội ngũ</a>
                </li>
                <li>
                  <a href="#contact">Liên hệ</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Hoạt Động</h4>
              <ul>
                <li>
                  <a href="#events">Sự kiện</a>
                </li>
                <li>
                  <a href="#campaigns">Chiến dịch</a>
                </li>
                <li>
                  <a href="#projects">Dự án</a>
                </li>
                <li>
                  <a href="#volunteer">Tình nguyện</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Tài Nguyên</h4>
              <ul>
                <li>
                  <a href="#blog">Blog</a>
                </li>
                <li>
                  <a href="#news">Tin tức</a>
                </li>
                <li>
                  <a href="#gallery">Thư viện</a>
                </li>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Kết Nối</h4>
              <div className="social-links">
                <a href="#" aria-label="Facebook">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" aria-label="LinkedIn">
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 VolunteerHub. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#privacy">Chính sách bảo mật</a>
            <span>|</span>
            <a href="#terms">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
