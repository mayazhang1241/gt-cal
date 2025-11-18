import React, { useState, useEffect } from 'react';
import './App.css';
import EventModal from './EventModal.jsx';
import ListView from './ListView.jsx';
import EventDetails from './EventDetails.jsx';
import './ListView.css';
import './EventDetails.css';
import axios from 'axios';
import logo from './assets/GTCal_icon.png';
import API_BASE_URL from './config.js';



// Landing Page Component
function LandingPage({ onEnterCalendar }) {
  useEffect(() => {
    document.title = "GT-Cal";
  },[]);
  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="hero-card">
          <div className="logo-section">
            <div className="logo-wrapper">
              <img src= {logo} alt="GT-Cal Logo" className="hero-logo" />
            </div>
            <h3 className="hero-title">GT-Cal</h3>
            
            <p className="hero-subtitle">Georgia Tech's Social Calendar</p>
            
          </div>
          
          <div className="hero-description">
            <p>Discover, create, and share campus events with fellow Yellow Jackets.</p>
            <p>Your gateway to Georgia Tech's vibrant student life.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">Calendar</div>
              <h3>Monthly Calendar</h3>
              <p>View all events in an intuitive monthly calendar</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">Create</div>
              <h3>Event Creation</h3>
              <p>Create and manage your own campus events</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">Social</div>
              <h3>Social Features</h3>
              <p>Like, attend, and discuss events with peers</p>
            </div>
          </div>
          
          <button className="cta-button" onClick={onEnterCalendar}>
            <span>Enter GT-Cal</span>
            <div className="button-arrow">→</div>
          </button>
        </div>
      </div>
    </div>
  );
}

