import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Header.css";

const Header = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/signin");
  };

  const handleRegister = () => {
    navigate("/signup");
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <div className="logo">VolunteerHub</div>
          <div className="nav-menu">
            <a href="#projects" className="nav-item">
              <img src="/images/nav-icon-1.svg" alt="" />
              <span>Sự Kiện</span>
            </a>
            <a href="#news" className="nav-item">
              <img src="/images/nav-icon-2.svg" alt="" />
              <span>Tin Tức</span>
            </a>
            <a href="#campaigns" className="nav-item">
              <img src="/images/nav-icon-3.svg" alt="" />
              <span>Chiến Dịch</span>
            </a>
          </div>
          <div className="nav-actions">
            <button className="btn-login" onClick={handleLogin}>
              Đăng Nhập
            </button>
            <button className="btn-register" onClick={handleRegister}>
              Đăng Ký
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
