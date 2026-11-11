/**
 * Prayer Requests Management for Admin
 */

import React, { useEffect, useMemo, useState } from 'react';
import { getAllPrayerRequests, markPrayerRequestAsRead } from '../../services/prayerRequestService.firebase';

const PrayerRequestsManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await getAllPrayerRequests();
      setRequests(data);
    } catch (error) {
      console.error('Failed to load prayer requests:', error);
      alert('Failed to load prayer requests');
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = useMemo(() => {
    if (filter === 'unread') {
      return requests.filter((request) => !request.read);
    }

    if (filter === 'read') {
      return requests.filter((request) => request.read);
    }

    return requests;
  }, [filter, requests]);

  const handleMarkRead = async (requestId) => {
    try {
      await markPrayerRequestAsRead(requestId);
      setRequests((prev) =>
        prev.map((request) =>
          request.id === requestId ? { ...request, read: true, readAt: new Date().toISOString() } : request
        )
      );
    } catch (error) {
      console.error('Failed to mark prayer request as read:', error);
      alert('Failed to update prayer request status');
    }
  };

  if (loading) {
    return <div className="loading">Loading prayer requests...</div>;
  }

  return (
    <div className="page-container" style={{ padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ margin: 0, color: '#1f2937' }}>🙏 Prayer Requests</h1>
            <p style={{ margin: '8px 0 0', color: '#4b5563' }}>View and manage prayer requests submitted by the congregation.</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setFilter('all')}
              style={{
                background: filter === 'all' ? '#7c3aed' : '#fff',
                color: filter === 'all' ? '#fff' : '#374151',
                border: '1px solid #d1d5db',
                padding: '10px 16px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              style={{
                background: filter === 'unread' ? '#7c3aed' : '#fff',
                color: filter === 'unread' ? '#fff' : '#374151',
                border: '1px solid #d1d5db',
                padding: '10px 16px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Unread
            </button>
            <button
              type="button"
              onClick={() => setFilter('read')}
              style={{
                background: filter === 'read' ? '#7c3aed' : '#fff',
                color: filter === 'read' ? '#fff' : '#374151',
                border: '1px solid #d1d5db',
                padding: '10px 16px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Read
            </button>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1px solid #e5e7eb', textAlign: 'center', color: '#4b5563' }}>
            No prayer requests found for this filter.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '18px' }}>
            {filteredRequests.map((request) => (
              <div key={request.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '18px', padding: '22px', boxShadow: '0 10px 24px rgba(15,23,42,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#111827' }}>{request.name}</h3>
                    <div style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '4px' }}>
                      {new Date(request.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </div>
                  <span style={{
                    background: request.read ? '#ecfdf5' : '#fef3c7',
                    color: request.read ? '#065f46' : '#92400e',
                    borderRadius: '999px',
                    padding: '6px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}>
                    {request.read ? 'Read' : 'Unread'}
                  </span>
                </div>

                {request.address && <p style={{ margin: '8px 0', color: '#374151' }}><strong>Address:</strong> {request.address}</p>}
                {request.phone && <p style={{ margin: '8px 0', color: '#374151' }}><strong>Phone:</strong> {request.phone}</p>}
                <p style={{ margin: '8px 0', color: '#374151', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  <strong>Prayer Request:</strong> {request.prayerRequest}
                </p>

                {!request.read && (
                  <div style={{ marginTop: '16px' }}>
                    <button
                      type="button"
                      onClick={() => handleMarkRead(request.id)}
                      style={{
                        background: '#7c3aed',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        padding: '10px 16px',
                        fontWeight: 700,
                      }}
                    >
                      Mark as Read
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerRequestsManagement;
