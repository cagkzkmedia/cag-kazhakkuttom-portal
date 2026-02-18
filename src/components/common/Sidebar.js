/**
 * Sidebar Component
 * Navigation sidebar with menu items and role-based access
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { openCelebrationsModal, openWeeklyEventsModal } from '../../redux/slices/uiSlice';
import churchLogo from '../../assets/cag-logo.png';
import agLogo from '../../assets/ag-logo.png';
import './Sidebar.css';

const Sidebar = ({ isOpen, onItemClick, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  // Normalize the user role: trim whitespace and default to admin if empty
  const userRole = (user?.role || 'admin').trim().toLowerCase();

  console.log('User object:', user);
  console.log('User role (normalized):', userRole);

  const allMenuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard', roles: ['admin', 'events_manager', 'finance_manager', 'resource_manager', 'content_manager'] },
    { path: 'celebrations', icon: '🎉', label: 'Celebrations', roles: ['admin', 'events_manager', 'finance_manager', 'resource_manager', 'content_manager'], isAction: true },
    { path: '/celebrations/slideshow', icon: '🎬', label: 'Celebration Slideshow', roles: ['admin', 'events_manager', 'finance_manager', 'resource_manager', 'content_manager'] },
    { path: '/admin/members', icon: '👥', label: 'Members', roles: ['admin'] },
    { path: '/admin/member-approvals', icon: '✅', label: 'Member Approvals', roles: ['admin'] },
    { path: '/admin/events', icon: '📅', label: 'Events', roles: ['admin', 'events_manager'] },
    { path: 'weekly-events', icon: '📆', label: 'Weekly Events', roles: ['admin', 'events_manager'], isAction: true },
    { path: '/admin/donations', icon: '💰', label: 'Donations', roles: ['admin', 'finance_manager'] },
    { path: '/admin/resources', icon: '📚', label: 'Resources', roles: ['admin', 'resource_manager'] },
    { path: '/admin/testimonials', icon: '💬', label: 'Testimonials', roles: ['admin', 'content_manager'] },
    { path: '/admin/announcements', icon: '📢', label: 'Latest News', roles: ['admin', 'content_manager'] },
    { path: '/admin/chat', icon: '💭', label: 'Live Chat', roles: ['admin'] },
    { path: '/admin/notifications', icon: '🔔', label: 'Notifications', roles: ['admin', 'events_manager', 'finance_manager', 'resource_manager', 'content_manager'] },
    { path: '/admin/users', icon: '👤', label: 'User Management', roles: ['admin'] },
    { path: '/admin/settings', icon: '⚙️', label: 'Settings', roles: ['admin', 'events_manager', 'finance_manager', 'resource_manager', 'content_manager'] },
    { path: '/admin/change-password', icon: '🔐', label: 'Change Password', roles: ['admin', 'events_manager', 'finance_manager', 'resource_manager', 'content_manager'] },
  ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item => {
    const hasAccess = item.roles.includes(userRole);
    console.log(`Menu item: ${item.label}, roles: ${item.roles}, user role: ${userRole}, has access: ${hasAccess}`);
    return hasAccess;
  });

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose || onItemClick}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="sidebar-logos">
          <img src={agLogo} alt="Assemblies of God" className="sidebar-logo ag-logo" />
          <img src={churchLogo} alt="Christ AG Church" className="sidebar-logo church-logo" />
        </div>
        {isOpen && <h3 className="sidebar-title">Christ AG Church</h3>}
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          item.isAction ? (
            <button
              key={item.path}
              onClick={() => {
                if (item.path === 'celebrations') {
                  dispatch(openCelebrationsModal());
                } else if (item.path === 'weekly-events') {
                  dispatch(openWeeklyEventsModal());
                }
                if (onItemClick) onItemClick();
              }}
              className="sidebar-item sidebar-action-item"
            >
              <span className="sidebar-icon">{item.icon}</span>
              {isOpen && <span className="sidebar-label">{item.label}</span>}
            </button>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onItemClick}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="sidebar-icon">{item.icon}</span>
              {isOpen && <span className="sidebar-label">{item.label}</span>}
            </NavLink>
          )
        ))}
      </nav>
    </aside>
    </>
  );
};

export default Sidebar;
