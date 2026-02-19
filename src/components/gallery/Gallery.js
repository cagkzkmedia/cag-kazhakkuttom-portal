/**
 * Gallery Page Component - Displays all church photos with navigation
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getAllGalleryPhotos } from '../../services/galleryService.firebase';
import gallery1 from '../../assets/gallery1.jpg';
import gallery2 from '../../assets/gallery2.jpg';
import gallery3 from '../../assets/gallery3.jpg';
import gallery4 from '../../assets/gallery4.jpg';
import churchGroupImage from '../../assets/church-group.jpg';
import './Gallery.css';

const STATIC_GALLERY_PHOTOS = [
  { id: 'static-1', title: 'Youth Camp', url: gallery1, description: 'Youth fellowship and worship' },
  { id: 'static-2', title: 'Sunday Service', url: gallery2, description: 'Weekly worship service' },
  { id: 'static-3', title: 'Sunday School', url: gallery3, description: 'Children ministry activities' },
  { id: 'static-4', title: 'Parenting Sessions', url: gallery4, description: 'Family ministry programs' },
  { id: 'static-5', title: 'Church Group', url: churchGroupImage, description: 'Our church family' },
];

const Gallery = () => {
  const navigate = useNavigate();
  const [allPhotos, setAllPhotos] = useState(STATIC_GALLERY_PHOTOS);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'slideshow'
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get unique categories from all photos
  const categories = ['All', ...new Set(allPhotos.filter(p => p.category).map(p => p.category))];

  // Filter photos based on selected category
  const filteredPhotos = selectedCategory === 'All' 
    ? allPhotos 
    : allPhotos.filter(photo => photo.category === selectedCategory);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const firebasePhotos = await getAllGalleryPhotos();
        const transformedPhotos = firebasePhotos.map(photo => ({
          id: photo.id,
          title: photo.title,
          url: photo.imageBase64,
          description: photo.description,
          category: photo.category
        }));
        
        // Combine static and Firebase photos
        const combined = [...STATIC_GALLERY_PHOTOS, ...transformedPhotos];
        setAllPhotos(combined);
      } catch (err) {
        console.error('Failed to load gallery photos:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, []);

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => 
      prevIndex === 0 ? allPhotos.length - 1 : prevIndex - 1
    );
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => 
      (prevIndex + 1) % allPhotos.length
    );
  };

  const handlePhotoClick = (index) => {
    // Find the index in allPhotos array
    const photoId = filteredPhotos[index].id;
    const allPhotosIndex = allPhotos.findIndex(p => p.id === photoId);
    setCurrentPhotoIndex(allPhotosIndex);
    setViewMode('slideshow');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (viewMode === 'slideshow') {
        if (e.key === 'ArrowLeft') {
          handlePrevPhoto();
        } else if (e.key === 'ArrowRight') {
          handleNextPhoto();
        } else if (e.key === 'Escape') {
          setViewMode('grid');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [viewMode, allPhotos.length]);

  if (loading) {
    return (
      <div className="public-gallery-page">
        <div className="public-gallery-loading">
          <div className="loading-spinner"></div>
          <p>Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="public-gallery-page">
      <Helmet>
        <title>Photo Gallery | Christ AG Church Kazhakkoottam | ഫോട്ടോ ഗാലറി</title>
        <meta name="description" content="Browse our church photo gallery featuring worship services, ministries, events, and community moments. Christ AG Church Kazhakkoottam photo collection." />
        <meta property="og:title" content="Photo Gallery | Christ AG Church Kazhakkoottam" />
        <meta property="og:description" content="Explore photos from our worship services, ministries, and community events" />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="Christ AG Church, Kazhakkoottam, photo gallery, church photos, worship, ministries, events" />
      </Helmet>

      {/* Header */}
      <div className="public-gallery-header">
        <button className="back-to-home-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <div className="public-gallery-header-content">
          <h1>📸 Church Photo Gallery | Christ AG Kazhakkoottam</h1>
          <p>Moments of worship, fellowship, and service in our community</p>
          <div className="public-gallery-stats">
            <span className="photo-count">{allPhotos.length} Photos</span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      {viewMode === 'grid' && (
        <div className="category-filter-container">
          <div className="category-filter-content">
            <h3>Filter by Category:</h3>
            <div className="category-tags">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-tag ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                  {category !== 'All' && (
                    <span className="tag-count">
                      {allPhotos.filter(p => p.category === category).length}
                    </span>
                  )}
                  {category === 'All' && (
                    <span className="tag-count">{allPhotos.length}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="public-gallery-grid-container">
          {filteredPhotos.length === 0 ? (
            <div className="no-photos-message">
              <p>No photos found in this category.</p>
              <button className="reset-filter-btn" onClick={() => setSelectedCategory('All')}>
                View All Photos
              </button>
            </div>
          ) : (
            <div className="public-gallery-grid-layout">
              {filteredPhotos.map((photo, index) => (
              <div 
                key={photo.id} 
                className="public-gallery-grid-item"
                onClick={() => handlePhotoClick(index)}
              >
                <img 
                  src={photo.url} 
                  alt={photo.title}
                  className="public-gallery-grid-image"
                  loading="lazy"
                />
                <div className="public-gallery-grid-overlay">
                  <div className="public-gallery-grid-info">
                    <h3>{photo.title}</h3>
                    {photo.description && <p>{photo.description}</p>}
                    {photo.category && (
                      <span className="photo-category-badge">{photo.category}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      )}

      {/* Slideshow View */}
      {viewMode === 'slideshow' && (
        <div className="public-gallery-slideshow">
          <button 
            className="slideshow-close-btn" 
            onClick={() => setViewMode('grid')}
            aria-label="Close slideshow"
          >
            ✕
          </button>

          <button 
            className="slideshow-nav-btn slideshow-prev-btn" 
            onClick={handlePrevPhoto}
            aria-label="Previous photo"
          >
            ‹
          </button>

          <button 
            className="slideshow-nav-btn slideshow-next-btn" 
            onClick={handleNextPhoto}
            aria-label="Next photo"
          >
            ›
          </button>

          <div className="slideshow-content">
            <div className="slideshow-image-container">
              <img 
                src={allPhotos[currentPhotoIndex].url} 
                alt={allPhotos[currentPhotoIndex].title}
                className="slideshow-image"
              />
            </div>
            
            <div className="slideshow-info">
              <h2>{allPhotos[currentPhotoIndex].title}</h2>
              {allPhotos[currentPhotoIndex].description && (
                <p className="slideshow-description">
                  {allPhotos[currentPhotoIndex].description}
                </p>
              )}
              {allPhotos[currentPhotoIndex].category && (
                <span className="slideshow-category-badge">
                  {allPhotos[currentPhotoIndex].category}
                </span>
              )}
              <p className="slideshow-counter">
                {currentPhotoIndex + 1} / {allPhotos.length}
              </p>
            </div>
          </div>

          <div className="slideshow-thumbnails">
            {allPhotos.map((photo, index) => (
              <div 
                key={photo.id}
                className={`slideshow-thumbnail ${index === currentPhotoIndex ? 'active' : ''}`}
                onClick={() => setCurrentPhotoIndex(index)}
              >
                <img src={photo.url} alt={photo.title} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      {viewMode === 'grid' && (
        <div className="public-gallery-cta-section">
          <div className="public-gallery-cta-content">
            <h2>Join Our Church Family</h2>
            <p>Be part of these wonderful moments and memories</p>
            <button 
              className="public-gallery-cta-btn"
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  const contactSection = document.querySelector('.contact-section');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
            >
              Get in Touch
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      {viewMode === 'grid' && (
        <footer className="public-gallery-footer">
          <p>Christ AG Church, Kazhakkoottam</p>
          <p>📍 2nd Floor, Mak Tower, 5705/4, National Highway, Near Kartika Park Hotel, Kazhakkoottam, Thiruvananthapuram, Kerala 695582</p>
          <p>📞 +91 85905 25909</p>
        </footer>
      )}
    </div>
  );
};

export default Gallery;
