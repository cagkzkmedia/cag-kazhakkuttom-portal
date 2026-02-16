import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getAllArticles } from '../../services/articlesService.firebase';
import './AllArticlesPage.css';

const AllArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const allArticles = await getAllArticles();
      setArticles(allArticles);
    } catch (err) {
      console.error('Failed to load articles', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(articles.map(article => article.category).filter(Boolean))];

  const filteredArticles = filter === 'all' 
    ? articles 
    : articles.filter(article => article.category === filter);

  const handleArticleClick = (articleId) => {
    navigate(`/article/${articleId}`, { state: { fromAllArticles: true } });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = 'Resources & Articles | Christ AG Church Kazhakkoottam | ക്രൈസ്റ്റ് AG കഴക്കൂട്ടം ചർച്ചിലെ സന്ദേശങ്ങളുടെ പൂർണ്ണമായ ശേഖരം';
    const text = 'Explore our collection of spiritual resources and inspiring articles from Christ AG Church Kazhakkoottam.';

    // Try native Web Share API first (works on mobile)
    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        console.log('Share cancelled');
      }
    }

    // Platform-specific sharing
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          alert('Link copied to clipboard!');
          return;
        } catch (err) {
          console.error('Failed to copy:', err);
          alert('Failed to copy link');
          return;
        }
      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
    }
  };

  return (
    <div className="all-articles-page">
      <Helmet>
        <title>Resources & Articles | Christ AG Church Kazhakkoottam</title>
        <meta name="description" content="Explore our collection of spiritual resources and inspiring articles. Discover faith-building content, devotionals, and biblical teachings from Christ AG Church Kazhakkoottam." />
        <meta name="keywords" content="christian articles, faith resources, devotionals, bible study, spiritual growth, Christ AG Church, Kazhakkoottam, church resources" />
        
        {/* Open Graph tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Resources & Articles | Christ AG Church Kazhakkoottam | ക്രൈസ്റ്റ് എജി കഴക്കൂട്ടം ചർച്ചിലെ സന്ദേശങ്ങളുടെ പൂർണ്ണമായ ശേഖരം" />
        <meta property="og:description" content="Explore our collection of spiritual resources and inspiring articles from Christ AG Church Kazhakkoottam. | ക്രൈസ്റ്റ് എജി ചർച്ച് കഴക്കൂട്ടത്തിൽ നിന്നുള്ള ആത്മീയ വിഭവങ്ങളുടെയും പ്രചോദനാത്മക ലേഖനങ്ങളുടെയും ശേഖരം പര്യവേക്ഷണം ചെയ്യുക." />
        <meta property="og:image" content={`${window.location.origin}/logo512.png`} />
        <meta property="og:image:secure_url" content={`${window.location.origin}/logo512.png`} />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:image:alt" content="Christ AG Church Kazhakkoottam Logo" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Christ AG Church Kazhakkoottam" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Resources & Articles | Christ AG Church Kazhakkoottam | ക്രൈസ്റ്റ് എജി കഴക്കൂട്ടം ചർച്ചിലെ സന്ദേശങ്ങളുടെ പൂർണ്ണമായ ശേഖരം" />
        <meta name="twitter:description" content="Explore our collection of spiritual resources and inspiring articles. | ക്രൈസ്റ്റ് എജി ചർച്ച് കഴക്കൂട്ടത്തിൽ നിന്നുള്ള ആത്മീയ വിഭവങ്ങളുടെയും പ്രചോദനാത്മക ലേഖനങ്ങളുടെയും ശേഖരം പര്യവേക്ഷണം ചെയ്യുക." />
        <meta name="twitter:image" content={`${window.location.origin}/logo512.png`} />
        <meta name="twitter:image:alt" content="Christ AG Church Kazhakkoottam Logo" />
      </Helmet>
      
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Home
      </button>

      <div className="articles-paper">
        {/* Header Section */}
        <div className="articles-paper-header">
          <h1 className="articles-paper-title">Resources & Articles</h1>
          <p className="articles-paper-subtitle">Explore our collection of spiritual resources and inspiring articles</p>
          
          {/* Share Buttons */}
          <div className="share-section">
            <p className="share-label">Share this page:</p>
            <div className="share-buttons">
              <button onClick={() => handleShare('facebook')} className="share-btn facebook" title="Share on Facebook">
                <span>📘</span> Facebook
              </button>
              <button onClick={() => handleShare('twitter')} className="share-btn twitter" title="Share on Twitter">
                <span>🐦</span> Twitter
              </button>
              <button onClick={() => handleShare('whatsapp')} className="share-btn whatsapp" title="Share on WhatsApp">
                <span>💬</span> WhatsApp
              </button>
              <button onClick={() => handleShare('email')} className="share-btn email" title="Share via Email">
                <span>📧</span> Email
              </button>
              <button onClick={() => handleShare('copy')} className="share-btn copy" title="Copy Link">
                <span>🔗</span> Copy Link
              </button>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="articles-filter-section">
        <div className="articles-filter-container">
          <h3>Filter by Category:</h3>
          <div className="articles-filter-buttons">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${filter === category ? 'active' : ''}`}
                onClick={() => setFilter(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="articles-content-section">
        {loading ? (
          <div className="articles-loading">
            <div className="spinner"></div>
            <p>Loading articles...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="articles-empty">
            <h3>No articles found</h3>
            <p>Check back later for new content!</p>
          </div>
        ) : (
          <div className="articles-grid">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="article-card"
                onClick={() => handleArticleClick(article.id)}
              >
                {article.imageUrl && (
                  <div className="article-card-image">
                    <img src={article.imageUrl} alt={article.title} />
                    {article.category && (
                      <span className="article-category-badge">
                        {article.category}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="article-card-content">
                  <h3 className="article-card-title">{article.title}</h3>
                  
                  <p className="article-card-excerpt">
                    {article.excerpt || article.description}
                  </p>
                  
                  <div className="article-card-meta">
                    {article.author && (
                      <span className="article-author">
                        By {article.author}
                      </span>
                    )}
                    {article.createdAt && (
                      <span className="article-date">
                        {formatDate(article.createdAt)}
                      </span>
                    )}
                  </div>
                  
                  <button className="article-read-more">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

        {/* Footer */}
        <div className="articles-paper-footer">
          <div className="footer-divider"></div>
          <div className="church-info">
            <h3>Christ AG Church Kazhakkoottam</h3>
            <p>2nd Floor, Mak Tower, National Highway, Kazhakkoottam</p>
            <p>Thiruvananthapuram, Kerala 695582</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllArticlesPage;
