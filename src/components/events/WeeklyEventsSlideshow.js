import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEvents } from '../../services/eventService.firebase';
import { formatTo12Hour } from '../../utils/timeFormatter';
import './ShareableWeeklyEvents.css';

const WeeklyEventsSlideshow = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [groupedEvents, setGroupedEvents] = useState({});
  const [everyDayEvents, setEveryDayEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => { loadEvents(); }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getAllEvents();
      setEvents(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const groupEventsByDay = (items) => {
    const grouped = {};
    (items || []).forEach(event => {
      if (event.isEveryDayInaWeek) return;
      const eventDate = new Date(event.date);
      const dayKey = eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
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
    Object.keys(grouped).forEach(day => {
      grouped[day].events.sort((a,b) => (a.time||'00:00').localeCompare(b.time||'00:00'));
    });
    return grouped;
  };

  useEffect(() => {
    const every = (events || []).filter(e => e.isEveryDayInaWeek);
    setEveryDayEvents(every);
    const grouped = groupEventsByDay(events || []);
    setGroupedEvents(grouped);
    setCurrentSlide(0);
  }, [events]);

  const sortedDays = Object.keys(groupedEvents).sort((a,b) => groupedEvents[a].date - groupedEvents[b].date);
  const totalSlides = 2 + Math.max(sortedDays.length, 0);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') navigate(-1);
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentSlide, sortedDays]);

  const prevSlide = () => setCurrentSlide(s => (s - 1 + totalSlides) % totalSlides);
  const nextSlide = () => setCurrentSlide(s => (s + 1) % totalSlides);

  if (loading) return <div className="slideshow-loading">Loading slideshow...</div>;

  return (
    <div className="slideshow-overlay" onClick={() => navigate(-1)}>
      <div className="slideshow-container" onClick={(e) => e.stopPropagation()}>
        <button className="slideshow-close" onClick={() => navigate(-1)}>✕</button>
        <button className="slideshow-prev" onClick={prevSlide}>‹</button>
        <button className="slideshow-next" onClick={nextSlide}>›</button>

        <div className="slideshow-slide fullscreen-slideshow">
          {totalSlides <= 2 ? (
            <div className="no-events-message">
              <h3>No Events This Week</h3>
              <p>There are no scheduled events for the current week.</p>
            </div>
          ) : (
            (() => {
              if (currentSlide === 0) {
                return (
                  <div className="slide-content overview-slide">
                    <div className="slide-header"><h1>This Week's Events</h1></div>
                    <div className="slide-body-overview"><p>Total days with events: {sortedDays.length}</p></div>
                    <div className="slide-footer"><div className="slide-pos">{currentSlide + 1} / {totalSlides}</div></div>
                  </div>
                );
              }

              if (currentSlide === 1) {
                return (
                  <div className="slide-content everyday-slide">
                    <div className="slide-header"><h1>Every Day This Week</h1></div>
                    <div className="slide-events">
                      {everyDayEvents.length === 0 ? (<p>No everyday events this week.</p>) : (
                        everyDayEvents.map((event, idx) => (
                          <div key={idx} className="slide-event-card">
                            <div className="slide-event-time">{event.time ? formatTo12Hour(event.time) : 'All Day'}</div>
                            <div className="slide-event-title">{event.title}</div>
                            {event.location && <div className="slide-event-location">{event.location}</div>}
                          </div>
                        ))
                      )}
                    </div>
                    <div className="slide-footer"><div className="slide-pos">{currentSlide + 1} / {totalSlides}</div></div>
                  </div>
                );
              }

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
                  <div className="slide-footer"><div className="slide-pos">{currentSlide + 1} / {totalSlides}</div></div>
                </div>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyEventsSlideshow;
