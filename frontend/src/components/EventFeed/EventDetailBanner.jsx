import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../../css/EventDetailBanner.css";

const EventDetailBanner = ({ event }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: { text: "Upcoming", className: "status-upcoming" },
      ongoing: { text: "Ongoing", className: "status-ongoing" },
      completed: { text: "Completed", className: "status-completed" },
    };
    return badges[status] || badges.upcoming;
  };

  const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M16 3H4C2.89543 3 2 3.89543 2 5V17C2 18.1046 2.89543 19 4 19H16C17.1046 19 18 18.1046 18 17V5C18 3.89543 17.1046 3 16 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 1V5M6 1V5M2 9H18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const ClockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 6V10L13 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const LocationIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M17 8C17 13 10 18 10 18C10 18 3 13 3 8C3 6.14348 3.7375 4.36301 5.05025 3.05025C6.36301 1.7375 8.14348 1 10 1C11.8565 1 13.637 1.7375 14.9497 3.05025C16.2625 4.36301 17 6.14348 17 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 10C11.1046 10 12 9.10457 12 8C12 6.89543 11.1046 6 10 6C8.89543 6 8 6.89543 8 8C8 9.10457 8.89543 10 10 10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const UsersIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M14 18V16C14 14.9391 13.5786 13.9217 12.8284 13.1716C12.0783 12.4214 11.0609 12 10 12H4C2.93913 12 1.92172 12.4214 1.17157 13.1716C0.421427 13.9217 0 14.9391 0 16V18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 8C8.65685 8 10 6.65685 10 5C10 3.34315 8.65685 2 7 2C5.34315 2 4 3.34315 4 5C4 6.65685 5.34315 8 7 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 18V16C18.9993 15.1137 18.7044 14.2528 18.1614 13.5523C17.6184 12.8519 16.8581 12.3516 16 12.13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 2.13C13.8604 2.35031 14.623 2.85071 15.1676 3.55232C15.7122 4.25392 16.0078 5.11683 16.0078 6.005C16.0078 6.89318 15.7122 7.75608 15.1676 8.45769C14.623 9.1593 13.8604 9.6597 13 9.88"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const ShareIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M15 6C16.6569 6 18 4.65685 18 3C18 1.34315 16.6569 0 15 0C13.3431 0 12 1.34315 12 3C12 4.65685 13.3431 6 15 6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 13C6.65685 13 8 11.6569 8 10C8 8.34315 6.65685 7 5 7C3.34315 7 2 8.34315 2 10C2 11.6569 3.34315 13 5 13Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 20C16.6569 20 18 18.6569 18 17C18 15.3431 16.6569 14 15 14C13.3431 14 12 15.3431 12 17C12 18.6569 13.3431 20 15 20Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.59 11.51L12.42 14.49M12.41 5.51L7.59 8.49"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const ArrowLeftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const statusBadge = getStatusBadge(event.status);

  return (
    <div className="event-detail-banner">
      {/* Background Image */}
      <div className="banner-background">
        <img src={event.coverImage} alt={event.title} />
        <div className="banner-overlay"></div>
      </div>

      {/* Banner Content */}
      <div className="banner-content">
        <div className="banner-container">
          {/* Back Button */}
          <button className="back-button" onClick={() => navigate("/events")}>
            <ArrowLeftIcon />
            <span>Back to Events</span>
          </button>

          {/* Event Info */}
          <div className="event-info-section">
            <div className="event-badges">
              <span className={`event-status-badge ${statusBadge.className}`}>
                {statusBadge.text}
              </span>
              <span className="event-category-badge">{event.category}</span>
            </div>

            <h1 className="event-title">{event.title}</h1>
            <p className="event-description">
              {event.fullDescription || event.description}
            </p>

            <div className="event-meta">
              <div className="meta-item">
                <CalendarIcon />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="meta-item">
                <ClockIcon />
                <span>{event.time}</span>
              </div>
              <div className="meta-item">
                <LocationIcon />
                <span>{event.location}</span>
              </div>
              <div className="meta-item">
                <UsersIcon />
                <span>
                  {event.participants.count}{" "}
                  {event.participants.limit && `/ ${event.participants.limit}`}{" "}
                  participants
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="event-actions">
              <button className="join-event-btn">
                <UsersIcon />
                <span>Join Event</span>
              </button>
              <button className="share-event-btn">
                <ShareIcon />
                <span>Share</span>
              </button>
            </div>

            {/* Host Info */}
            <div className="event-host-info">
              <img src={event.host.avatar} alt={event.host.name} />
              <div className="host-details">
                <span className="host-label">Hosted by</span>
                <span className="host-name">{event.host.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

EventDetailBanner.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    fullDescription: PropTypes.string,
    coverImage: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["upcoming", "ongoing", "completed"]).isRequired,
    category: PropTypes.string.isRequired,
    host: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    }).isRequired,
    participants: PropTypes.shape({
      count: PropTypes.number.isRequired,
      limit: PropTypes.number,
    }).isRequired,
  }).isRequired,
};

export default EventDetailBanner;
