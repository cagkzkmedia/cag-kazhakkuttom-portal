/**
 * Layout Component
 * Main application layout with header and sidebar
 */

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebarOnMobile = () => {
    // Only close on mobile (when sidebar would be an overlay)
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleOverlayClick = () => {
    if (window.innerWidth < 768 && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="layout">
      <Header toggleSidebar={toggleSidebar} />
      <div className="layout-content">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={handleOverlayClick}></div>
        )}
        <Sidebar isOpen={sidebarOpen} onItemClick={closeSidebarOnMobile} />
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
