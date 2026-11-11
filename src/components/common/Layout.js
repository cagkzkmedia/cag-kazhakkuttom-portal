/**
 * Layout Component
 * Main application layout with header and sidebar
 */

import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { closeCelebrationsModal, closeWeeklyEventsModal } from '../../redux/slices/uiSlice';
import { getUnreadPrayerRequests } from '../../services/prayerRequestService.firebase';
import Header from './Header';
import Sidebar from './Sidebar';
import Celebrations from '../celebrations/Celebrations';
import WeeklyEvents from '../events/WeeklyEvents';
import PrayerRequestPopup from '../prayer-cards/PrayerRequestPopup';
import './Layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [showPrayerRequestPopup, setShowPrayerRequestPopup] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const { celebrationsModalOpen, weeklyEventsModalOpen } = useSelector((state) => state.ui);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'admin') {
      setPrayerRequests([]);
      setShowPrayerRequestPopup(false);
      return;
    }

    const fetchPrayerRequests = async () => {
      try {
        const unreadRequests = await getUnreadPrayerRequests();
        setPrayerRequests(unreadRequests);
        setShowPrayerRequestPopup(unreadRequests.length > 0);
      } catch (error) {
        console.error('Failed to load unread prayer requests:', error);
      }
    };

    fetchPrayerRequests();
  }, [isAuthenticated, user, location.pathname]);

  const handlePrayerRequestsRefresh = async () => {
    if (!isAuthenticated || user?.role !== 'admin') return;

    try {
      const unreadRequests = await getUnreadPrayerRequests();
      setPrayerRequests(unreadRequests);
      setShowPrayerRequestPopup(unreadRequests.length > 0);
    } catch (error) {
      console.error('Failed to refresh unread prayer requests:', error);
    }
  };

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

      {/* Prayer Request Popup for Admin */}
      <PrayerRequestPopup
        isOpen={showPrayerRequestPopup}
        requests={prayerRequests}
        onClose={() => setShowPrayerRequestPopup(false)}
        onMarkedRead={handlePrayerRequestsRefresh}
      />

      {/* Global Celebrations Modal */}
      <Celebrations 
        isOpen={celebrationsModalOpen} 
        onClose={() => dispatch(closeCelebrationsModal())} 
      />
      
      {/* Global Weekly Events Modal */}
      <WeeklyEvents 
        isOpen={weeklyEventsModalOpen} 
        onClose={() => dispatch(closeWeeklyEventsModal())} 
      />
    </div>
  );
};

export default Layout;
