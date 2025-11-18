import React, { useState, useEffect } from 'react';

function ListView({ events, onEventClick }) {
  // Filter state
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    organization: ''
  });
  const [filteredEvents, setFilteredEvents] = useState(events);

  // Update filtered events when events prop changes
  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const applyFilters = () => {
    let filtered = [...events];
    
    if (filters.category) {
      filtered = filtered.filter(event => 
        event.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    if (filters.location) {
      filtered = filtered.filter(event => 
        event.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.organization) {
      filtered = filtered.filter(event => 
        event.organizer?.toLowerCase().includes(filters.organization.toLowerCase())
      );
    }
    
    setFilteredEvents(filtered);
  };

  // Helper function to safely parse dates (handles both YYYY-MM-DD and ISO timestamp formats)
  const parseEventDate = (dateStr) => {
    if (!dateStr) return new Date();
    // If date already contains 'T', it's an ISO timestamp - parse directly
    if (dateStr.includes('T')) {
      return new Date(dateStr);
    }
    // Otherwise, it's a simple date string - add T12:00:00 to avoid timezone issues
    return new Date(dateStr + 'T12:00:00');
  };

  // Sort events chronologically and group by date
  const groupEventsByDate = (events) => {
    // First, sort events by date (chronological order)
    const sortedEvents = [...events].sort((a, b) => {
      return parseEventDate(a.date) - parseEventDate(b.date);
    });

    const grouped = {};
    sortedEvents.forEach(event => {
      const dateObj = parseEventDate(event.date);
      const dateKey = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          sortDate: dateObj, // Keep actual date for sorting
          events: []
        };
      }
      grouped[dateKey].events.push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByDate(filteredEvents);

  // Helper function to convert time string to 24-hour format for sorting
  const parseTime = (timeStr) => {
    if (!timeStr) return 0;
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toUpperCase();
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return hours * 60 + minutes; // Return total minutes for easy comparison
  };

  // Calculate duration between start and end time
  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return '2 hours'; // Default fallback
    
    const startMinutes = parseTime(startTime);
    const endMinutes = parseTime(endTime);
    
    let durationMinutes = endMinutes - startMinutes;
    
    // Handle overnight events (end time is next day)
    if (durationMinutes < 0) {
      durationMinutes += 24 * 60; // Add 24 hours
    }
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    if (hours === 0) {
      return `${minutes} min`;
    } else if (minutes === 0) {
      return hours === 1 ? '1 hour' : `${hours} hours`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  };

  return (
    <div className="list-view">
      <div className="list-header">
        <div className="filter-controls">
          <select 
            className="filter-select" 
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">Category</option>
            <option value="academic">Academic</option>
            <option value="social">Social</option>
            <option value="sports">Sports</option>
            <option value="career">Career</option>
            <option value="tech">Tech</option>
          </select>
          <select 
            className="filter-select" 
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          >
            <option value="">Location</option>
            <option value="klaus">Klaus</option>
            <option value="coc">College of Computing</option>
            <option value="culc">CULC</option>
            <option value="student-center">Student Center</option>
          </select>
          <select 
            className="filter-select" 
            value={filters.organization}
            onChange={(e) => handleFilterChange('organization', e.target.value)}
          >
            <option value="">Organization</option>
            <option value="sga">Student Government Association</option>
            <option value="coc">College of Computing</option>
            <option value="greek">Greek Life</option>
            <option value="athletics">Athletics</option>
          </select>
          <button className="apply-filter-btn" onClick={applyFilters}>Apply filter</button>
        </div>
      </div>

      <div className="list-content">
        {Object.entries(groupedEvents)
          .sort(([, groupA], [, groupB]) => {
            // Sort date groups chronologically using the stored date object
            return groupA.sortDate - groupB.sortDate;
          })
          .map(([dateKey, dateGroup]) => {
          // Sort events by time within each date
          const sortedDateEvents = [...dateGroup.events].sort((a, b) => {
            return parseTime(a.time) - parseTime(b.time);
          });
          
          return (
            <div key={dateKey} className="date-group">
              <h2 className="date-header">{dateKey}</h2>
              <div className="event-list">
                {sortedDateEvents.map(event => (
                <div key={event.id} className="list-event-card" onClick={() => onEventClick(event)}>
                  <div className="event-time">
                    <span className="time">{event.time}</span>
                    {event.endTime && <span className="duration">{calculateDuration(event.time, event.endTime)}</span>}
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
          );
        })}
      </div>
    </div>
  );
}

export default ListView;
