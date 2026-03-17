/**
 * Resource Form Component
 * Form for creating and editing resources/articles
 */

import React, { useState, useEffect } from 'react';
import { getAllAuthors, getOrCreateAuthor } from '../../services/authorService.firebase';
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
    authorId: '', // Reference to author document
    description: '',
    content: '',
    imageUrl: categoryImages['Faith'],
    type: 'text', // 'text' or 'pdf'
    pdfData: null, // base64 PDF data
  });

  const [errors, setErrors] = useState({});
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState('existing');
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newAuthorPhoto, setNewAuthorPhoto] = useState(null);
  const [authorPhotoPreview, setAuthorPhotoPreview] = useState(null);
  const [loadingAuthors, setLoadingAuthors] = useState(true);

  // Load authors from database
  useEffect(() => {
    const loadAuthors = async () => {
      try {
        const authorsList = await getAllAuthors();
        setAuthors(authorsList);
      } catch (error) {
        console.error('Error loading authors:', error);
      } finally {
        setLoadingAuthors(false);
      }
    };
    loadAuthors();
  }, []);

  useEffect(() => {
    if (resource) {
      setFormData({
        title: resource.title || '',
        category: resource.category || 'Faith',
        authorId: resource.authorId || '',
        description: resource.description || '',
        content: resource.content || '',
        imageUrl: resource.imageUrl || '',
        type: resource.type || 'text',
        pdfData: resource.pdfData || null,
      });
      if (resource.type === 'pdf' && resource.pdfData) {
        setPdfPreview(resource.pdfData);
      }
      
      // When editing, if article has an authorId, load that author's photo
      if (resource.authorId && authors.length > 0) {
        const author = authors.find(a => a.id === resource.authorId);
        if (author) {
          setSelectedAuthor('existing');
          if (author.photo) {
            setAuthorPhotoPreview(author.photo);
          }
        }
      }
    }
  }, [resource, authors]);

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

    if (selectedAuthor === 'existing' && !formData.authorId) {
      newErrors.author = 'Please select an author';
    }

    if (selectedAuthor === 'new' && !newAuthorName.trim()) {
      newErrors.author = 'Author name is required';
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

  const handleAuthorPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, authorPhoto: 'Please upload an image file' }));
        return;
      }

      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, authorPhoto: 'Image size should not exceed 2MB' }));
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        setNewAuthorPhoto(base64Data);
        setAuthorPhotoPreview(base64Data);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.authorPhoto) {
        setErrors(prev => ({
          ...prev,
          authorPhoto: ''
        }));
      }
    }
  };

  const handleRemoveAuthorPhoto = () => {
    setAuthorPhotoPreview(null);
    setNewAuthorPhoto(null);
  };

  const handleAuthorSelectionChange = (value) => {
    setSelectedAuthor(value);
    if (value === 'existing') {
      setNewAuthorName('');
      setNewAuthorPhoto(null);
      // Don't clear preview - allow editing existing author's photo
    } else {
      setFormData(prev => ({ ...prev, authorId: '' }));
    }
  };

  const handleExistingAuthorChange = (authorId) => {
    setFormData(prev => ({ ...prev, authorId }));
    const author = authors.find(a => a.id === authorId);
    if (author && author.photo) {
      setAuthorPhotoPreview(author.photo);
    } else {
      setAuthorPhotoPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let authorId = formData.authorId;

      // If creating a new author, save it first
      if (selectedAuthor === 'new') {
        authorId = await getOrCreateAuthor(newAuthorName.trim(), newAuthorPhoto);
      }

      // Submit the form data with authorId
      onSubmit({
        ...formData,
        authorId
      });
    } catch (error) {
      console.error('Error handling author:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to save author. Please try again.' }));
    }
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

        {/* Category */}
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

        {/* Author Selection */}
        <div className="form-group">
          <label>Author *</label>
          <div className="author-selection-type">
            <label className="radio-label">
              <input
                type="radio"
                value="existing"
                checked={selectedAuthor === 'existing'}
                onChange={(e) => handleAuthorSelectionChange(e.target.value)}
                disabled={isLoading || loadingAuthors}
              />
              <span>Select Existing Author</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="new"
                checked={selectedAuthor === 'new'}
                onChange={(e) => handleAuthorSelectionChange(e.target.value)}
                disabled={isLoading}
              />
              <span>Add New Author</span>
            </label>
          </div>

          {selectedAuthor === 'existing' ? (
            <>
              <select
                id="existingAuthor"
                value={formData.authorId}
                onChange={(e) => handleExistingAuthorChange(e.target.value)}
                disabled={isLoading || loadingAuthors}
                className={errors.author ? 'error' : ''}
              >
                <option value="">-- Select an author --</option>
                {authors.map(author => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
              {loadingAuthors && <small className="helper-text">Loading authors...</small>}
            </>
          ) : (
            <>
              <input
                type="text"
                id="newAuthorName"
                value={newAuthorName}
                onChange={(e) => setNewAuthorName(e.target.value)}
                placeholder="Enter new author name"
                disabled={isLoading}
                className={errors.author ? 'error' : ''}
              />
            </>
          )}
          {errors.author && <span className="error-message">{errors.author}</span>}
        </div>

        {/* Author Photo - Only show for new author or if existing author has photo */}
        {(selectedAuthor === 'new' || authorPhotoPreview) && (
          <div className="form-group">
            <label htmlFor="authorPhoto">
              {selectedAuthor === 'new' ? 'Author Photo (Optional)' : 'Author Photo'}
            </label>
            <input
              type="file"
              id="authorPhoto"
              name="authorPhoto"
              accept="image/*"
              onChange={handleAuthorPhotoUpload}
              disabled={isLoading}
              className={errors.authorPhoto ? 'error' : ''}
              style={{ display: 'none' }}
            />
            <div className="author-photo-upload-area">
              {!authorPhotoPreview ? (
                <label htmlFor="authorPhoto" className="author-photo-upload-label">
                  <div className="upload-icon">👤</div>
                  <div className="upload-text">Click to upload author photo</div>
                  <div className="upload-hint">Maximum file size: 2MB</div>
                </label>
              ) : (
                <div className="author-photo-preview">
                  <img src={authorPhotoPreview} alt="Author" />
                  <button 
                    type="button" 
                    className="remove-photo-btn" 
                    onClick={handleRemoveAuthorPhoto}
                    disabled={isLoading}
                    title="Remove photo"
                  >
                    ✕
                  </button>
                  {selectedAuthor === 'existing' && (
                    <label htmlFor="authorPhoto" className="change-photo-btn" title="Change photo">
                      ✎
                    </label>
                  )}
                </div>
              )}
            </div>
            {errors.authorPhoto && <span className="error-message">{errors.authorPhoto}</span>}
            <small className="helper-text">
              {selectedAuthor === 'new' ? 'Optional: Add a photo for the new author' : 'Click to change the photo'}
            </small>
          </div>
        )}

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
              placeholder="Full resource content (displayed on detail page)&#10;&#10;Formatting tips:&#10;- Use **text** for bold&#10;- Use *text* for italic&#10;- Start lines with - or * for bullet points&#10;- Use blank lines to separate paragraphs"
              rows="12"
              disabled={isLoading}
              className={errors.content ? 'error' : ''}
            />
            {errors.content && <span className="error-message">{errors.content}</span>}
            <small className="helper-text">
              Supports: **bold**, *italic*, bullet points (- item), numbered lists (1. item), and line breaks
            </small>
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
