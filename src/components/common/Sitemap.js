import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './Sitemap.css';

const Sitemap = () => {
  const navigate = useNavigate();

  const sitemapSections = [
    {
      title: 'Main Pages',
      icon: '🏠',
      links: [
        { path: '/', label: 'Home' },
        { path: '/celebrations', label: 'Celebrations' },
        { path: '/articles', label: 'Resources & Articles' },
        { path: '/announcements', label: 'Latest News & Announcements' },
        { path: '/donate', label: 'Donate' },
      ]
    },
    {
      title: 'Ministries',
      icon: '⛪',
      links: [
        { path: '/ministry/childrens', label: "Children's Ministry - Sunday School" },
        { path: '/ministry/youth', label: 'Youth Ministry - Christ Ambassadors' },
        { path: '/ministry/worship', label: 'Worship Ministry' },
        { path: '/ministry/family', label: 'Family Ministry - Bible Study & Counseling' },
        { path: '/ministry/outreach', label: 'Outreach Ministry - Gospel for Kazhakkuttom (GFK)' },
        { path: '/ministry/prayer', label: 'Prayer Ministry - Zoom Prayer Meetings' },
        { path: '/ministry/ladies', label: "Ladies Ministry - Women's Missionary Council (WMC)" },
        { path: '/ministry/mission', label: 'Mission Department - Telangana Missions' },
      ]
    },
    {
      title: 'Member Portal',
      icon: '👤',
      links: [
        { path: '/member-portal/login', label: 'Member Login' },
        { path: '/member-portal/signup', label: 'Member Signup' },
        { path: '/member-portal/dashboard', label: 'Member Dashboard' },
        { path: '/member-portal/donate', label: 'Member Donation' },
        { path: '/member-portal/donation-history', label: 'Donation History' },
        { path: '/member-portal/events', label: 'Member Events' },
        { path: '/member-portal/change-password', label: 'Change Password' },
      ]
    },
    {
      title: 'Admin Portal',
      icon: '🔐',
      links: [
        { path: '/login', label: 'Admin Login' },
        { path: '/register', label: 'Admin Register' },
        { path: '/admin/dashboard', label: 'Admin Dashboard' },
        { path: '/admin/members', label: 'Member Management' },
        { path: '/admin/events', label: 'Event Management' },
        { path: '/admin/donations', label: 'Donation Management' },
        { path: '/admin/users', label: 'User Management' },
        { path: '/admin/resources', label: 'Resource Manager' },
        { path: '/admin/testimonials', label: 'Testimonials Management' },
        { path: '/admin/announcements', label: 'Announcement Management' },
        { path: '/admin/member-approvals', label: 'Member Approvals' },
      ]
    },
    {
      title: 'Tools & Utilities',
      icon: '🛠️',
      links: [
        { path: '/youtube-thumbnail-creator', label: 'YouTube Thumbnail Creator' },
        { path: '/celebrations/slideshow', label: 'Celebration Slideshow' },
      ]
    }
  ];

  return (
    <div className="sitemap-page">
      <Helmet>
        <title>Sitemap | Christ AG Church Kazhakkoottam | സൈറ്റ്മാപ്പ്</title>
        <meta name="description" content="Complete sitemap of Christ AG Church Kazhakkoottam website. Find all pages, ministries, and resources easily. | ക്രൈസ്റ്റ് എജി ചർച്ച് കഴക്കൂട്ടം വെബ്സൈറ്റിന്റെ സമ്പൂർണ്ണ സൈറ്റ്മാപ്പ്." />
        <meta name="keywords" content="sitemap, website map, navigation, Christ AG Church, Kazhakkoottam, church pages, സൈറ്റ്മാപ്പ്" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Sitemap | Christ AG Church Kazhakkoottam | സൈറ്റ്മാപ്പ്" />
        <meta property="og:description" content="Complete sitemap of Christ AG Church Kazhakkoottam website. Find all pages and resources easily." />
        <meta property="og:image" content={`${window.location.origin}/logo512.png`} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Christ AG Church Kazhakkoottam" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sitemap | Christ AG Church Kazhakkoottam" />
        <meta name="twitter:description" content="Complete sitemap of Christ AG Church Kazhakkoottam website." />
        <meta name="twitter:image" content={`${window.location.origin}/logo512.png`} />
      </Helmet>

      <button className="back-to-home-btn" onClick={() => navigate('/')}>
        ← Back to Home
      </button>

      <div className="sitemap-hero">
        <div className="sitemap-hero-content">
          <div className="sitemap-hero-icon">🗺️</div>
          <h1>Sitemap | Christ AG Kazhakkoottam</h1>
          <p className="sitemap-hero-subtitle">Navigate Our Website Easily</p>
        </div>
      </div>

      <div className="sitemap-content">
        <div className="sitemap-intro">
          <p>
            Welcome to the Christ AG Church Kazhakkoottam sitemap. Find all pages, ministries, 
            and resources organized for easy navigation.
          </p>
        </div>

        <div className="sitemap-sections">
          {sitemapSections.map((section, index) => (
            <div key={index} className="sitemap-section">
              <h2 className="sitemap-section-title">
                <span className="sitemap-section-icon">{section.icon}</span>
                {section.title}
              </h2>
              <ul className="sitemap-links">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button 
                      className="sitemap-link"
                      onClick={() => navigate(link.path)}
                    >
                      <span className="sitemap-link-icon">→</span>
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="sitemap-cta">
          <h2>Need Help?</h2>
          <p>
            Can't find what you're looking for? Feel free to contact us for assistance.
          </p>
          <button className="btn-primary" onClick={() => {
            navigate('/');
            setTimeout(() => {
              const contactSection = document.querySelector('.contact-section');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }, 100);
          }}>
            Contact Us
          </button>
        </div>
      </div>

      <div className="sitemap-footer">
        <div className="sitemap-footer-content">
          <h3>Christ AG Church Kazhakkoottam</h3>
          <p>2nd Floor, Mak Tower, National Highway, Kazhakkoottam</p>
          <p>Thiruvananthapuram, Kerala 695582</p>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
