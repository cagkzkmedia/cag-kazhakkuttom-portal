/**
 * Member Portal Dashboard Component
 */

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getMemberProfile, getMemberEvents } from '../../services/memberPortalService';
import { getAllEvents } from '../../services/eventService.firebase';
import { formatTo12Hour } from '../../utils/timeFormatter';
import './MemberPortalDashboard.css';

const MemberPortalDashboard = () => {
  const { member } = useSelector((state) => state.memberPortal);
  const [profile, setProfile] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line
  }, []);

  const filterCurrentWeekEvents = (allEvents) => {
    const now = new Date();
    // Start from Monday
    const dayOfWeek = now.getDay();
    const daysFromMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() + daysFromMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 5); // End on Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    return allEvents
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [profileData, allEvents] = await Promise.all([
        getMemberProfile(member.id),
        getAllEvents(),
      ]);

      setProfile(profileData);
      const weekEvents = filterCurrentWeekEvents(allEvents);
      setMyEvents(weekEvents);
      setAvailableEvents(allEvents.filter(e => 
        !weekEvents.some(we => we.id === e.id) && 
        new Date(e.date) >= new Date()
      ));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="member-portal-dashboard">
      <div className="member-portal-header-section">
        <h1>Welcome back, {member?.name || 'Member'}!</h1>
        <p>Christ AG Church, Kazhakkuttom - Community Overview</p>
      </div>

      <div className="member-portal-grid">
        {/* Profile Summary */}
        <div className="member-portal-card">
          <h3>👤 My Profile</h3>
          <div className="profile-info">
            <div className="profile-item">
              <span className="label">Name:</span>
              <span className="value">{profile?.name}</span>
            </div>
            <div className="profile-item">
              <span className="label">Email:</span>
              <span className="value">{profile?.email}</span>
            </div>
            <div className="profile-item">
              <span className="label">Phone:</span>
              <span className="value">{profile?.phone}</span>
            </div>
            <div className="profile-item">
              <span className="label">Member Since:</span>
              <span className="value">{new Date(profile?.joinDate).toLocaleDateString()}</span>
            </div>
            <div className="profile-item">
              <span className="label">Membership:</span>
              <span className="value badge">{profile?.membershipType}</span>
            </div>
          </div>
        </div>

        {/* My Events */}
        <div className="member-portal-card weekly-events-card">
          <div className="card-header">
            <h3>📅 This Week's Events</h3>
            <span className="week-label">Mon - Sat</span>
          </div>
          {myEvents.length === 0 ? (
            <div className="no-data-state">
              <div className="empty-icon">📭</div>
              <p>No events scheduled for this week</p>
            </div>
          ) : (
            <div className="weekly-events-list">
              {myEvents.map((event) => (
                <div key={event.id} className="weekly-event-item compact">
                  <div className="event-date-badge">
                    <span className="day">{new Date(event.date).getDate()}</span>
                    <span className="month">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  </div>
                  <div className="event-content">
                    <h4 className="event-title">{event.title}</h4>
                    <div className="event-meta-info">
                      <span className="meta-item">
                        <span className="icon">🕐</span>
                        {formatTo12Hour(event.time)}
                      </span>
                      <span className="meta-item">
                        <span className="icon">📍</span>
                        {event.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Events */}
        <div className="member-portal-card full-width">
          <h3>🎯 Upcoming Events</h3>
          {availableEvents.length === 0 ? (
            <p className="no-data">No upcoming events available.</p>
          ) : (
            <div className="available-events-grid">
              {availableEvents.map((event) => (
                <div key={event.id} className="available-event-card">
                  <h4>{event.title}</h4>
                  <p className="description">{event.description}</p>
                  <div className="event-meta">
                    <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                    <span>🕐 {formatTo12Hour(event.time)}</span>
                    <span>📍 {event.location}</span>
                  </div>
                  <button className="btn btn-register">Register</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="member-portal-card">
          <h3>📊 Quick Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{myEvents.length}</span>
              <span className="stat-label">This Week's Events</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{availableEvents.length}</span>
              <span className="stat-label">Available Events</span>
            </div>
          </div>
        </div>

        {/* Church Info */}
        <div className="member-portal-card church-info">
          <h3>⛪ Church Information</h3>
          <div className="profile-info">
            <div className="profile-item">
              <span className="label">Senior Pastor:</span>
              <span className="value">Pr. Jobin Alisha</span>
            </div>
            <div className="profile-item">
              <span className="label">Location:</span>
              <span className="value">Kazhakkuttom, Trivandrum</span>
            </div>
            <div className="profile-item">
              <span className="label">Contact:</span>
              <span className="value">info@christag.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberPortalDashboard;
