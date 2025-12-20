import React, { useMemo } from "react";

const FeaturesSection = () => {
  // Calculate spherical positions for 20 images using Fibonacci sphere distribution
  const imagePositions = useMemo(() => {
    const positions = [];
    const numImages = 20;
    const radius = 240; // radius of the sphere in pixels
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~137.5 degrees

    for (let i = 0; i < numImages; i++) {
      // Fibonacci sphere algorithm for even distribution
      const y = 1 - (i / (numImages - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Convert to actual pixel positions
      const translateX = x * radius;
      const translateY = y * radius;
      const translateZ = z * radius;

      positions.push({
        transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px)`,
        index: i + 1,
      });
    }
    return positions;
  }, []);

  return (
    <section className="stats">
      <div className="container-wide">
        <div className="stats-grid">
          <div className="stats-image">
            <img src="/images/1.jpg" alt="Tree planting" />
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
          
          {/* 3D Globe with rotating images */}
          <div className="globe-container">
            <div className="globe">
              {imagePositions.map((pos, index) => (
                <div
                  key={index}
                  className="globe-image"
                  style={{ 
                    "--base-transform": pos.transform,
                    transform: pos.transform
                  }}
                >
                  <img
                    src={`/images/${pos.index}.jpg`}
                    alt={`Volunteer activity ${pos.index}`}
                  />
                </div>
              ))}
            </div>
            <div className="globe-shadow"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
