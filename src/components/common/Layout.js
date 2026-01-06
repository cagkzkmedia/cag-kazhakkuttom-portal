/**
 * Layout Component
 * Main application layout with header and sidebar
 */

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { closeCelebrationsModal } from '../../redux/slices/uiSlice';
import Header from './Header';
import Sidebar from './Sidebar';
import Celebrations from '../celebrations/Celebrations';
import './Layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  const { celebrationsModalOpen } = useSelector((state) => state.ui);

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
        <Sidebar
          isOpen={sidebarOpen}
          onItemClick={closeSidebarOnMobile}
          onClose={handleOverlayClick}
        />
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <Outlet />
        </main>
      </div>
      
      {/* Global Celebrations Modal */}
      <Celebrations 
        isOpen={celebrationsModalOpen} 
        onClose={() => dispatch(closeCelebrationsModal())} 
      />
    </div>
  );
};

export default Layout;
