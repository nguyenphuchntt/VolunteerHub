import React, { useState } from "react";

const TestimonialsSection = () => {
  const [openAccordion, setOpenAccordion] = useState(1);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <section className="get-involved">
      <div className="container">
        <div className="involved-header">
          <div className="involved-title">
            <h2>Tham Gia Cùng Chúng Tôi</h2>
            <img src="/images/leaf-icon.svg" alt="" />
          </div>
          <p>
            VolunteerHub đã thực hiện nhiều dự án thành công trong việc phục vụ
            cộng đồng và lan tỏa yêu thương đến mọi người.
          </p>
        </div>
        <div className="accordion">
          <div
            className={`accordion-item ${openAccordion === 0 ? "open" : ""}`}
          >
            <div
              className="accordion-header"
              onClick={() => toggleAccordion(0)}
            >
              <h3>Bạn có thể trở thành tình nguyện viên</h3>
              <div className="accordion-icon">
                <img
                  src={
                    openAccordion === 0
                      ? "/images/arrow-up.svg"
                      : "/images/arrow-down.svg"
                  }
                  alt=""
                />
              </div>
            </div>
          </div>
          <div
            className={`accordion-item ${openAccordion === 1 ? "open" : ""}`}
          >
            <div
              className="accordion-header"
              onClick={() => toggleAccordion(1)}
            >
              <h3>Bạn có thể chia sẻ thông tin</h3>
              <div className="accordion-icon">
                <img
                  src={
                    openAccordion === 1
                      ? "/images/arrow-up.svg"
                      : "/images/arrow-down.svg"
                  }
                  alt=""
                />
              </div>
            </div>
            {openAccordion === 1 && (
              <div className="accordion-content">
                <p>
                  Giúp chúng tôi lan tỏa thông điệp về tầm quan trọng của việc
                  giúp đỡ cộng đồng bằng cách chia sẻ tin tức và bài viết của
                  chúng tôi trên mạng xã hội.
                </p>
              </div>
            )}
          </div>
          <div
            className={`accordion-item ${openAccordion === 2 ? "open" : ""}`}
          >
            <div
              className="accordion-header"
              onClick={() => toggleAccordion(2)}
            >
              <h3>Bạn có thể quyên góp từ thiện</h3>
              <div className="accordion-icon">
                <img
                  src={
                    openAccordion === 2
                      ? "/images/arrow-up.svg"
                      : "/images/arrow-down.svg"
                  }
                  alt=""
                />
              </div>
            </div>
          </div>
          <div
            className={`accordion-item ${openAccordion === 3 ? "open" : ""}`}
          >
            <div
              className="accordion-header"
              onClick={() => toggleAccordion(3)}
            >
              <h3>Bạn có thể tham gia các chiến dịch</h3>
              <div className="accordion-icon">
                <img
                  src={
                    openAccordion === 3
                      ? "/images/arrow-up.svg"
                      : "/images/arrow-down.svg"
                  }
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
