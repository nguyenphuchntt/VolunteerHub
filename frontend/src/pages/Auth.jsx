import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Auth.css";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignUp = location.pathname === "/signup";
  const [isFlipping, setIsFlipping] = useState(false);

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleSignInChange = (e) => {
    setSignInData({
      ...signInData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUpChange = (e) => {
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement signin logic
    console.log("Sign in data:", signInData);
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement signup logic
    console.log("Sign up data:", signUpData);
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google Sign In
    console.log("Google Sign In");
  };

  const switchToSignUp = () => {
    if (!isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        navigate("/signup");
        setTimeout(() => setIsFlipping(false), 50);
      }, 300);
    }
  };

  const switchToSignIn = () => {
    if (!isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        navigate("/signin");
        setTimeout(() => setIsFlipping(false), 50);
      }, 300);
    }
  };

  return (
    <div className="auth-container">
      <div className={`auth-card-wrapper ${isFlipping ? "flipping" : ""}`}>
        <div className={`auth-card ${isSignUp ? "flipped" : ""}`}>
          {/* Front Side - Sign In */}
          <div className="auth-card-face auth-card-front">
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
                <h2 className="auth-title">Welcome Back</h2>

                <button className="google-btn" onClick={handleGoogleSignIn}>
                  <img src="/images/google-icon.png" alt="Google" />
                  <span>Continue with Google</span>
                </button>

                <div className="divider">- OR -</div>

                <form onSubmit={handleSignInSubmit}>
                  <div className="form-group">
                    <label htmlFor="signin-email">Email Address</label>
                    <input
                      type="email"
                      id="signin-email"
                      name="email"
                      value={signInData.email}
                      onChange={handleSignInChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="signin-password">Password</label>
                    <input
                      type="password"
                      id="signin-password"
                      name="password"
                      value={signInData.password}
                      onChange={handleSignInChange}
                      required
                    />
                  </div>

                  <div className="forgot-password">
                    <a href="/forgot-password">Forgot Password?</a>
                  </div>

                  <button type="submit" className="auth-submit-btn">
                    Sign In
                  </button>
                </form>

                <p className="auth-link-text">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="auth-switch-btn"
                    onClick={switchToSignUp}
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Back Side - Sign Up */}
          <div className="auth-card-face auth-card-back">
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

                <form onSubmit={handleSignUpSubmit}>
                  <div className="form-group">
                    <label htmlFor="signup-fullName">Full Name</label>
                    <input
                      type="text"
                      id="signup-fullName"
                      name="fullName"
                      value={signUpData.fullName}
                      onChange={handleSignUpChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="signup-email">Email Address</label>
                    <input
                      type="email"
                      id="signup-email"
                      name="email"
                      value={signUpData.email}
                      onChange={handleSignUpChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="signup-password">Password</label>
                    <input
                      type="password"
                      id="signup-password"
                      name="password"
                      value={signUpData.password}
                      onChange={handleSignUpChange}
                      required
                    />
                  </div>

                  <button type="submit" className="auth-submit-btn">
                    Create Account
                  </button>
                </form>

                <p className="auth-link-text">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="auth-switch-btn"
                    onClick={switchToSignIn}
                  >
                    Login
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
