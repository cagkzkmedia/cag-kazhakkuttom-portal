/**
 * Birthday Card Component
 * Generates a birthday greeting card for WhatsApp sharing
 */

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import './BirthdayCard.css';

const BirthdayCard = ({ member, onClose, onShare }) => {
  const memberName = member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim();
  const cardRef = useRef(null);
  
  // Format name to title case if in all caps
  const formatName = (name) => {
    if (!name) return '';
    // Check if name is all uppercase
    if (name === name.toUpperCase()) {
      return name.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    }
    return name;
  };
  
  const formattedName = formatName(memberName);
  
  const handleWhatsAppShare = () => {
    const message = `🎉 Happy Birthday ${memberName}! 🎉

🎂 May this special day bring you endless joy, blessings, and cherished moments.

May God's grace shine upon you today and always. Wishing you a year filled with love, peace, and prosperity.

🙏 God bless you abundantly!

With love and prayers,
Christ AG Church Kazhakkoottam Family 💙`;

    const whatsappUrl = `https://wa.me/${member.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    if (onShare) onShare();
  };

  const handleShareImage = async () => {
    if (!cardRef.current) return;

    const phoneNumber = member.phone?.replace(/\D/g, '');
    
    if (!phoneNumber) {
      alert('Phone number not available for this member.');
      return;
    }
    
    // Open WhatsApp with a message
    const message = `🎉 Happy Birthday ${formattedName}! 🎉\n\nMay this special day bring you endless joy, blessings, and cherished moments.\n\nWith love and prayers,\nChrist AG Church Kazhakkoottam Family 💙`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 3,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      });

      canvas.toBlob((blob) => {
        const fileName = `birthday-${memberName.replace(/\s+/g, '-')}.png`;
        downloadImage(blob, fileName);
      });
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const downloadImage = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="birthday-modal-overlay" onClick={onClose}>
      <div className="birthday-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="birthday-close-btn" onClick={onClose}>✕</button>
        
        <div className="birthday-card" ref={cardRef}>
          <div className="birthday-card-photo-section">
            {member.profileImage && (
              <div
                className="birthday-card-main-photo"
                style={{
                  backgroundImage: `url(${member.profileImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 40%',
                  backgroundRepeat: 'no-repeat',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
            )}
            <div className="birthday-card-stars">
              <span className="star star-1">★</span>
              <span className="star star-2">★</span>
              <span className="star star-3">★</span>
              <span className="star star-4">★</span>
              <span className="star star-5">★</span>
              <span className="star star-6">★</span>
              <span className="star star-7">★</span>
              <span className="star star-8">★</span>
              <span className="star star-9">★</span>
              <span className="star star-10">★</span>
              <span className="star star-11">★</span>
              <span className="star star-12">★</span>
            </div>
          </div>
          
          <div className="birthday-card-content">
            <div className="birthday-card-title">Happy Birthday!</div>
            <div className="birthday-card-name">{formattedName}</div>
            
            <div className="birthday-card-message">
              May this special day bring you joy and blessings.
            </div>
            
            <div className="birthday-card-footer">
              <p>With love and prayers,</p>
              <p className="birthday-card-church-name">Christ AG Church Kazhakkoottam Family</p>
            </div>
          </div>
        </div>
        
        <div className="birthday-card-actions">
          <button className="birthday-download-image-btn" onClick={handleDownloadImage}>
            <span>💾</span>
            <span>Download Card</span>
          </button>
          <button className="birthday-share-image-btn" onClick={handleShareImage}>
            <span>📲</span>
            <span>Send to WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BirthdayCard;
