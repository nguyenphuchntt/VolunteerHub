import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../../css/EventCard.css";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/events/${event.id}`);
  };

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: { text: "Upcoming", className: "status-upcoming" },
      ongoing: { text: "Ongoing", className: "status-ongoing" },
      completed: { text: "Completed", className: "status-completed" },
    };
    return badges[status] || badges.upcoming;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const getParticipantText = () => {
    const count = event.participants.length;
    return `${count} joined`;
  };

  const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M12.6667 2.66667H3.33333C2.59695 2.66667 2 3.26362 2 4V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V4C14 3.26362 13.403 2.66667 12.6667 2.66667Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6667 1.33333V4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.33333 1.33333V4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 6.66667H14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const LocationIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M14 6.66667C14 11.3333 8 15.3333 8 15.3333C8 15.3333 2 11.3333 2 6.66667C2 5.07536 2.63214 3.54926 3.75736 2.42404C4.88258 1.29882 6.40869 0.666672 8 0.666672C9.59131 0.666672 11.1174 1.29882 12.2426 2.42404C13.3679 3.54926 14 5.07536 14 6.66667Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 8.66667C9.10457 8.66667 10 7.77124 10 6.66667C10 5.5621 9.10457 4.66667 8 4.66667C6.89543 4.66667 6 5.5621 6 6.66667C6 7.77124 6.89543 8.66667 8 8.66667Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const UsersIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M11.3333 14V12.6667C11.3333 11.9594 11.0524 11.2811 10.5523 10.781C10.0522 10.281 9.37393 10 8.66667 10H3.33333C2.62609 10 1.94781 10.281 1.44772 10.781C0.947625 11.2811 0.666672 11.9594 0.666672 12.6667V14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.00001 7.33333C7.47277 7.33333 8.66667 6.13943 8.66667 4.66667C8.66667 3.19391 7.47277 2 6.00001 2C4.52725 2 3.33334 3.19391 3.33334 4.66667C3.33334 6.13943 4.52725 7.33333 6.00001 7.33333Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.3333 14V12.6667C15.3328 12.0758 15.1362 11.5019 14.7742 11.0349C14.4122 10.5679 13.9053 10.2344 13.3333 10.0867"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6667 2.08667C11.2404 2.23354 11.7489 2.56714 12.1119 3.03488C12.4749 3.50262 12.6719 4.07789 12.6719 4.67C12.6719 5.26212 12.4749 5.83739 12.1119 6.30513C11.7489 6.77287 11.2404 7.10647 10.6667 7.25334"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const statusBadge = getStatusBadge(event.status);

  return (
    <div className="event-card" onClick={handleCardClick}>
      <div className="event-card-image">
        <img src={event.coverImage} alt={event.title} />
        <div className="event-card-overlay">
          <span className={`event-status-badge ${statusBadge.className}`}>
            {statusBadge.text}
          </span>
          <span className="event-category-badge">{event.category}</span>
        </div>
      </div>

      <div className="event-card-content">
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-description">{event.description}</p>

        <div className="event-card-details">
          <div className="event-detail-item">
            <CalendarIcon />
            <span>
              {formatDate(event.date)} • {event.time}
            </span>
          </div>
          <div className="event-detail-item">
            <LocationIcon />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="event-card-footer">
          <div className="event-participants">
            <div className="participants-avatars">
              {event.participants.slice(0, 3).map((participant, index) => (
                <img
                  key={participant.user.id}
                  src={participant.user.avatar}
                  alt={`Participant ${index + 1}`}
                  className="participant-avatar"
                  style={{ zIndex: 3 - index }}
                />
              ))}
              {event.participants.length > 3 && (
                <div className="participants-more">
                  +{event.participants.length - 3}
                </div>
              )}
            </div>
            <span className="participants-text">{getParticipantText()}</span>
          </div>

          <div className="event-host">
            <img
              src={event.host.avatar}
              alt={event.host.name}
              className="host-avatar"
            />
            <span className="host-name">{event.host.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
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
      type: PropTypes.string,
    }).isRequired,
    participants: PropTypes.arrayOf(
      PropTypes.shape({
        user: PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          avatar: PropTypes.string.isRequired,
        }).isRequired,
        role: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default EventCard;
