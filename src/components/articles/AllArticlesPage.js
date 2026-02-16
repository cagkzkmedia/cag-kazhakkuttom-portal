import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllArticles } from '../../services/articlesService.firebase';
import PageHeader from '../common/PageHeader';
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
      {/* Header Section */}
      <PageHeader 
        title="Resources & Articles"
        subtitle="Explore our collection of spiritual resources and inspiring articles"
        showBackButton={true}
        backPath="/"
      />

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

      {/* Back to Home Button */}
      <div className="articles-back-section">
        <button className="btn-back-home" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default AllArticlesPage;
