/**
 * Prayer Cards Page Component
 * Public page for creating and displaying instant prayer cards for Sunday service
 * No backend required - uses localStorage for persistence
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllMembers } from '../../services/memberService.firebase';
import './PrayerCardsPage.css';

const PrayerCardsPage = () => {
  const navigate = useNavigate();
  const [prayers, setPrayers] = useState([]);
  const [celebrations, setCelebrations] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    prayer: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Load prayers and celebrations from localStorage on component mount
  useEffect(() => {
    loadPrayers();
    loadCelebrations();
  }, []);

  const loadPrayers = () => {
    try {
      const savedPrayers = localStorage.getItem('prayerCards');
      if (savedPrayers) {
        const parsedPrayers = JSON.parse(savedPrayers);
        setPrayers(parsedPrayers);
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
          // Check only month and day, ignoring year
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

  const savePrayers = (prayersToSave) => {
    try {
      localStorage.setItem('prayerCards', JSON.stringify(prayersToSave));
    } catch (error) {
      console.error('Error saving prayers:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.prayer.trim()) {
      setError('Please enter your prayer request');
      return false;
    }
    if (formData.prayer.length < 10) {
      setError('Prayer request must be at least 10 characters');
      return false;
    }
    if (formData.name.length > 50) {
      setError('Name must be 50 characters or less');
      return false;
    }
    if (formData.prayer.length > 500) {
      setError('Prayer request must be 500 characters or less');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newPrayer = {
      id: Date.now(),
      name: formData.name.trim(),
      prayer: formData.prayer.trim(),
      timestamp: new Date().toLocaleString(),
      prayed: false,
    };

    const updatedPrayers = [newPrayer, ...prayers];
    setPrayers(updatedPrayers);
    savePrayers(updatedPrayers);

    setFormData({
      name: '',
      prayer: '',
    });
    setSubmitted(true);

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  const handleDeletePrayer = (id) => {
    const updatedPrayers = prayers.filter(p => p.id !== id);
    setPrayers(updatedPrayers);
    savePrayers(updatedPrayers);
  };

  const handleMarkAsPrayed = (id) => {
    const updatedPrayers = prayers.map(p =>
      p.id === id ? { ...p, prayed: !p.prayed } : p
    );
    setPrayers(updatedPrayers);
    savePrayers(updatedPrayers);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all prayers? This action cannot be undone.')) {
      setPrayers([]);
      savePrayers([]);
    }
  };

  const startPresentationMode = () => {
    if (filteredPrayers.length === 0) {
      setError('No prayers available for presentation');
      return;
    }
    // Navigate to presentation page
    navigate('/prayer-cards/presentation');
  };

  const filteredPrayers = filterType === 'all' 
    ? prayers 
    : filterType === 'unprayed'
    ? prayers.filter(p => !p.prayed)
    : prayers.filter(p => p.prayed);

  return (
    <div className="prayer-cards-page">
      {/* Header with Navigation */}
      <div className="prayer-cards-header">
        <div className="prayer-cards-nav">
          <Link to="/" className="nav-link">← Back to Home</Link>
        </div>
        <div className="prayer-cards-title-section">
          <h1>Prayer Cards for Sunday Service</h1>
          <p>Submit your prayer requests to be prayed over during service</p>
        </div>
      </div>

      <div className="prayer-cards-container">
        {/* Form Section */}
        <div className="prayer-form-section">
          <div className="form-card">
            <h2>Submit Your Prayer Request</h2>
            
            {submitted && (
              <div className="success-message">
                <span className="success-icon">✓</span>
                Prayer submitted successfully!
              </div>
            )}

            {error && (
              <div className="error-message">
                <span className="error-icon">✕</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  maxLength="50"
                  required
                />
                <span className="char-count">{formData.name.length}/50</span>
              </div>

              <div className="form-group">
                <label htmlFor="prayer">Prayer Request *</label>
                <textarea
                  id="prayer"
                  name="prayer"
                  value={formData.prayer}
                  onChange={handleInputChange}
                  placeholder="Please share your prayer request... (e.g., healing, guidance, thanksgiving, etc.)"
                  rows="5"
                  maxLength="500"
                  required
                />
                <span className="char-count">{formData.prayer.length}/500</span>
              </div>

              <button type="submit" className="submit-btn">
                Submit Prayer Request
              </button>
            </form>
          </div>
        </div>

        {/* Prayers Display Section */}
        <div className="prayer-display-section">
          <div className="display-header">
            <div className="display-title">
              <h2>Prayer Requests</h2>
              <span className="prayer-count">({filteredPrayers.length})</span>
            </div>

            {prayers.length > 0 && (
              <div className="filter-controls">
                <div className="filter-buttons">
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
                    Not Prayed ({prayers.filter(p => !p.prayed).length})
                  </button>
                  <button
                    className={`filter-btn ${filterType === 'prayed' ? 'active' : ''}`}
                    onClick={() => setFilterType('prayed')}
                  >
                    Prayed ({prayers.filter(p => p.prayed).length})
                  </button>
                </div>
                
                <div className="action-buttons">
                  {filteredPrayers.length > 0 && (
                    <button className="presentation-mode-btn" onClick={startPresentationMode}>
                      🎬 Start Presentation
                    </button>
                  )}
                  {prayers.length > 0 && (
                    <button className="clear-all-btn" onClick={handleClearAll}>
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {filteredPrayers.length === 0 ? (
            <div className="empty-state">
              {prayers.length === 0 ? (
                <>
                  <div className="empty-icon">🙏</div>
                  <h3>No Prayer Requests Yet</h3>
                  <p>Be the first to submit a prayer request for Sunday service</p>
                </>
              ) : (
                <>
                  <div className="empty-icon">✨</div>
                  <h3>No {filterType === 'prayed' ? 'un' : ''}prayed requests</h3>
                  <p>Try selecting a different filter</p>
                </>
              )}
            </div>
          ) : (
            <>
              {celebrations.length > 0 && filterType === 'all' && (
                <div className="page-celebration-cards">
                  <div className="page-celebration-card">
                    <div className="page-celebration-card-header">
                      <h3>🎉 Today's Celebrations</h3>
                    </div>
                    <div className="page-celebration-list">
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
                            <div key={`${person.id || index}-${celebIndex}`} className="page-celebration-item">
                              <p className="page-celebration-name">{person.name}</p>
                              <p className="page-celebration-type">{celebration.type}</p>
                              <p className="page-celebration-date">{dateStr}</p>
                            </div>
                          );
                        });
                      })}
                    </div>
                  </div>
                </div>
              )}
              <div className="prayer-cards-grid">
              {filteredPrayers.map((prayer) => (
                <div key={prayer.id} className={`prayer-card ${prayer.prayed ? 'prayed' : ''}`}>
                  <div className="prayer-card-header">
                    <div className="prayer-meta">
                      <p className="prayer-name">{prayer.name}</p>
                      <p className="prayer-time">{prayer.timestamp}</p>
                    </div>
                    {prayer.prayed && (
                      <span className="prayed-badge">✓ Prayed</span>
                    )}
                  </div>

                  <div className="prayer-card-content">
                    <p className="prayer-text">{prayer.prayer}</p>
                  </div>

                  <div className="prayer-card-actions">
                    <button
                      className={`action-btn pray-btn ${prayer.prayed ? 'prayed' : ''}`}
                      onClick={() => handleMarkAsPrayed(prayer.id)}
                      title={prayer.prayed ? 'Mark as unprayed' : 'Mark as prayed'}
                    >
                      {prayer.prayed ? '✓ Prayed' : 'Mark as Prayed'}
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeletePrayer(prayer.id)}
                      title="Delete this prayer"
                    >
                      ✕ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            </>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="prayer-cards-info">
        <div className="info-card">
          <h3>📝 How It Works</h3>
          <ul>
            <li>Submit your prayer request using the form above</li>
            <li>Your prayer will be displayed for the congregation to see</li>
            <li>Mark prayers as "Prayed" when they've been lifted up in prayer</li>
            <li>All prayers are stored locally during the service</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>🙏 Prayer Guidelines</h3>
          <ul>
            <li>Be respectful and kind in your requests</li>
            <li>Keep requests clear and concise</li>
            <li>Include specific needs (healing, guidance, thanksgiving, etc.)</li>
            <li>Prayers are visible to all service attendees</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrayerCardsPage;
