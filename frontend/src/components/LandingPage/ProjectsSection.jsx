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
              <img src="/images/donrac.jpg" alt="Dọn rác" />
            </div>
          </div>
          <div className="project-card project-card-small" style={{ backgroundImage: 'url(/images/trongcay.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="project-header">
              <div className="project-tag">Trồng Cây Xanh</div>
              <div className="project-link-small">
                <span>Xem thêm</span>
              </div>
            </div>
          </div>
          <div className="project-card project-card-small" style={{ backgroundImage: 'url(/images/bdhv.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="project-header">
              <div className="project-tag">Bình Dân Học Vụ Số</div>
              <div className="project-link-small">
                <span>Xem thêm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
