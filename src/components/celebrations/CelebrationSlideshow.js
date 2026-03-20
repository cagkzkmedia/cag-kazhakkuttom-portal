/**
 * Celebration Slideshow Component
 * Displays weekly birthdays and anniversaries in a slideshow format
 */

import React, { useState, useEffect, useRef } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { getProfileImageUrl } from '../../utils/imageUtils';
import './CelebrationSlideshow.css';

const CelebrationSlideshow = () => {
  const [celebrations, setCelebrations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0); // 0 = this week, -1 = prev, +1 = next
  const [uploadedImages, setUploadedImages] = useState({});
  const [customAnniversaryNames, setCustomAnniversaryNames] = useState(() => {
    try {
      const saved = localStorage.getItem('celebrationSlideshowAnniversaryNames');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [editingNameId, setEditingNameId] = useState(null);
  const [editingNameValue, setEditingNameValue] = useState('');
  const [loading, setLoading] = useState(true);
  const fileInputRefs = useRef({});

  useEffect(() => {
    try {
      localStorage.setItem('celebrationSlideshowAnniversaryNames', JSON.stringify(customAnniversaryNames));
    } catch (error) {
      console.error('Error saving custom anniversary names:', error);
    }
  }, [customAnniversaryNames]);

  useEffect(() => {
    fetchWeeklyCelebrations(weekOffset);
    setCurrentIndex(0);
  }, [weekOffset]);

  const fetchWeeklyCelebrations = async (offset = 0) => {
    try {
      setLoading(true);
      const membersRef = collection(db, 'members');
      const q = query(membersRef);
      const querySnapshot = await getDocs(q);
      
      const now = new Date();
      // Shift the reference date by offset weeks
      const referenceDate = new Date(now);
      referenceDate.setDate(now.getDate() + offset * 7);

      const currentWeekStart = getStartOfWeek(referenceDate);
      const currentWeekEnd = getEndOfWeek(referenceDate);
      
      const celebrationsList = [];
      
      querySnapshot.forEach((doc) => {
        const member = { id: doc.id, ...doc.data() };
        
        // Check for birthday
        if (member.dateOfBirth) {
          const dob = new Date(member.dateOfBirth);
          if (isDateInWeek(dob, currentWeekStart, currentWeekEnd, referenceDate)) {
            celebrationsList.push({
              id: `birthday-${member.id}`,
              type: 'birthday',
              member: member,
              date: dob,
              name: member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim(),
            });
          }
        }
        
        // Check for anniversary
        if (member.marriageDate) {
          const marriageDate = new Date(member.marriageDate);
          if (isDateInWeek(marriageDate, currentWeekStart, currentWeekEnd, referenceDate)) {
            const years = referenceDate.getFullYear() - marriageDate.getFullYear();
            celebrationsList.push({
              id: `anniversary-${member.id}`,
              type: 'anniversary',
              member: member,
              date: marriageDate,
              name: member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim(),
              years: years,
            });
          }
        }
      });
      
      // Sort by type (birthdays first, then anniversaries), then by date within each type
      celebrationsList.sort((a, b) => {
        // First, sort by type: birthday comes before anniversary
        if (a.type !== b.type) {
          return a.type === 'birthday' ? -1 : 1;
        }
        
        // Within same type, sort by date
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        dateA.setFullYear(referenceDate.getFullYear());
        dateB.setFullYear(referenceDate.getFullYear());
        return dateA - dateB;
      });
      
      setCelebrations(celebrationsList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching celebrations:', error);
      setLoading(false);
    }
  };

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const getEndOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() + (6 - day);
    return new Date(d.setDate(diff));
  };

  const isDateInWeek = (date, weekStart, weekEnd, referenceDate) => {
    const checkDate = new Date(date);
    checkDate.setFullYear(referenceDate.getFullYear());
    
    const weekStartCopy = new Date(weekStart);
    const weekEndCopy = new Date(weekEnd);
    weekStartCopy.setHours(0, 0, 0, 0);
    weekEndCopy.setHours(23, 59, 59, 999);
    
    return checkDate >= weekStartCopy && checkDate <= weekEndCopy;
  };

  const handleImageUpload = (celebrationId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      event.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImages(prev => ({
        ...prev,
        [celebrationId]: reader.result
      }));
      // Reset the file input
      event.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? celebrations.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => 
      prev === celebrations.length - 1 ? 0 : prev + 1
    );
  };

  const handleStartEditName = (celebration) => {
    const currentDisplayName = customAnniversaryNames[celebration.id] || celebration.name || '';
    setEditingNameId(celebration.id);
    setEditingNameValue(currentDisplayName);
  };

  const handleCancelEditName = () => {
    setEditingNameId(null);
    setEditingNameValue('');
  };

  const handleSaveEditName = (celebration) => {
    const trimmedName = editingNameValue.trim();

    if (!trimmedName) {
      const updatedNames = { ...customAnniversaryNames };
      delete updatedNames[celebration.id];
      setCustomAnniversaryNames(updatedNames);
    } else {
      setCustomAnniversaryNames((prev) => ({
        ...prev,
        [celebration.id]: trimmedName
      }));
    }

    setEditingNameId(null);
    setEditingNameValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [celebrations.length]);

  const formatName = (name) => {
    if (!name) return '';
    // Always capitalize first letter of each word
    return name.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  };

  const getBirthdayMessage = (name) => {
    return {
      title: 'Happy Birthday!',
      message: `Wishing you a blessed and joyful day filled with God's grace and love.`,
      name: formatName(name)
    };
  };

  const getAnniversaryMessage = (name, years) => {
    const yearText = years > 0 ? `${years}${getOrdinalSuffix(years)} ` : '';
    return {
      title: `Happy ${yearText}Anniversary!`,
      message: `Celebrating your beautiful journey together. May the Lord bless you with many more wonderful years ahead.`,
      name: formatName(name)
    };
  };

  const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  };

  const getBirthdayCelebrationText = (dateOfBirth) => {
    if (!dateOfBirth) return 'Celebrating birthday';

    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const celebrationDate = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const daysLived = Math.floor((celebrationDate - birthDate) / millisecondsPerDay) + 1;

    if (daysLived <= 0) return 'Celebrating birthday';
    const dayText = daysLived === 1 ? 'day' : 'days';
    return `${daysLived} ${dayText}`;
  };

  if (loading) {
    return (
      <div className="celebration-slideshow-container">
        <div className="celebration-slideshow-loading">
          <div className="celebration-spinner"></div>
          <p>Loading celebrations...</p>
        </div>
      </div>
    );
  }

  if (celebrations.length === 0) {
    const weekLabel = weekOffset === 0 ? 'this week' : weekOffset < 0 ? `${Math.abs(weekOffset)} week${Math.abs(weekOffset) > 1 ? 's' : ''} ago` : `in ${weekOffset} week${weekOffset > 1 ? 's' : ''}`;
    return (
      <div className="celebration-slideshow-container">
        <div className="celebration-week-nav">
          <button className="celebration-week-btn" onClick={() => setWeekOffset(prev => prev - 1)}>← Previous Week</button>
          <span className="celebration-week-label">
            {weekOffset === 0 ? 'This Week' : weekOffset === -1 ? 'Previous Week' : weekOffset === 1 ? 'Next Week' : weekOffset > 0 ? `+${weekOffset} Weeks` : `${weekOffset} Weeks`}
          </span>
          <button className="celebration-week-btn" onClick={() => setWeekOffset(prev => prev + 1)}>Next Week →</button>
          {weekOffset !== 0 && (
            <button className="celebration-week-btn celebration-week-btn-today" onClick={() => setWeekOffset(0)}>Back to Today</button>
          )}
        </div>
        <div className="celebration-slideshow-empty">
          <div className="celebration-empty-icon">🎉</div>
          <h2>No Celebrations {weekLabel.charAt(0).toUpperCase() + weekLabel.slice(1)}</h2>
          <p>No birthdays or anniversaries found for this week!</p>
        </div>
      </div>
    );
  }

  const currentCelebration = celebrations[currentIndex];
  const displayName = currentCelebration.type === 'anniversary' && customAnniversaryNames[currentCelebration.id]
    ? customAnniversaryNames[currentCelebration.id]
    : currentCelebration.name;

  const message = currentCelebration.type === 'birthday' 
    ? getBirthdayMessage(displayName)
    : getAnniversaryMessage(displayName, currentCelebration.years);

  return (
    <div className="celebration-slideshow-container">
      {/* Floating Celebration Emojis */}
      <div className="celebration-balloon">🎈</div>
      <div className="celebration-balloon">🎂</div>
      <div className="celebration-balloon">🎉</div>
      <div className="celebration-balloon">💝</div>
      <div className="celebration-balloon">🎁</div>
      <div className="celebration-balloon">🎊</div>
      <div className="celebration-balloon">🎈</div>
      <div className="celebration-balloon">💕</div>
      <div className="celebration-balloon">🎂</div>
      <div className="celebration-balloon">🎉</div>
      <div className="celebration-balloon">🎁</div>
      <div className="celebration-balloon">✨</div>
      
      <div className="celebration-slideshow-header">
        <h1 className="celebration-slideshow-title">
          <span className="celebration-title-icon">✨</span>
          This Week's Celebrations
          <span className="celebration-title-icon">✨</span>
        </h1>
        <div className="celebration-counter">
          {currentIndex + 1} of {celebrations.length}
        </div>
      </div>

      {/* Week Navigation */}
      <div className="celebration-week-nav">
        <button
          className="celebration-week-btn"
          onClick={() => setWeekOffset(prev => prev - 1)}
        >
          ← Previous Week
        </button>
        <span className="celebration-week-label">
          {weekOffset === 0 ? 'This Week' : weekOffset === -1 ? 'Previous Week' : weekOffset === 1 ? 'Next Week' : weekOffset > 0 ? `+${weekOffset} Weeks` : `${weekOffset} Weeks`}
        </span>
        <button
          className="celebration-week-btn"
          onClick={() => setWeekOffset(prev => prev + 1)}
        >
          Next Week →
        </button>
        {weekOffset !== 0 && (
          <button
            className="celebration-week-btn celebration-week-btn-today"
            onClick={() => setWeekOffset(0)}
          >
            Back to Today
          </button>
        )}
      </div>

      <div className="celebration-slideshow-content">
        {/* Navigation Arrows */}
        {celebrations.length > 1 && (
          <>
            <button 
              className="celebration-nav-arrow celebration-nav-left"
              onClick={handlePrevious}
              aria-label="Previous celebration"
            >
              ‹
            </button>
            <button 
              className="celebration-nav-arrow celebration-nav-right"
              onClick={handleNext}
              aria-label="Next celebration"
            >
              ›
            </button>
          </>
        )}

        <div className="celebration-slideshow-card">
          {/* Left Side - Image */}
          <div className="celebration-image-section">
            <div 
              className="celebration-image-wrapper"
              onClick={() => fileInputRefs.current[currentCelebration.id]?.click()}
            >
              {uploadedImages[currentCelebration.id] ? (
                <img 
                  src={uploadedImages[currentCelebration.id]} 
                  alt={currentCelebration.name}
                  className="celebration-image"
                />
              ) : (
                <img 
                  src={getProfileImageUrl(
                    currentCelebration.member?.profileImage, 
                    currentCelebration.member?.gender, 
                    currentCelebration.name
                  )}
                  alt={currentCelebration.name}
                  className="celebration-image"
                />
              )}
            </div>
            <input
              type="file"
              ref={(el) => fileInputRefs.current[currentCelebration.id] = el}
              onChange={(e) => handleImageUpload(currentCelebration.id, e)}
              accept="image/*"
              style={{ display: 'none' }}
            />
            
            <div className="celebration-controls">
              <button 
                className="celebration-upload-btn"
                onClick={() => fileInputRefs.current[currentCelebration.id]?.click()}
              >
                📷 {uploadedImages[currentCelebration.id] ? 'Change Photo' : 'Add Photo'}
              </button>
              
              <div className="celebration-type-badge">
                {currentCelebration.type === 'birthday' ? (
                  <span className="celebration-badge celebration-badge-birthday">
                    🎂 Birthday
                  </span>
                ) : (
                  <span className="celebration-badge celebration-badge-anniversary">
                    💕 Anniversary
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Message */}
          <div className="celebration-message-section">
            <div className="celebration-message-header">
              <h2 className="celebration-message-title">{message.title}</h2>
              {currentCelebration.type === 'anniversary' ? (
                <div className="celebration-name-editor">
                  {editingNameId === currentCelebration.id ? (
                    <div className="celebration-name-editing">
                      <input
                        type="text"
                        value={editingNameValue}
                        onChange={(e) => setEditingNameValue(e.target.value)}
                        className="celebration-name-input"
                        placeholder="Enter spouse name"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEditName(currentCelebration);
                          if (e.key === 'Escape') handleCancelEditName();
                        }}
                        autoFocus
                      />
                      <div className="celebration-name-edit-actions">
                        <button
                          className="celebration-name-save-btn"
                          onClick={() => handleSaveEditName(currentCelebration)}
                        >
                          Save
                        </button>
                        <button
                          className="celebration-name-cancel-btn"
                          onClick={handleCancelEditName}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="celebration-name-container">
                        <div className="celebration-name">{message.name}</div>
                        <button
                          className="celebration-name-edit-btn"
                          onClick={() => handleStartEditName(currentCelebration)}
                          title="Edit name"
                          aria-label="Edit name"
                        >
                          ✏️
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="celebration-name">{message.name}</div>
              )}
            </div>
            
            <div className="celebration-message-body">
              <div className="celebration-date-row">
                <div className="celebration-date-display">
                  <div className="celebration-date-day">
                    {new Date(currentCelebration.date).getDate()}
                  </div>
                  <div className="celebration-date-month">
                    {new Date(currentCelebration.date).toLocaleDateString('en-US', { month: 'long' })}
                  </div>
                </div>
              </div>

              <p className="celebration-message-text">{message.message}</p>
              <p className="celebration-church-name">Christ AG Church Kazhakkoottam 💙</p>
            </div>
          </div>
        </div>

        {/* Dots Navigation */}
        {celebrations.length > 1 && (
          <div className="celebration-dots">
            {celebrations.map((_, index) => (
              <button
                key={index}
                className={`celebration-dot ${index === currentIndex ? 'celebration-dot-active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to celebration ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CelebrationSlideshow;
