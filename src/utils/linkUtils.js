/**
 * Utility functions for processing and rendering links
 */

/**
 * Extract YouTube video ID from various YouTube URL formats
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if not found
 */
export const extractYouTubeId = (url) => {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:m\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

/**
 * Detect if a URL is a YouTube link
 * @param {string} url - URL to check
 * @returns {boolean} - True if it's a YouTube URL
 */
export const isYouTubeUrl = (url) => {
  return /(?:youtube\.com|youtu\.be)/i.test(url);
};

/**
 * Process text content to make links clickable and embed YouTube videos
 * @param {string} htmlContent - HTML content string
 * @returns {string} - Processed HTML content
 */
export const processLinksInContent = (htmlContent) => {
  if (!htmlContent) return '';

  // URL pattern that matches URLs in text
  const urlPattern = /(https?:\/\/[^\s<>"]+)/g;
  
  // Split content by HTML tags to avoid processing URLs inside tags
  const parts = htmlContent.split(/(<[^>]+>)/g);
  
  const processed = parts.map(part => {
    // Skip HTML tags
    if (part.startsWith('<')) {
      return part;
    }
    
    // Process text content
    return part.replace(urlPattern, (url) => {
      // Clean trailing punctuation
      let cleanUrl = url.replace(/[.,;:!?)\]]+$/, '');
      
      // Check if it's a YouTube URL
      if (isYouTubeUrl(cleanUrl)) {
        const videoId = extractYouTubeId(cleanUrl);
        if (videoId) {
          return `<div class="youtube-embed-container"><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe></div>`;
        }
      }
      
      // Make regular links clickable
      return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="content-link">${cleanUrl}</a>`;
    });
  }).join('');

  return processed;
};

/**
 * Convert plain text URLs to clickable links (for non-HTML content)
 * @param {string} text - Plain text content
 * @returns {string} - HTML with clickable links
 */
export const linkify = (text) => {
  if (!text) return '';
  
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlPattern, (url) => {
    // Check if it's a YouTube URL
    if (isYouTubeUrl(url)) {
      const videoId = extractYouTubeId(url);
      if (videoId) {
        return `
          <div class="youtube-embed-container">
            <iframe 
              width="560" 
              height="315" 
              src="https://www.youtube.com/embed/${videoId}" 
              title="YouTube video player" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowfullscreen
              loading="lazy"
            ></iframe>
          </div>
        `;
      }
    }
    
    // Make regular links clickable
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="content-link">${url}</a>`;
  });
};
