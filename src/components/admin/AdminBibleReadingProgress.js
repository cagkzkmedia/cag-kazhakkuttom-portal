/**
 * Admin Bible Reading Progress Component
 * Shows all users' Bible reading progress in a table
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminBibleReadingProgress.css';
import { 
  getAllUsersProgress, 
  resetUserProgress, 
  deleteUserProgress 
} from '../../services/bibleReadingService.firebase';

const AdminBibleReadingProgress = () => {
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt'); // createdAt, userName, progress
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

  // Badge milestones
  const badges = [
    { id: 1, name: 'First Steps', icon: '🌱', milestone: 1 },
    { id: 2, name: 'One Week', icon: '⭐', milestone: 7 },
    { id: 3, name: 'Committed', icon: '🔥', milestone: 30 },
    { id: 4, name: 'Warrior', icon: '⚔️', milestone: 90 },
    { id: 5, name: 'Half Way', icon: '🏆', milestone: 182 },
    { id: 6, name: 'Almost There', icon: '🎯', milestone: 300 },
    { id: 7, name: 'Champion', icon: '👑', milestone: 365 }
  ];

  const getUserBadges = (completedCount) => {
    return badges.filter(badge => completedCount >= badge.milestone);
  };

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      const data = await getAllUsersProgress();
      setProgressData(data);
      setError('');
    } catch (err) {
      console.error('Error loading progress data:', err);
      setError('Failed to load progress data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortedAndFilteredData = () => {
    let filtered = progressData;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort data
    filtered = [...filtered].sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case 'userName':
          aVal = (a.userName || '').toLowerCase();
          bVal = (b.userName || '').toLowerCase();
          break;
        case 'progress':
          aVal = parseFloat(a.progressPercent) || 0;
          bVal = parseFloat(b.progressPercent) || 0;
          break;
        case 'completedCount':
          aVal = a.completedCount || 0;
          bVal = b.completedCount || 0;
          break;
        case 'startDate':
          aVal = new Date(a.startDate || 0).getTime();
          bVal = new Date(b.startDate || 0).getTime();
          break;
        case 'updatedAt':
          aVal = new Date(a.updatedAt || 0).getTime();
          bVal = new Date(b.updatedAt || 0).getTime();
          break;
        default: // createdAt
          aVal = new Date(a.createdAt || 0).getTime();
          bVal = new Date(b.createdAt || 0).getTime();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressColor = (percent) => {
    if (percent >= 75) return 'green';
    if (percent >= 50) return 'blue';
    if (percent >= 25) return 'orange';
    return 'red';
  };

  const handleResetProgress = async (userId, userName) => {
    const confirmReset = window.confirm(
      `Are you sure you want to reset progress for "${userName}"?\n\nThis will clear all completed days but keep the user record.`
    );

    if (!confirmReset) return;

    try {
      await resetUserProgress(userId);
      alert('Progress reset successfully!');
      loadProgressData(); // Reload data
    } catch (error) {
      console.error('Error resetting progress:', error);
      alert('Failed to reset progress. Please try again.');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    const confirmDelete = window.confirm(
      `⚠️ WARNING: Are you sure you want to DELETE the entire reading record for "${userName}"?\n\nThis action CANNOT be undone!`
    );

    if (!confirmDelete) return;

    // Double confirmation for delete
    const doubleConfirm = window.confirm(
      `FINAL CONFIRMATION: Delete "${userName}"'s reading record permanently?`
    );

    if (!doubleConfirm) return;

    try {
      await deleteUserProgress(userId);
      alert('User record deleted successfully.');
      loadProgressData(); // Reload data
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const sortedData = getSortedAndFilteredData();
  const totalUsers = progressData.length;
  const activeUsers = progressData.filter(u => u.completedCount > 0).length;
  const averageProgress = progressData.length > 0 
    ? (progressData.reduce((sum, u) => sum + parseFloat(u.progressPercent || 0), 0) / progressData.length).toFixed(1)
    : 0;

  return (
    <div className="admin-bible-progress-content">
      <div className="admin-bible-progress-header">
        <h1>📖 Bible Reading Progress Tracker</h1>
        <button className="btn-refresh" onClick={loadProgressData} disabled={loading}>
          {loading ? '⏳ Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="bible-stats-grid">
          <div className="bible-stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="bible-stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{activeUsers}</h3>
              <p>Active Readers</p>
            </div>
          </div>
          <div className="bible-stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>{averageProgress}%</h3>
              <p>Average Progress</p>
            </div>
          </div>
          <div className="bible-stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <h3>{progressData.filter(u => parseFloat(u.progressPercent) === 100).length}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bible-table-controls">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search by name or user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="sort-info">
            Showing {sortedData.length} of {totalUsers} users
          </div>
        </div>

        {/* Progress Table */}
        {loading ? (
          <div className="loading-container">
            <p>Loading progress data...</p>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="no-data">
            <p>No users found.</p>
          </div>
        ) : (
          <div className="bible-progress-table-container">
            <table className="bible-progress-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('userName')} className="sortable">
                    Name {sortBy === 'userName' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('startDate')} className="sortable">
                    Start Date {sortBy === 'startDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('completedCount')} className="sortable">
                    Days Completed {sortBy === 'completedCount' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('progress')} className="sortable">
                    Progress {sortBy === 'progress' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('updatedAt')} className="sortable">
                    Last Updated {sortBy === 'updatedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('createdAt')} className="sortable">
                    Joined {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Badges</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((user) => {
                  const earnedBadges = getUserBadges(user.completedCount);
                  return (
                  <tr key={user.id}>
                    <td className="user-name">
                      <strong>{user.userName || 'Anonymous'}</strong>
                      <span className="user-id">{user.userId}</span>
                    </td>
                    <td>{formatDate(user.startDate)}</td>
                    <td className="text-center">
                      <span className="badge-count">{user.completedCount} / 365</span>
                    </td>
                    <td>
                      <div className="progress-cell">
                        <div className="progress-bar">
                          <div 
                            className={`progress-fill ${getProgressColor(user.progressPercent)}`}
                            style={{ width: `${user.progressPercent}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{user.progressPercent}%</span>
                      </div>
                    </td>
                    <td>{formatDate(user.updatedAt)}</td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td className="badges-cell">
                      {earnedBadges.length > 0 ? (
                        <div className="admin-badges-list">
                          {earnedBadges.map(badge => (
                            <span 
                              key={badge.id} 
                              className="admin-badge-icon" 
                              title={badge.name}
                            >
                              {badge.icon}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="no-badges">No badges yet</span>
                      )}
                    </td>
                    <td className="action-buttons">
                      <button 
                        className="btn-reset" 
                        onClick={() => handleResetProgress(user.userId, user.userName)}
                        title="Reset progress"
                      >
                        🔄 Reset
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDeleteUser(user.userId, user.userName)}
                        title="Delete user"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

export default AdminBibleReadingProgress;
