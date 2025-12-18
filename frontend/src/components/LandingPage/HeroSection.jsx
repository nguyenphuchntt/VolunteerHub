import React from "react";

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-visual">
            <img
              src="/images/hero-illustration.svg"
              alt="Volunteer"
              className="hero-img"
            />
            <div className="hero-text-wrapper">
              <h1 className="hero-title">
                <span>Cùng chúng tôi </span>
                <span className="highlight">lan tỏa yêu thương</span>
                <span> đến cộng đồng</span>
              </h1>
            </div>
            <img
              src="/images/hero-decoration.svg"
              alt=""
              className="hero-decoration"
            />
          </div>
          <div className="hero-description">
            <p>
              Nền tảng kết nối và quản lý các hoạt động tình nguyện: trồng cây,
              dọn rác, từ thiện, bình dân học vụ số và nhiều hoạt động ý nghĩa
              khác
            </p>
            <button className="btn-primary">
              <span>Tìm Hiểu Thêm</span>
              <img src="/images/arrow-up-right.svg" alt="" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
