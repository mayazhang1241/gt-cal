import React, { useState } from 'react';
import './DiscussionBoard.css';

function DiscussionBoard({ discussions = [], onAddDiscussion, onAddReply }) {
  const [newDiscussion, setNewDiscussion] = useState('');
  const [replyText, setReplyText] = useState({});

  const handleAddDiscussion = () => {
    if (newDiscussion.trim()) {
      onAddDiscussion({
        title: newDiscussion,
        content: newDiscussion,
        timestamp: new Date().toISOString()
      });
      setNewDiscussion('');
    }
  };

  const handleAddReply = (discussionId) => {
    if (replyText[discussionId]?.trim()) {
      onAddReply(discussionId, {
        content: replyText[discussionId],
        timestamp: new Date().toISOString()
      });
      setReplyText(prev => ({ ...prev, [discussionId]: '' }));
    }
  };

  return (
    <div className="discussion-board">
      <div className="new-discussion">
        <textarea
          placeholder="Start a new discussion..."
          value={newDiscussion}
          onChange={(e) => setNewDiscussion(e.target.value)}
          rows="3"
          className="discussion-input"
        />
        <button
          className="post-btn"
          onClick={handleAddDiscussion}
          disabled={!newDiscussion.trim()}
        >
          Post Discussion
        </button>
      </div>

      <div className="discussions-list">
        {discussions.length === 0 ? (
          <div className="no-discussions">
            No discussions yet. Start the conversation!
          </div>
        ) : (
          discussions.map(discussion => (
            <div key={discussion.id} className="discussion-item">
              <div className="discussion-header">
                <div className="user-info">
                  <div className="user-avatar">{discussion.user.initials}</div>
                  <div className="user-details">
                    <div className="user-name">{discussion.user.name}</div>
                    <div className="post-time">
                      {new Date(discussion.timestamp).toLocaleDateString()} at{' '}
                      {new Date(discussion.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="discussion-content">
                {discussion.content}
              </div>

              {discussion.replies && discussion.replies.length > 0 && (
                <div className="replies-list">
                  {discussion.replies.map(reply => (
                    <div key={reply.id} className="reply-item">
                      <div className="user-info">
                        <div className="user-avatar small">{reply.user.initials}</div>
                        <div className="user-details">
                          <div className="user-name">{reply.user.name}</div>
                          <div className="post-time">
                            {new Date(reply.timestamp).toLocaleDateString()} at{' '}
                            {new Date(reply.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className="reply-content">
                        {reply.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="reply-box">
                <textarea
                  placeholder="Write a reply..."
                  value={replyText[discussion.id] || ''}
                  onChange={(e) =>
                    setReplyText(prev => ({
                      ...prev,
                      [discussion.id]: e.target.value
                    }))
                  }
                  rows="2"
                  className="reply-input"
                />
                <button
                  className="reply-btn"
                  onClick={() => handleAddReply(discussion.id)}
                  disabled={!replyText[discussion.id]?.trim()}
                >
                  Reply
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DiscussionBoard;
