import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './MinistryPages.css';

const OutreachMinistry = () => {
  const navigate = useNavigate();

  return (
    <div className="ministry-page">
      <Helmet>
        <title>Outreach Ministry - Gospel for Kazhakkuttom (GFK) | Christ AG Church | സുവിശേഷ ശുശ്രൂഷ</title>
        <meta name="description" content="Join our Gospel for Kazhakkuttom (GFK) outreach ministry. Spreading the love of Christ through community service and evangelism. | കഴക്കൂട്ടത്തിനായുള്ള സുവിശേഷ ശുശ്രൂഷയിൽ ചേരുക." />
        <meta name="keywords" content="outreach ministry, evangelism, community service, Gospel for Kazhakkuttom, GFK, Christ AG Church, സുവിശേഷ ശുശ്രൂഷ, സുവിശേഷ പ്രചാരണം" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Outreach Ministry - Gospel for Kazhakkuttom (GFK) | Christ AG Church | സുവിശേഷ ശുശ്രൂഷ" />
        <meta property="og:description" content="Spreading the love of Christ through community service and evangelism. | സമൂഹസേവനത്തിലൂടെ ക്രിസ്തുവിന്റെ സ്നേഹം പ്രചരിപ്പിക്കുന്നു." />
        <meta property="og:image" content={`${window.location.origin}/logo512.png`} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Christ AG Church Kazhakkoottam" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Outreach Ministry - GFK | Christ AG Church Kazhakkoottam | സുവിശേഷ ശുശ്രൂഷ" />
        <meta name="twitter:description" content="Spreading the love of Christ through community service and evangelism." />
        <meta name="twitter:image" content={`${window.location.origin}/logo512.png`} />
      </Helmet>
      <button className="back-to-home-btn" onClick={() => navigate('/')}>
        ← Back to Home
      </button>
      <div className="ministry-hero" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="ministry-hero-content">
          <div className="ministry-hero-icon">🌍</div>
          <h1>Outreach Ministry</h1>
          <p className="ministry-hero-subtitle">Sharing God's Love Beyond Our Walls</p>
        </div>
      </div>

      <div className="ministry-content">
        <section className="ministry-section cta-section">
          <h2>Coming Soon</h2>
          <p>
            We're currently working on building this page with detailed information about our Outreach Ministry 
            and Gospel for Kazhakkuttom (GFK) initiative. Please check back soon for updates!
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
              Join Outreach Team
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

export default OutreachMinistry;
