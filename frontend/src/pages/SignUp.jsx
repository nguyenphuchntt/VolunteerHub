import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Auth.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement signup logic
    console.log("Sign up data:", formData);
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google Sign In
    console.log("Google Sign In");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-left">
          <h1 className="auth-tagline">Kết Nối & Lan Tỏa Yêu Thương</h1>
          <p className="auth-subtitle">
            Mỗi hành động nhỏ – góp phần tạo nên thay đổi lớn.
          </p>
        </div>

        <div className="auth-right">
          <div className="language-selector">
            <span>English (UK)</span>
            <svg width="15" height="10" viewBox="0 0 15 10" fill="none">
              <path d="M7.5 10L0 0H15L7.5 10Z" fill="#989898" />
            </svg>
          </div>

          <div className="auth-form-container">
            <h2 className="auth-title">Create Account</h2>

            <button className="google-btn" onClick={handleGoogleSignIn}>
              <img src="/images/google-icon.png" alt="Google" />
              <span>Continue with Google</span>
            </button>

            <div className="divider">- OR -</div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="auth-submit-btn">
                Create Account
              </button>
            </form>

            <p className="auth-link-text">
              Already have an account? <Link to="/signin">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
