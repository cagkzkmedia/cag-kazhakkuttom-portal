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
          return element.classList.contains('anniversary-card-actions');
        },
      });

      canvas.toBlob(async (blob) => {
        const fileName = `anniversary-${memberName.replace(/\s+/g, '-')}.png`;
        
        // Try Web Share API first (works on mobile and some desktop browsers)
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], fileName, { type: 'image/png' })] })) {
          try {
            const file = new File([blob], fileName, { type: 'image/png' });
            await navigator.share({
              files: [file],
              title: `Happy Anniversary ${formattedName}!`,
              text: '💕 Anniversary Wishes from Christ AG Church Kazhakkuttom Family 💙'
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
    <div className="anniversary-modal-overlay" onClick={onClose}>
      <div className="anniversary-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="anniversary-close-btn" onClick={onClose}>✕</button>
        
        <div className="anniversary-card" ref={cardRef}>
          <div className="anniversary-card-header">
            <div className="anniversary-card-icon">💑</div>
            <h2>Happy Anniversary!</h2>
            {years > 0 && <div className="anniversary-years-badge">{years} {years === 1 ? 'Year' : 'Years'}</div>}
          </div>
          
          <div className="anniversary-card-body">
            <div className="anniversary-card-name">{formattedName}</div>
            
            <div className="anniversary-card-message">
              <p>❤️ May your love continue to grow stronger with each passing day. May God bless your union with endless joy, peace, and harmony. Celebrating the beautiful journey you've shared together and wishing you many more wonderful years ahead! May the Lord continue to guide and bless your marriage abundantly. 🙏</p>
            </div>
            
            <div className="anniversary-card-footer">
              <p>With love and prayers,</p>
              <p className="anniversary-card-church-name">Christ AG Church Kazhakkuttom Family 💙</p>
            </div>
          </div>
          
          <div className="anniversary-card-actions">
            <button className="anniversary-share-image-btn" onClick={handleShareImage}>
              <span>📤</span>
              <span className="anniversary-btn-text-desktop">Download Image</span>
              <span className="anniversary-btn-text-mobile">Share Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnniversaryCard;
