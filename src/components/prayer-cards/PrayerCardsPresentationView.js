/**
 * Prayer Cards Presentation View Component
 * Full-screen presentation mode for displaying all prayer cards
 * Loads cards in real-time as new prayers are added
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllMembers } from '../../services/memberService.firebase';
import './PrayerCardsPresentationView.css';

const PrayerCardsPresentationView = () => {
  const [prayers, setPrayers] = useState([]);
  const [celebrations, setCelebrations] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Load prayers and celebrations on component mount
  useEffect(() => {
    loadPrayers();
    loadCelebrations();

    // Poll for updates every 500ms to catch new prayers in real-time
    const interval = setInterval(() => {
      loadPrayers();
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const loadPrayers = () => {
    try {
      const savedPrayers = localStorage.getItem('prayerCards');
      if (savedPrayers) {
        const parsedPrayers = JSON.parse(savedPrayers);
        setPrayers(parsedPrayers);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error loading prayers:', error);
    }
  };

  const loadCelebrations = async () => {
    try {
      const members = await getAllMembers();
      const today = new Date();
      
      // Get current week boundaries (Sunday to Saturday)
      const currentDay = today.getDay();
      const diff = today.getDate() - currentDay;
      const weekStart = new Date(today.setDate(diff)); // Sunday
      const weekEnd = new Date(today.setDate(weekStart.getDate() + 6)); // Saturday

      const weekCelebrations = members.filter(member => {
        if (member.dateOfBirth) {
          const birthDate = new Date(member.dateOfBirth);
          const birthThisYear = new Date(new Date().getFullYear(), birthDate.getMonth(), birthDate.getDate());
          if (birthThisYear >= weekStart && birthThisYear <= weekEnd) {
            return true;
          }
        }
        if (member.anniversaryDate) {
          const anniversary = new Date(member.anniversaryDate);
          const anniversaryThisYear = new Date(new Date().getFullYear(), anniversary.getMonth(), anniversary.getDate());
          if (anniversaryThisYear >= weekStart && anniversaryThisYear <= weekEnd) {
            return true;
          }
        }
        if (member.churchJoinningAnniversary) {
          const churchAnniversary = new Date(member.churchJoinningAnniversary);
          const churchThisYear = new Date(new Date().getFullYear(), churchAnniversary.getMonth(), churchAnniversary.getDate());
          if (churchThisYear >= weekStart && churchThisYear <= weekEnd) {
            return true;
          }
        }
        return false;
      });

      setCelebrations(weekCelebrations);
    } catch (error) {
      console.error('Error loading celebrations:', error);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        window.location.hash = '#/prayer-cards';
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'r' || e.key === 'R') {
        loadPrayers();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const filteredPrayers = filterType === 'all'
    ? prayers
    : filterType === 'unprayed'
    ? prayers.filter((p) => !p.prayed)
    : prayers.filter((p) => p.prayed);

  return (
    <div className="presentation-view">
      {/* Header Bar */}
      <div className="presentation-header-bar">
        <div className="presentation-title">
          <h1>Prayer Requests - Sunday Service</h1>
          <p>Live: {filteredPrayers.length} prayers • Updated: {lastUpdated.toLocaleTimeString()}</p>
        </div>

        <div className="presentation-filter-buttons">
          <button
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All ({prayers.length})
          </button>
          <button
            className={`filter-btn ${filterType === 'unprayed' ? 'active' : ''}`}
            onClick={() => setFilterType('unprayed')}
          >
            Not Prayed ({prayers.filter((p) => !p.prayed).length})
          </button>
          <button
            className={`filter-btn ${filterType === 'prayed' ? 'active' : ''}`}
            onClick={() => setFilterType('prayed')}
          >
            Prayed ({prayers.filter((p) => p.prayed).length})
          </button>
        </div>

        <div className="presentation-controls">
          <button className="control-btn" onClick={loadPrayers} title="Refresh (R)">
            🔄
          </button>
          <button className="control-btn" onClick={toggleFullscreen} title="Fullscreen (F)">
            ⛶
          </button>
          <Link to="/prayer-cards" className="control-btn exit-btn" title="Exit (ESC)">
            ✕
          </Link>
        </div>
      </div>

      {/* Prayer Cards Grid */}
      {filteredPrayers.length === 0 ? (
        <div className="presentation-empty">
          {prayers.length === 0 ? (
            <>
              <div className="empty-icon">🙏</div>
              <h2>No Prayer Requests Yet</h2>
              <p>Waiting for prayer requests... Refreshing automatically every 500ms</p>
            </>
          ) : (
            <>
              <div className="empty-icon">✨</div>
              <h2>No {filterType === 'prayed' ? 'un' : ''}prayed requests</h2>
              <p>Try selecting a different filter</p>
            </>
          )}
        </div>
      ) : (
        <>
          {celebrations.length > 0 && (
            <div className="presentation-celebration-card">
              <div className="celebration-card-header">
                <h2>🎉 This Week's Celebrations</h2>
              </div>
              <div className="celebration-list-presentation">
                {celebrations.map((person, index) => {
                  const today = new Date();
                  const currentDay = today.getDay();
                  const diff = today.getDate() - currentDay;
                  const weekStart = new Date(today.setDate(diff));
                  const weekEnd = new Date(today.setDate(weekStart.getDate() + 6));

                  const celebrations_items = [];

                  // Check Birthday
                  if (person.dateOfBirth) {
                    const birthDate = new Date(person.dateOfBirth);
                    const birthThisYear = new Date(new Date().getFullYear(), birthDate.getMonth(), birthDate.getDate());
                    if (birthThisYear >= weekStart && birthThisYear <= weekEnd) {
                      celebrations_items.push({
                        type: '🎂 Birthday',
                        date: birthThisYear,
                      });
                    }
                  }

                  // Check Anniversary
                  if (person.anniversaryDate) {
                    const anniversary = new Date(person.anniversaryDate);
                    const anniversaryThisYear = new Date(new Date().getFullYear(), anniversary.getMonth(), anniversary.getDate());
                    if (anniversaryThisYear >= weekStart && anniversaryThisYear <= weekEnd) {
                      celebrations_items.push({
                        type: '💕 Anniversary',
                        date: anniversaryThisYear,
                      });
                    }
                  }

                  // Check Church Anniversary
                  if (person.churchJoinningAnniversary) {
                    const churchAnniversary = new Date(person.churchJoinningAnniversary);
                    const churchThisYear = new Date(new Date().getFullYear(), churchAnniversary.getMonth(), churchAnniversary.getDate());
                    if (churchThisYear >= weekStart && churchThisYear <= weekEnd) {
                      celebrations_items.push({
                        type: '⛪ Church Anniversary',
                        date: churchThisYear,
                      });
                    }
                  }

                  return celebrations_items.map((celebration, celebIndex) => {
                    const dateStr = celebration.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    return (
                      <div key={`${person.id || index}-${celebIndex}`} className="celebration-item-presentation">
                        <p className="celebration-name-presentation">{person.name}</p>
                        <p className="celebration-type-presentation">{celebration.type}</p>
                        <p className="celebration-date-presentation">{dateStr}</p>
                      </div>
                    );
                  });
                })}
              </div>
            </div>
          )}
          <div className="presentation-cards-grid">
            {filteredPrayers.map((prayer) => (
            <div key={prayer.id} className={`presentation-card ${prayer.prayed ? 'prayed' : ''}`}>
              <div className="card-inner">
                <div className="card-header">
                  <div className="card-name">{prayer.name}</div>
                  {prayer.prayed && <span className="card-prayed-badge">✓ PRAYED</span>}
                </div>
                <div className="card-text">{prayer.prayer}</div>
              </div>
            </div>
          ))}
            </div>
        </>
      )}

      {/* Bottom Keyboard Hints */}
      <div className="presentation-footer">
        <p>
          <strong>Keyboard Shortcuts:</strong> ESC = Exit • F = Fullscreen • R = Refresh • Auto-refreshes every 500ms
        </p>
      </div>
    </div>
  );
};

export default PrayerCardsPresentationView;
