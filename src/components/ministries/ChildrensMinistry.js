import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MinistryPages.css';

const ChildrensMinistry = () => {
  const navigate = useNavigate();

  return (
    <div className="ministry-page">
      <button className="back-to-home-btn" onClick={() => navigate('/')}>
        ← Back to Home
      </button>
      <div className="ministry-hero" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="ministry-hero-content">
          <div className="ministry-hero-icon">👶</div>
          <h1>Children's Ministry</h1>
          <p className="ministry-hero-subtitle">Nurturing Young Hearts for Christ</p>
        </div>
      </div>

      <div className="ministry-content">
        <section className="ministry-section">
          <h2>Sunday School Leadership</h2>
          <div className="leadership-section">
            <div className="headmaster-card">
              <div className="headmaster-photo-placeholder">
                <div className="photo-icon">👤</div>
                <span className="photo-label">Photo</span>
              </div>
              <div className="headmaster-info">
                <h3>Sunday School Headmaster</h3>
                <h4>Br Geo Jacob</h4>
                <p>Leading our Sunday School program with dedication and passion for nurturing young hearts in Christ.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="ministry-section">
          <h2>Sunday School Teachers</h2>
          <div className="teachers-grid">
            <div className="teacher-card">
              <div className="teacher-photo-placeholder">
                <div className="photo-icon">👤</div>
                <span className="photo-label">Photo</span>
              </div>
              <h4>Br Leji</h4>
              <p>Sunday School Teacher</p>
            </div>
            <div className="teacher-card">
              <div className="teacher-photo-placeholder">
                <div className="photo-icon">👤</div>
                <span className="photo-label">Photo</span>
              </div>
              <h4>Br Santhosh</h4>
              <p>Sunday School Teacher</p>
            </div>
            <div className="teacher-card">
              <div className="teacher-photo-placeholder">
                <div className="photo-icon">👤</div>
                <span className="photo-label">Photo</span>
              </div>
              <h4>Sis Raji</h4>
              <p>Sunday School Teacher</p>
            </div>
            <div className="teacher-card">
              <div className="teacher-photo-placeholder">
                <div className="photo-icon">👤</div>
                <span className="photo-label">Photo</span>
              </div>
              <h4>Sis Glory</h4>
              <p>Sunday School Teacher</p>
            </div>
            <div className="teacher-card">
              <div className="teacher-photo-placeholder">
                <div className="photo-icon">👤</div>
                <span className="photo-label">Photo</span>
              </div>
              <h4>Br Shaiju</h4>
              <p>Sunday School Teacher</p>
            </div>
            <div className="teacher-card">
              <div className="teacher-photo-placeholder">
                <div className="photo-icon">👤</div>
                <span className="photo-label">Photo</span>
              </div>
              <h4>Sis Hena</h4>
              <p>Sunday School Teacher</p>
            </div>
          </div>
        </section>

        <section className="ministry-section cta-section">
          <h2>Get Involved</h2>
          <p>
            We welcome children of all ages to join our Sunday School program. Contact us to learn more 
            about class schedules, age groups, and how you can be part of our Children's Ministry.
          </p>
          <div className="cta-buttons">
            <button className="btn-primary" onClick={() => navigate('/contact')}>
              Contact Us
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

export default ChildrensMinistry;
