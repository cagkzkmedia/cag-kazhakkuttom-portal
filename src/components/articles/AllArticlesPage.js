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

  return (
    <div className="all-articles-page">
      <Helmet>
        <title>Resources & Articles | Christ AG Church Kazhakkoottam | Christ AG കഴക്കൂട്ടം ചർച്ചിലെ സന്ദേശങ്ങളുടെ പൂർണ്ണമായ ശേഖരം</title>
        <meta name="description" content="Explore our collection of spiritual resources and inspiring articles. Discover faith-building content, devotionals, and biblical teachings from Christ AG Church Kazhakkoottam." />
        <meta name="keywords" content="christian articles, faith resources, devotionals, bible study, spiritual growth, Christ AG Church, Kazhakkoottam, church resources" />
        
        {/* Open Graph tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Resources & Articles | Christ AG Church Kazhakkoottam | Christ AG കഴക്കൂട്ടം ചർച്ചിലെ സന്ദേശങ്ങളുടെ പൂർണ്ണമായ ശേഖരം" />
        <meta property="og:description" content="Explore our collection of spiritual resources and inspiring articles from Christ AG Church Kazhakkoottam." />
        <meta property="og:image" content={`${window.location.origin}/logo512.png`} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Christ AG Church Kazhakkoottam" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Resources & Articles | Christ AG Church Kazhakkoottam | Christ AG കഴക്കൂട്ടം ചർച്ചിലെ സന്ദേശങ്ങളുടെ പൂർണ്ണമായ ശേഖരം" />
        <meta name="twitter:description" content="Explore our collection of spiritual resources and inspiring articles." />
        <meta name="twitter:image" content={`${window.location.origin}/logo512.png`} />
      </Helmet>
      
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Home
      </button>

      <div className="articles-paper">
        {/* Header Section */}
        <div className="articles-paper-header">
          <h1 className="articles-paper-title">Resources & Articles</h1>
          <p className="articles-paper-subtitle">Explore our collection of spiritual resources and inspiring articles</p>
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
