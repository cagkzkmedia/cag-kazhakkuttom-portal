import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './MinistryPages.css';

const LadiesMinistry = () => {
  const navigate = useNavigate();

  return (
    <div className="ministry-page">
      <Helmet>
        <title>Ladies Ministry - Women's Missionary Council (WMC) | Christ AG Church Kazhakkoottam | സ്ത്രീകളുടെ ശുശ്രൂഷ</title>
        <meta name="description" content="Join our Women's Missionary Council (WMC) at Christ AG Church Kazhakkoottam. Empowering women in faith, fellowship, and service. | സ്ത്രീകളുടെ മിഷനറി കൗൺസിലിൽ (WMC) ചേരുക." />
        <meta name="keywords" content="ladies ministry, women's ministry, WMC, women's missionary council, Christ AG Church, Kazhakkoottam, സ്ത്രീകളുടെ ശുശ്രൂഷ, WMC" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Ladies Ministry - Women's Missionary Council (WMC) | Christ AG Church | സ്ത്രീകളുടെ ശുശ്രൂഷ" />
        <meta property="og:description" content="Empowering women in faith, fellowship, and service through our Women's Missionary Council. | വിശ്വാസത്തിലും സഹവാസത്തിലും സേവനത്തിലും സ്ത്രീകളെ ശാക്തീകരിക്കുന്നു." />
        <meta property="og:image" content={`${window.location.origin}/logo512.png`} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Christ AG Church Kazhakkoottam" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ladies Ministry - WMC | Christ AG Church Kazhakkoottam | സ്ത്രീകളുടെ ശുശ്രൂഷ" />
        <meta name="twitter:description" content="Empowering women in faith, fellowship, and service through our Women's Missionary Council." />
        <meta name="twitter:image" content={`${window.location.origin}/logo512.png`} />
      </Helmet>
      <button className="back-to-home-btn" onClick={() => navigate('/')}>
        ← Back to Home
      </button>
      <div className="ministry-hero" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="ministry-hero-content">
          <div className="ministry-hero-icon">💐</div>
          <h1>Ladies Ministry (WMC) | Christ AG Kazhakkoottam</h1>
          <p className="ministry-hero-subtitle">Women's Missionary Council - Empowering Women of Faith</p>
        </div>
      </div>

      <div className="ministry-content">
        <section className="ministry-section cta-section">
          <h2>Coming Soon</h2>
          <p>
            We're currently working on building this page with detailed information about our Ladies Ministry (WMC) 
            and programs. Please check back soon for updates!
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
              Join WMC
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

export default LadiesMinistry;
