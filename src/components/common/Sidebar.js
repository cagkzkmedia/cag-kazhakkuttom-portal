/**
 * Sidebar Component
 * Navigation sidebar with menu items and role-based access
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import churchLogo from '../../assets/cag-logo.png';
import './Sidebar.css';

const Sidebar = ({ isOpen, onItemClick }) => {
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role?.trim() || 'admin'; // Trim any whitespace and default to admin

  console.log('User object:', user);
  console.log('User role (type):', typeof userRole, 'value:', JSON.stringify(userRole));

  const allMenuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard', roles: ['admin', 'events_manager', 'finance_manager', 'resource_manager'] },
    { path: '/admin/members', icon: '👥', label: 'Members', roles: ['admin'] },
    { path: '/admin/events', icon: '📅', label: 'Events', roles: ['admin', 'events_manager'] },
    { path: '/admin/donations', icon: '💰', label: 'Donations', roles: ['admin', 'finance_manager'] },
    { path: '/admin/resources', icon: '📚', label: 'Resources', roles: ['admin', 'resource_manager'] },
    { path: '/admin/testimonials', icon: '💬', label: 'Testimonials', roles: ['admin', 'content_manager'] },
    { path: '/admin/notifications', icon: '🔔', label: 'Notifications', roles: ['admin', 'events_manager', 'finance_manager', 'resource_manager'] },
    { path: '/admin/users', icon: '👤', label: 'User Management', roles: ['admin'] },
    { path: '/admin/settings', icon: '⚙️', label: 'Settings', roles: ['admin', 'events_manager', 'finance_manager', 'resource_manager'] },
  ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item => {
    const hasAccess = item.roles.includes(userRole);
    console.log(`Menu item: ${item.label}, roles: ${item.roles}, has access: ${hasAccess}`);
    return hasAccess;
  });

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <img src={churchLogo} alt="Christ AG Church" className="sidebar-logo" />
        {isOpen && <h3 className="sidebar-title">Christ AG Church</h3>}
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
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
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
