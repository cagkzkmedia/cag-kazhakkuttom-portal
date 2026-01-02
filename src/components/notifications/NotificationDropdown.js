import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markAsRead, deleteNotification, toggleNotifications, setNotifications } from '../../redux/slices/notificationSlice';
import { getRecentNotifications, markAsRead as markNotificationAsRead, deleteNotification as deleteNotificationService } from '../../services/notificationService.firebase';
import './NotificationDropdown.css';

const NotificationDropdown = () => {
  const dispatch = useDispatch();
  const { notifications, showNotifications } = useSelector((state) => state.notifications);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await getRecentNotifications(10);
      dispatch(setNotifications(data));
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      dispatch(deleteNotification(id));
    } catch (error) {
      console.error('Error clearing notification:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotificationService(id);
      dispatch(deleteNotification(id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  if (!showNotifications) return null;

  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h3>Notifications</h3>
        <button onClick={() => dispatch(toggleNotifications())}>✕</button>
      </div>
      <div className="notification-list">
        {notifications.length === 0 ? (
          <p className="no-notifications">No notifications</p>
        ) : (
          notifications.slice(0, 10).map((notification) => (
            <div key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
              <div className="notification-content">
                <p>{notification.message}</p>
                <span className="notification-time">
                  {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ''}
                </span>
              </div>
              <div className="notification-actions">
                {!notification.read && (
                  <button onClick={() => handleMarkAsRead(notification.id)}>✓</button>
                )}
                <button onClick={() => handleDelete(notification.id)}>🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
