import React, { useState, useEffect, useRef } from 'react';
import './ChatWidget.css';
import { 
  createChatSession, 
  sendMessage, 
  listenToMessages,
  getChatSession,
  markMessagesAsRead
} from '../../services/chatService.firebase';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [sessionStatus, setSessionStatus] = useState('waiting');
  const [adminName, setAdminName] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolledDown, setScrolledDown] = useState(false);
  const messagesEndRef = useRef(null);
  const unsubscribeRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Detect scroll position for shifting chat button
  useEffect(() => {
    const handleScroll = () => {
      setScrolledDown(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen to messages when session is created
  useEffect(() => {
    if (sessionId) {
      // Mark messages as read when chat is open
      if (isOpen) {
        markMessagesAsRead(sessionId, 'visitor');
        setUnreadCount(0);
      }

      unsubscribeRef.current = listenToMessages(sessionId, (newMessages) => {
        setMessages(newMessages);
        
        // Count unread messages from admin
        if (!isOpen) {
          const unread = newMessages.filter(
            msg => msg.senderType === 'admin' && !msg.read
          ).length;
          setUnreadCount(unread);
        }
      });

      // Also listen to session status
      const checkSessionStatus = setInterval(async () => {
        const session = await getChatSession(sessionId);
        if (session) {
          setSessionStatus(session.status);
          if (session.adminName && session.adminName !== adminName) {
            setAdminName(session.adminName);
          }
        }
      }, 3000);

      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
        }
        clearInterval(checkSessionStatus);
      };
    }
  }, [sessionId, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && sessionId) {
      markMessagesAsRead(sessionId, 'visitor');
      setUnreadCount(0);
    }
  };

  const startChat = async (e) => {
    e.preventDefault();
    if (!visitorName.trim()) {
      alert('Please enter your name');
      return;
    }

    try {
      const newSessionId = await createChatSession(visitorName, visitorEmail);
      setSessionId(newSessionId);
      setIsStarted(true);
      
      // Store in localStorage to persist across page refreshes
      localStorage.setItem('chatSessionId', newSessionId);
      localStorage.setItem('chatVisitorName', visitorName);
      localStorage.setItem('chatVisitorEmail', visitorEmail);
      
      // Send initial message
      await sendMessage(
        newSessionId,
        `Hi! I'm ${visitorName}. I'd like to chat with someone.`,
        'visitor',
        visitorName
      );
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Failed to start chat. Please try again.');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !sessionId) return;

    try {
      await sendMessage(sessionId, message, 'visitor', visitorName);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  // Check if there's an existing session
  useEffect(() => {
    const savedSessionId = localStorage.getItem('chatSessionId');
    const savedName = localStorage.getItem('chatVisitorName');
    const savedEmail = localStorage.getItem('chatVisitorEmail');

    if (savedSessionId && savedName) {
      getChatSession(savedSessionId).then(session => {
        if (session && session.status !== 'closed') {
          setSessionId(savedSessionId);
          setVisitorName(savedName);
          setVisitorEmail(savedEmail || '');
          setIsStarted(true);
          setSessionStatus(session.status);
          setAdminName(session.adminName || '');
        } else {
          // Clear invalid session
          localStorage.removeItem('chatSessionId');
          localStorage.removeItem('chatVisitorName');
          localStorage.removeItem('chatVisitorEmail');
        }
      });
    }
  }, []);

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Chat Button */}
      <div className={`chat-button ${isOpen ? 'hidden' : ''} ${scrolledDown ? 'shifted' : ''}`} onClick={toggleChat}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="28"
          height="28"
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
        </svg>
        {unreadCount > 0 && <span className="chat-badge">{unreadCount}</span>}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-widget">
          <div className="chat-header">
            <div className="chat-header-content">
              <h3>Chat with Admin</h3>
              {sessionStatus === 'active' && adminName && (
                <span className="admin-joined">
                  <span className="status-dot"></span>
                  {adminName} joined
                </span>
              )}
              {sessionStatus === 'waiting' && (
                <span className="waiting-status">Waiting for admin...</span>
              )}
            </div>
            <button className="close-button" onClick={toggleChat}>×</button>
          </div>

          {!isStarted ? (
            <div className="chat-start-form">
              <h4>Start a conversation</h4>
              <form onSubmit={startChat}>
                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email (optional)</label>
                  <input
                    type="email"
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <button type="submit" className="btn-start-chat">
                  Start Chat
                </button>
              </form>
            </div>
          ) : (
            <>
              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div className="no-messages">
                    <p>Your message has been sent. An admin will respond shortly.</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`message ${msg.senderType === 'visitor' ? 'message-visitor' : 'message-admin'}`}
                    >
                      <div className="message-content">
                        <div className="message-text">{msg.message}</div>
                        <div className="message-time">{formatTime(msg.timestamp)}</div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-container">
                <form onSubmit={handleSendMessage} className="chat-input-form">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="chat-input"
                  />
                  <button type="submit" className="send-button" disabled={!message.trim()}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="20"
                      height="20"
                    >
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;
