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

  const handleEventsClick = () => {
    navigate("/events");
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <div className="logo">VolunteerHub</div>
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
