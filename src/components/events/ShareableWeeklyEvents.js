/**
 * Shareable Weekly Events Component
 * Generates a downloadable/shareable image of the week's events
 */

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import cagLogo from '../../assets/cag-logo.png';
import './ShareableWeeklyEvents.css';

const ShareableWeeklyEvents = ({ events, weekRange, onClose }) => {
  const shareableRef = useRef(null);

  const formatTo12Hour = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const groupEventsByDay = () => {
    const grouped = {};
    
    events.forEach(event => {
      const eventDate = new Date(event.date);
      const dayKey = eventDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
      
      if (!grouped[dayKey]) {
        grouped[dayKey] = {
          date: eventDate,
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

  const groupedEvents = groupEventsByDay();
  const sortedDays = Object.keys(groupedEvents).sort((a, b) => {
    return groupedEvents[a].date - groupedEvents[b].date;
  });

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
              <div className="shareable-header-top">
                <img src={cagLogo} alt="CAG Logo" className="cag-logo-shareable" />
                <h1 className="church-title">CAG Kazhakuttom</h1>
              </div>
              
              <div className="shareable-title-section">
                <div className="title-decoration"></div>
                <h2 className="events-heading">📅 This Week's Events</h2>
                <p className="week-date-range">{weekRange}</p>
              </div>

              <div className="shareable-events-list">
                {sortedDays.length === 0 ? (
                  <div className="no-events-message-shareable">
                    <p>No events scheduled for this week.</p>
                  </div>
                ) : (
                  sortedDays.map((dayKey) => {
                    const dayData = groupedEvents[dayKey];
                    
                    return (
                      <div key={dayKey} className="shareable-day-section">
                        <div className="day-header-bar">
                          <h3>{dayKey}</h3>
                        </div>
                        
                        <div className="shareable-events">
                          {dayData.events.map((event, index) => (
                            <div key={index} className="shareable-event-item">
                              {/* Desktop layout */}
                              <div className="event-time-badge">
                                {event.time ? formatTo12Hour(event.time) : 'All Day'}
                              </div>
                              <div className="event-info">
                                <h4>{event.title}</h4>
                                {event.location && (
                                  <p className="event-location">📍 {event.location}</p>
                                )}
                              </div>
                              
                              {/* Mobile layout */}
                              <span className="event-time-text">
                                {event.time ? formatTo12Hour(event.time) : 'All Day'}
                              </span>
                              <span className="pipe-separator">|</span>
                              <span className="event-title-text">{event.title}</span>
                              {event.location && (
                                <>
                                  <span className="pipe-separator">|</span>
                                  <span className="event-location-text">📍 {event.location}</span>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="contact-card-shareable">
                <p>For more details contact/whatsapp Pr Jobin Elisha : +91 85905 25909</p>
              </div>
            </div>
          </div>
        </div>

        <div className="shareable-actions">
          <button className="btn-download" onClick={downloadAsImage}>
            💾 Download as Image
          </button>
          <button className="btn-share" onClick={shareAsWhatsApp}>
            📱 Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareableWeeklyEvents;
