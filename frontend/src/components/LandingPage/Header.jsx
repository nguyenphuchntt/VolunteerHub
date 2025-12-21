import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Header.css";

const Header = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/signin");
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <div className="logo">
            <img src="/images/logo.png" alt="VolunteerHub" className="logo-img" />
            <span>VolunteerHub</span>
          </div>
          <div className="nav-actions">
            <button className="btn-join" onClick={handleLogin}>
              Tham Gia Ngay
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
