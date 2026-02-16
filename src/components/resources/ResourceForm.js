/**
 * Resource Form Component
 * Form for creating and editing resources/articles
 */

import React, { useState, useEffect } from 'react';
import './ResourceForm.css';

// Default images for each category from Unsplash
const categoryImages = {
  'Faith': 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Prayer': 'https://images.unsplash.com/photo-1604537466573-5e94508fd243?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Devotion': 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Teaching': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Testimony': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Inspiration': 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Bible Study': 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Other': 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
};

const ResourceForm = ({ resource, onSubmit, onClose, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Faith',
    author: '',
    description: '',
    content: '',
    imageUrl: categoryImages['Faith'],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (resource) {
      setFormData({
        title: resource.title || '',
        category: resource.category || 'Faith',
        author: resource.author || '',
        description: resource.description || '',
        content: resource.content || '',
        imageUrl: resource.imageUrl || '',
      });
    }
  }, [resource]);

  const categories = [
    'Faith',
    'Prayer',
    'Devotion',
    'Teaching',
    'Testimony',
    'Inspiration',
    'Bible Study',
    'Other'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If category is changed, update image URL to match category
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        imageUrl: categoryImages[value] || categoryImages['Other']
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="resource-form">
      <div className="form-header">
        <h2>{resource ? '✏️ Edit Resource' : '➕ Create New Resource'}</h2>
        <button className="close-btn" onClick={onClose} disabled={isLoading}>✕</button>
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter resource title"
            disabled={isLoading}
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        {/* Category and Author Row */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isLoading}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="author">Author *</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Author name"
              disabled={isLoading}
              className={errors.author ? 'error' : ''}
            />
            {errors.author && <span className="error-message">{errors.author}</span>}
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the resource (shown in resource list)"
            rows="3"
            disabled={isLoading}
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        {/* Content */}
        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Full resource content (displayed on detail page)"
            rows="8"
            disabled={isLoading}
            className={errors.content ? 'error' : ''}
          />
          {errors.content && <span className="error-message">{errors.content}</span>}
          <small className="helper-text">Tip: You can use markdown formatting or plain text</small>
        </div>

        {/* Image URL */}
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            disabled={isLoading}
          />
          <small className="helper-text">
            Suggested: Use picsum.photos or unsplash.com URLs
          </small>
          {formData.imageUrl && (
            <div className="image-preview">
              <img src={formData.imageUrl} alt="Preview" onError={(e) => e.target.src = ''} />
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-small"></span>
                Saving...
              </>
            ) : (
              resource ? '✏️ Update Resource' : '➕ Create Resource'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResourceForm;
