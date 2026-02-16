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

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = 'Latest News & Announcements | Christ AG Church Kazhakkoottam | ഏറ്റവും പുതിയ വാർത്തകളും അറിയിപ്പുകളും';
    const text = 'Stay updated with the latest news and important announcements from Christ AG Church Kazhakkoottam.';

    // Try native Web Share API first (works on mobile)
    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        console.log('Share cancelled');
      }
    }

    // Platform-specific sharing
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          alert('Link copied to clipboard!');
          return;
        } catch (err) {
          console.error('Failed to copy:', err);
          alert('Failed to copy link');
          return;
        }
      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
    }
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
        <meta property="og:description" content="Stay updated with the latest news and important announcements from Christ AG Church Kazhakkoottam. | ക്രൈസ്റ്റ് എജി ചർച്ച് കഴക്കൂട്ടത്തിൽ നിന്നുള്ള ഏറ്റവും പുതിയ വാർത്തകളും പ്രധാന അറിയിപ്പുകളും അറിയുക." />
        <meta property="og:image" content={`${window.location.origin}/logo512.png`} />
        <meta property="og:image:secure_url" content={`${window.location.origin}/logo512.png`} />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:image:alt" content="Christ AG Church Kazhakkoottam Logo" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Christ AG Church Kazhakkoottam" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Latest News & Announcements | Christ AG Church Kazhakkoottam | ഏറ്റവും പുതിയ വാർത്തകളും അറിയിപ്പുകളും" />
        <meta name="twitter:description" content="Stay updated with the latest news and important announcements from our church. | ക്രൈസ്റ്റ് എജി ചർച്ച് കഴക്കൂട്ടത്തിൽ നിന്നുള്ള പുതിയ വാർത്തകളും പ്രധാന അറിയിപ്പുകളും അറിയുക." />
        <meta name="twitter:image" content={`${window.location.origin}/logo512.png`} />
        <meta name="twitter:image:alt" content="Christ AG Church Kazhakkoottam Logo" />
      </Helmet>
      
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Home
      </button>

      <div className="announcements-paper">
        {/* Header Section */}
        <div className="announcements-paper-header">
          <h1 className="announcements-paper-title">Latest News & Announcements</h1>
          <p className="announcements-paper-subtitle">Stay updated with the latest news and important announcements from our church</p>
          
          {/* Share Buttons */}
          <div className="share-section">
            <p className="share-label">Share this page:</p>
            <div className="share-buttons">
              <button onClick={() => handleShare('facebook')} className="share-btn facebook" title="Share on Facebook">
                <span>📘</span> Facebook
              </button>
              <button onClick={() => handleShare('twitter')} className="share-btn twitter" title="Share on Twitter">
                <span>🐦</span> Twitter
              </button>
              <button onClick={() => handleShare('whatsapp')} className="share-btn whatsapp" title="Share on WhatsApp">
                <span>💬</span> WhatsApp
              </button>
              <button onClick={() => handleShare('email')} className="share-btn email" title="Share via Email">
                <span>📧</span> Email
              </button>
              <button onClick={() => handleShare('copy')} className="share-btn copy" title="Copy Link">
                <span>🔗</span> Copy Link
              </button>
            </div>
          </div>
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
