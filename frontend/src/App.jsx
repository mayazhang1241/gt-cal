import React, { useState, useEffect } from 'react';
import './App.css';
import EventModal from './EventModal.jsx';
import ListView from './ListView.jsx';
import EventDetails from './EventDetails.jsx';
import './ListView.css';
import './EventDetails.css';
import axios from 'axios';
import logo from './assets/GTCal_icon.png';



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
  
  const getEventsForDay = (date) => {
    if (!date) return [];
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
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
                      <div className="more-events">+{dayEvents.length - 2}</div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


// My Events View Component
function MyEventsView({ events, onEditEvent, onDeleteEvent, onLike, onAttend, onComment, discussions, onAddDiscussion, onAddReply, currentUserId }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('created'); // 'created' or 'attending'
  
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
      setIsEventDetailOpen(false);
      setSelectedEvent(null);
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
                  <span className="month">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  <span className="day">{new Date(event.date).getDate()}</span>
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
      />
    </div>
  );
}

// Profile View Component
function ProfileView() {
  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">GT</div>
          <h2>Georgia Tech Student</h2>
          <p>gtstudent@gatech.edu</p>
        </div>
        
        <div className="profile-stats">
          <div className="stat-card">
            <h3>Events Created</h3>
            <span className="stat-number">5</span>
          </div>
          <div className="stat-card">
            <h3>Events Attending</h3>
            <span className="stat-number">12</span>
          </div>
          <div className="stat-card">
            <h3>Total Likes</h3>
            <span className="stat-number">47</span>
          </div>
        </div>
        
        <div className="profile-actions">
          <button className="btn btn-primary">Edit Profile</button>
          <button className="btn btn-outline">Settings</button>
        </div>
      </div>
    </div>
  );
}

// Main Calendar Page
function CalendarPage({ events, onCreateEvent, onEventClick, onEditEvent, onDeleteEvent, onLike, onAttend, onComment, discussions, onAddDiscussion, onAddReply, currentView, onViewChange, currentUserId }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);
  
  const handleDayClick = (date) => {
    setSelectedDate(date);
    setIsEventModalOpen(true);
  };
  
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventDetailOpen(true);
  };
  
  const handleCreateEvent = (eventData) => {
    onCreateEvent(eventData);
    setIsEventModalOpen(false);
    setSelectedDate(null);
  };
  
  const handleEditEvent = () => {
    setIsEventDetailOpen(false);
    setIsEventModalOpen(true);
  };
  
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      onDeleteEvent(selectedEvent.id);
      setIsEventDetailOpen(false);
      setSelectedEvent(null);
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
      case 'profile':
        return <ProfileView />;
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
            <div className="user-avatar" onClick={() => onViewChange('profile')}>GT</div>
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
        }}
        onSave={handleCreateEvent}
        initialDate={selectedDate}
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
      />
    </div>
  );
}

// Mock data for development - Updated with current dates
const mockEvents = [
  {
    id: 1,
    title: "HackGT 2024",
    date: "2024-12-15",
    time: "9:00 AM",
    location: "Klaus Advanced Computing Building",
    category: "Tech",
    description: "Georgia Tech's premier hackathon featuring workshops, networking, and prizes!",
    likes: 45,
    comments: 12,
    attendees: 150,
    organizer: "HackGT Team",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=200&fit=crop",
    createdBy: "user123"
  },
  {
    id: 2,
    title: "Career Fair",
    date: "2024-12-20",
    time: "10:00 AM",
    location: "McCamish Pavilion",
    category: "Career",
    description: "Connect with top companies and explore internship opportunities.",
    likes: 78,
    comments: 23,
    attendees: 500,
    organizer: "Career Services",
    image: "https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=400&h=200&fit=crop"
  },
  {
    id: 3,
    title: "GT vs UGA Game",
    date: "2024-12-25",
    time: "3:30 PM",
    location: "Bobby Dodd Stadium",
    category: "Sports",
    description: "Cheer on the Yellow Jackets in this epic rivalry game!",
    likes: 156,
    comments: 45,
    attendees: 55000,
    organizer: "GT Athletics",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=200&fit=crop"
  },
  {
    id: 4,
    title: "Study Session",
    date: "2024-12-18",
    time: "7:00 PM",
    location: "Library Study Room",
    category: "Academic",
    description: "Join us for a collaborative study session for CS 1331 final exam prep.",
    likes: 12,
    comments: 5,
    attendees: 8,
    organizer: "CS Study Group",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop"
  },
  {
    id: 5,
    title: "Startup Pitch",
    date: "2024-12-22",
    time: "6:00 PM",
    location: "Scheller College",
    category: "Entrepreneurship",
    description: "Watch student entrepreneurs pitch their innovative ideas to investors.",
    likes: 32,
    comments: 8,
    attendees: 80,
    organizer: "GT Entrepreneurship",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop"
  },
  {
    id: 6,
    title: "Coffee Chat",
    date: "2024-12-19",
    time: "2:00 PM",
    location: "Starbucks - Tech Square",
    category: "Social",
    description: "Casual meetup for networking and coffee!",
    likes: 8,
    comments: 3,
    attendees: 15,
    organizer: "Student Life",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=200&fit=crop"
  },
  {
    id: 8,
    title: "Today's Meeting",
    date: new Date().toISOString().split('T')[0], // Today's date
    time: "2:00 PM",
    location: "Conference Room A",
    category: "Academic",
    description: "Weekly team meeting to discuss project progress.",
    likes: 5,
    comments: 2,
    attendees: 8,
    organizer: "Project Team",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop",
    createdBy: "user123"
  }
];

