import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { createDonation } from '../../services/donationService.firebase';
import qrCodeImage from '../../assets/qr-code.jpg';
import './DonationPage.css';

const DonationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    donorName: '',
    email: '',
    phone: '',
    amount: '',
    category: 'Tithe',
    paymentMethod: 'UPI',
    message: ''
  });
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [donationId, setDonationId] = useState(null);
  const [paymentCompleting, setPaymentCompleting] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const categories = [
    { value: 'Tithe', label: 'Tithe' },
    { value: 'Offering', label: 'Offering' },
    { value: 'Building Fund', label: 'Building Fund' },
    { value: 'Mission', label: 'Mission' },
    { value: 'general', label: 'General Fund' },
    { value: 'youth', label: 'Youth Ministry' },
    { value: 'charity', label: 'Charity' }
  ];

  const paymentMethods = [
    { value: 'UPI', label: 'UPI Payment', description: 'GPay, PhonePe, Paytm' },
    { value: 'Cash', label: 'Cash/Cheque', description: 'In-person or mail' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProceedToPayment = async () => {
    // Validate
    if (!formData.donorName || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Create donation record with pending status
      const donationData = {
        donor: formData.donorName,
        donorName: formData.donorName,
        amount: parseFloat(formData.amount),
        category: formData.category,
        paymentMethod: formData.paymentMethod,
        date: new Date().toISOString(),
        status: 'pending',
        notes: formData.message || `Email: ${formData.email}, Phone: ${formData.phone}`,
        email: formData.email,
        phone: formData.phone
      };

      const result = await createDonation(donationData);
      setDonationId(result.id);

      // Show payment section
      setShowQR(true);
      setTimeout(() => {
        const paymentSection = document.querySelector('.payment-section-container');
        if (paymentSection) {
          window.scrollTo({
            top: paymentSection.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      }, 100);
    } catch (error) {
      console.error('Error submitting donation:', error);
      alert('Failed to submit donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  const handlePayWithUPIApp = () => {
    const upiId = 'assemblies49629@fbl';
    const amount = formData.amount;
    const name = 'Christ AG Church Kazhakkoottam';
    const note = `${formData.category} - ${formData.donorName}`;
    
    // UPI deep link format
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    
    window.location.href = upiUrl;
  };

  const handleOpenUPIApp = () => {
    const upiId = 'assemblies49629@fbl';
    const name = 'ASSEMBLIES OF GOD';
    
    // UPI deep link format without amount (user can enter in app)
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&cu=INR`;
    
    window.location.href = upiUrl;
  };

  const handleCompletePayment = async () => {
    if (!donationId) {
      alert('No donation record found. Please submit the form again.');
      return;
    }

    setPaymentCompleting(true);
    try {
      // Here you would update the donation status
      // For now, we'll just show success message
      alert(
        `Thank you for your donation of ₹${formData.amount}!\n\n` +
        `Your donation has been recorded.\n\n` +
        `Please WhatsApp the payment screenshot to:\n` +
        `+91 85905 25909\n\n` +
        `Reference: ${formData.donorName} - ${formData.category}`
      );
      
      // Reset form
      setFormData({
        donorName: '',
        email: '',
        phone: '',
        amount: '',
        category: 'Tithe',
        paymentMethod: 'UPI',
        message: ''
      });
      setShowQR(false);
      setDonationId(null);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error completing payment:', error);
      alert('Failed to complete payment confirmation. Please contact us.');
    } finally {
      setPaymentCompleting(false);
    }
  };

  return (
    <div className="donation-page-public">
      <Helmet>
        <title>Make a Donation | Christ AG Church Kazhakkoottam</title>
        <meta name="description" content="Support Christ AG Church Kazhakkoottam through your generous donations. Your giving helps us serve our community and spread God's love." />
      </Helmet>

      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Home
      </button>

      <div className="donation-paper">
        <div className="donation-header">
          <h1>Make a Donation</h1>
          <p className="donation-subtitle">
            Your generosity helps us serve our community and spread God's love.
            <br />
            "Give, and it will be given to you. A good measure, pressed down, shaken together and running over." - Luke 6:38
          </p>
        </div>

        {/* Payment Information */}
        <div className="payment-info">
          <h3>Payment Information</h3>
          
          {!showQR && (
            <div className="info-grid">
            <div className="info-card">
              <h4>📱 UPI Payment</h4>
              <div className="info-qr-container">
                <img src={qrCodeImage} alt="UPI Payment QR Code" className="info-qr-image" />
              </div>
              <p>
                <strong>UPI ID:</strong> assemblies49629@fbl<br />
                <strong>Apps:</strong> GPay, PhonePe, Paytm<br />
                <em>Share payment screenshot via WhatsApp</em>
              </p>
              <button 
                onClick={handleOpenUPIApp}
                disabled={!isMobile}
                className="btn-upi-app-info"
                title={!isMobile ? 'Available only on mobile devices' : ''}
              >
                {isMobile ? '🚀 Pay with UPI App' : '📱 Available on Mobile Only'}
              </button>
              {!isMobile && (
                <p className="mobile-only-note">Use your mobile device to pay via UPI app</p>
              )}
            </div>
            <div className="info-card">
              <h4>💵 Cash/Cheque</h4>
              <p>
                <strong>Account Name:</strong> ASSEMBLIES OF GOD<br />
                <strong>Account Number:</strong> 16170100049629<br />
                <strong>Branch:</strong> Kazhakootam<br />
                <strong>IFSC Code:</strong> FDRL0001617<br />
                <br />
                <strong>Cash:</strong> Visit church office<br />
                <strong>Cheque:</strong> Payable to "ASSEMBLIES OF GOD"
              </p>
            </div>
          </div>
          )}

          {/* Church Footer */}
          <div className="donation-footer">
            <div className="donation-church-info">
              <h3>Christ AG Church Kazhakkoottam</h3>
              <p>2nd Floor, Mak Tower, National Highway, Kazhakkoottam</p>
              <p>Thiruvananthapuram, Kerala 695582</p>
            </div>
          </div>
        </div>

        <div className="donation-form" style={{display: 'none'}}>
          {/* Personal Information */}
          <div className="form-section">
            <h3>Your Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="donorName"
                  value={formData.donorName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>
          </div>

          {/* Donation Details */}
          <div className="form-section">
            <h3>Donation Details</h3>
            <div className="form-group">
              <label>Amount (₹) *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                min="1"
                required
              />
              <div className="suggested-amounts">
                <button type="button" onClick={() => setFormData({...formData, amount: '500'})}>₹500</button>
                <button type="button" onClick={() => setFormData({...formData, amount: '1000'})}>₹1000</button>
                <button type="button" onClick={() => setFormData({...formData, amount: '2000'})}>₹2000</button>
                <button type="button" onClick={() => setFormData({...formData, amount: '5000'})}>₹5000</button>
              </div>
            </div>

            <div className="donation-form-group">
              <label>Donation Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="form-select"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="donation-form-group" style={{display: 'none'}}>
              <label>Payment Method *</label>
              <div className="donation-payment-methods">
                {paymentMethods.map(method => (
                  <label key={method.value} className={`donation-payment-card ${formData.paymentMethod === method.value ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={handleChange}
                    />
                    <span className="donation-method-icon">{method.icon}</span>
                    <span className="donation-method-label">{method.label}</span>
                    <span className="donation-method-desc">{method.description}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Message (Optional)</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Leave a message or prayer request..."
                rows="4"
              />
            </div>
          </div>
        </div>

        {/* Payment Section */}
        {formData.donorName && formData.amount && (
          <div className="payment-section-container">
            {!donationId && (
              <div className="proceed-section">
                <button 
                  onClick={handleProceedToPayment}
                  disabled={loading}
                  className="btn-proceed"
                >
                  {loading ? 'Processing...' : '→ Proceed to Payment'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* UPI Payment Section */}
        {donationId && formData.paymentMethod === 'UPI' && (
          <div className="upi-payment-section">
            <h3>Complete Your Payment</h3>
            
            <div className="payment-options-container">
              {/* Pay with UPI App Button */}
              <div className="upi-app-section">
                <h4>📱 Pay with UPI App</h4>
                <p className="upi-app-desc">Open your preferred UPI app directly</p>
                <button 
                  onClick={handlePayWithUPIApp}
                  disabled={!isMobile}
                  className="btn-upi-app"
                  title={!isMobile ? 'Available only on mobile devices' : ''}
                >
                  {isMobile ? '🚀 Open UPI App' : '📱 Available on Mobile Only'}
                </button>
                {!isMobile && (
                  <p className="desktop-note">Please use your mobile device to pay via UPI app</p>
                )}
                <p className="payment-details">
                  <strong>Amount:</strong> ₹{formData.amount}<br />
                  <strong>To:</strong> Christ AG Church Kazhakkoottam
                </p>
              </div>

              <div className="payment-divider">
                <span>OR</span>
              </div>

              {/* QR Code Section */}
              <div className="qr-code-section">
                <div className="qr-code-container">
                  <h4>📱 Scan QR Code to Pay</h4>
                  <div className="qr-placeholder">
                    <img src={qrCodeImage} alt="UPI Payment QR Code" className="qr-code-image" />
                  </div>
                  <div className="qr-instructions">
                    <p><strong>Amount:</strong> ₹{formData.amount}</p>
                    <p><strong>UPI ID:</strong> assemblies49629@fbl</p>
                    <p>Open any UPI app and scan this code</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Complete Payment Button */}
            <div className="payment-completion">
              <p className="completion-instruction">
                After making the payment, click the button below:
              </p>
              <button 
                onClick={handleCompletePayment}
                disabled={paymentCompleting}
                className="btn-complete-payment"
              >
                {paymentCompleting ? 'Processing...' : '✓ I Have Completed Payment'}
              </button>
              <p className="whatsapp-reminder">
                Please WhatsApp the payment screenshot to: <strong>+91 85905 25909</strong>
              </p>
            </div>
          </div>
        )}

        {/* Cash/Cheque Payment Section */}
        {donationId && formData.paymentMethod === 'Cash' && (
          <div className="cash-payment-section">
            <h3>Complete Your Payment</h3>
            
            <div className="payment-options-container">
              {/* Bank Account Details */}
              <div className="bank-details-section">
                <h4>🏦 Bank Account Details</h4>
                <div className="bank-info-card">
                  <div className="bank-detail-row">
                    <span className="detail-label">Account Name:</span>
                    <span className="detail-value">ASSEMBLIES OF GOD</span>
                  </div>
                  <div className="bank-detail-row">
                    <span className="detail-label">Account Number:</span>
                    <span className="detail-value">16170100049629</span>
                  </div>
                  <div className="bank-detail-row">
                    <span className="detail-label">Branch:</span>
                    <span className="detail-value">Kazhakootam</span>
                  </div>
                  <div className="bank-detail-row">
                    <span className="detail-label">IFSC Code:</span>
                    <span className="detail-value">FDRL0001617</span>
                  </div>
                  <div className="bank-detail-row highlight">
                    <span className="detail-label">Amount:</span>
                    <span className="detail-value">₹{formData.amount}</span>
                  </div>
                </div>
              </div>

              <div className="payment-divider">
                <span>OR</span>
              </div>

              {/* Cash Payment Details */}
              <div className="cash-details-section">
                <h4>💵 Cash Payment</h4>
                <div className="cash-info-card">
                  <p><strong>Visit our church office:</strong></p>
                  <p className="address-text">
                    2nd Floor, Mak Tower<br />
                    National Highway, Kazhakkoottam<br />
                    Thiruvananthapuram, Kerala
                  </p>
                  <div className="contact-info">
                    <p><strong>Contact:</strong></p>
                    <p>📞 +91 85905 25909</p>
                    <p>📧 waytoagkazhakuttom@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Complete Payment Button */}
            <div className="payment-completion">
              <p className="completion-instruction">
                After making the payment, click the button below:
              </p>
              <button 
                onClick={handleCompletePayment}
                disabled={paymentCompleting}
                className="btn-complete-payment"
              >
                {paymentCompleting ? 'Processing...' : '✓ I Have Completed Payment'}
              </button>
              <p className="whatsapp-reminder">
                For verification, please WhatsApp the payment receipt to: <strong>+91 85905 25909</strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationPage;
