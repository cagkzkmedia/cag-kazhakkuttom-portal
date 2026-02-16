import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getAllAnnouncements } from '../../services/announcementService.firebase';
import './AllAnnouncementsPage.css';

const AllAnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, expired
  const navigate = useNavigate();

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const allAnnouncements = await getAllAnnouncements();
      setAnnouncements(allAnnouncements);
    } catch (err) {
      console.error('Failed to load announcements', err);
    } finally {
      setLoading(false);
    }
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    if (filter === 'all') return true;
    if (filter === 'active') return !isExpired(announcement.expiryDate);
    if (filter === 'expired') return isExpired(announcement.expiryDate);
    return true;
  });

  const handleAnnouncementClick = (announcementId) => {
    navigate(`/announcement/${announcementId}`, { state: { fromAllAnnouncements: true } });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="all-announcements-page">
      <Helmet>
        <title>Latest News & Announcements | Christ AG Church Kazhakkoottam</title>
        <meta name="description" content="Stay updated with the latest news and important announcements from Christ AG Church Kazhakkoottam. Find information about upcoming events, church activities, and community updates." />
        <meta name="keywords" content="church announcements, church news, Christ AG Church, Kazhakkoottam, church events, community updates, church activities" />
        
        {/* Open Graph tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Latest News & Announcements | Christ AG Church Kazhakkoottam | ഏറ്റവും പുതിയ വാർത്തകളും അറിയിപ്പുകളും" />
        <meta property="og:description" content="Stay updated with the latest news and important announcements from Christ AG Church Kazhakkoottam." />
        <meta property="og:image" content={`${window.location.origin}/logo512.png`} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Christ AG Church Kazhakkoottam" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Latest News & Announcements | Christ AG Church Kazhakkoottam | ഏറ്റവും പുതിയ വാർത്തകളും അറിയിപ്പുകളും" />
        <meta name="twitter:description" content="Stay updated with the latest news and important announcements from our church." />
        <meta name="twitter:image" content={`${window.location.origin}/logo512.png`} />
      </Helmet>
      
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Home
      </button>

      <div className="announcements-paper">
        {/* Header Section */}
        <div className="announcements-paper-header">
          <h1 className="announcements-paper-title">Latest News & Announcements</h1>
          <p className="announcements-paper-subtitle">Stay updated with the latest news and important announcements from our church</p>
        </div>

        {/* Filter Section */}
        <div className="announcements-filter-section">
          <div className="announcements-filter-container">
            <h3>Filter by Status:</h3>
            <div className="announcements-filter-buttons">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All Announcements
              </button>
              <button
                className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button
                className={`filter-btn ${filter === 'expired' ? 'active' : ''}`}
                onClick={() => setFilter('expired')}
              >
                Expired
              </button>
            </div>
          </div>
        </div>

        {/* Announcements Grid */}
        <div className="announcements-content-section">
          {loading ? (
            <div className="announcements-loading">
              <div className="spinner"></div>
              <p>Loading announcements...</p>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="announcements-empty">
              <h3>No announcements found</h3>
              <p>Check back later for new updates!</p>
            </div>
          ) : (
            <div className="announcements-grid">
              {filteredAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`announcement-card ${isExpired(announcement.expiryDate) ? 'expired' : ''}`}
                  onClick={() => handleAnnouncementClick(announcement.id)}
                >
                  {announcement.imageBase64 && (
                    <div className="announcement-card-image">
                      <img src={announcement.imageBase64} alt={announcement.title} />
                      {isExpired(announcement.expiryDate) && (
                        <span className="announcement-status-badge expired">
                          Expired
                        </span>
                      )}
                      {!isExpired(announcement.expiryDate) && (
                        <span className="announcement-status-badge active">
                          Active
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="announcement-card-content">
                    <h3 className="announcement-card-title">{announcement.title}</h3>
                    
                    <p className="announcement-card-description">
                      {announcement.description}
                    </p>
                    
                    <div className="announcement-card-meta">
                      <span className="announcement-date">
                        📅 Posted: {formatDate(announcement.createdAt)}
                      </span>
                    </div>
                    
                    <button className="announcement-read-more">
                      Read More →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="announcements-paper-footer">
          <div className="footer-divider"></div>
          <div className="church-info">
            <h3>Christ AG Church Kazhakkoottam</h3>
            <p>2nd Floor, Mak Tower, National Highway, Kazhakkoottam</p>
            <p>Thiruvananthapuram, Kerala 695582</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllAnnouncementsPage;
