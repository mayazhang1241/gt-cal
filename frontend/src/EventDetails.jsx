import React, { useState } from 'react';
import RSVPList from './RSVPList';
import DiscussionBoard from './DiscussionBoard';
import './EventDetails.css';
import './RSVPList.css';
import './DiscussionBoard.css';

function EventDetails({ event, isOpen, onClose, onEdit, onDelete, onLike, onAttend, onComment, discussions = [], onAddDiscussion, onAddReply }) {
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'rsvp', 'discussion'

  if (!isOpen || !event) return null;

  const renderDetailsTab = () => (
    <div className="event-details-content">
      <div className="event-info">
        <div className="info-row">
          <span className="info-label">Date</span>
          <span className="info-value">{new Date(event.date).toLocaleDateString()}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Time</span>
          <span className="info-value">{event.time}</span>
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
      <div className="event-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{event.title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
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
          <button className="action-btn secondary" onClick={onEdit}>
            Edit Event
          </button>
          <button className="action-btn primary" onClick={() => onAttend(event.id)}>
            {event.isAttending ? 'Cancel RSVP' : 'RSVP'}
          </button>
          <button className="action-btn danger" onClick={() => onDelete(event.id)}>
            Delete Event
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
