/**
 * Anniversary Card Component
 * Generates an anniversary greeting card for WhatsApp sharing
 */

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import './AnniversaryCard.css';

const AnniversaryCard = ({ member, onClose, onShare }) => {
  const memberName = member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim();
  const marriageDate = member.marriageDate ? new Date(member.marriageDate) : null;
  const years = marriageDate ? new Date().getFullYear() - marriageDate.getFullYear() : 0;
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
    const message = `💕 Happy ${years > 0 ? years + (years === 1 ? 'st' : years === 2 ? 'nd' : years === 3 ? 'rd' : 'th') + ' ' : ''}Wedding Anniversary! 💕

❤️ Dear ${memberName},

May your love continue to grow stronger with each passing day. May God bless your union with endless joy, peace, and harmony.

Celebrating the beautiful journey you've shared together and wishing you many more wonderful years ahead!

🙏 May the Lord continue to guide and bless your marriage abundantly.

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
    const yearsText = years > 0 ? `${years}${years === 1 ? 'st' : years === 2 ? 'nd' : years === 3 ? 'rd' : 'th'} ` : '';
    const message = `💕 Happy ${yearsText}Wedding Anniversary! 💕\n\n❤️ Dear ${formattedName},\n\nMay your love continue to grow stronger with each passing day. May God bless your union with endless joy, peace, and harmony.\n\nWith love and prayers,\nChrist AG Church Kazhakkoottam Family 💙`;
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
        const fileName = `anniversary-${memberName.replace(/\s+/g, '-')}.png`;
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
    <div className="anniversary-modal-overlay" onClick={onClose}>
      <div className="anniversary-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="anniversary-close-btn" onClick={onClose}>✕</button>
        
        <div className="anniversary-card" ref={cardRef}>
          <div className="anniversary-card-photo-section">
            {member.profileImage && (
              <div
                className="anniversary-card-main-photo"
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
            <div className="anniversary-card-stars">
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
          
          <div className="anniversary-card-content">
            <div className="anniversary-card-title">Happy Anniversary!</div>
            <div className="anniversary-card-name">{formattedName}</div>
            
            <div className="anniversary-card-message">
              Celebrating your beautiful journey together!
            </div>
            
            <div className="anniversary-card-footer">
              <p>With love and prayers,</p>
              <p className="anniversary-card-church-name">Christ AG Church Kazhakkoottam Family</p>
            </div>
          </div>
        </div>
        
        <div className="anniversary-card-actions">
          <button className="anniversary-download-image-btn" onClick={handleDownloadImage}>
            <span>💾</span>
            <span>Download Card</span>
          </button>
          <button className="anniversary-share-image-btn" onClick={handleShareImage}>
            <span>📲</span>
            <span>Send to WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnniversaryCard;