function App() {
  const [currentView, setCurrentView] = useState('calendar');
  const [events, setEvents] = useState(mockEvents);
  const [loading, setLoading] = useState(false);
  const [discussions, setDiscussions] = useState({}); // Discussion state per event: { eventId: [discussions] }

  // Mock user ID for development
  const currentUserId = 'user123';

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
        date: eventData.date instanceof Date ? eventData.date.toISOString().split('T')[0] : eventData.date
      };
      
      console.log('Attempting API save:', formattedEventData); // Debug log
      const response = await axios.post('http://localhost:5000/api/events', formattedEventData);
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

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${eventId}`);
      setEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      // Fallback to local state update
      setEvents(prev => prev.filter(event => event.id !== eventId));
    }
  };

  const handleLike = async (eventId, isLiked) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/events/${eventId}/like`, {
        userId: currentUserId
      });

      setEvents(events.map(event =>
        event.id === eventId
          ? { 
              ...event, 
              likes: response.data.likes, 
              likedBy: isLiked 
                ? [...(event.likedBy || []), currentUserId] 
                : (event.likedBy || []).filter(id => id !== currentUserId) 
            }
          : event
      ));
    } catch (error) {
      console.error('Error liking event:', error);
      // Fallback to local state update
      setEvents(events.map(event =>
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
    }
  };

  const handleAttend = async (eventId, isAttending) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/events/${eventId}/attend`, {
        userId: currentUserId
      });

      setEvents(events.map(event =>
        event.id === eventId
          ? { 
              ...event, 
              attendees: response.data.attendees, 
              attendingUsers: isAttending 
                ? [...(event.attendingUsers || []), currentUserId] 
                : (event.attendingUsers || []).filter(id => id !== currentUserId) 
            }
          : event
      ));
    } catch (error) {
      console.error('Error attending event:', error);
      // Fallback to local state update
      setEvents(events.map(event =>
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
    }
  };

  const handleComment = async (eventId) => {
    try {
      // In a real app, this would make an API call to add a comment
      // For now, just increment the comment count
      setEvents(events.map(event =>
        event.id === eventId
          ? { ...event, comments: event.comments + 1 }
          : event
      ));
    } catch (error) {
      console.error('Error commenting on event:', error);
    }
  };

  const handleAddDiscussion = (eventId, discussionData) => {
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

    setDiscussions(prev => ({
      ...prev,
      [eventId]: [...(prev[eventId] || []), newDiscussion]
    }));

    // Increment comment count on the event
    handleComment(eventId);
  };

  const handleAddReply = (eventId, discussionId, replyData) => {
    const newReply = {
      id: Date.now(),
      user: {
        name: "Georgia Tech Student", // In a real app, get from user profile
        initials: "GT"
      },
      content: replyData.content,
      timestamp: replyData.timestamp
    };

    setDiscussions(prev => ({
      ...prev,
      [eventId]: (prev[eventId] || []).map(discussion =>
        discussion.id === discussionId
          ? { ...discussion, replies: [...discussion.replies, newReply] }
          : discussion
      )
    }));

    // Increment comment count on the event
    handleComment(eventId);
  };

  return (
    <div className="app">
      <CalendarPage 
        events={events}
        onCreateEvent={handleCreateEvent}
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