// Calendar Grid Component
function CalendarGrid({ events, onDayClick, onEventClick, viewMode, setViewMode }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDayEventsModal, setShowDayEventsModal] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [selectedDayDate, setSelectedDayDate] = useState(null);
  
  // Filter state
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    organization: ''
  });
  const [filteredEvents, setFilteredEvents] = useState(events);
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const endingDayOfWeek = lastDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    // Add empty cells for days after the last day of the month
    for (let i = endingDayOfWeek; i < 6; i++) {
      days.push(null);
    }
    
    return days;
  };
  
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };
  
  // Update filtered events when events prop changes
  React.useEffect(() => {
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
  
  const getEventsForDay = (date) => {
    if (!date) return [];
    return filteredEvents.filter(event => {
      const eventDate = parseEventDate(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };
  
  const handleSeeMoreClick = (date, dayEvents, e) => {
    e.stopPropagation();
    setSelectedDayDate(date);
    setSelectedDayEvents(dayEvents);
    setShowDayEventsModal(true);
  };
  
  const days = getDaysInMonth(currentDate);
  
  // Calculate number of weeks in the month
  const numWeeks = Math.ceil((days.length) / 7);
  
  return (
    <div className="calendar-wrapper">
      <div className="calendar-controls">
        <div className="calendar-header">
          <div className="month-navigation">
            <button className="nav-button" onClick={() => navigateMonth(-1)}>
              <span>‹</span>
            </button>
            <h2 className="calendar-title">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button className="nav-button" onClick={() => navigateMonth(1)}>
              <span>›</span>
            </button>
          </div>
        </div>
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
      
      <div className={`calendar-grid weeks-${numWeeks}`}>
        {dayNames.map(day => (
          <div key={day} className="day-header">{day}</div>
        ))}
        
        {days.map((date, index) => {
          const dayEvents = getEventsForDay(date);
          const isToday = date && date.toDateString() === new Date().toDateString();
          
          return (
            <div
              key={index}
              className={`calendar-day ${!date ? 'empty' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => date && onDayClick(date)}
            >
              {date && (
                <>
                  <div className="day-number">{date.getDate()}</div>
                  <div className="day-events">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className="event-indicator"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div 
                        className="more-events see-more-btn"
                        onClick={(e) => handleSeeMoreClick(date, dayEvents, e)}
                      >
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Day Events Modal */}
      {showDayEventsModal && (
        <div className="modal-overlay" onClick={() => setShowDayEventsModal(false)}>
          <div className="day-events-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {selectedDayDate && selectedDayDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h2>
              <button className="close-btn" onClick={() => setShowDayEventsModal(false)}>×</button>
            </div>
            <div className="day-events-list">
              {selectedDayEvents.map(event => (
                <div 
                  key={event.id} 
                  className="day-event-item"
                  onClick={() => {
                    setShowDayEventsModal(false);
                    onEventClick(event);
                  }}
                >
                  <div className="event-time-badge">{event.time}</div>
                  <div className="event-content">
                    <h3>{event.title}</h3>
                    <p className="event-location">{event.location}</p>
                    <p className="event-organizer">{event.organizer}</p>
                  </div>
                  <div className="event-stats-mini">
                    <span>❤️ {event.likes}</span>
                    <span>👥 {event.attendees}</span>
                    <span>💬 {event.comments}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// My Events View Component
function MyEventsView({ events, onEditEvent, onDeleteEvent, onLike, onAttend, onComment, discussions, onAddDiscussion, onAddReply, currentUserId }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('created'); // 'created' or 'attending'
  
  // Update selectedEvent when events array changes (for real-time updates like likes)
  useEffect(() => {
    if (selectedEvent) {
      const updatedEvent = events.find(e => e.id === selectedEvent.id);
      if (updatedEvent) {
        setSelectedEvent(updatedEvent);
      } else {
        // Event was deleted, close the modal
        setSelectedEvent(null);
        setIsEventDetailOpen(false);
      }
    }
  }, [events, selectedEvent?.id]);
  
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
  
  // Filter events based on active tab
  const createdEvents = events.filter(event => event.createdBy === currentUserId);
  const attendingEvents = events.filter(event => event.attendingUsers?.includes(currentUserId));
  
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventDetailOpen(true);
  };
  
  const handleEditEvent = () => {
    setIsEventDetailOpen(false);
    // This would open edit modal
    console.log('Edit event:', selectedEvent);
  };
  
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      onDeleteEvent(selectedEvent.id);
      // Don't close modal immediately - let useEffect handle it when event is removed
    }
  };
  
  const currentEvents = activeTab === 'created' ? createdEvents : attendingEvents;
  
  return (
    <div className="my-events-page">
      <div className="events-container">
        <h2>My Events</h2>
        
        <div className="events-tabs">
          <button 
            className={`tab-btn ${activeTab === 'created' ? 'active' : ''}`}
            onClick={() => setActiveTab('created')}
          >
            Created Events ({createdEvents.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'attending' ? 'active' : ''}`}
            onClick={() => setActiveTab('attending')}
          >
            Attending Events ({attendingEvents.length})
          </button>
        </div>
        
        <div className="events-list">
          {currentEvents.length === 0 ? (
            <div className="no-events">
              <p>
                {activeTab === 'created' 
                  ? "No events created yet. Create your first event!" 
                  : "No events you're attending yet. Find events to attend!"
                }
              </p>
            </div>
          ) : (
            currentEvents.map(event => (
              <div key={event.id} className="event-item" onClick={() => handleEventClick(event)}>
                <div className="event-date">
                  <span className="month">{parseEventDate(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  <span className="day">{parseEventDate(event.date).getDate()}</span>
                </div>
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <p className="event-location">{event.location}</p>
                  <p className="event-time">{event.time}</p>
                  <p className="event-organizer">{event.organizer}</p>
                </div>
                <div className="event-stats">
                  <span>{event.likes} Likes</span>
                  <span>{event.attendees} Attending</span>
                  <span>{event.comments} Comments</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <EventDetails
        event={selectedEvent}
        isOpen={isEventDetailOpen}
        onClose={() => {
          setIsEventDetailOpen(false);
          setSelectedEvent(null);
        }}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        onLike={onLike}
        onAttend={onAttend}
        onComment={onComment}
        discussions={selectedEvent ? discussions[selectedEvent.id] || [] : []}
        onAddDiscussion={(discussionData) => selectedEvent && onAddDiscussion(selectedEvent.id, discussionData)}
        onAddReply={(discussionId, replyData) => selectedEvent && onAddReply(selectedEvent.id, discussionId, replyData)}
        currentUserId={currentUserId}
      />
    </div>
  );
}


// Main Calendar Page
function CalendarPage({ events, onCreateEvent, onUpdateEvent, onEventClick, onEditEvent, onDeleteEvent, onLike, onAttend, onComment, discussions, onAddDiscussion, onAddReply, currentView, onViewChange, currentUserId }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);
  
  // Update selectedEvent when events array changes (for real-time updates like likes)
  useEffect(() => {
    if (selectedEvent) {
      const updatedEvent = events.find(e => e.id === selectedEvent.id);
      if (updatedEvent) {
        setSelectedEvent(updatedEvent);
      } else {
        // Event was deleted, close the modal
        setSelectedEvent(null);
        setIsEventDetailOpen(false);
      }
    }
  }, [events, selectedEvent?.id]);
  
  const handleDayClick = (date) => {
    setSelectedDate(date);
    setIsEventModalOpen(true);
  };
  
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventDetailOpen(true);
  };
  
  const handleCreateEvent = (eventData) => {
    if (eventData.id) {
      // Editing existing event
      onUpdateEvent(eventData);
    } else {
      // Creating new event
      onCreateEvent(eventData);
    }
    setIsEventModalOpen(false);
    setSelectedDate(null);
    setSelectedEvent(null);
  };
  
  const handleEditEvent = () => {
    setIsEventDetailOpen(false);
    setIsEventModalOpen(true);
  };
  
  const handleDeleteEvent = (eventId) => {
    // Accept eventId parameter from child components (like MyEventsView)
    // or use selectedEvent if called directly
    const idToDelete = eventId || selectedEvent?.id;
    if (idToDelete) {
      onDeleteEvent(idToDelete);
      // Don't close modal immediately - let useEffect handle it when event is removed
    }
  };
  
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'

  const renderCurrentView = () => {
    switch (currentView) {
      case 'calendar':
        return (
          <div className="view-container">
            {viewMode === 'calendar' ? (
              <CalendarGrid 
                events={events}
                onDayClick={handleDayClick}
                onEventClick={handleEventClick}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
            ) : (
              <ListView 
                events={events}
                onEventClick={handleEventClick}
              />
            )}
          </div>
        );
      case 'my-events':
        return (
          <MyEventsView 
            events={events}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onLike={onLike}
            onAttend={onAttend}
            onComment={onComment}
            discussions={discussions}
            onAddDiscussion={onAddDiscussion}
            onAddReply={onAddReply}
            currentUserId={currentUserId}
          />
        );
      default:
        return (
          <CalendarGrid 
            events={events}
            onDayClick={handleDayClick}
            onEventClick={handleEventClick}
          />
        );
    }
  };
  
  return (
    <div className="calendar-page">
      <header className="calendar-header-nav">
        <div className="header-container">
          <div className="logo-section">
            <img src="/GTCal_icon.png" alt="GT-Cal Logo" className="logo" />
          </div>
          <nav className="nav">
            <button 
              className={`nav-btn ${currentView === 'calendar' && viewMode === 'calendar' ? 'active' : ''}`}
              onClick={() => {
                onViewChange('calendar');
                setViewMode('calendar');
              }}
            >
              Calendar
            </button>
            <button 
              className={`nav-btn ${currentView === 'calendar' && viewMode === 'list' ? 'active' : ''}`}
              onClick={() => {
                onViewChange('calendar');
                setViewMode('list');
              }}
            >
              List
            </button>
            <button 
              className={`nav-btn ${currentView === 'my-events' ? 'active' : ''}`}
              onClick={() => onViewChange('my-events')}
            >
              My Events
            </button>
          </nav>
          <div className="user-section">
            <div className="user-avatar">GT</div>
          </div>
        </div>
      </header>
      
      <main className="calendar-main">
        <div className="main-container">
          {renderCurrentView()}
        </div>
      </main>
      
      <EventModal 
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedDate(null);
          setSelectedEvent(null);
        }}
        onSave={handleCreateEvent}
        initialDate={selectedDate}
        eventToEdit={selectedEvent}
      />
      
      <EventDetails
        event={selectedEvent}
        isOpen={isEventDetailOpen}
        onClose={() => {
          setIsEventDetailOpen(false);
          setSelectedEvent(null);
        }}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        onLike={onLike}
        onAttend={onAttend}
        onComment={onComment}
        discussions={selectedEvent ? discussions[selectedEvent.id] || [] : []}
        onAddDiscussion={(discussionData) => selectedEvent && onAddDiscussion(selectedEvent.id, discussionData)}
        onAddReply={(discussionId, replyData) => selectedEvent && onAddReply(selectedEvent.id, discussionId, replyData)}
        currentUserId={currentUserId}
      />
    </div>
  );
}

// Mock data for development - November 2025 events
const mockEvents = [
  {
    id: 1,
    title: "Fall 2025 AI Career Fair",
    date: "2025-11-17",
    time: "9:00 AM EST",
    endTime: "1:00 PM EST",
    location: "Exhibition Hall, Midtown Room",
    category: "Academic",
    description: "Georgia Tech students interested in artificial intelligence (AI) are invited to attend the Tech AI Career Fair. The event offers a valuable opportunity to connect with leading companies, explore career paths, and showcase research. A student research poster session may also be included.\n\nTech AI's AI Career Fair offers a chance to gain industry insights, build your network, and take the next step in your AI career.\n\nCompanies include: Airia, BlackRock, Deposco, Evident, Geotab, Google, Halco Lighting Technologies, Lennar, Lumen Technologies, ScottMadden, Inc., and the United States Patent and Trademark Office.",
    likes: 89,
    comments: 4,
    attendees: 12,
    organizer: "Georgia Tech College of Computing",
    image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=200&fit=crop",
    createdBy: "gt_college_computing",
    likedBy: [],
    attendingUsers: [
      { name: "Sarah Chen", initials: "SC" },
      { name: "Michael Park", initials: "MP" },
      { name: "Alex Johnson", initials: "AJ" },
      { name: "Emily Williams", initials: "EW" },
      { name: "David Kim", initials: "DK" },
      { name: "Jessica Lee", initials: "JL" },
      { name: "Ryan Patel", initials: "RP" },
      { name: "Amanda Zhang", initials: "AZ" },
      { name: "James Wilson", initials: "JW" },
      { name: "Olivia Brown", initials: "OB" },
      { name: "Nathan Garcia", initials: "NG" },
      { name: "Sophia Martinez", initials: "SM" }
    ]
  },
  {
    id: 2,
    title: "Web Dev @ GT Demo Day",
    date: "2025-11-18",
    time: "6:30 PM EST",
    endTime: "7:30 PM EST",
    location: "Howey Physics Building",
    category: "Academic",
    description: "Demo day for all of the hard working projects from all of our web dev teams! Pizza and drinks will be provided :)",
    likes: 42,
    comments: 2,
    attendees: 8,
    organizer: "Web Dev @ GT",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=200&fit=crop",
    createdBy: "webdev_gt",
    likedBy: [],
    attendingUsers: [
      { name: "Chris Anderson", initials: "CA" },
      { name: "Maya Thompson", initials: "MT" },
      { name: "Kevin Liu", initials: "KL" },
      { name: "Rachel Green", initials: "RG" },
      { name: "Brandon Moore", initials: "BM" },
      { name: "Ashley Davis", initials: "AD" },
      { name: "Tyler Scott", initials: "TS" },
      { name: "Jennifer White", initials: "JW" }
    ]
  },
  {
    id: 3,
    title: "Product@GT Demo Day",
    date: "2025-11-19",
    time: "6:30 PM EST",
    endTime: "8:00 PM EST",
    location: "Scheller College of Business 300",
    category: "Academic",
    description: "Demo Day will be a project progress showcase for all six teams this semester. It's also open to non-project students who want to see how project teams work. Presentations are typically slide-based, and each team should plan for 8-10 minutes at the front of the classroom. We'll also have food!",
    likes: 56,
    comments: 3,
    attendees: 10,
    organizer: "Product@GT",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop",
    createdBy: "product_gt",
    likedBy: [],
    attendingUsers: [
      { name: "Daniel Harris", initials: "DH" },
      { name: "Victoria Clark", initials: "VC" },
      { name: "Matthew Lewis", initials: "ML" },
      { name: "Lauren Walker", initials: "LW" },
      { name: "Andrew Hall", initials: "AH" },
      { name: "Nicole Allen", initials: "NA" },
      { name: "Justin Young", initials: "JY" },
      { name: "Megan King", initials: "MK" },
      { name: "Eric Wright", initials: "EW" },
      { name: "Samantha Hill", initials: "SH" }
    ]
  },
  {
    id: 4,
    title: "AI, Technology, and the Future of Trading with Ryan Duckworth - CEO of Akuna Capital",
    date: "2025-11-21",
    time: "1:30 PM EST",
    endTime: "2:30 PM EST",
    location: "Scheller College of Business 201",
    category: "Career",
    description: "The Center for Finance and Technology is thrilled to welcome Advisory Board Member and Georgia Tech alum Ryan Duckworth, CEO of Akuna Capital, to campus this Friday, November 21, for a fireside chat with Dr. Sudheer Chava.",
    likes: 78,
    comments: 3,
    attendees: 15,
    organizer: "Georgia Tech Center for Finance and Technology",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop",
    createdBy: "gt_finance_center",
    likedBy: [],
    attendingUsers: [
      { name: "Benjamin Adams", initials: "BA" },
      { name: "Christina Baker", initials: "CB" },
      { name: "Joshua Nelson", initials: "JN" },
      { name: "Elizabeth Carter", initials: "EC" },
      { name: "Patrick Mitchell", initials: "PM" },
      { name: "Rebecca Perez", initials: "RP" },
      { name: "Aaron Roberts", initials: "AR" },
      { name: "Michelle Turner", initials: "MT" },
      { name: "Jacob Phillips", initials: "JP" },
      { name: "Kimberly Campbell", initials: "KC" },
      { name: "Nicholas Parker", initials: "NP" },
      { name: "Stephanie Evans", initials: "SE" },
      { name: "Timothy Edwards", initials: "TE" },
      { name: "Brittany Collins", initials: "BC" },
      { name: "Jonathan Stewart", initials: "JS" }
    ]
  },
  {
    id: 5,
    title: "Pitt vs. Georgia Tech Football Game",
    date: "2025-11-22",
    time: "7:00 PM EST",
    endTime: "",
    location: "Bobby Dodd Football Stadium",
    category: "Sports",
    description: "Georgia Tech vs. Pitt football game!",
    likes: 234,
    comments: 3,
    attendees: 18,
    organizer: "",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&h=200&fit=crop",
    createdBy: "gt_athletics",
    likedBy: [],
    attendingUsers: [
      { name: "Marcus Johnson", initials: "MJ" },
      { name: "Taylor Rodriguez", initials: "TR" },
      { name: "Connor Murphy", initials: "CM" },
      { name: "Hannah Cooper", initials: "HC" },
      { name: "Dylan Reed", initials: "DR" },
      { name: "Emma Bailey", initials: "EB" },
      { name: "Austin Bell", initials: "AB" },
      { name: "Madison Rivera", initials: "MR" },
      { name: "Cameron Cox", initials: "CC" },
      { name: "Grace Howard", initials: "GH" },
      { name: "Jordan Ward", initials: "JW" },
      { name: "Alexis Torres", initials: "AT" },
      { name: "Blake Peterson", initials: "BP" },
      { name: "Sydney Gray", initials: "SG" },
      { name: "Trevor Ramirez", initials: "TR" },
      { name: "Kayla James", initials: "KJ" },
      { name: "Evan Watson", initials: "EW" },
      { name: "Morgan Brooks", initials: "MB" }
    ]
  },
  {
    id: 6,
    title: "UGA vs. Georgia Tech Football Game",
    date: "2025-11-28",
    time: "3:30 PM EST",
    endTime: "",
    location: "Mercedes Benz Stadium",
    category: "Sports",
    description: "Annual UGA versus Georgia Tech football game!",
    likes: 567,
    comments: 5,
    attendees: 20,
    organizer: "",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=200&fit=crop",
    createdBy: "gt_athletics",
    likedBy: [],
    attendingUsers: [
      { name: "Logan Kelly", initials: "LK" },
      { name: "Chloe Bennett", initials: "CB" },
      { name: "Mason Wood", initials: "MW" },
      { name: "Ava Barnes", initials: "AB" },
      { name: "Lucas Ross", initials: "LR" },
      { name: "Isabella Henderson", initials: "IH" },
      { name: "Caleb Coleman", initials: "CC" },
      { name: "Lily Jenkins", initials: "LJ" },
      { name: "Zachary Perry", initials: "ZP" },
      { name: "Natalie Powell", initials: "NP" },
      { name: "Hunter Long", initials: "HL" },
      { name: "Ella Patterson", initials: "EP" },
      { name: "Ian Hughes", initials: "IH" },
      { name: "Avery Flores", initials: "AF" },
      { name: "Cole Washington", initials: "CW" },
      { name: "Zoe Butler", initials: "ZB" },
      { name: "Gavin Simmons", initials: "GS" },
      { name: "Addison Foster", initials: "AF" },
      { name: "Wyatt Russell", initials: "WR" },
      { name: "Ruby Griffin", initials: "RG" }
    ]
  }
];

// Mock discussions for events
const mockDiscussions = {
  1: [ // Fall 2025 AI Career Fair
    {
      id: 1,
      user: { name: "Sarah Chen", initials: "SC" },
      content: "Is this event open to all majors or just CS students?",
      timestamp: new Date("2025-11-15T10:30:00").toISOString(),
      replies: [
        {
          id: 1,
          user: { name: "Event Organizer", initials: "EO" },
          content: "This event is open to all Georgia Tech students interested in AI! We welcome students from all majors.",
          timestamp: new Date("2025-11-15T11:00:00").toISOString()
        }
      ]
    },
    {
      id: 2,
      user: { name: "Michael Park", initials: "MP" },
      content: "Will there be time for 1-on-1 conversations with recruiters?",
      timestamp: new Date("2025-11-16T14:20:00").toISOString(),
      replies: [
        {
          id: 2,
          user: { name: "Event Organizer", initials: "EO" },
          content: "Yes! Each company will have their own booth where you can have direct conversations with recruiters.",
          timestamp: new Date("2025-11-16T15:00:00").toISOString()
        }
      ]
    }
  ],
  2: [ // Web Dev @ GT Demo Day
    {
      id: 3,
      user: { name: "Alex Johnson", initials: "AJ" },
      content: "Do we need to bring our laptops?",
      timestamp: new Date("2025-11-17T12:00:00").toISOString(),
      replies: [
        {
          id: 3,
          user: { name: "Emma Wilson", initials: "EW" },
          content: "Not required! Each team will present using the room's projector.",
          timestamp: new Date("2025-11-17T13:30:00").toISOString()
        }
      ]
    }
  ],
  3: [ // Product@GT Demo Day
    {
      id: 4,
      user: { name: "Rachel Kim", initials: "RK" },
      content: "Will there be vegetarian food options?",
      timestamp: new Date("2025-11-18T10:00:00").toISOString(),
      replies: [
        {
          id: 4,
          user: { name: "Product@GT Team", initials: "PT" },
          content: "Absolutely! We'll have both vegetarian and vegan options available.",
          timestamp: new Date("2025-11-18T10:30:00").toISOString()
        }
      ]
    },
    {
      id: 5,
      user: { name: "David Lee", initials: "DL" },
      content: "Is there a dress code for this event?",
      timestamp: new Date("2025-11-18T16:00:00").toISOString(),
      replies: []
    }
  ],
  4: [ // AI, Technology, and the Future of Trading
    {
      id: 6,
      user: { name: "Jessica Wang", initials: "JW" },
      content: "Will this be recorded for students who can't attend?",
      timestamp: new Date("2025-11-20T09:00:00").toISOString(),
      replies: [
        {
          id: 5,
          user: { name: "Center for Finance", initials: "CF" },
          content: "We plan to record the session and share it with registered students afterwards.",
          timestamp: new Date("2025-11-20T09:45:00").toISOString()
        }
      ]
    },
    {
      id: 7,
      user: { name: "Brandon Smith", initials: "BS" },
      content: "This sounds amazing! Really excited to hear from an industry leader about AI in trading.",
      timestamp: new Date("2025-11-20T18:00:00").toISOString(),
      replies: []
    }
  ],
  5: [ // Pitt vs. Georgia Tech Football Game
    {
      id: 8,
      user: { name: "Tyler Jackson", initials: "TJ" },
      content: "Anyone know where to get student tickets?",
      timestamp: new Date("2025-11-21T14:00:00").toISOString(),
      replies: [
        {
          id: 6,
          user: { name: "Sports Fan", initials: "SF" },
          content: "Check the GT Athletics website! Student tickets are usually free with BuzzCard.",
          timestamp: new Date("2025-11-21T14:30:00").toISOString()
        }
      ]
    },
    {
      id: 9,
      user: { name: "Megan Brown", initials: "MB" },
      content: "GO JACKETS! 🐝💛",
      timestamp: new Date("2025-11-22T10:00:00").toISOString(),
      replies: []
    }
  ],
  6: [ // UGA vs. Georgia Tech Football Game
    {
      id: 10,
      user: { name: "Chris Martinez", initials: "CM" },
      content: "This is THE game of the year! Can't wait!",
      timestamp: new Date("2025-11-25T15:00:00").toISOString(),
      replies: [
        {
          id: 7,
          user: { name: "Kelly Davis", initials: "KD" },
          content: "Agreed! Clean, Old-Fashioned Hate! TO HELL WITH GEORGIA!",
          timestamp: new Date("2025-11-25T16:00:00").toISOString()
        }
      ]
    },
    {
      id: 11,
      user: { name: "Jordan Lee", initials: "JL" },
      content: "Anyone organizing a tailgate before the game?",
      timestamp: new Date("2025-11-27T12:00:00").toISOString(),
      replies: []
    },
    {
      id: 12,
      user: { name: "Amy Zhang", initials: "AZ" },
      content: "Is parking available near Mercedes Benz Stadium?",
      timestamp: new Date("2025-11-27T20:00:00").toISOString(),
      replies: [
        {
          id: 8,
          user: { name: "Transportation Guide", initials: "TG" },
          content: "I'd recommend taking MARTA! It's way easier than dealing with parking downtown.",
          timestamp: new Date("2025-11-27T21:00:00").toISOString()
        }
      ]
    }
  ]
};

function App() {
  const [currentView, setCurrentView] = useState('calendar');
  const [events, setEvents] = useState(mockEvents);
  const [loading, setLoading] = useState(false);
  const [discussions, setDiscussions] = useState(mockDiscussions); // Discussion state per event: { eventId: [discussions] }

  // Mock user ID for development
  const currentUserId = 'user123';

  // Apply production-only scaling fix for Vercel deployment
  useEffect(() => {
    if (import.meta.env.PROD) {
      document.documentElement.style.fontSize = '14.4px'; // 90% of 16px
    }
  }, []);

  // Load events from API on mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/events`);
        console.log('Loaded from API:', response.data.length, 'events');
        
        if (response.data && response.data.length > 0) {
          // Create a map of unique events by title and date to avoid duplicates
          const eventMap = new Map();
          
          // First add mock events (they take priority)
          mockEvents.forEach(event => {
            const key = `${event.title}-${event.date}`;
            eventMap.set(key, event);
          });
          
          // Then add API events only if they don't duplicate mock events
          response.data.forEach(event => {
            const key = `${event.title}-${event.date}`;
            if (!eventMap.has(key)) {
              // Convert MongoDB _id to id for consistency
              eventMap.set(key, { ...event, id: event._id || event.id });
            }
          });
          
          const uniqueEvents = Array.from(eventMap.values());
          console.log('Final unique events:', uniqueEvents.length);
          setEvents(uniqueEvents);
        }
      } catch (error) {
        console.log('Using mock events only (API not available):', error.message);
        // Keep using mock events if API fails
      }
    };
    
    loadEvents();
  }, []);

  // Load discussions for all events
  useEffect(() => {
    const loadDiscussions = async () => {
      try {
        const discussionPromises = events.map(async (event) => {
          try {
            const response = await axios.get(`${API_BASE_URL}/api/discussions/event/${event.id}`);
            return { eventId: event.id, discussions: response.data };
          } catch (error) {
            // If API fails, use mock discussions for this event if available
            return { eventId: event.id, discussions: mockDiscussions[event.id] || [] };
          }
        });
        
        const results = await Promise.all(discussionPromises);
        const discussionsMap = {};
        results.forEach(({ eventId, discussions }) => {
          if (discussions.length > 0) {
            discussionsMap[eventId] = discussions;
          }
        });
        
        // Merge with mock discussions (mock discussions take priority if API returned empty)
        const mergedDiscussions = { ...mockDiscussions, ...discussionsMap };
        setDiscussions(mergedDiscussions);
      } catch (error) {
        console.log('Using mock discussions only');
        setDiscussions(mockDiscussions);
      }
    };
    
    if (events.length > 0) {
      loadDiscussions();
    }
  }, [events.length]);

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleCreateEvent = async (eventData) => {
    console.log('handleCreateEvent called with:', eventData); // Debug log
    
    // Always add to local state first for immediate feedback
    const newEvent = {
      ...eventData,
      id: Date.now(), // Temporary ID
      likes: 0,
      comments: 0,
      attendees: 0,
      likedBy: [],
      attendingUsers: [],
      createdBy: currentUserId, // Track who created the event
      date: eventData.date instanceof Date ? eventData.date.toISOString().split('T')[0] : eventData.date
    };
    
    console.log('Adding event to local state:', newEvent); // Debug log
    setEvents(prev => [...prev, newEvent]);
    
    // Try to save to API in background
    try {
      setLoading(true);
      const formattedEventData = {
        ...eventData,
        date: eventData.date instanceof Date ? eventData.date.toISOString().split('T')[0] : eventData.date,
        createdBy: currentUserId,
        likes: 0,
        comments: 0,
        attendees: 0,
        likedBy: [],
        attendingUsers: []
      };
      
      console.log('Attempting API save:', formattedEventData); // Debug log
      const response = await axios.post(`${API_BASE_URL}/api/events`, formattedEventData);
      console.log('API save successful:', response.data); // Debug log
      
      // Update the event with the real ID from the server
      setEvents(prev => prev.map(event => 
        event.id === newEvent.id 
          ? { ...event, id: response.data._id || event.id }
          : event
      ));
    } catch (error) {
      console.error('API save failed, but event is in local state:', error);
      // Event is already in local state, so user can still see it
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = async (eventData) => {
    console.log('handleUpdateEvent called with:', eventData); // Debug log
    
    // Update local state first for immediate feedback
    setEvents(prev => prev.map(event => 
      event.id === eventData.id ? { ...eventData } : event
    ));
    
    // Try to update API in background
    try {
      setLoading(true);
      const formattedEventData = {
        ...eventData,
        date: eventData.date instanceof Date ? eventData.date.toISOString().split('T')[0] : eventData.date
      };
      
      console.log('Attempting API update:', formattedEventData); // Debug log
      await axios.put(`${API_BASE_URL}/api/events/${eventData.id}`, formattedEventData);
      console.log('API update successful'); // Debug log
    } catch (error) {
      console.error('API update failed, but event is updated in local state:', error);
      // Event is already updated in local state, so user can still see it
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/events/${eventId}`);
      setEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      // Fallback to local state update
      setEvents(prev => prev.filter(event => event.id !== eventId));
    }
  };

  const handleLike = async (eventId, isLiked) => {
    // Optimistic update - update UI immediately
    setEvents(prevEvents => prevEvents.map(event =>
      event.id === eventId
        ? { 
            ...event, 
            likes: event.likes + (isLiked ? 1 : -1),
            likedBy: isLiked 
              ? [...(event.likedBy || []), currentUserId] 
              : (event.likedBy || []).filter(id => id !== currentUserId)
          }
        : event
    ));

    // Then sync with backend
    try {
      const response = await axios.post(`${API_BASE_URL}/api/events/${eventId}/like`, {
        userId: currentUserId
      });

      // Update with server response to ensure consistency
      setEvents(prevEvents => prevEvents.map(event =>
        event.id === eventId
          ? { 
              ...event, 
              likes: response.data.likes,
              likedBy: response.data.likedBy
            }
          : event
      ));
    } catch (error) {
      console.error('Error syncing like with backend:', error);
      // UI already updated optimistically, so user experience is maintained
    }
  };

  const handleAttend = async (eventId, isAttending) => {
    // Optimistic update - update UI immediately
    setEvents(prevEvents => prevEvents.map(event =>
      event.id === eventId
        ? { 
            ...event, 
            attendees: event.attendees + (isAttending ? 1 : -1),
            attendingUsers: isAttending 
              ? [...(event.attendingUsers || []), currentUserId] 
              : (event.attendingUsers || []).filter(id => id !== currentUserId)
          }
        : event
    ));

    // Then sync with backend
    try {
      const response = await axios.post(`${API_BASE_URL}/api/events/${eventId}/attend`, {
        userId: currentUserId
      });

      // Update with server response to ensure consistency
      setEvents(prevEvents => prevEvents.map(event =>
        event.id === eventId
          ? { 
              ...event, 
              attendees: response.data.attendees,
              attendingUsers: response.data.attendingUsers
            }
          : event
      ));
    } catch (error) {
      console.error('Error syncing attendance with backend:', error);
      // UI already updated optimistically, so user experience is maintained
    }
  };

  const handleComment = async (eventId) => {
    // Optimistic update
    setEvents(prevEvents => prevEvents.map(event =>
      event.id === eventId
        ? { ...event, comments: event.comments + 1 }
        : event
    ));

    // Sync with backend
    try {
      await axios.post(`${API_BASE_URL}/api/events/${eventId}/comment`);
    } catch (error) {
      console.error('Error syncing comment count with backend:', error);
      // UI already updated, no need to rollback for comment count
    }
  };

  const handleAddDiscussion = async (eventId, discussionData) => {
    const newDiscussion = {
      id: Date.now(),
      user: {
        name: "Georgia Tech Student", // In a real app, get from user profile
        initials: "GT"
      },
      content: discussionData.content,
      timestamp: discussionData.timestamp,
      replies: []
    };

    // Optimistic update
    setDiscussions(prev => ({
      ...prev,
      [eventId]: [...(prev[eventId] || []), newDiscussion]
    }));

    // Increment comment count on the event
    handleComment(eventId);

    // Sync with backend
    try {
      await axios.post(`${API_BASE_URL}/api/discussions/event/${eventId}`, newDiscussion);
    } catch (error) {
      console.error('Error saving discussion to backend:', error);
      // Discussion already in local state
    }
  };

  const handleAddReply = async (eventId, discussionId, replyData) => {
    const newReply = {
      id: Date.now(),
      user: {
        name: "Georgia Tech Student", // In a real app, get from user profile
        initials: "GT"
      },
      content: replyData.content,
      timestamp: replyData.timestamp
    };

    // Optimistic update
    setDiscussions(prev => ({
      ...prev,
      [eventId]: (prev[eventId] || []).map(discussion =>
        discussion.id === discussionId
          ? { ...discussion, replies: [...discussion.replies, newReply] }
          : discussion
      )
    }));

    // Increment comment count on the event for replies too
    handleComment(eventId);

    // Sync with backend
    try {
      await axios.post(`${API_BASE_URL}/api/discussions/${discussionId}/replies`, newReply);
    } catch (error) {
      console.error('Error saving reply to backend:', error);
      // Reply already in local state
    }
  };

  return (
    <div className="app">
      <CalendarPage 
        events={events}
        onCreateEvent={handleCreateEvent}
        onUpdateEvent={handleUpdateEvent}
        onEventClick={() => {}}
        onEditEvent={() => {}}
        onDeleteEvent={handleDeleteEvent}
        onLike={handleLike}
        onAttend={handleAttend}
        onComment={handleComment}
        discussions={discussions}
        onAddDiscussion={handleAddDiscussion}
        onAddReply={handleAddReply}
        currentView={currentView}
        onViewChange={handleViewChange}
        currentUserId={currentUserId}
      />
    </div>
  );
}

export default App;