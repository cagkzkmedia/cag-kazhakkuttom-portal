import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import './AdminChatPanel.css';
import {
  listenToChatSessions,
  listenToMessages,
  sendMessage,
  joinChatSession,
  closeChatSession,
  markMessagesAsRead
} from '../../services/chatService.firebase';

const AdminChatPanel = () => {
  const { user } = useSelector((state) => state.auth);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [filter, setFilter] = useState('all'); // all, waiting, active
  const messagesEndRef = useRef(null);
  const unsubscribeSessionsRef = useRef(null);
  const unsubscribeMessagesRef = useRef(null);

  // Listen to chat sessions
  useEffect(() => {
    unsubscribeSessionsRef.current = listenToChatSessions((newSessions) => {
      setSessions(newSessions);
      
      // Play notification sound for new waiting sessions
      const waitingSessions = newSessions.filter(s => s.status === 'waiting');
      if (waitingSessions.length > 0) {
        playNotificationSound();
      }
    });

    return () => {
      if (unsubscribeSessionsRef.current) {
        unsubscribeSessionsRef.current();
      }
    };
  }, []);

  // Listen to messages in selected session
  useEffect(() => {
    if (selectedSession) {
      unsubscribeMessagesRef.current = listenToMessages(selectedSession.id, (newMessages) => {
        setMessages(newMessages);
        scrollToBottom();
      });

      // Mark messages as read
      markMessagesAsRead(selectedSession.id, 'admin');

      return () => {
        if (unsubscribeMessagesRef.current) {
          unsubscribeMessagesRef.current();
        }
      };
    }
  }, [selectedSession]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const playNotificationSound = () => {
    // Simple beep using Audio API
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzKM0fPTgjMGHm7A7+OZURE');
      audio.play();
    } catch (error) {
      // Ignore audio errors
    }
  };

  const handleSelectSession = async (session) => {
    setSelectedSession(session);
    
    // If session is waiting, join it
    if (session.status === 'waiting') {
      const adminId = user.id || user.uid || user.email;
      const adminName = user.name || user.displayName || user.email;
      
      if (adminId) {
        try {
          await joinChatSession(session.id, adminId, adminName);
        } catch (error) {
          console.error('Error joining chat session:', error);
          alert('Failed to join chat session');
        }
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedSession) return;

    try {
      await sendMessage(
        selectedSession.id,
        messageInput,
        'admin',
        user.name || user.displayName || user.email
      );
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleCloseSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to close this chat session?')) {
      try {
        await closeChatSession(sessionId);
        if (selectedSession?.id === sessionId) {
          setSelectedSession(null);
          setMessages([]);
        }
      } catch (error) {
        console.error('Error closing session:', error);
        alert('Failed to close session');
      }
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    return session.status === filter;
  });

  const waitingCount = sessions.filter(s => s.status === 'waiting').length;
  const activeCount = sessions.filter(s => s.status === 'active').length;

  return (
    <div className="admin-chat-panel">
      <div className="chat-panel-header">
        <h2>Live Chat Support</h2>
        <div className="chat-stats">
          <span className="stat-badge waiting">
            {waitingCount} Waiting
          </span>
          <span className="stat-badge active">
            {activeCount} Active
          </span>
        </div>
      </div>

      <div className="chat-panel-container">
        {/* Sessions List */}
        <div className="sessions-sidebar">
          <div className="sessions-filter">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All ({sessions.length})
            </button>
            <button
              className={filter === 'waiting' ? 'active' : ''}
              onClick={() => setFilter('waiting')}
            >
              Waiting ({waitingCount})
            </button>
            <button
              className={filter === 'active' ? 'active' : ''}
              onClick={() => setFilter('active')}
            >
              Active ({activeCount})
            </button>
          </div>

          <div className="sessions-list">
            {filteredSessions.length === 0 ? (
              <div className="no-sessions">
                <p>No chat sessions</p>
              </div>
            ) : (
              filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className={`session-item ${selectedSession?.id === session.id ? 'selected' : ''} ${session.status}`}
                  onClick={() => handleSelectSession(session)}
                >
                  <div className="session-info">
                    <div className="session-name">
                      {session.visitorName}
                      {session.status === 'waiting' && (
                        <span className="new-badge">NEW</span>
                      )}
                    </div>
                    <div className="session-meta">
                      <span className="session-time">{formatTime(session.lastMessageAt)}</span>
                      {session.unreadByAdmin > 0 && (
                        <span className="unread-badge">{session.unreadByAdmin}</span>
                      )}
                    </div>
                  </div>
                  <div className="session-status-indicator">
                    {session.status === 'waiting' ? '⏱️' : '💬'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {selectedSession ? (
            <>
              <div className="chat-area-header">
                <div className="visitor-info">
                  <h3>{selectedSession.visitorName}</h3>
                  {selectedSession.visitorEmail && (
                    <p className="visitor-email">{selectedSession.visitorEmail}</p>
                  )}
                  <span className={`status-label ${selectedSession.status}`}>
                    {selectedSession.status === 'waiting' ? 'Waiting' : 'Active'}
                  </span>
                </div>
                <button
                  className="btn-close-session"
                  onClick={() => handleCloseSession(selectedSession.id)}
                >
                  End Chat
                </button>
              </div>

              <div className="chat-messages-area">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`chat-message ${msg.senderType === 'admin' ? 'admin-message' : 'visitor-message'}`}
                  >
                    <div className="message-bubble">
                      <div className="message-sender">
                        {msg.senderType === 'admin' ? 'You' : msg.senderName}
                      </div>
                      <div className="message-text">{msg.message}</div>
                      <div className="message-timestamp">
                        {msg.timestamp && new Date(msg.timestamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-area">
                <form onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    className="admin-chat-input"
                  />
                  <button
                    type="submit"
                    className="btn-send-admin"
                    disabled={!messageInput.trim()}
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="empty-state">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="80"
                  height="80"
                >
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                </svg>
                <h3>No chat selected</h3>
                <p>Select a chat session from the list to start responding</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatPanel;
