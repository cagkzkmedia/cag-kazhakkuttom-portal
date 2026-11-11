/**
 * Popup for unread prayer requests aimed at admin users
 */

import React from 'react';
import { markPrayerRequestAsRead } from '../../services/prayerRequestService.firebase';
import './PrayerRequestPopup.css';

const PrayerRequestPopup = ({ isOpen, requests, onClose, onMarkedRead }) => {
  if (!isOpen) {
    return null;
  }

  const handleMarkRead = async (requestId) => {
    try {
      await markPrayerRequestAsRead(requestId);
      onMarkedRead?.();
    } catch (error) {
      console.error('Failed to mark prayer request as read:', error);
    }
  };

  return (
    <div className="prayer-request-popup-backdrop" onClick={onClose}>
      <div className="prayer-request-popup" onClick={(event) => event.stopPropagation()}>
        <div className="prayer-request-popup-header">
          <h3>New Prayer Requests</h3>
          <button type="button" className="prayer-request-popup-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {requests.length === 0 ? (
          <div className="prayer-request-popup-empty">No new prayer requests right now.</div>
        ) : (
          <div className="prayer-request-popup-body">
            {requests.map((request) => (
              <div key={request.id} className="prayer-request-popup-item">
                <div className="prayer-request-popup-top">
                  <strong>{request.name}</strong>
                  <span className="prayer-request-popup-date">
                    {new Date(request.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>

                {request.address && <p><strong>Address:</strong> {request.address}</p>}
                {request.phone && <p><strong>Phone:</strong> {request.phone}</p>}
                <p><strong>Prayer Request:</strong> {request.prayerRequest}</p>

                <div className="prayer-request-popup-actions">
                  <button type="button" onClick={() => handleMarkRead(request.id)}>Mark as Read</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerRequestPopup;
