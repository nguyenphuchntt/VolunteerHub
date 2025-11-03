
import React from "react";
import PropTypes from "prop-types";
import "../../css/ParticipatedEventCard.css";

const ParticipatedEventCard = ({ event, role }) => {
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

  const ClockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.3181 11.6819 1.33333 8 1.33333C4.3181 1.33333 1.33333 4.3181 1.33333 8C1.33333 11.6819 4.3181 14.6667 8 14.6667Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 4V8L10.6667 9.33333"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="participated-event-card">
      <div className="participated-event-image">
        <img src={event.coverImage} alt={event.title} />
      </div>
      <div className="participated-event-info">
        <div>
          <h3 className="participated-event-title">{event.title}</h3>
          <p className="participated-event-description">{event.description}</p>
        </div>
        <div>
          <div className="participated-event-details">
            <div className="detail-item">
              <LocationIcon />
              <span>{event.location}</span>
            </div>
            <div className="detail-item">
              <ClockIcon />
              <span>
                {event.time} - {event.endTime}
              </span>
            </div>
          </div>
          <div className="participated-event-role">
            Role: <span className="role-label">{role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

ParticipatedEventCard.propTypes = {
  event: PropTypes.object.isRequired,
  role: PropTypes.string.isRequired,
};

export default ParticipatedEventCard;
