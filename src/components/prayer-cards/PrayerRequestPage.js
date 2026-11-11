/**
 * Prayer Request Submission Page
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPrayerRequest } from '../../services/prayerRequestService.firebase';
import './PrayerRequestPage.css';

const initialForm = {
  name: '',
  address: '',
  phone: '',
  prayerRequest: '',
};

const PrayerRequestPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setMessage({ type: '', text: '' });

      await createPrayerRequest(formData);
      setFormData(initialForm);
      setMessage({
        type: 'success',
        text: 'Your prayer request has been submitted successfully. Our church team will pray for you.',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to submit your prayer request. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="prayer-request-page">
      <div className="prayer-request-header-bar">
        <Link to="/" className="prayer-request-back-link">← Back to Home</Link>
      </div>

      <div className="prayer-request-card">
        <div className="prayer-request-header">
          <h1>Prayer Request</h1>
          <p>Please share your prayer request. We will pray with you and lift your needs before the Lord.</p>
        </div>

        <form onSubmit={handleSubmit} className="prayer-request-form">
          <div className="form-row">
            <div>
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="phone">Phone Number (optional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Your address"
            />
          </div>

          <div>
            <label htmlFor="prayerRequest">Prayer Request *</label>
            <textarea
              id="prayerRequest"
              name="prayerRequest"
              value={formData.prayerRequest}
              onChange={handleChange}
              placeholder="Please describe your prayer request..."
              required
            />
          </div>

          <button type="submit" className="prayer-request-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Send Prayer Request'}
          </button>
        </form>

        {message.text && (
          <div className={`prayer-request-message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>

      <div className="prayer-request-footer-details">
        <h3>Christ AG Church, Kazhakkoottam</h3>
        <p>2nd Floor, Mak Tower, 5705/4, National Highway, Near Kartika Park Hotel, Kazhakkoottam, Thiruvananthapuram, Kerala 695582</p>
        <div className="prayer-request-footer-meta">
          <a href="tel:+918590525909">📞 +91 85905 25909</a>
          <a href="mailto:waytoagkazhakkoottom@gmail.com">✉️ waytoagkazhakkoottom@gmail.com</a>
        </div>
      </div>
    </div>
  );
};

export default PrayerRequestPage;
