/**
 * Image Crop Modal Component
 * Allows users to crop images before uploading
 */

import React, { useState, useRef, useEffect } from 'react';
import './ImageCropModal.css';

const ImageCropModal = ({ image, onCrop, onCancel }) => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [cropBox, setCropBox] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);

  useEffect(() => {
    if (!imgRef.current || !containerRef.current) return;

    const img = imgRef.current;
    const container = containerRef.current;

    const initializeImage = () => {
      setTimeout(() => {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;

        if (imgWidth === 0 || imgHeight === 0) return;

        // Calculate display dimensions maintaining aspect ratio
        const scale = Math.min(containerWidth / imgWidth, containerHeight / imgHeight);
        const displayWidth = imgWidth * scale;
        const displayHeight = imgHeight * scale;

        // Initialize crop box as a centered square
        const size = Math.min(displayWidth, displayHeight) * 0.8;
        const offsetX = (containerWidth - displayWidth) / 2;
        const offsetY = (containerHeight - displayHeight) / 2;

        const initialCropBox = {
          x: offsetX + (displayWidth - size) / 2,
          y: offsetY + (displayHeight - size) / 2,
          width: size,
          height: size,
          scale,
          imgWidth,
          imgHeight,
          displayWidth,
          displayHeight,
          offsetX,
          offsetY,
        };

        setCropBox(initialCropBox);
        drawCropArea(initialCropBox);
      }, 50);
    };

    if (img.complete) {
      initializeImage();
    } else {
      img.addEventListener('load', initializeImage);
      return () => img.removeEventListener('load', initializeImage);
    }
  }, [image]);

  const drawCropArea = (box) => {
    if (!canvasRef.current || !imgRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size to match container
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // Draw semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear crop area
    ctx.clearRect(box.x, box.y, box.width, box.height);

    // Draw crop box border
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, box.y, box.width, box.height);

    // Draw resize handles
    const handleSize = 12;
    ctx.fillStyle = '#4CAF50';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 3;
    
    const handles = [
      { x: box.x - handleSize / 2, y: box.y - handleSize / 2 }, // top-left
      { x: box.x + box.width - handleSize / 2, y: box.y - handleSize / 2 }, // top-right
      { x: box.x - handleSize / 2, y: box.y + box.height - handleSize / 2 }, // bottom-left
      { x: box.x + box.width - handleSize / 2, y: box.y + box.height - handleSize / 2 }, // bottom-right
    ];
    handles.forEach((handle) => {
      ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
    });
    
    ctx.shadowColor = 'transparent';
  };

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    // Handle both mouse and touch events
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const getResizeHandle = (pos, box) => {
    const handleSize = 16;
    const handles = {
      'tl': { x: box.x, y: box.y },
      'tr': { x: box.x + box.width, y: box.y },
      'bl': { x: box.x, y: box.y + box.height },
      'br': { x: box.x + box.width, y: box.y + box.height },
    };

    for (const [key, handle] of Object.entries(handles)) {
      if (
        Math.abs(pos.x - handle.x) < handleSize &&
        Math.abs(pos.y - handle.y) < handleSize
      ) {
        return key;
      }
    }
    return null;
  };

  const handleMouseDown = (e) => {
    if (!cropBox) return;
    e.preventDefault();

    const pos = getMousePos(e);
    const handle = getResizeHandle(pos, cropBox);

    if (handle) {
      setIsResizing(true);
      setResizeHandle(handle);
      setStartX(pos.x);
      setStartY(pos.y);
    } else if (
      pos.x >= cropBox.x &&
      pos.x <= cropBox.x + cropBox.width &&
      pos.y >= cropBox.y &&
      pos.y <= cropBox.y + cropBox.height
    ) {
      setIsDragging(true);
      setStartX(pos.x);
      setStartY(pos.y);
    }
  };

  const handleTouchStart = (e) => {
    handleMouseDown(e);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    handleMouseMove(e);
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  const handleMouseMove = (e) => {
    if (!cropBox) return;

    const pos = getMousePos(e);
    const handle = getResizeHandle(pos, cropBox);

    // Update cursor
    if (handle === 'tl' || handle === 'br') {
      canvasRef.current.style.cursor = 'nwse-resize';
    } else if (handle === 'tr' || handle === 'bl') {
      canvasRef.current.style.cursor = 'nesw-resize';
    } else if (
      pos.x >= cropBox.x &&
      pos.x <= cropBox.x + cropBox.width &&
      pos.y >= cropBox.y &&
      pos.y <= cropBox.y + cropBox.height
    ) {
      canvasRef.current.style.cursor = 'move';
    } else {
      canvasRef.current.style.cursor = 'crosshair';
    }

    if (isDragging) {
      const deltaX = pos.x - startX;
      const deltaY = pos.y - startY;

      let newBox = { ...cropBox };
      newBox.x += deltaX;
      newBox.y += deltaY;

      // Keep within bounds
      const minX = cropBox.offsetX;
      const maxX = cropBox.offsetX + cropBox.displayWidth - cropBox.width;
      const minY = cropBox.offsetY;
      const maxY = cropBox.offsetY + cropBox.displayHeight - cropBox.height;

      newBox.x = Math.max(minX, Math.min(newBox.x, maxX));
      newBox.y = Math.max(minY, Math.min(newBox.y, maxY));

      setStartX(pos.x);
      setStartY(pos.y);
      setCropBox(newBox);
      drawCropArea(newBox);
    } else if (isResizing && resizeHandle) {
      const deltaX = pos.x - startX;
      const deltaY = pos.y - startY;

      let newBox = { ...cropBox };
      const minSize = 50;

      switch (resizeHandle) {
        case 'tl':
          newBox.x += deltaX;
          newBox.y += deltaY;
          newBox.width -= deltaX;
          newBox.height -= deltaY;
          break;
        case 'tr':
          newBox.y += deltaY;
          newBox.width += deltaX;
          newBox.height -= deltaY;
          break;
        case 'bl':
          newBox.x += deltaX;
          newBox.width -= deltaX;
          newBox.height += deltaY;
          break;
        case 'br':
          newBox.width += deltaX;
          newBox.height += deltaY;
          break;
        default:
          break;
      }

      // Ensure minimum size
      newBox.width = Math.max(minSize, newBox.width);
      newBox.height = Math.max(minSize, newBox.height);

      // Keep within bounds
      const minX = cropBox.offsetX;
      const maxX = cropBox.offsetX + cropBox.displayWidth - newBox.width;
      const minY = cropBox.offsetY;
      const maxY = cropBox.offsetY + cropBox.displayHeight - newBox.height;

      newBox.x = Math.max(minX, Math.min(newBox.x, maxX));
      newBox.y = Math.max(minY, Math.min(newBox.y, maxY));

      setStartX(pos.x);
      setStartY(pos.y);
      setCropBox(newBox);
      drawCropArea(newBox);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  const handleCrop = async () => {
    if (!imgRef.current || !cropBox) return;

    const img = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Calculate the original image coordinates
    const scaleFactor = 1 / cropBox.scale;
    
    // Account for the offset of the displayed image
    const x = (cropBox.x - cropBox.offsetX) * scaleFactor;
    const y = (cropBox.y - cropBox.offsetY) * scaleFactor;
    const width = cropBox.width * scaleFactor;
    const height = cropBox.height * scaleFactor;

    canvas.width = width;
    canvas.height = height;

    // Draw the cropped image from the original
    ctx.drawImage(
      img,
      x,
      y,
      width,
      height,
      0,
      0,
      width,
      height
    );

    // Convert to base64
    const base64Image = canvas.toDataURL('image/jpeg', 0.9);
    onCrop(base64Image);
  };

  return (
    <div className="crop-modal-overlay" onClick={onCancel}>
      <div className="crop-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Crop Image</h2>
        <p className="crop-instructions">Drag to move or resize the crop area</p>

        <div className="crop-container" ref={containerRef}>
          <img ref={imgRef} src={image} alt="Crop preview" />
          <canvas
            ref={canvasRef}
            className="crop-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </div>

        <div className="crop-actions">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="crop-btn" onClick={handleCrop}>
            Crop & Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
