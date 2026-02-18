import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MinistryPages.css';

const YouthMinistry = () => {
  const navigate = useNavigate();

  return (
    <div className="ministry-page">
      <button className="back-to-home-btn" onClick={() => navigate('/')}>
        ← Back to Home
      </button>
      <div className="ministry-hero" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="ministry-hero-content">
          <div className="ministry-hero-icon">🎓</div>
          <h1>Youth Ministry</h1>
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
            <button className="btn-primary" onClick={() => navigate('/contact')}>
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
