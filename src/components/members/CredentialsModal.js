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
    const text = `Username: ${credentials.username}\nPassword: ${credentials.password}\nLogin URL: ${window.location.origin}/#/member-portal/login`;
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
    const message = `Hello ${displayName},%0A%0AHere are your portal login details:%0AUsername: ${credentials.username}%0APassword: ${credentials.password}%0A%0ALogin: ${window.location.origin}/#/member-portal/login`;

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
                <code>{window.location.origin}/#/member-portal/login</code>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(`${window.location.origin}/#/member-portal/login`)}
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
              className="btn btn-success"
              onClick={sendToWhatsApp}
              disabled={!credentials.phone}
              title={credentials.phone ? 'Send credentials via WhatsApp' : 'No phone number available'}
              aria-label={credentials.phone ? 'Send via WhatsApp' : 'No phone number available'}
            >
              Send to watsapp
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
