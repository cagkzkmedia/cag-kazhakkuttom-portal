/**
 * Dashboard Overview Component
 * Main dashboard with key metrics and charts
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMembers } from '../../redux/slices/memberSlice';
import { setEvents } from '../../redux/slices/eventSlice';
import { setDonations } from '../../redux/slices/donationSlice';
import { getAllMembers } from '../../services/memberService.firebase';
import { getAllEvents } from '../../services/eventService.firebase';
import { getAllDonations } from '../../services/donationService.firebase';
import StatsCard from './StatsCard';
import DonationChart from './DonationChart';
import MemberGrowthChart from './MemberGrowthChart';
import RecentActivity from './RecentActivity';
import UpcomingEvents from './UpcomingEvents';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { members } = useSelector((state) => state.members);
  const { events } = useSelector((state) => state.events);
  const { donations, totalAmount, monthlyTotal } = useSelector((state) => state.donations);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  // Check if user is event manager or resource manager
  const isEventOrResourceManager = user?.role === 'events_manager' || user?.role === 'resource_manager';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [membersData, eventsData, donationsData] = await Promise.all([
        getAllMembers(),
        getAllEvents(),
        getAllDonations(),
      ]);

      dispatch(setMembers(membersData));
      dispatch(setEvents(eventsData));
      dispatch(setDonations(donationsData));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get current week range (Sunday to Saturday)
  const getWeekRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysFromSunday = -dayOfWeek;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + daysFromSunday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
  };

  // Check if a date (month/day only) falls within current week
  const isInCurrentWeek = (monthDay) => {
    if (!monthDay) return false;
    const { startOfWeek, endOfWeek } = getWeekRange();
    const dateObj = new Date(monthDay);
    const month = dateObj.getMonth();
    const day = dateObj.getDate();

    let checkDate = new Date(startOfWeek);
    while (checkDate <= endOfWeek) {
      if (checkDate.getMonth() === month && checkDate.getDate() === day) {
        return true;
      }
      checkDate.setDate(checkDate.getDate() + 1);
    }
    return false;
  };

  // Get members celebrating birthdays this week
  const birthdayMembers = members.filter(
    (m) => m.dateOfBirth && isInCurrentWeek(m.dateOfBirth)
  );

  // Get members celebrating anniversaries this week
  const anniversaryMembers = members.filter(
    (m) => m.marriageDate && isInCurrentWeek(m.marriageDate)
  );

  // Get members celebrating church joining anniversaries this week
  const churchJoinAnniversaryMembers = members.filter(
    (m) => m.joinDate && isInCurrentWeek(m.joinDate)
  );

  // Combine and sort by date
  const weekCelebrations = [
    ...birthdayMembers.map((m) => ({
      ...m,
      type: 'birthday',
      celebrationDate: new Date(m.dateOfBirth),
      icon: '🎂',
    })),
    ...anniversaryMembers.map((m) => ({
      ...m,
      type: 'anniversary',
      celebrationDate: new Date(m.marriageDate),
      icon: '❤️',
      years: new Date().getFullYear() - new Date(m.marriageDate).getFullYear(),
    })),
    ...churchJoinAnniversaryMembers.map((m) => ({
      ...m,
      type: 'churchJoinAnniversary',
      celebrationDate: new Date(m.joinDate),
      icon: '⛪',
      years: new Date().getFullYear() - new Date(m.joinDate).getFullYear(),
    })),
  ].sort((a, b) => a.celebrationDate.getDate() - b.celebrationDate.getDate());

  // Calculate upcoming events
  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  // Calculate stats
  const activeMembers = members.filter((m) => m.status === 'active').length;
  const recentDonations = donations.slice(0, 5);

  if (loading) {
    return (
      <div className="dashboard loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening today. | Pastor: Pr. Jobin Alisha</p>
      </div>

      {/* Weekly Celebrations Section */}
      {weekCelebrations.length > 0 && (
        <div className="celebrations-section">
          <h2>🎉 This Week's Celebrations</h2>
          <div className="celebrations-grid">
            {weekCelebrations.map((member) => (
              <div
                key={`${member.id}-${member.type}`}
                className={`celebration-card ${member.type}`}
              >
                <div className="celebration-display">
                  <div className="celebration-icon">{member.icon}</div>
                  {(member.type === 'anniversary' || member.type === 'churchJoinAnniversary') && (
                    <div className="anniversary-badge">
                      <span className="years-number">{member.years}</span>
                      <span className="years-text">years</span>
                    </div>
                  )}
                </div>
                <div className="celebration-info">
                  <h4>{member.name}</h4>
                  <p className="celebration-type">
                    {member.type === 'birthday'
                      ? 'Birthday'
                      : member.type === 'anniversary'
                      ? 'Wedding Anniversary'
                      : 'Church Joining'}
                  </p>
                  <p className="celebration-date">
                    {new Date(
                      member.type === 'birthday'
                        ? member.dateOfBirth
                        : member.type === 'anniversary'
                        ? member.marriageDate
                        : member.joinDate
                    ).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Total Members"
          value={members.length}
          subtitle={`${activeMembers} active`}
          icon="👥"
          color="#667eea"
        />
        <StatsCard
          title="Upcoming Events"
          value={upcomingEvents.length}
          subtitle="This month"
          icon="📅"
          color="#48bb78"
        />
        {!isEventOrResourceManager && (
          <StatsCard
            title="Total Donations"
            value={`₹${totalAmount.toLocaleString()}`}
            subtitle={`₹${monthlyTotal.toLocaleString()} this month`}
            icon="💰"
            color="#ed8936"
          />
        )}
        <StatsCard
          title="Recent Activities"
          value={isEventOrResourceManager ? events.length : donations.length + events.length}
          subtitle="All time"
          icon="📊"
          color="#9f7aea"
        />
      </div>

      {/* Charts Section */}
      {!isEventOrResourceManager && (
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Donation Trends</h3>
            <DonationChart donations={donations} />
          </div>
          <div className="chart-card">
            <h3>Member Growth</h3>
            <MemberGrowthChart members={members} />
          </div>
        </div>
      )}

      {isEventOrResourceManager && (
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Member Growth</h3>
            <MemberGrowthChart members={members} />
          </div>
        </div>
      )}

      {/* Activity and Events */}
      <div className="activity-grid">
        <div className="activity-card">
          <h3>Recent Activity</h3>
          <RecentActivity donations={recentDonations} events={events} />
        </div>
        <div className="activity-card">
          <h3>Upcoming Events</h3>
          <UpcomingEvents events={upcomingEvents} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
