import React from "react";

const AboutSection = () => {
  return (
    <section className="about-projects">
      <div className="container">
        <div className="section-row">
          <div className="about-content">
            <p className="section-desc">
              VolunteerHub đã tổ chức nhiều dự án tình nguyện thành công phục vụ
              cộng đồng và xã hội.
            </p>
            <div className="about-details">
              <h2>
                Chúng tôi nỗ lực xây dựng cộng đồng tốt đẹp hơn cho thế hệ tương
                lai.
              </h2>
              <div className="about-actions">
                <button className="btn-primary">Về Chúng Tôi</button>
                <button className="btn-text">
                  Xem thêm
                  <img src="/images/arrow-right.svg" alt="" />
                </button>
              </div>
            </div>
          </div>
          <div className="projects-content">
            <button className="btn-outline">Dự Án Của Chúng Tôi</button>
            <div className="projects-desc">
              <p>
                Chúng tôi tổ chức các sự kiện, chiến dịch và gây quỹ để thực
                hiện các dự án phục vụ{" "}
              </p>
              <span className="highlight-inline">cộng đồng</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
