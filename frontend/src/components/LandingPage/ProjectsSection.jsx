import React from "react";

const ProjectsSection = () => {
  return (
    <section className="projects-grid">
      <div className="container-wide">
        <div className="projects-cards">
          <div className="project-card project-card-large">
            <div className="project-info">
              <h3>Chiến dịch Dọn Rác Bảo Vệ Môi Trường</h3>
              <p>
                Đội ngũ tình nguyện viên của chúng tôi tích cực tham gia dọn dẹp
                các khu vực công cộng, bảo vệ môi trường sống xanh sạch đẹp.
              </p>
              <div className="project-link">
                <span>Xem thêm</span>
                <img src="/images/project-decoration.svg" alt="" />
                <img src="/images/arrow-right.svg" alt="" />
              </div>
            </div>
            <div className="project-image">
              <img src="/images/danube-project.png" alt="Dọn rác" />
            </div>
          </div>
          <div className="project-card project-card-small">
            <div className="project-header">
              <div className="project-tag">Trồng Cây Xanh</div>
              <div className="project-link-small">
                <img
                  src="/images/forest-decoration.svg"
                  alt=""
                  className="forest-decoration"
                />
                <span>Xem thêm</span>
              </div>
            </div>
            <img
              src="/images/project-decoration.svg"
              alt=""
              className="project-decoration-bottom"
            />
          </div>
          <div className="project-card project-card-small">
            <div className="project-header">
              <div className="project-tag">Bình Dân Học Vụ Số</div>
              <div className="project-link-small">
                <img
                  src="/images/forest-decoration.svg"
                  alt=""
                  className="forest-decoration"
                />
                <span>Xem thêm</span>
              </div>
            </div>
            <img
              src="/images/project-decoration.svg"
              alt=""
              className="project-decoration-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
