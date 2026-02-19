import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './MinistryPages.css';
import prCornelius from '../../assets/pr-cornelius.jpg';
import prLazarus from '../../assets/pr-Lazerus.jpg';
import prSimonAndPaul from '../../assets/pr-SimonAndPaul.jpg';
import prVictor from '../../assets/pr-victor.jpg';
import prTimothy from '../../assets/pr-timothy.jpg';

const MissionMinistry = () => {
  const navigate = useNavigate();
  const [enlargedPhoto, setEnlargedPhoto] = useState(null);

  const missionaries = [
    { name: 'Pr. Cornelius & Family', image: prCornelius, focus: 'Pioneering community outreach and family ministry initiatives' },
    { name: 'Pr. Lazarus & Family', image: prLazarus, focus: 'Championing rural evangelism and spiritual deliverance ministries' },
    { name: 'Pr. Simon & Pr. Paul', image: prSimonAndPaul, focus: 'Dedicated to biblical teaching, discipling new converts, and establishing local prayer networks' },
    { name: 'Pr. Victor & Family', image: prVictor, focus: 'Bringing the light of Christ to unreached neighborhoods' },
    { name: 'Pr. Timothy & Family', image: prTimothy, focus: 'Mentoring and raising up the next generation of believers' }
  ];

  const handlePhotoClick = (missionary) => {
    setEnlargedPhoto(missionary);
  };

  const closeEnlargedPhoto = () => {
    setEnlargedPhoto(null);
  };


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
          <h1>Mission Department | Christ AG Kazhakkoottam</h1>
          <p className="ministry-hero-subtitle">Taking the Gospel to Unreached Regions</p>
        </div>
      </div>

      <div className="ministry-content">
        <section className="ministry-section">
          <h2>A Season of Grace in Telangana</h2>
          <div className="scripture-quote">
            <p className="scripture-text">"How beautiful are the feet of those who bring good news!"</p>
            <p className="scripture-reference">- Romans 10:15</p>
          </div>
          <p>
            At Christ AG Church Kazhakkoottam, our hearts overflow with joy as we witness the transformative work 
            unfolding in the mission fields of Telangana. Through your unwavering prayers and generous financial support, 
            we are privileged to empower six devoted pastoral families who have courageously answered God's call to serve 
            on the front lines of Gospel ministry.
          </p>
          <p>
            These families are more than leaders—they are spiritual pioneers, establishing vibrant communities of faith 
            and making disciples in regions where Christ's light is desperately needed. Their dedication to advancing 
            the Kingdom in challenging territories inspires us all.
          </p>
        </section>

        <section className="ministry-section">
          <h2>Our Mission Partners in Telangana</h2>
          <p className="section-intro">
            We are honored to partner with and support these faithful servants who are transforming lives through the Gospel:
          </p>

          <div className="missionaries-grid">
            {missionaries.map((missionary, index) => (
              <div key={index} className="missionary-card">
                <img 
                  src={missionary.image} 
                  alt={missionary.name} 
                  className="missionary-photo" 
                  onClick={() => handlePhotoClick(missionary)}
                  style={{ cursor: 'pointer' }}
                />
                <div className="missionary-info">
                  <h3>{missionary.name}</h3>
                  <p className="missionary-focus">{missionary.focus}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="ministry-section cta-section">
          <h2>Partner With Us in Mission</h2>
          <p>
            Your prayers and support make an eternal difference. Join us in empowering these faithful servants 
            as they advance God's Kingdom in Telangana and beyond.
          </p>
          <div className="cta-buttons">
            <button className="btn-primary" onClick={() => navigate('/donate')}>
              Support Our Missions
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

      {enlargedPhoto && (
        <div className="photo-modal-overlay" onClick={closeEnlargedPhoto}>
          <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="photo-modal-close" onClick={closeEnlargedPhoto}>×</button>
            <img src={enlargedPhoto.image} alt={enlargedPhoto.name} className="photo-modal-image" />
            <div className="photo-modal-info">
              <h3>{enlargedPhoto.name}</h3>
              <p>{enlargedPhoto.focus}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionMinistry;
