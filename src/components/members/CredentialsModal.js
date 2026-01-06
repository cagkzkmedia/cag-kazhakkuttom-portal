/**
 * Credentials Modal Component
 * Displays member portal credentials
 */

import React, { useState } from 'react';
import './MemberModal.css';

const CredentialsModal = ({ credentials, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyAllCredentials = () => {
    const text = `Username: ${credentials.username}\nPassword: ${credentials.password}\nLogin URL: ${window.location.origin}/member-portal/login`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendToWhatsApp = () => {
    const phone = (credentials.phone || '').replace(/\D/g, '');
    if (!phone) {
      alert('No phone number available for this member');
      return;
    }

    const displayName = credentials.name || credentials.email || '';
    const message = `Hello ${displayName},%0A%0AHere are your portal login details:%0AUsername: ${credentials.username}%0APassword: ${credentials.password}%0A%0ALogin: ${window.location.origin}/member-portal/login`;

    const url = `https://wa.me/${phone}?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content credentials-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔑 Portal Access Credentials</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="credentials-info">
            <div className="credential-item">
              <label>Username</label>
              <div className="credential-value">
                <code>{credentials.username}</code>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(credentials.username)}
                  title="Copy username"
                >
                  📋
                </button>
              </div>
            </div>

            <div className="credential-item">
              <label>Password</label>
              <div className="credential-value">
                <code>
                  {showPassword ? credentials.password : '••••••••••••'}
                </code>
                <button 
                  className="copy-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(credentials.password)}
                  title="Copy password"
                >
                  📋
                </button>
              </div>
            </div>

            <div className="credential-item">
              <label>Login URL</label>
              <div className="credential-value">
                <code>{window.location.origin}/member-portal/login</code>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(`${window.location.origin}/member-portal/login`)}
                  title="Copy URL"
                >
                  📋
                </button>
              </div>
            </div>

            {credentials.temporaryPassword && (
              <div className="warning-box">
                ⚠️ This is a temporary password. The member will be prompted to change it upon first login.
              </div>
            )}

            {copied && (
              <div className="success-message">
                ✅ Copied to clipboard!
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={copyAllCredentials}
            >
              📋 Copy All Credentials
            </button>
            <button
              type="button"
              className="btn btn-success btn-whatsapp"
              onClick={sendToWhatsApp}
              disabled={!credentials.phone}
              title={credentials.phone ? 'Send credentials via WhatsApp' : 'No phone number available'}
              aria-label={credentials.phone ? 'Send via WhatsApp' : 'No phone number available'}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M20.5 3.5H3.5C2.94772 3.5 2.5 3.94772 2.5 4.5V18.5C2.5 19.0523 2.94772 19.5 3.5 19.5H7.5V22L11.5 19.5H20.5C21.0523 19.5 21.5 19.0523 21.5 18.5V4.5C21.5 3.94772 21.0523 3.5 20.5 3.5Z" fill="#25D366"/>
                <path d="M16.2 14.2C15.6 14.6 14.9 14.8 14.2 14.9C13.8 14.9 13.4 14.8 13.1 14.6C12.7 14.4 12.4 14.1 12.2 13.7C11.9 13.3 11.8 12.9 11.8 12.5C11.8 12.1 11.9 11.7 12.1 11.3C12.3 10.9 12.6 10.6 13 10.4C13.3 10.2 13.6 10.1 14 10.1C14.3 10.1 14.6 10.2 14.9 10.4C15.3 10.6 15.6 10.9 15.8 11.3C16 11.7 16.1 12.1 16.1 12.5C16.1 12.9 16 13.3 15.8 13.6C15.7 13.9 15.5 14.1 15.2 14.3L16.2 14.2Z" fill="white"/>
              </svg>
              <span className="whatsapp-label">Send to WhatsApp</span>
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CredentialsModal;
