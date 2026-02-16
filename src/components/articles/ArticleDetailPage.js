/**
 * Article Detail Page Component
 * Displays full article content in a paper-style layout
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getArticleById } from '../../services/articlesService.firebase';
import './ArticleDetailPage.css';

// Mock articles for reference
const MOCK_ARTICLES = [
  {
    id: 'mock-1',
    title: 'The Power of Daily Prayer',
    excerpt: 'Discover how establishing a daily prayer routine can transform your spiritual life and deepen your connection with God.',
    description: 'Prayer is the foundation of our faith. Learn practical tips for maintaining a meaningful prayer practice that brings you closer to God\'s love and purpose.',
    content: `Prayer is one of the most powerful tools available to us as believers. It\'s a direct line to God, a way to communicate our deepest concerns, gratitude, and desires. Yet many of us struggle to maintain a consistent prayer practice.

Why is daily prayer so important? In the Bible, we see countless examples of people who maintained faithful prayer habits. Jesus himself rose early to pray. Through prayer, we:

• Connect with God on a personal level
• Find peace and clarity in difficult times
• Express gratitude for blessings
• Intercede for others
• Strengthen our faith and trust in God

Starting a daily prayer routine doesn't need to be complicated. Here are some practical steps:

1. Choose a consistent time - Morning, evening, or both work well
2. Find a quiet space - Minimize distractions
3. Start simple - Begin with 5-10 minutes
4. Use a journal - Write down your prayers and God's responses
5. Include Scripture - Read and meditate on God's Word
6. Be authentic - Pray from your heart, not from a script

Remember, prayer is not about perfect words or lengthy conversations. God wants to hear from your heart. Start today, and experience the transformation that comes from daily communion with the Almighty.`,
    category: 'Prayer',
    author: 'Pastor Jobin Elisha',
    imageUrl: 'https://picsum.photos/800/400?random=1',
    link: '#',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-2',
    title: 'Finding Faith in Times of Uncertainty',
    excerpt: 'When life feels overwhelming, how can we maintain our faith and trust in God\'s plan? Explore biblical wisdom and practical guidance.',
    description: 'Faith is not about having all the answers. It\'s about trusting God even when we don\'t understand the journey. Discover how to strengthen your faith during challenging times.',
    content: `Uncertainty is a natural part of life. We face job losses, health challenges, relationship struggles, and countless unknowns. In these moments, our faith is tested. But it\'s precisely in these times that faith becomes most powerful.

What does it mean to have faith during uncertainty? Faith is not the absence of doubt or fear. Rather, it\'s choosing to trust God even when circumstances seem overwhelming. The Bible tells us, "Now faith is confidence in what we hope for and assurance about what we do not see." (Hebrews 11:1)

Throughout Scripture, we see heroes of faith who faced incredible uncertainty:

• Abraham left everything for a land he hadn't seen
• Noah built an ark when it had never rained
• Mary accepted her role as Jesus' mother despite the confusion and scandal
• The disciples followed Jesus without knowing where it would lead

What can we learn from their example?

Trust in God's Character: God is faithful, loving, and sovereign. Even when we can't see His plan, we can trust His character.

Lean on Community: Share your struggles with others. The church is called to bear one another's burdens.

Study Scripture: God's Word offers comfort, wisdom, and examples of faith during difficult times.

Practice Surrender: Let go of the need to control everything. Release your worries to God.

Take Action: Faith without works is dead. Do what you can while trusting God for what you can't.

Remember, faith is not blind optimism. It's grounded in who God is and what He has done. As you face uncertainty, trust that God is working for your good, even when you can't see it.`,
    category: 'Faith',
    author: 'Pastor Jobin Elisha',
    imageUrl: 'https://picsum.photos/800/400?random=2',
    link: '#',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-3',
    title: 'Living a Life of Gratitude',
    excerpt: 'Gratitude is a powerful spiritual practice that transforms our perspective. Learn how thanksgiving can deepen your faith journey.',
    description: 'A grateful heart opens doors to blessings we often overlook. Explore how to cultivate gratitude in your daily life and experience the peace that comes from appreciating God\'s goodness.',
    content: `Gratitude is often overlooked as a spiritual practice, yet it has the power to transform our lives completely. When we cultivate a grateful heart, we shift our focus from what\'s wrong to what\'s right, from what we lack to what we have been blessed with.

In 1 Thessalonians 5:16-18, Paul writes: "Rejoice always, pray without ceasing, give thanks in all circumstances; for this is the will of God in Christ Jesus for you."

Notice that Paul doesn't say give thanks for all circumstances, but in all circumstances. There\'s a difference. We don't have to be grateful for difficulties, but we can find things to be grateful for even in difficult times.

The Power of Gratitude:

Shifts Our Perspective: Gratitude helps us see blessings we might otherwise miss.

Increases Joy: A grateful heart naturally experiences more joy and contentment.

Strengthens Relationships: When we express gratitude to others, we deepen our connections.

Improves Mental Health: Research shows that gratitude reduces stress, anxiety, and depression.

Draws Us Closer to God: Gratitude is a form of worship, acknowledging God\'s goodness.

How to Cultivate Gratitude:

1. Start a Gratitude Journal: Each day, write down 3-5 things you\'re grateful for, no matter how small.

2. Practice Gratitude Prayer: Before meals and at bedtime, thank God specifically for His blessings.

3. Express Thanks to Others: Tell people how much they mean to you and how they\'ve impacted your life.

4. Notice the Small Things: A warm cup of coffee, a friend\'s smile, a beautiful sunset—these all deserve gratitude.

5. Reframe Challenges: Even difficulties can teach us valuable lessons and build our character.

6. Share Your Blessings: When we share what we have, we acknowledge that everything is a gift from God.

As you go through your day, I challenge you to pause and count your blessings. No matter what you\'re facing, there\'s always something to be grateful for. A grateful heart is a peaceful heart, and a peaceful heart is a powerful testimony to God\'s goodness.`,
    category: 'Faith',
    author: 'Pastor Jobin Elisha',
    imageUrl: 'https://picsum.photos/800/400?random=3',
    link: '#',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleBackClick = () => {
    // Check if user came from AllArticlesPage
    if (location.state?.fromAllArticles) {
      navigate('/articles');
    } else {
      // Navigate to home and scroll to resources section
      navigate('/', { state: { scrollToResources: true } });
    }
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = article.title;
    const text = article.description || article.excerpt;

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

  useEffect(() => {
    const loadArticle = async () => {
      try {
        // Try to fetch from Firebase first
        let foundArticle = await getArticleById(id);
        
        // If not found, check mock articles
        if (!foundArticle) {
          foundArticle = MOCK_ARTICLES.find(a => a.id === id);
        }
        
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error loading article:', error);
        // Try mock articles as fallback
        const foundArticle = MOCK_ARTICLES.find(a => a.id === id);
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id, navigate]);

  if (loading) {
    return <div className="article-detail-loading">Loading article...</div>;
  }

  if (!article) {
    return null;
  }

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description || article.excerpt,
    "image": article.imageUrl || '',
    "datePublished": article.createdAt,
    "dateModified": article.updatedAt || article.createdAt,
    "author": {
      "@type": "Person",
      "name": article.author || "Christ AG Church"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Christ AG Church Kazhakkoottam",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/static/media/cag-logo.png`
      }
    },
    "articleSection": article.category,
    "keywords": `${article.category}, christian article, faith, devotion, Christ AG Church`
  };

  return (
    <div className="article-detail-page">
      <Helmet>
        <title>{article.title} | Christ AG Church Kazhakkoottam</title>
        <meta name="description" content={article.description || article.excerpt} />
        <meta name="keywords" content={`${article.category}, christian article, faith resources, ${article.author}, Christ AG Church, Kazhakkoottam`} />
        <meta name="author" content={article.author || 'Christ AG Church'} />
        
        {/* Open Graph tags for social sharing */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description || article.excerpt} />
        {article.imageUrl && <meta property="og:image" content={article.imageUrl} />}
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Christ AG Church Kazhakkoottam" />
        <meta property="article:published_time" content={article.createdAt} />
        <meta property="article:author" content={article.author || 'Christ AG Church'} />
        <meta property="article:section" content={article.category} />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.description || article.excerpt} />
        {article.imageUrl && <meta name="twitter:image" content={article.imageUrl} />}
        
        {/* Structured data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <button className="back-button" onClick={handleBackClick}>
        ← Back to Articles
      </button>

      <article className="article-paper">
        <div className="article-paper-header">
          {article.imageUrl && (
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="article-paper-image"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
          
          <div className="article-paper-title-section">
            <h1 className="article-paper-title">{article.title}</h1>
            
            <div className="article-paper-meta">
              <div className="meta-group">
                <span className="category-badge">{article.category || 'General'}</span>
              </div>
              <div className="meta-group">
                <span className="author">By {article.author || 'Unknown'}</span>
                <span className="separator">•</span>
                <span className="date">
                  {new Date(article.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="article-paper-content">
          {article.content ? (
            article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="article-paragraph">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="article-paragraph">{article.description}</p>
          )}
        </div>

        {/* Share Buttons */}
        <div className="article-detail-share">
          <h3 className="share-title">Share this article</h3>
          <div className="share-buttons">
            <button 
              className="share-btn share-facebook"
              onClick={() => handleShare('facebook')}
              title="Share on Facebook"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
            
            <button 
              className="share-btn share-twitter"
              onClick={() => handleShare('twitter')}
              title="Share on Twitter"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter
            </button>
            
            <button 
              className="share-btn share-whatsapp"
              onClick={() => handleShare('whatsapp')}
              title="Share on WhatsApp"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </button>
            
            <button 
              className="share-btn share-email"
              onClick={() => handleShare('email')}
              title="Share via Email"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Email
            </button>
            
            <button 
              className="share-btn share-copy"
              onClick={() => handleShare('copy')}
              title="Copy Link"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              Copy Link
            </button>
          </div>
        </div>

        <div className="article-paper-footer">
          <div className="footer-divider"></div>
          <div className="church-info">
            <h3>Christ AG Church Kazhakkoottam</h3>
            <p>2nd Floor, Mak Tower, National Highway, Kazhakkoottam</p>
            <p>Thiruvananthapuram, Kerala 695582</p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetailPage;
