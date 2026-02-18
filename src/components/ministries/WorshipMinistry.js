import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MinistryPages.css';

const WorshipMinistry = () => {
  const navigate = useNavigate();

  return (
    <div className="ministry-page">
      <button className="back-to-home-btn" onClick={() => navigate('/')}>
        ← Back to Home
      </button>
      <div className="ministry-hero" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="ministry-hero-content">
          <div className="ministry-hero-icon">🎵</div>
          <h1>Worship Ministry</h1>
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
            <button className="btn-primary" onClick={() => navigate('/contact')}>
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
