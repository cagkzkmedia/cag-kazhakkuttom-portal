/**
 * Member Portal Layout Component
 */

import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/memberPortalSlice';
import { toggleNotifications } from '../../redux/slices/notificationSlice';
import NotificationDropdown from '../notifications/NotificationDropdown';
import churchLogo from '../../assets/cag-logo.png';
import './MemberPortalLayout.css';

const MemberPortalLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { member } = useSelector((state) => state.memberPortal);
  const { notifications } = useSelector((state) => state.notifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/member-portal/login');
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleNotificationToggle = () => {
    dispatch(toggleNotifications());
  };

  return (
    <div className="member-portal-layout">
      <header className="member-portal-nav">
        <div className="member-portal-nav-left">
          <div className="member-portal-logo">
            <img src={churchLogo} alt="Christ AG Church" className="logo-image" />
            <h2>Christ AG Church, Kazhakkuttom</h2>
          </div>
          <nav className="member-nav-links">
            <button onClick={() => navigateTo('/member-portal/dashboard')} className="nav-link">
              📊 Dashboard
            </button>
            <button onClick={() => navigateTo('/member-portal/events')} className="nav-link">
              📅 Events
            </button>
            <button onClick={() => navigateTo('/member-portal/donate')} className="nav-link">
              💝 Donate
            </button>
            <button onClick={() => navigateTo('/member-portal/donation-history')} className="nav-link">
              📜 History
            </button>
          </nav>
        </div>
        <div className="member-portal-nav-right">
          <div className="notification-container">
            <button className="notification-bell" onClick={handleNotificationToggle}>
              🔔
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
            <NotificationDropdown />
          </div>
          <span className="member-name">Welcome, {member?.name}</span>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <main className="member-portal-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MemberPortalLayout;
