import React from "react";

const CTASection = () => {
  return (
    <section className="gallery">
      <div className="container">
        <div className="gallery-header">
          <button className="btn-outline">Thư Viện Ảnh</button>
          <h2>
            Xem lại những khoảnh khắc ý nghĩa trong thư viện của chúng tôi
          </h2>
        </div>
        <div className="gallery-preview">
          <img src="/images/gallery-bg.png" alt="Gallery" />
          <div className="gallery-cta">
            <span>XEM TẤT CẢ HÌNH ẢNH</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
