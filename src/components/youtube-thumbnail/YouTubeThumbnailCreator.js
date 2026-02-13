import React, { useState, useRef, useEffect } from 'react';
import './YouTubeThumbnailCreator.css';

const YouTubeThumbnailCreator = () => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [textElements, setTextElements] = useState([
    { id: 1, text: 'മാനത്തെ ചെമ്പരുന്തേ..', fontSize: 60, x: 400, y: 120, color: '#FFFFFF', fontFamily: 'Arial', fontWeight: 'bold', stroke: true, strokeColor: '#000000' },
    { id: 2, text: 'VIDEO SONG', fontSize: 20, x: 750, y: 180, color: '#FFFFFF', fontFamily: 'Arial', fontWeight: 'normal', stroke: false, strokeColor: '#000000' },
    { id: 3, text: 'അർമ്പന്ന്3!', fontSize: 80, x: 400, y: 350, color: '#FFD700', fontFamily: 'Arial', fontWeight: 'bold', stroke: true, strokeColor: '#8B4513' }
  ]);
  
  const [selectedElement, setSelectedElement] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const [logoPosition, setLogoPosition] = useState({ x: 20, y: 20, width: 80, height: 80 });
  
  useEffect(() => {
    renderCanvas();
  }, [backgroundImage, textElements, logoImage, logoPosition]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setBackgroundImage(img);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setLogoImage(img);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    if (backgroundImage) {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw logo
    if (logoImage) {
      ctx.drawImage(logoImage, logoPosition.x, logoPosition.y, logoPosition.width, logoPosition.height);
    }

    // Draw text elements
    textElements.forEach(element => {
      ctx.font = `${element.fontWeight} ${element.fontSize}px ${element.fontFamily}`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      if (element.stroke) {
        ctx.strokeStyle = element.strokeColor;
        ctx.lineWidth = 4;
        ctx.strokeText(element.text, element.x, element.y);
      }

      ctx.fillStyle = element.color;
      ctx.fillText(element.text, element.x, element.y);
    });
  };

  const updateTextElement = (id, updates) => {
    setTextElements(prev => 
      prev.map(el => el.id === id ? { ...el, ...updates } : el)
    );
  };

  const addTextElement = () => {
    const newId = Math.max(...textElements.map(el => el.id), 0) + 1;
    setTextElements([...textElements, {
      id: newId,
      text: 'New Text',
      fontSize: 40,
      x: 100,
      y: 100,
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontWeight: 'normal',
      stroke: false,
      strokeColor: '#000000'
    }]);
    setSelectedElement(newId);
  };

  const removeTextElement = (id) => {
    setTextElements(prev => prev.filter(el => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  const downloadThumbnail = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'youtube-thumbnail.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const selectedElementData = textElements.find(el => el.id === selectedElement);

  return (
    <div className="thumbnail-creator">
      <div className="creator-header">
        <h1>YouTube Thumbnail Creator</h1>
        <p>Create professional YouTube thumbnails for your songs and videos</p>
      </div>

      <div className="creator-container">
        <div className="canvas-area">
          <canvas ref={canvasRef} className="thumbnail-canvas"></canvas>
          <div className="canvas-info">
            <span>1280 x 720 px (YouTube Standard)</span>
          </div>
        </div>

        <div className="controls-panel">
          <div className="control-section">
            <h3>Background Image</h3>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button 
              className="btn-upload"
              onClick={() => fileInputRef.current.click()}
            >
              Upload Background Image
            </button>
          </div>

          <div className="control-section">
            <h3>Logo/Watermark</h3>
            <input
              type="file"
              onChange={handleLogoUpload}
              accept="image/*"
              id="logo-upload"
              style={{ display: 'none' }}
            />
            <button 
              className="btn-upload"
              onClick={() => document.getElementById('logo-upload').click()}
            >
              Upload Logo
            </button>
            {logoImage && (
              <div className="logo-controls">
                <label>
                  Logo X: 
                  <input 
                    type="number" 
                    value={logoPosition.x}
                    onChange={(e) => setLogoPosition({...logoPosition, x: parseInt(e.target.value)})}
                  />
                </label>
                <label>
                  Logo Y: 
                  <input 
                    type="number" 
                    value={logoPosition.y}
                    onChange={(e) => setLogoPosition({...logoPosition, y: parseInt(e.target.value)})}
                  />
                </label>
                <label>
                  Logo Size: 
                  <input 
                    type="number" 
                    value={logoPosition.width}
                    onChange={(e) => setLogoPosition({...logoPosition, width: parseInt(e.target.value), height: parseInt(e.target.value)})}
                  />
                </label>
              </div>
            )}
          </div>

          <div className="control-section">
            <div className="section-header">
              <h3>Text Elements</h3>
              <button className="btn-add" onClick={addTextElement}>+ Add Text</button>
            </div>
            
            <div className="text-elements-list">
              {textElements.map(element => (
                <div 
                  key={element.id} 
                  className={`text-element-item ${selectedElement === element.id ? 'selected' : ''}`}
                  onClick={() => setSelectedElement(element.id)}
                >
                  <span>{element.text.substring(0, 20)}...</span>
                  <button 
                    className="btn-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTextElement(element.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {selectedElementData && (
            <div className="control-section">
              <h3>Edit Text Element</h3>
              <div className="text-controls">
                <label>
                  Text:
                  <input
                    type="text"
                    value={selectedElementData.text}
                    onChange={(e) => updateTextElement(selectedElement, { text: e.target.value })}
                  />
                </label>

                <label>
                  Font Size:
                  <input
                    type="number"
                    value={selectedElementData.fontSize}
                    onChange={(e) => updateTextElement(selectedElement, { fontSize: parseInt(e.target.value) })}
                    min="10"
                    max="200"
                  />
                </label>

                <label>
                  Font Weight:
                  <select
                    value={selectedElementData.fontWeight}
                    onChange={(e) => updateTextElement(selectedElement, { fontWeight: e.target.value })}
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                  </select>
                </label>

                <label>
                  Font Family:
                  <select
                    value={selectedElementData.fontFamily}
                    onChange={(e) => updateTextElement(selectedElement, { fontFamily: e.target.value })}
                  >
                    <option value="Arial">Arial</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Impact">Impact</option>
                  </select>
                </label>

                <label>
                  Position X:
                  <input
                    type="number"
                    value={selectedElementData.x}
                    onChange={(e) => updateTextElement(selectedElement, { x: parseInt(e.target.value) })}
                    min="0"
                    max="1280"
                  />
                </label>

                <label>
                  Position Y:
                  <input
                    type="number"
                    value={selectedElementData.y}
                    onChange={(e) => updateTextElement(selectedElement, { y: parseInt(e.target.value) })}
                    min="0"
                    max="720"
                  />
                </label>

                <label>
                  Text Color:
                  <input
                    type="color"
                    value={selectedElementData.color}
                    onChange={(e) => updateTextElement(selectedElement, { color: e.target.value })}
                  />
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedElementData.stroke}
                    onChange={(e) => updateTextElement(selectedElement, { stroke: e.target.checked })}
                  />
                  Add Text Stroke/Outline
                </label>

                {selectedElementData.stroke && (
                  <label>
                    Stroke Color:
                    <input
                      type="color"
                      value={selectedElementData.strokeColor}
                      onChange={(e) => updateTextElement(selectedElement, { strokeColor: e.target.value })}
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          <div className="control-section">
            <button className="btn-download" onClick={downloadThumbnail}>
              Download Thumbnail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeThumbnailCreator;
