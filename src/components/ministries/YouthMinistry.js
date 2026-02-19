import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './MinistryPages.css';

const YouthMinistry = () => {
  const navigate = useNavigate();

  return (
    <div className="ministry-page">
      <Helmet>
        <title>Youth Ministry - Christ Ambassadors | Christ AG Church Kazhakkoottam | യുവജന ശുശ്രൂഷ - ക്രൈസ്റ്റ് അംബാസഡേഴ്‌സ്</title>
        <meta name="description" content="Join Christ Ambassadors youth ministry at Christ AG Church Kazhakkoottam. Led by Br Lin Noble, empowering the next generation for Christ. | ക്രൈസ്റ്റ് അംബാസഡേഴ്‌സ് യുവജന ശുശ്രൂഷയിൽ ചേരുക." />
        <meta name="keywords" content="youth ministry, christ ambassadors, young adults, Christ AG Church, Kazhakkoottam, youth fellowship, യുവജന ശുശ്രൂഷ, ക്രൈസ്റ്റ് അംബാസഡേഴ്‌സ്" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Youth Ministry - Christ Ambassadors | Christ AG Church Kazhakkoottam | യുവജന ശുശ്രൂഷ" />
        <meta property="og:description" content="Empowering the next generation for Christ through our vibrant youth ministry program. | അടുത്ത തലമുറയെ ക്രിസ്തുവിനായി ശാക്തീകരിക്കുന്നു." />
        <meta property="og:image" content={`${window.location.origin}/logo512.png`} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Christ AG Church Kazhakkoottam" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Youth Ministry - Christ Ambassadors | Christ AG Church Kazhakkoottam" />
        <meta name="twitter:description" content="Empowering the next generation for Christ through our vibrant youth ministry program." />
        <meta name="twitter:image" content={`${window.location.origin}/logo512.png`} />
      </Helmet>
      <button className="back-to-home-btn" onClick={() => navigate('/')}>
        ← Back to Home
      </button>
      <div className="ministry-hero" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="ministry-hero-content">
          <div className="ministry-hero-icon">🎓</div>
          <h1>Youth Ministry | Christ AG Kazhakkoottam</h1>
          <p className="ministry-hero-subtitle">Empowering the Next Generation</p>
        </div>
      </div>

      <div className="ministry-content">
        <section className="ministry-section">
          <h2>Christ Ambassadors Leadership</h2>
          <div className="leadership-section">
            <div className="headmaster-card">
              <div className="headmaster-photo-placeholder">
                <div className="photo-icon">👤</div>
                <span className="photo-label">Photo</span>
              </div>
              <div className="headmaster-info">
                <h3>Christ Ambassador Secretary</h3>
                <h4>Br Lin Noble</h4>
                <p>Leading our Christ Ambassadors youth ministry with passion and dedication to empower the next generation for Christ.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="ministry-section cta-section">
          <h2>Get Involved</h2>
          <p>
            Join our vibrant youth ministry and be part of the Christ Ambassadors program. 
            Contact us to learn more about our activities, fellowship meetings, and how you can get connected.
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
              Get Connected
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

export default YouthMinistry;
