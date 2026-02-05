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
Christ AG Church Kazhakkuttom Family 💙`;

    const whatsappUrl = `https://wa.me/${member.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    if (onShare) onShare();
  };

  const handleShareImage = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
        ignoreElements: (element) => {
          return element.classList.contains('birthday-card-actions');
        },
      });

      canvas.toBlob(async (blob) => {
        const fileName = `birthday-${memberName.replace(/\s+/g, '-')}.png`;
        
        // Try Web Share API first (works on mobile and some desktop browsers)
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], fileName, { type: 'image/png' })] })) {
          try {
            const file = new File([blob], fileName, { type: 'image/png' });
            await navigator.share({
              files: [file],
              title: `Happy Birthday ${formattedName}!`,
              text: '🎉 Birthday Wishes from Christ AG Church Kazhakkuttom Family 💙'
            });
          } catch (shareError) {
            if (shareError.name !== 'AbortError') {
              // If share was cancelled, don't show error
              console.error('Share failed:', shareError);
              downloadImage(blob, fileName);
            }
          }
        } else {
          // Fallback: download the image
          downloadImage(blob, fileName);
        }
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
          <div className="birthday-card-header">
            <div className="birthday-card-icon">🎂</div>
            <h2>Happy Birthday!</h2>
          </div>
          
          <div className="birthday-card-body">
            <div className="birthday-card-name">{formattedName}</div>
            
            <div className="birthday-card-message">
              <p>🎉 May this special day bring you endless joy, blessings, and cherished moments. May God's grace shine upon you today and always. Wishing you a year filled with love, peace, and prosperity. God bless you abundantly! 🙏</p>
            </div>
            
            <div className="birthday-card-footer">
              <p>With love and prayers,</p>
              <p className="birthday-card-church-name">Christ AG Church Kazhakkuttom Family 💙</p>
            </div>
          </div>
          
          <div className="birthday-card-actions">
            <button className="birthday-share-image-btn" onClick={handleShareImage}>
              <span>📤</span>
              <span className="birthday-btn-text-desktop">Download Image</span>
              <span className="birthday-btn-text-mobile">Share Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayCard;
