import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './MinistryPages.css';

const MissionMinistry = () => {
  const navigate = useNavigate();

  return (
    <div className="ministry-page">
      <Helmet>
        <title>Mission Department - Telangana Missions | Christ AG Church Kazhakkoottam | - തെലങ്കാന മിഷനുകൾ</title>
        <meta name="description" content="Support our mission work in Telangana and beyond. Join us in spreading the Gospel to unreached areas. | തെലങ്കാനയിലെയും മറ്റും മിഷൻ പ്രവർത്തനങ്ങളെ പിന്തുണയ്ക്കുക." />
        <meta name="keywords" content="mission department, telangana missions, church planting, missions, Christ AG Church, Kazhakkoottam, missionary work, മിഷൻ വകുപ്പ്, തെലങ്കാന മിഷനുകൾ" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Mission Department - Telangana Missions | Christ AG Church Kazhakkoottam | മിഷൻ വകുപ്പ്" />
        <meta property="og:description" content="Support our mission work in Telangana. Join us in spreading the Gospel to unreached areas. | തെലങ്കാനയിലെ മിഷൻ പ്രവർത്തനങ്ങളെ പിന്തുണയ്ക്കുക." />
        <meta property="og:image" content={`${window.location.origin}/logo512.png`} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Christ AG Church Kazhakkoottam" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mission Department - Telangana Missions | Christ AG Church Kazhakkoottam" />
        <meta name="twitter:description" content="Support our mission work in Telangana. Join us in spreading the Gospel to unreached areas." />
        <meta name="twitter:image" content={`${window.location.origin}/logo512.png`} />
      </Helmet>
      <button className="back-to-home-btn" onClick={() => navigate('/')}>
        ← Back to Home
      </button>
      <div className="ministry-hero" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="ministry-hero-content">
          <div className="ministry-hero-icon">✈️</div>
          <h1>Mission Department</h1>
          <p className="ministry-hero-subtitle">Taking the Gospel to Unreached Regions</p>
        </div>
      </div>

      <div className="ministry-content">
        <section className="ministry-section cta-section">
          <h2>Coming Soon</h2>
          <p>
            We're currently working on building this page with detailed information about our Mission Department 
            and our mission work in Telangana. Please check back soon for updates!
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
              Learn About Missions
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

export default MissionMinistry;
