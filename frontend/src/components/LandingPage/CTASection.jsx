import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { eventService } from "../../api";
import { buildEventUrl } from "../../utils/urlUtils";

const CTASection = () => {
  const navigate = useNavigate();
  const [hotEvents, setHotEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotEvents = async () => {
      try {
        const response = await eventService.getHotEvents(0, 3);
        // Filter out PENDING and CANCELLED events
        const activeEvents = (response.content || [])
          .filter(event => event.status !== 'PENDING' && event.status !== 'CANCELLED')
          .slice(0, 3);
        setHotEvents(activeEvents);
      } catch (error) {
        console.error("Failed to fetch hot events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotEvents();
  }, []);

  const handleEventClick = (event) => {
    navigate(buildEventUrl(event));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusLabel = (status) => {
    const labels = {
      SCHEDULED: "Sắp diễn ra",
      STARTED: "Đang diễn ra",
      FINISHED: "Đã kết thúc",
    };
    return labels[status] || status;
  };

  const getStatusClass = (status) => {
    const classes = {
      SCHEDULED: "status-scheduled",
      STARTED: "status-started",
      FINISHED: "status-finished",
    };
    return classes[status] || "";
  };

  if (loading) {
    return (
      <section className="hot-events">
        <div className="container">
          <div className="hot-events-header">
            <h2>🔥 Sự Kiện Nổi Bật</h2>
            <p>Đang tải...</p>
          </div>
        </div>
      </section>
    );
  }

  if (hotEvents.length === 0) {
    return null;
  }

  return (
    <section className="hot-events">
      <div className="container">
        <div className="hot-events-header">
          <h2> Sự Kiện Nổi Bật</h2>
          <p>Tham gia ngay những sự kiện được yêu thích nhất</p>
        </div>
        <div className="hot-events-grid">
          {hotEvents.map((event, index) => (
            <div 
              key={event.eventId} 
              className={`hot-event-card ${index === 0 ? 'featured' : ''}`}
              onClick={() => handleEventClick(event)}
            >
              <div className="hot-event-image">
                {event.coverImageUrl ? (
                  <img src={event.coverImageUrl} alt={event.title} />
                ) : (
                  <div className="hot-event-placeholder">
                    <span>🌱</span>
                  </div>
                )}
                <div className="hot-event-badge">
                  <span className="ranking">#{index + 1}</span>
                </div>
                <div className={`hot-event-status ${getStatusClass(event.status)}`}>
                  {getStatusLabel(event.status)}
                </div>
              </div>
              <div className="hot-event-content">
                <h3>{event.title}</h3>
                <p className="hot-event-description">
                  {event.shortDescription || event.description?.substring(0, 100) + "..."}
                </p>
                <div className="hot-event-meta">
                  <div className="meta-item">
                    <span className="meta-icon">📅</span>
                    <span>{formatDate(event.startTime)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">👥</span>
                    <span>{event.attendeeCount || 0} người tham gia</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">❤️</span>
                    <span>{event.likeCount || 0} lượt thích</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="hot-events-footer">
          <button className="btn-explore" onClick={() => navigate("/explore")}>
            Khám phá tất cả sự kiện
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
