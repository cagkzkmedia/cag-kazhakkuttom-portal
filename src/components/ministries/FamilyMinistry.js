import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './MinistryPages.css';

const FamilyMinistry = () => {
  const navigate = useNavigate();

  return (
    <div className="ministry-page">
      <Helmet>
        <title>Family Ministry - Bible Study & Counseling | Christ AG Church Kazhakkoottam | കുടുംബ ശുശ്രൂഷ - ബൈബിൾ പഠനവും കൗൺസിലിംഗും</title>
        <meta name="description" content="Strengthen your family through our Bible study sessions and professional family counseling at Christ AG Church Kazhakkoottam. | കുടുംബത്തെ ശക്തിപ്പെടുത്താൻ ബൈബിൾ പഠനവും കൗൺസിലിംഗും." />
        <meta name="keywords" content="family ministry, bible study, family counseling, marriage counseling, Christ AG Church, Kazhakkoottam, കുടുംബ ശുശ്രൂഷ, ബൈബിൾ പഠനം, കൗൺസിലിംഗ്" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Family Ministry - Bible Study & Counseling | Christ AG Church Kazhakkoottam | കുടുംബ ശുശ്രൂഷ" />
        <meta property="og:description" content="Strengthen your family through our Bible study sessions and professional family counseling. | കുടുംബത്തെ ശക്തിപ്പെടുത്താൻ ബൈബിൾ പഠനവും കൗൺസിലിംഗും." />
        <meta property="og:image" content={`${window.location.origin}/logo512.png`} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Christ AG Church Kazhakkoottam" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Family Ministry - Bible Study & Counseling | Christ AG Church Kazhakkoottam" />
        <meta name="twitter:description" content="Strengthen your family through our Bible study sessions and professional family counseling." />
        <meta name="twitter:image" content={`${window.location.origin}/logo512.png`} />
      </Helmet>
      <button className="back-to-home-btn" onClick={() => navigate('/')}>
        ← Back to Home
      </button>
      <div className="ministry-hero" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="ministry-hero-content">
          <div className="ministry-hero-icon">👨‍👩‍👧‍👦</div>
          <h1>Family Ministry</h1>
          <p className="ministry-hero-subtitle">Building Strong, God-Centered Families</p>
        </div>
      </div>

      <div className="ministry-content">
        <section className="ministry-section cta-section">
          <h2>Coming Soon</h2>
          <p>
            We're currently working on building this page with detailed information about our Family Ministry, 
            special Bible study sessions, and professional family counseling services. Please check back soon for updates!
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
              Schedule Counseling
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

export default FamilyMinistry;
