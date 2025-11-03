import React from 'react';

function ListView({ events, onEventClick }) {
  // Group events by date
  const groupEventsByDate = (events) => {
    const grouped = {};
    events.forEach(event => {
      const date = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByDate(events);

  return (
    <div className="list-view">
      <div className="list-header">
        <div className="filter-controls">
          <select className="filter-select" defaultValue="">
            <option value="">Category</option>
            <option value="academic">Academic</option>
            <option value="social">Social</option>
            <option value="sports">Sports</option>
            <option value="career">Career</option>
          </select>
          <select className="filter-select" defaultValue="">
            <option value="">Location</option>
            <option value="klaus">Klaus</option>
            <option value="coc">College of Computing</option>
            <option value="culc">CULC</option>
            <option value="student-center">Student Center</option>
          </select>
          <select className="filter-select" defaultValue="">
            <option value="">Organization</option>
            <option value="sga">Student Government Association</option>
            <option value="coc">College of Computing</option>
            <option value="greek">Greek Life</option>
            <option value="athletics">Athletics</option>
          </select>
          <button className="apply-filter-btn">Apply filter</button>
        </div>
      </div>

      <div className="list-content">
        {Object.entries(groupedEvents).map(([date, dateEvents]) => (
          <div key={date} className="date-group">
            <h2 className="date-header">{date}</h2>
            <div className="event-list">
              {dateEvents.map(event => (
                <div key={event.id} className="list-event-card" onClick={() => onEventClick(event)}>
                  <div className="event-time">
                    <span className="time">{event.time}</span>
                    <span className="duration">2 hours</span>
                  </div>
                  <div className="event-details">
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-location">{event.location}</p>
                    <p className="event-organizer">{event.organizer}</p>
                  </div>
                  <div className="event-meta">
                    <div className="meta-item">
                      <span className="meta-label">Attendees</span>
                      <span className="meta-value">{event.attendees}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Comments</span>
                      <span className="meta-value">{event.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListView;
