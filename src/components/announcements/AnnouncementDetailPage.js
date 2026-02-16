/**
 * Announcement Detail Page Component
 * Displays full announcement details with news-style layout
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getAllAnnouncements } from '../../services/announcementService.firebase';
import './AnnouncementDetailPage.css';

const AnnouncementDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncement();
  }, [id]);

  const loadAnnouncement = async () => {
    try {
      setLoading(true);
      const announcements = await getAllAnnouncements();
      const found = announcements.find(a => a.id === id);
      
      if (found) {
        setAnnouncement(found);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error loading announcement:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="announcement-detail-loading">
        <div className="spinner"></div>
        <p>Loading announcement...</p>
      </div>
    );
  }

  if (!announcement) {
    return null;
  }

  const isExpired = new Date(announcement.expiryDate) < new Date();

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = announcement.title;
    const text = announcement.description;

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

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": announcement.title,
    "description": announcement.description,
    "image": announcement.imageBase64 || '',
    "datePublished": announcement.createdAt,
    "dateModified": announcement.createdAt,
    "author": {
      "@type": "Organization",
      "name": "Christ AG Church Kazhakkoottam"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Christ AG Church Kazhakkoottam",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/static/media/cag-logo.png`
      }
    }
  };

  return (
    <div className="announcement-detail-page">
      <Helmet>
        <title>{announcement.title} | Christ AG Church Kazhakkoottam</title>
        <meta name="description" content={announcement.description} />
        <meta name="keywords" content="church announcement, Christ AG Church, Kazhakkoottam, church news, christian community" />
        
        {/* Open Graph tags for social sharing */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={announcement.title} />
        <meta property="og:description" content={announcement.description} />
        <meta property="og:image" content={`${window.location.origin}/church-photo.jpg`} />
        <meta property="og:image:secure_url" content={`${window.location.origin}/church-photo.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Christ AG Church Kazhakkoottam" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Christ AG Church Kazhakkoottam" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={announcement.title} />
        <meta name="twitter:description" content={announcement.description} />
        <meta name="twitter:image" content={`${window.location.origin}/church-photo.jpg`} />
        <meta name="twitter:image:alt" content="Christ AG Church Kazhakkoottam" />
        
        {/* Structured data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <div className="announcement-detail-container">
        {/* Header */}
        <div className="announcement-detail-header">
          <button 
            className="announcement-back-btn"
            onClick={() => navigate('/')}
            aria-label="Go back"
          >
            ← Back to Home
          </button>
        </div>

        {/* Content */}
        <div className="announcement-detail-content">
          <div className="announcement-detail-wrapper">
            {isExpired && (
              <div className="announcement-expired-banner">
                ⚠️ This announcement has expired
              </div>
            )}

            <div className="announcement-detail-meta">
              <span className="announcement-detail-date">
                📅 {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="announcement-detail-expiry">
                ⏰ Valid until {new Date(announcement.expiryDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>

            <h1 className="announcement-detail-title">{announcement.title}</h1>

            <div className="announcement-detail-divider"></div>

            {announcement.imageBase64 && (
              <div className="announcement-detail-image">
                <img src={announcement.imageBase64} alt={announcement.title} />
              </div>
            )}

            <div className="announcement-detail-body">
              <p>{announcement.description}</p>
            </div>

            {/* Share Buttons */}
            <div className="announcement-detail-share">
              <h3 className="share-title">Share this announcement</h3>
              <div className="share-buttons">
                <button 
                  className="share-btn share-facebook"
                  onClick={() => handleShare('facebook')}
                  title="Share on Facebook"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
                
                <button 
                  className="share-btn share-twitter"
                  onClick={() => handleShare('twitter')}
                  title="Share on Twitter"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </button>
                
                <button 
                  className="share-btn share-whatsapp"
                  onClick={() => handleShare('whatsapp')}
                  title="Share on WhatsApp"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </button>
                
                <button 
                  className="share-btn share-email"
                  onClick={() => handleShare('email')}
                  title="Share via Email"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Email
                </button>
                
                <button 
                  className="share-btn share-copy"
                  onClick={() => handleShare('copy')}
                  title="Copy Link"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  Copy Link
                </button>
              </div>
            </div>

            <div className="announcement-detail-footer">
              <div className="announcement-church-info">
                <h3>Christ AG Church Kazhakkoottam</h3>
                <p>2nd Floor, Mak Tower, National Highway, Kazhakkoottam</p>
                <p>Thiruvananthapuram, Kerala 695582</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetailPage;
