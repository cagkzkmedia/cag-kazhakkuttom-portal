import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './MinistryPages.css';

const PrayerMinistry = () => {
  const navigate = useNavigate();

  return (
    <div className="ministry-page">
      <Helmet>
        <title>Prayer Ministry - Zoom Prayer Meetings | Christ AG Church Kazhakkoottam | പ്രാർത്ഥനാ ശുശ്രൂഷ</title>
        <meta name="description" content="Join our special prayer meetings on Zoom. Connect with believers worldwide for powerful intercession and worship. | സൂം വഴിയുള്ള പ്രത്യേക പ്രാർത്ഥനാ യോഗങ്ങളിൽ ചേരുക." />
        <meta name="keywords" content="prayer ministry, prayer meetings, zoom prayer, intercession, Christ AG Church, Kazhakkoottam, online prayer, പ്രാർത്ഥനാ ശുശ്രൂഷ, പ്രാർത്ഥനാ യോഗം" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Prayer Ministry - Zoom Prayer Meetings | Christ AG Church Kazhakkoottam | പ്രാർത്ഥനാ ശുശ്രൂഷ" />
        <meta property="og:description" content="Join our special prayer meetings on Zoom. Connect with believers worldwide for powerful intercession. | സൂം വഴിയുള്ള പ്രാർത്ഥനാ യോഗങ്ങളിൽ ചേരുക." />
        <meta property="og:image" content={`${window.location.origin}/logo512.png`} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Christ AG Church Kazhakkoottam" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Prayer Ministry - Zoom Prayer Meetings | Christ AG Church Kazhakkoottam" />
        <meta name="twitter:description" content="Join our special prayer meetings on Zoom. Connect with believers worldwide for powerful intercession." />
        <meta name="twitter:image" content={`${window.location.origin}/logo512.png`} />
      </Helmet>
      <button className="back-to-home-btn" onClick={() => navigate('/')}>
        ← Back to Home
      </button>
      <div className="ministry-hero" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="ministry-hero-content">
          <div className="ministry-hero-icon">🙏</div>
          <h1>Prayer Ministry</h1>
          <p className="ministry-hero-subtitle">The Power of United Prayer</p>
        </div>
      </div>

      <div className="ministry-content">
        <section className="ministry-section cta-section">
          <h2>Coming Soon</h2>
          <p>
            We're currently working on building this page with detailed information about our Prayer Ministry 
            and special prayer meetings on Zoom. Please check back soon for updates!
          </p>
          <div className="cta-buttons">
            <button className="btn-primary" onClick={() => {
              navigate('/');
              setTimeout(() => {
                const contactSection = document.querySelector('.contact-section');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}>
              Get Zoom Link
            </button>

          </div>
        </section>
      </div>

      <div className="ministry-footer">
        <div className="ministry-footer-content">
          <h3>Christ AG Church Kazhakkoottam</h3>
          <p>2nd Floor, Mak Tower, National Highway, Kazhakkoottam</p>
          <p>Thiruvananthapuram, Kerala 695582</p>
        </div>
      </div>
    </div>
  );
};

export default PrayerMinistry;
