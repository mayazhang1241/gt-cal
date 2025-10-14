import React, { useState } from 'react';
import './EventModal.css';

function EventModal({ isOpen, onClose, onSave, initialDate }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    category: 'Tech',
    description: '',
    organizer: '',
    image: ''
  });

  const [errors, setErrors] = useState({});
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const categories = ['Tech', 'Career', 'Sports', 'Entrepreneurship', 'Social', 'Academic', 'Cultural'];

  // Update form data when initialDate changes
  React.useEffect(() => {
    if (initialDate) {
      const dateString = initialDate.toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        date: dateString
      }));
    }
  }, [initialDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.organizer.trim()) newErrors.organizer = 'Organizer is required';
    
    // Validate date is not in the past (allow today)
    if (formData.date && new Date(formData.date) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.date = 'Event date cannot be in the past';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted!', formData); // Debug log
    
    if (validateForm()) {
      console.log('Form validation passed!'); // Debug log
      setIsPublishing(true);
      
      const eventData = {
        ...formData,
        date: formData.date, // Keep as string for API compatibility
        likes: 0,
        comments: 0,
        attendees: 0,
        likedBy: [],
        attendingUsers: []
      };
      
      console.log('Publishing event:', eventData); // Debug log
      
      try {
        await onSave(eventData);
        setIsPublished(true);
        
        // Show success message for 2 seconds
        setTimeout(() => {
          setIsPublished(false);
          setIsPublishing(false);
          
          // Reset form
          setFormData({
            title: '',
            date: '',
            time: '',
            location: '',
            category: 'Tech',
            description: '',
            organizer: '',
            image: ''
          });
          
          onClose();
        }, 2000);
      } catch (error) {
        console.error('Error publishing event:', error);
        setIsPublishing(false);
      }
    } else {
      console.log('Form validation failed!', errors); // Debug log
    }
  };

  const handleClose = () => {
    onClose();
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Event</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
              placeholder="Enter event title"
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={errors.date ? 'error' : ''}
              />
              {errors.date && <span className="error-message">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="time">Time</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className=""
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={errors.location ? 'error' : ''}
              placeholder="e.g., Klaus Advanced Computing Building"
            />
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className=""
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="organizer">Organizer *</label>
              <input
                type="text"
                id="organizer"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                className={errors.organizer ? 'error' : ''}
                placeholder="Your name or organization"
              />
              {errors.organizer && <span className="error-message">{errors.organizer}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`textarea ${errors.description ? 'error' : ''}`}
              placeholder="Describe your event..."
              rows="4"
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL (optional)</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="input"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className={`btn btn-primary publish-btn ${isPublished ? 'success' : ''}`} disabled={isPublishing}>
              {isPublishing ? '⏳ Publishing...' : isPublished ? '✅ Published!' : '🚀 Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventModal;
