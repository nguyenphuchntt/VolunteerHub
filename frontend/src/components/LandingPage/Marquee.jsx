import React, { useState, useEffect, useRef } from "react";

const Marquee = () => {
  const [marqueeRepeat, setMarqueeRepeat] = useState(2);
  const marqueeRef = useRef(null);

  useEffect(() => {
    const calculateMarqueeRepeat = () => {
      if (marqueeRef.current) {
        const marqueeWidth = marqueeRef.current.offsetWidth;
        const contentWidth =
          marqueeRef.current.querySelector(".marquee-content")?.offsetWidth ||
          500;

        // Calculate how many times we need to repeat to fill at least 2x the viewport
        const repeatCount = Math.ceil((marqueeWidth * 2) / contentWidth);
        setMarqueeRepeat(Math.max(repeatCount, 3)); // Minimum 3 for smooth loop
      }
    };

    // Calculate on mount and window resize
    calculateMarqueeRepeat();
    window.addEventListener("resize", calculateMarqueeRepeat);

    return () => window.removeEventListener("resize", calculateMarqueeRepeat);
  }, []);

  // Marquee content items
  const marqueeItems = [
    { type: "icon", src: "/images/sun-line.svg" },
    { type: "text", content: "Nhiệt Huyết Tình Nguyện Viên" },
    { type: "icon", src: "/images/sun-fill.svg" },
    { type: "text", content: "Nhiệt Huyết Tình Nguyện Viên" },
    { type: "icon", src: "/images/sun-line.svg" },
    { type: "text", content: "Nhiệt Huyết Tình Nguyện Viên" },
    { type: "icon", src: "/images/sun-fill.svg" },
    { type: "text", content: "Nhiệt Huyết Tình Nguyện Viên" },
  ];

  const renderMarqueeContent = () => {
    return marqueeItems.map((item, index) =>
      item.type === "icon" ? (
        <img key={`item-${index}`} src={item.src} alt="" />
      ) : (
        <span key={`item-${index}`}>{item.content}</span>
      )
    );
  };

  return (
    <div className="marquee" ref={marqueeRef}>
      <div
        className="marquee-track"
        style={{ "--marquee-items": marqueeRepeat }}
      >
        {[...Array(marqueeRepeat)].map((_, i) => (
          <div
            key={i}
            className="marquee-content"
            aria-hidden={i > 0 ? "true" : undefined}
          >
            {renderMarqueeContent()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
