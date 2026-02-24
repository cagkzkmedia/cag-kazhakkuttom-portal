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
    type: 'text', // 'text' or 'pdf'
    pdfData: null, // base64 PDF data
  });

  const [errors, setErrors] = useState({});
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);

  useEffect(() => {
    if (resource) {
      setFormData({
        title: resource.title || '',
        category: resource.category || 'Faith',
        author: resource.author || '',
        description: resource.description || '',
        content: resource.content || '',
        imageUrl: resource.imageUrl || '',
        type: resource.type || 'text',
        pdfData: resource.pdfData || null,
      });
      if (resource.type === 'pdf' && resource.pdfData) {
        setPdfPreview(resource.pdfData);
      }
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

    if (formData.type === 'text' && !formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (formData.type === 'pdf' && !formData.pdfData && !pdfFile) {
      newErrors.pdf = 'PDF file is required';
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

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is PDF
      if (file.type !== 'application/pdf') {
        setErrors(prev => ({ ...prev, pdf: 'Please upload a PDF file' }));
        return;
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, pdf: 'PDF file size should not exceed 5MB' }));
        return;
      }

      setPdfFile(file);

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        setFormData(prev => ({
          ...prev,
          pdfData: base64Data
        }));
        setPdfPreview(base64Data);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.pdf) {
        setErrors(prev => ({
          ...prev,
          pdf: ''
        }));
      }
    }
  };

  const handleRemovePdf = () => {
    setPdfFile(null);
    setPdfPreview(null);
    setFormData(prev => ({
      ...prev,
      pdfData: null
    }));
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

        {/* Article Type */}
        <div className="form-group">
          <label htmlFor="type">Article Type *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="text">Text Article</option>
            <option value="pdf">PDF Document</option>
          </select>
          <small className="helper-text">
            Choose 'Text Article' for written content or 'PDF Document' to upload a PDF file
          </small>
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

        {/* Content - Only show for text type */}
        {formData.type === 'text' && (
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
        )}

        {/* PDF Upload - Only show for pdf type */}
        {formData.type === 'pdf' && (
          <div className="form-group">
            <label htmlFor="pdf">PDF Document *</label>
            <input
              type="file"
              id="pdf"
              name="pdf"
              accept="application/pdf"
              onChange={handlePdfUpload}
              disabled={isLoading}
              className={errors.pdf ? 'error' : ''}
              style={{ display: 'none' }}
            />
            <div className="pdf-upload-area">
              {!pdfPreview ? (
                <label htmlFor="pdf" className="pdf-upload-label">
                  <div className="upload-icon">📄</div>
                  <div className="upload-text">Click to upload PDF</div>
                  <div className="upload-hint">Maximum file size: 5MB</div>
                </label>
              ) : (
                <div className="pdf-preview">
                  <div className="pdf-preview-header">
                    <span className="pdf-icon">📄</span>
                    <span className="pdf-name">{pdfFile?.name || 'Uploaded PDF'}</span>
                    <button 
                      type="button" 
                      className="remove-pdf-btn" 
                      onClick={handleRemovePdf}
                      disabled={isLoading}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="pdf-preview-info">
                    PDF document ready for upload
                  </div>
                </div>
              )}
            </div>
            {errors.pdf && <span className="error-message">{errors.pdf}</span>}
          </div>
        )}

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
