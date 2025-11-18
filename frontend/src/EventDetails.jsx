import React, { useState } from 'react';
import RSVPList from './RSVPList';
import DiscussionBoard from './DiscussionBoard';
import './EventDetails.css';
import './RSVPList.css';
import './DiscussionBoard.css';

function EventDetails({ event, isOpen, onClose, onEdit, onDelete, onLike, onAttend, onComment, discussions = [], onAddDiscussion, onAddReply, currentUserId }) {
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'rsvp', 'discussion'
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  if (!isOpen || !event) return null;

  // Check if current user is attending this event
  const isAttending = event.attendingUsers?.includes(currentUserId) || false;

  // Check if current user has liked this event
  const isLiked = event.likedBy?.includes(currentUserId) || false;

  const handleLike = () => {
    onLike(event.id, !isLiked);
  };

  const handleRSVP = () => {
    onAttend(event.id, !isAttending);
    
    // Show confirmation message
    if (!isAttending) {
      setConfirmationMessage(`✓ You've successfully RSVP'd to ${event.title}!`);
    } else {
      setConfirmationMessage(`✓ You've cancelled your RSVP to ${event.title}`);
    }
    setShowConfirmation(true);
    
    // Hide confirmation after 3 seconds
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
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

  const renderDetailsTab = () => (
    <div className="event-details-content">
      <div className="event-info">
        <div className="info-row">
          <span className="info-label">Date</span>
          <span className="info-value">{parseEventDate(event.date).toLocaleDateString()}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Time</span>
          <span className="info-value">
            {event.time}
            {event.endTime && ` - ${event.endTime.replace(' EST', '')}`}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Location</span>
          <span className="info-value">{event.location}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Organizer</span>
          <span className="info-value">{event.organizer}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Category</span>
          <span className="info-value">{event.category}</span>
        </div>
      </div>

      <div className="event-description">
        <h3>Description</h3>
        <p>{event.description}</p>
      </div>

      <div className="organization-links">
        <h3>Organization Links</h3>
        <div className="links-grid">
          <a href="#" className="org-link">
            <span className="link-label">GroupMe</span>
            <span className="link-url">Join Group</span>
          </a>
          <a href="#" className="org-link">
            <span className="link-label">Slack</span>
            <span className="link-url">Join Workspace</span>
          </a>
          <a href="#" className="org-link">
            <span className="link-label">Discord</span>
            <span className="link-url">Join Server</span>
          </a>
          <a href="#" className="org-link">
            <span className="link-label">Email List</span>
            <span className="link-url">Subscribe</span>
          </a>
          <a href="#" className="org-link">
            <span className="link-label">Website</span>
            <span className="link-url">Visit Site</span>
          </a>
        </div>
      </div>

      <div className="event-stats">
        <div className="stat">
          <span className="stat-number">{event.likes}</span>
          <span className="stat-label">Likes</span>
        </div>
        <div className="stat">
          <span className="stat-number">{event.attendees}</span>
          <span className="stat-label">Attendees</span>
        </div>
        <div className="stat">
          <span className="stat-number">{event.comments}</span>
          <span className="stat-label">Comments</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      {showConfirmation && (
        <div className="rsvp-confirmation">
          {confirmationMessage}
        </div>
      )}
      <div className="event-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{event.title}</h2>
          <div className="header-actions">
            <button 
              className={`like-btn ${isLiked ? 'liked' : ''}`} 
              onClick={handleLike}
              title={isLiked ? 'Unlike' : 'Like'}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill={isLiked ? '#E53E3E' : 'none'} stroke={isLiked ? '#E53E3E' : '#666'} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button 
            className={`tab-btn ${activeTab === 'rsvp' ? 'active' : ''}`}
            onClick={() => setActiveTab('rsvp')}
          >
            RSVP List
          </button>
          <button 
            className={`tab-btn ${activeTab === 'discussion' ? 'active' : ''}`}
            onClick={() => setActiveTab('discussion')}
          >
            Discussion
          </button>
        </div>

        <div className="modal-content">
          {activeTab === 'details' && renderDetailsTab()}
          {activeTab === 'rsvp' && (
            <RSVPList
              attendees={[
                {
                  id: 1,
                  firstName: "John",
                  lastName: "Doe",
                  email: "john.doe@gatech.edu",
                  rsvpDate: "2024-12-01",
                  status: "Confirmed"
                },
                {
                  id: 2,
                  firstName: "Jane",
                  lastName: "Smith",
                  email: "jane.smith@gatech.edu",
                  rsvpDate: "2024-12-02",
                  status: "Pending"
                },
                {
                  id: 3,
                  firstName: "Mike",
                  lastName: "Johnson",
                  email: "mike.j@gatech.edu",
                  rsvpDate: "2024-12-03",
                  status: "Confirmed"
                }
              ]}
              onSearch={(query) => console.log('Search:', query)}
            />
          )}
          {activeTab === 'discussion' && (
            <DiscussionBoard
              discussions={discussions}
              onAddDiscussion={onAddDiscussion}
              onAddReply={onAddReply}
            />
          )}
        </div>

        <div className="modal-actions">
          {event.createdBy === currentUserId ? (
            <>
              <button className="action-btn secondary" onClick={onEdit}>
                Edit Event
              </button>
              <button className="action-btn primary" onClick={handleRSVP}>
                {isAttending ? 'Cancel RSVP' : 'RSVP'}
              </button>
              <button className="action-btn danger" onClick={() => onDelete(event.id)}>
                Delete Event
              </button>
            </>
          ) : (
            <button className="action-btn primary" onClick={handleRSVP} style={{ width: '100%' }}>
              {isAttending ? 'Cancel RSVP' : 'RSVP'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
