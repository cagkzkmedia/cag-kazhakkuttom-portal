import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './MinistryPages.css';

const WorshipMinistry = () => {
  const navigate = useNavigate();

  return (
    <div className="ministry-page">
      <Helmet>
        <title>Worship Ministry | Christ AG Church Kazhakkoottam | ആരാധനാ ശുശ്രൂഷ</title>
        <meta name="description" content="Experience powerful praise and worship at Christ AG Church Kazhakkoottam. Join our worship ministry and celebrate God's presence through music and song. | ആരാധനയിലൂടെ ദൈവസാന്നിധ്യം അനുഭവിക്കുക." />
        <meta name="keywords" content="worship ministry, praise and worship, worship team, Christ AG Church, Kazhakkoottam, church music, ആരാധനാ ശുശ്രൂഷ, സ്തോത്രം" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Worship Ministry | Christ AG Church Kazhakkoottam | ആരാധനാ ശുശ്രൂഷ" />
        <meta property="og:description" content="Experience powerful praise and worship. Join our worship ministry and celebrate God's presence. | ആരാധനയിലൂടെ ദൈവസാന്നിധ്യം അനുഭവിക്കുക." />
        <meta property="og:image" content={`${window.location.origin}/logo512.png`} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Christ AG Church Kazhakkoottam" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Worship Ministry | Christ AG Church Kazhakkoottam | ആരാധനാ ശുശ്രൂഷ" />
        <meta name="twitter:description" content="Experience powerful praise and worship at Christ AG Church Kazhakkoottam." />
        <meta name="twitter:image" content={`${window.location.origin}/logo512.png`} />
      </Helmet>
      <button className="back-to-home-btn" onClick={() => navigate('/')}>
        ← Back to Home
      </button>
      <div className="ministry-hero" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="ministry-hero-content">
          <div className="ministry-hero-icon">🎵</div>
          <h1>Worship Ministry | Christ AG Kazhakkoottam</h1>
          <p className="ministry-hero-subtitle">Leading Hearts in Worship</p>
        </div>
      </div>

      <div className="ministry-content">
        <section className="ministry-section cta-section">
          <h2>Coming Soon</h2>
          <p>
            We're currently working on building this page with detailed information about our Worship Ministry 
            teams and programs. Please check back soon for updates!
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
              Join Worship Team
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

export default WorshipMinistry;
