/**
 * Announcement Management Component
 * Admin interface for creating, editing, and managing announcements
 */

import React, { useState, useEffect } from 'react';
import {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  deleteExpiredAnnouncements
} from '../../services/announcementService.firebase';
import './AnnouncementManagement.css';

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageBase64: '',
    expiryDate: ''
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    setIsLoading(true);
    try {
      const data = await getAllAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to load announcements:', error);
      alert('Failed to load announcements');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size should be less than 2MB' }));
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setFormData(prev => ({ ...prev, imageBase64: base64String }));
      setImagePreview(base64String);
      setErrors(prev => ({ ...prev, image: '' }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      const expiryDate = new Date(formData.expiryDate);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      if (expiryDate < tomorrow) {
        newErrors.expiryDate = 'Expiry date must be at least tomorrow';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editingId) {
        await updateAnnouncement(editingId, formData);
        alert('News updated successfully!');
      } else {
        await createAnnouncement(formData);
        alert('News created successfully!');
      }

      resetForm();
      loadAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Failed to save news: ' + error.message);
    }
  };

  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title,
      description: announcement.description,
      imageBase64: announcement.imageBase64 || '',
      expiryDate: announcement.expiryDate ? announcement.expiryDate.split('T')[0] : ''
    });
    setImagePreview(announcement.imageBase64 || '');
    setEditingId(announcement.id);
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news?')) {
      return;
    }

    try {
      await deleteAnnouncement(id);
      alert('News deleted successfully!');
      loadAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Failed to delete news');
    }
  };

  const handleCleanup = async () => {
    if (!window.confirm('Delete all expired announcements?')) {
      return;
    }

    try {
      const result = await deleteExpiredAnnouncements();
      alert(`Deleted ${result.count} expired announcements`);
      loadAnnouncements();
    } catch (error) {
      console.error('Error cleaning up:', error);
      alert('Failed to cleanup expired announcements');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageBase64: '',
      expiryDate: ''
    });
    setImagePreview('');
    setEditingId(null);
    setIsFormVisible(false);
    setErrors({});
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (isLoading) {
    return <div className="announcement-loading">Loading latest news and announcements...</div>;
  }

  return (
    <div className="announcement-management">
      <div className="announcement-header">
        <h1>📢 Latest News and Announcements Management</h1>
        <div className="announcement-header-actions">
          <button
            className="btn-cleanup"
            onClick={handleCleanup}
            title="Delete expired announcements"
          >
            🗑️ Cleanup Expired
          </button>
          <button
            className="btn-new-announcement"
            onClick={() => setIsFormVisible(!isFormVisible)}
          >
            {isFormVisible ? '✕ Cancel' : '+ New Announcement'}
          </button>
        </div>
      </div>

      {isFormVisible && (
        <div className="announcement-form-container">
          <h2>{editingId ? 'Edit Latest News and Announcements' : 'Create New Latest News and Announcements'}</h2>
          <form onSubmit={handleSubmit} className="announcement-form">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter announcement title"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter announcement description"
                rows="4"
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="image">Poster Image</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className={errors.image ? 'error' : ''}
              />
              {errors.image && <span className="error-message">{errors.image}</span>}
              <small className="helper-text">Max size: 2MB. Recommended: 800x600px</small>
              
              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button
                    type="button"
                    className="btn-remove-image"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, imageBase64: '' }));
                      setImagePreview('');
                    }}
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date *</label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                min={getMinDate()}
                className={errors.expiryDate ? 'error' : ''}
              />
              {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
              <small className="helper-text">Announcement will automatically hide after this date</small>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {editingId ? 'Update Latest News and Announcements' : 'Create Latest News and Announcements'}
              </button>
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="announcements-list">
        <h2>All Latest News and Announcements ({announcements.length})</h2>
        {announcements.length === 0 ? (
          <div className="no-announcements">
            <p>No latest news and announcements yet. Create your first one!</p>
          </div>
        ) : (
          <div className="announcements-grid">
            {announcements.map(announcement => (
              <div 
                key={announcement.id} 
                className={`announcement-card ${isExpired(announcement.expiryDate) ? 'expired' : ''}`}
              >
                {isExpired(announcement.expiryDate) && (
                  <div className="expired-badge">Expired</div>
                )}
                
                {announcement.imageBase64 && (
                  <div className="announcement-image">
                    <img src={announcement.imageBase64} alt={announcement.title} />
                  </div>
                )}
                
                <div className="announcement-content">
                  <h3>{announcement.title}</h3>
                  <p className="announcement-description">{announcement.description}</p>
                  
                  <div className="announcement-meta">
                    <span className="meta-item">
                      📅 Created: {new Date(announcement.createdAt).toLocaleDateString()}
                    </span>
                    <span className={`meta-item ${isExpired(announcement.expiryDate) ? 'expired-date' : ''}`}>
                      ⏰ Expires: {new Date(announcement.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="announcement-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(announcement)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(announcement.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementManagement;
