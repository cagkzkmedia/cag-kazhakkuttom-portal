/**
 * Shareable Weekly Events Component
 * Generates a downloadable/shareable image of the week's events
 */

import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import cagLogo from '../../assets/cag-logo.png';
import './ShareableWeeklyEvents.css';

const ShareableWeeklyEvents = ({ events, weekRange, onClose }) => {
  const shareableRef = useRef(null);

  // Debug: Log the weekRange value
  console.log('ShareableWeeklyEvents - weekRange:', weekRange);

  const formatTo12Hour = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getDayColor = (index) => {
    const colors = [
      'linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)', // Cyan - Monday
      'linear-gradient(135deg, #673ab7 0%, #512da8 100%)', // Deep Purple - Tuesday
      'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)', // Dark Blue - Wednesday
      'linear-gradient(135deg, #047857 0%, #065f46 100%)', // Dark Green - Thursday
      'linear-gradient(135deg, #ff5722 0%, #e64a19 100%)', // Deep Orange - Friday
      'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)', // Pink - Saturday
      'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)', // Purple - Sunday
    ];
    return colors[index % colors.length];
  };

  const groupEventsByDay = () => {
    const grouped = {};
    
    events.forEach(event => {
      if (event.isEveryDayInaWeek) return; // handled separately
      const eventDate = new Date(event.date);
      const dayKey = eventDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
      
      if (!grouped[dayKey]) {
        grouped[dayKey] = {
          date: eventDate,
          dayNum: eventDate.getDate(),
          dayName: eventDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
          events: []
        };
      }
      
      grouped[dayKey].events.push(event);
    });

    // Sort events within each day by time
    Object.keys(grouped).forEach(day => {
      grouped[day].events.sort((a, b) => {
        const timeA = a.time || '00:00';
        const timeB = b.time || '00:00';
        return timeA.localeCompare(timeB);
      });
    });

    return grouped;
  };

  const downloadAsImage = async () => {
    if (!shareableRef.current) return;

    try {
      const canvas = await html2canvas(shareableRef.current, {
        backgroundColor: '#667eea',
        scale: 2,
        logging: false,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `weekly-events-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    }
  };

  const shareAsWhatsApp = async () => {
    if (!shareableRef.current) return;

    try {
      const canvas = await html2canvas(shareableRef.current, {
        backgroundColor: '#667eea',
        scale: 2,
        logging: false,
        useCORS: true
      });

      canvas.toBlob(async (blob) => {
        if (navigator.share && navigator.canShare({ files: [new File([blob], 'weekly-events.png', { type: 'image/png' })] })) {
          const file = new File([blob], 'weekly-events.png', { type: 'image/png' });
          await navigator.share({
            files: [file],
            title: 'This Week\'s Events - CAG Kazhakuttom',
            text: 'Check out this week\'s events!'
          });
        } else {
          // Fallback: download the image
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'weekly-events.png';
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Failed to share. Image has been downloaded instead.');
    }
  };

  const everyDayEvents = events.filter(e => e.isEveryDayInaWeek);
  const groupedEvents = groupEventsByDay();
  const sortedDays = Object.keys(groupedEvents).sort((a, b) => {
    return groupedEvents[a].date - groupedEvents[b].date;
  });

  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!slideshowOpen) return;
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') setSlideshowOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [slideshowOpen, currentSlide]);

  const totalSlides = 2 + Math.max(sortedDays.length, 0); // 0: overview, 1: everyday, 2..: days

  const prevSlide = () => {
    setCurrentSlide((s) => (s - 1 + totalSlides) % totalSlides);
  };

  const nextSlide = () => {
    setCurrentSlide((s) => (s + 1) % totalSlides);
  };

  return (
    <div className="shareable-modal-overlay" onClick={onClose}>
      <div className="shareable-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shareable-header">
          <h2>📱 Share Weekly Events</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="shareable-preview-container">
          <div className="shareable-preview" ref={shareableRef}>
            <div className="shareable-content">
              <div className="shareable-header-section">
                <div className="shareable-header-top">
                  <img src={cagLogo} alt="CAG Logo" className="cag-logo-shareable" />
                </div>
                
                <div className="shareable-title-section">
                  <h1 className="cag-main-title">Christ AG Weekly Gathering</h1>
                  <p className="week-date-range">{weekRange || 'DATE RANGE NOT AVAILABLE'}</p>
                </div>
              </div>

              {everyDayEvents.length > 0 && (
                <div className="everyday-events-section">
                  <div className="everyday-events-header">📅 Every Day This Week</div>
                  {everyDayEvents.map((event, index) => (
                    <div key={index} className="everyday-event-item">
                      <span className="everyday-event-title">{event.title}</span>
                      <span className="everyday-event-time">
                        {event.time ? formatTo12Hour(event.time) : ''}
                        {event.location ? ` @ ${event.location}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="shareable-events-list">
                {sortedDays.length === 0 ? (
                  <div className="no-events-message-shareable">
                    <p>No events scheduled for this week.</p>
                  </div>
                ) : (
                  sortedDays.map((dayKey, dayIndex) => {
                    const dayData = groupedEvents[dayKey];
                    
                    // Debug: Log day data
                    console.log('Day data:', { dayKey, dayNum: dayData.dayNum, dayName: dayData.dayName });
                    
                    return (
                      <div key={dayKey} className="shareable-day-section">
                        <div className="day-section-wrapper" style={{ background: getDayColor(dayIndex) }}>
                          <div className="day-date-badge">
                            <div className="day-number">{dayData.dayNum || '??'}</div>
                            <div className="day-name">{dayData.dayName || 'DAY'}</div>
                          </div>
                          
                          <div className="day-events-content">
                            {dayData.events.map((event, index) => {
                              // Define color classes for different event types
                              const eventColorClass = index === 0 ? 'event-primary' : 
                                                     index === 1 ? 'event-secondary' : 
                                                     'event-tertiary';
                              
                              return (
                                <div key={index} className={`event-line ${eventColorClass}`}>
                                  <span className="event-title-main">{event.title}</span>
                                  {event.isEveryDayInaWeek && (
                                    <span className="event-everyday-badge">📅 Every Day This Week</span>
                                  )}
                                  <span className="event-time-main">
                                    {event.time ? formatTo12Hour(event.time) : ''}
                                    {event.location ? ` @ ${event.location}` : ''}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="contact-card-shareable">
                <div className="contact-badge">FOR MORE DETAILS</div>
                <p>PR JOBIN ELISHA : 9847998584</p>
              </div>
            </div>
          </div>
        </div>

        <div className="shareable-actions">
          <button className="btn-slideshow" onClick={() => { setSlideshowOpen(true); setCurrentSlide(0); }}>
            📽️ Slideshow
          </button>
          <button className="btn-download" onClick={downloadAsImage}>
            💾 Download as Image
          </button>
          <button className="btn-share" onClick={shareAsWhatsApp}>
            📱 Share
          </button>
        </div>

        {slideshowOpen && (
          <div className="slideshow-overlay" onClick={() => setSlideshowOpen(false)}>
            <div className="slideshow-container" onClick={(e) => e.stopPropagation()}>
              <button className="slideshow-close" onClick={() => setSlideshowOpen(false)} aria-label="Close slideshow">✕</button>
              <button className="slideshow-prev" onClick={prevSlide} aria-label="Previous slide">‹</button>
              <button className="slideshow-next" onClick={nextSlide} aria-label="Next slide">›</button>

              <div className="slideshow-slide fullscreen-slideshow">
                {totalSlides <= 2 ? (
                  <div className="no-events-message">
                    <div className="no-events-icon"></div>
                    <h3>No Events This Week</h3>
                    <p>There are no scheduled events for the current week.</p>
                  </div>
                ) : (
                  (() => {
                    // Slide 0: Overview / This Week Events
                    if (currentSlide === 0) {
                      return (
                        <div className="slide-content overview-slide">
                          <div className="slide-header">
                            <h1>This Week's Events</h1>
                            <div className="slide-week-range">{weekRange}</div>
                          </div>
                          <div className="slide-body-overview">
                            <p className="overview-text">Total days with events: {sortedDays.length}</p>
                          </div>
                          <div className="slide-footer">
                            <div className="slide-pos">{currentSlide + 1} / {totalSlides}</div>
                          </div>
                        </div>
                      );
                    }

                    // Slide 1: Every Day Events
                    if (currentSlide === 1) {
                      return (
                        <div className="slide-content everyday-slide">
                          <div className="slide-header">
                            <h1>Every Day This Week</h1>
                          </div>
                          <div className="slide-events">
                            {everyDayEvents.length === 0 ? (
                              <p className="no-everyday">No everyday events this week.</p>
                            ) : (
                              everyDayEvents.map((event, idx) => (
                                <div key={idx} className="slide-event-card">
                                  <div className="slide-event-time">{event.time ? formatTo12Hour(event.time) : 'All Day'}</div>
                                  <div className="slide-event-title">{event.title}</div>
                                  {event.location && <div className="slide-event-location">{event.location}</div>}
                                </div>
                              ))
                            )}
                          </div>
                          <div className="slide-footer">
                            <div className="slide-pos">{currentSlide + 1} / {totalSlides}</div>
                          </div>
                        </div>
                      );
                    }

                    // Remaining slides: day slides (index - 2)
                    const dayIndex = currentSlide - 2;
                    const dayKey = sortedDays[dayIndex];
                    const dayData = groupedEvents[dayKey];
                    return (
                      <div className="slide-content day-slide">
                        <div className="slide-header">
                          <div className="slide-day-name">{dayData.dayName}</div>
                          <div className="slide-day-number">{dayData.dayNum}</div>
                          <div className="slide-day-full">{dayKey}</div>
                        </div>

                        <div className="slide-events">
                          {dayData.events.map((event, idx) => (
                            <div key={idx} className="slide-event-card">
                              <div className="slide-event-time">{event.time ? formatTo12Hour(event.time) : 'All Day'}</div>
                              <div className="slide-event-title">{event.title}</div>
                              {event.location && <div className="slide-event-location">{event.location}</div>}
                            </div>
                          ))}
                        </div>

                        <div className="slide-footer">
                          <div className="slide-pos">{currentSlide + 1} / {totalSlides}</div>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareableWeeklyEvents;
