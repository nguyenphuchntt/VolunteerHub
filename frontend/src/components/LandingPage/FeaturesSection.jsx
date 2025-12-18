import React from "react";

const FeaturesSection = () => {
  return (
    <section className="stats">
      <div className="container-wide">
        <div className="stats-grid">
          <div className="stats-image">
            <img src="/images/stats-image.png" alt="Tree planting" />
          </div>
          <div className="stats-cards">
            <div className="stat-card stat-card-white">
              <h3>+500 tình nguyện viên</h3>
              <p>
                Hơn 500 tình nguyện viên tích cực đã tham gia các hoạt động của
                chúng tôi trong năm qua
              </p>
            </div>
            <div className="stat-card stat-card-green">
              <h3>120+ sự kiện thành công</h3>
              <p>
                Hơn 120 sự kiện tình nguyện đã được tổ chức thành công với sự
                tham gia nhiệt tình của cộng đồng
              </p>
            </div>
          </div>
          <div className="stats-share">
            <img
              src="/images/share-results-bg.svg"
              alt=""
              className="share-bg"
            />
            <div className="share-content">
              <h3>Chia sẻ hành trình tình nguyện của bạn</h3>
            </div>
          </div>
          <div className="stats-donate">
            <div className="donate-tags">
              <span className="tag">Tình Nguyện</span>
              <span className="tag">Cộng Đồng</span>
            </div>
            <div className="donate-content">
              <h3>Đóng góp và giúp đỡ cộng đồng</h3>
              <img src="/images/arrow-circle.svg" alt="" />
            </div>
          </div>
          <div className="stats-event">
            <img src="/images/arrow-circle-alt.svg" alt="" />
            <p>Ngày Tình Nguyện Quốc Tế</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
