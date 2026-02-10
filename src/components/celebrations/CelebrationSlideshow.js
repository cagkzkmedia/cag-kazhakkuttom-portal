/**
 * Celebration Slideshow Component
 * Displays weekly birthdays and anniversaries in a slideshow format
 */

import React, { useState, useEffect, useRef } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import './CelebrationSlideshow.css';

const CelebrationSlideshow = () => {
  const [celebrations, setCelebrations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploadedImages, setUploadedImages] = useState({});
  const [loading, setLoading] = useState(true);
  const fileInputRefs = useRef({});

  useEffect(() => {
    fetchWeeklyCelebrations();
  }, []);

  const fetchWeeklyCelebrations = async () => {
    try {
      setLoading(true);
      const membersRef = collection(db, 'members');
      const q = query(membersRef);
      const querySnapshot = await getDocs(q);
      
      const now = new Date();
      const currentWeekStart = getStartOfWeek(now);
      const currentWeekEnd = getEndOfWeek(now);
      
      const celebrationsList = [];
      
      querySnapshot.forEach((doc) => {
        const member = { id: doc.id, ...doc.data() };
        
        // Check for birthday
        if (member.dateOfBirth) {
          const dob = new Date(member.dateOfBirth);
          if (isDateInCurrentWeek(dob, currentWeekStart, currentWeekEnd)) {
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
          if (isDateInCurrentWeek(marriageDate, currentWeekStart, currentWeekEnd)) {
            const years = now.getFullYear() - marriageDate.getFullYear();
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
        dateA.setFullYear(now.getFullYear());
        dateB.setFullYear(now.getFullYear());
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

  const isDateInCurrentWeek = (date, weekStart, weekEnd) => {
    const checkDate = new Date(date);
    const currentYear = new Date().getFullYear();
    checkDate.setFullYear(currentYear);
    
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
    if (name === name.toUpperCase()) {
      return name.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    }
    return name;
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
    return (
      <div className="celebration-slideshow-container">
        <div className="celebration-slideshow-empty">
          <div className="celebration-empty-icon">🎉</div>
          <h2>No Celebrations This Week</h2>
          <p>Check back next week for upcoming birthdays and anniversaries!</p>
        </div>
      </div>
    );
  }

  const currentCelebration = celebrations[currentIndex];
  const message = currentCelebration.type === 'birthday' 
    ? getBirthdayMessage(currentCelebration.name)
    : getAnniversaryMessage(currentCelebration.name, currentCelebration.years);

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
                <div className="celebration-image-placeholder">
                  <div className="celebration-placeholder-icon">
                    {currentCelebration.type === 'birthday' ? '🎂' : '💑'}
                  </div>
                  <p className="celebration-placeholder-text">Click to upload image</p>
                </div>
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
              <div className="celebration-name">{message.name}</div>
            </div>
            
            <div className="celebration-message-body">
              <p className="celebration-message-text">{message.message}</p>
              <p className="celebration-church-name">Christ AG Church Kazhakkuttom 💙</p>
            </div>

            <div className="celebration-date-info">
              <div className="celebration-date-icon">📅</div>
              <div className="celebration-date-text">
                {new Date(currentCelebration.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
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
