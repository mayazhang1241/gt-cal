import React, { useState } from 'react';
import './RSVPList.css';

function RSVPList({ attendees = [], onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter attendees based on search query
  const filteredAttendees = attendees.filter(attendee => {
    const fullName = `${attendee.firstName} ${attendee.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="rsvp-list-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search attendees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="attendees-list">
        <div className="list-header">
          <div className="header-cell">Name</div>
          <div className="header-cell">RSVP Date</div>
          <div className="header-cell">Status</div>
        </div>

        {filteredAttendees.length === 0 ? (
          <div className="no-results">
            {searchQuery ? "No matching attendees found" : "No attendees yet"}
          </div>
        ) : (
          <div className="list-body">
            {filteredAttendees.map(attendee => (
              <div key={attendee.id} className="list-row">
                <div className="name-cell">
                  <div className="attendee-avatar">
                    {attendee.firstName[0]}{attendee.lastName[0]}
                  </div>
                  <div className="attendee-info">
                    <div className="attendee-name">
                      {attendee.firstName} {attendee.lastName}
                    </div>
                    <div className="attendee-email">
                      {attendee.email}
                    </div>
                  </div>
                </div>
                <div className="date-cell">
                  {new Date(attendee.rsvpDate).toLocaleDateString()}
                </div>
                <div className="status-cell">
                  <span className={`status-badge ${attendee.status.toLowerCase()}`}>
                    {attendee.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="list-footer">
        <div className="attendee-count">
          {filteredAttendees.length} {filteredAttendees.length === 1 ? 'attendee' : 'attendees'}
        </div>
      </div>
    </div>
  );
}

export default RSVPList;
