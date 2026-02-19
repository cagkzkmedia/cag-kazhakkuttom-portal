import React, { useState, useEffect } from 'react';
import { 
  createGalleryPhoto, 
  getAllGalleryPhotos, 
  updateGalleryPhoto, 
  deleteGalleryPhoto 
} from '../../services/galleryService.firebase';
import './GalleryManagement.css';

const GalleryManagement = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    imageBase64: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const data = await getAllGalleryPhotos();
      setPhotos(data);
    } catch (error) {
      showNotification('Error fetching photos: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showNotification('Image size should be less than 2MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData({ ...formData, imageBase64: base64String });
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.imageBase64) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    try {
      if (editingId) {
        await updateGalleryPhoto(editingId, formData);
        showNotification('Photo updated successfully!');
      } else {
        await createGalleryPhoto(formData);
        showNotification('Photo added successfully!');
      }
      
      resetForm();
      fetchPhotos();
    } catch (error) {
      showNotification('Error saving photo: ' + error.message, 'error');
    }
  };

  const handleEdit = (photo) => {
    setFormData({
      title: photo.title,
      description: photo.description || '',
      category: photo.category || '',
      imageBase64: photo.imageBase64
    });
    setPreviewImage(photo.imageBase64);
    setEditingId(photo.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      try {
        await deleteGalleryPhoto(id);
        showNotification('Photo deleted successfully!');
        fetchPhotos();
      } catch (error) {
        showNotification('Error deleting photo: ' + error.message, 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      imageBase64: ''
    });
    setPreviewImage('');
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="gallery-management">
      <div className="gallery-header">
        <h1>📸 Gallery Management</h1>
        <button 
          className="btn-add"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ Add New Photo'}
        </button>
      </div>

      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {showForm && (
        <div className="gallery-form-card">
          <h2>{editingId ? 'Edit Photo' : 'Add New Photo'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter photo title"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter photo description (optional)"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select a category</option>
                <option value="Worship">Worship Service</option>
                <option value="Youth">Youth Ministry</option>
                <option value="Children">Children's Ministry</option>
                <option value="Events">Special Events</option>
                <option value="Outreach">Outreach & Mission</option>
                <option value="Fellowship">Fellowship</option>
                <option value="Prayer">Prayer Meeting</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Upload Image * (Max 2MB)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required={!editingId}
              />
              {previewImage && (
                <div className="image-preview">
                  <img src={previewImage} alt="Preview" />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save">
                {editingId ? 'Update Photo' : 'Add Photo'}
              </button>
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="gallery-list">
        <h2>Gallery Photos ({photos.length})</h2>
        {loading ? (
          <div className="loading">Loading photos...</div>
        ) : photos.length === 0 ? (
          <div className="empty-state">
            <p>No photos in the gallery yet. Add your first photo!</p>
          </div>
        ) : (
          <div className="photos-grid">
            {photos.map(photo => (
              <div key={photo.id} className="photo-card">
                <div className="photo-image">
                  <img src={photo.imageBase64} alt={photo.title} />
                </div>
                <div className="photo-info">
                  <h3>{photo.title}</h3>
                  {photo.category && <div className="photo-category">{photo.category}</div>}
                  {photo.description && <p>{photo.description}</p>}
                  <div className="photo-date">
                    Added: {photo.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                  </div>
                </div>
                <div className="photo-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(photo)}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(photo.id)}
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

export default GalleryManagement;
