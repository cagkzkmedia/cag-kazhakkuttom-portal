/**
 * Text Formatter Utility
 * Processes text content to support basic formatting like bold, bullets, etc.
 */

/**
 * Process text content to convert markdown-like syntax to HTML
 * @param {string} text - Plain text with markdown-like formatting
 * @returns {string} - HTML formatted text
 */
export const formatTextContent = (text) => {
  if (!text) return '';

  let formatted = text;

  // Convert **bold** or __bold__ to <strong>bold</strong>
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Convert *italic* or _italic_ to <em>italic</em> (but not if it's a bullet)
  formatted = formatted.replace(/(?<!^[\s]*)(?<!\*)(\*)(?!\*)(.+?)(?<!\*)(\*)(?!\*)/gm, '<em>$2</em>');
  formatted = formatted.replace(/(?<!^[\s]*)(_)(?!_)(.+?)(?<!_)(_)(?!_)/gm, '<em>$2</em>');

  // Split by double newlines to get paragraphs
  const blocks = formatted.split(/\n\n+/);
  const result = [];

  for (let block of blocks) {
    const lines = block.split('\n');
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Check if this line is a bullet point
      if (/^[\s]*[-•*][\s]/.test(line)) {
        // Collect all consecutive bullet points
        const bulletItems = [];
        while (i < lines.length && /^[\s]*[-•*][\s]/.test(lines[i])) {
          const content = lines[i].replace(/^[\s]*[-•*][\s]*/, '');
          bulletItems.push(`<li>${content}</li>`);
          i++;
        }
        result.push(`<ul>${bulletItems.join('')}</ul>`);
      }
      // Check if this line is a numbered item
      else if (/^[\s]*\d+\.[\s]/.test(line)) {
        // Collect all consecutive numbered items
        const numberedItems = [];
        while (i < lines.length && /^[\s]*\d+\.[\s]/.test(lines[i])) {
          const content = lines[i].replace(/^[\s]*\d+\.[\s]*/, '');
          numberedItems.push(`<li>${content}</li>`);
          i++;
        }
        result.push(`<ol>${numberedItems.join('')}</ol>`);
      }
      // Regular line - collect until next list or end
      else {
        const regularLines = [];
        while (i < lines.length && 
               !/^[\s]*[-•*][\s]/.test(lines[i]) && 
               !/^[\s]*\d+\.[\s]/.test(lines[i])) {
          if (lines[i].trim() !== '') {
            regularLines.push(lines[i]);
          }
          i++;
        }
        if (regularLines.length > 0) {
          result.push(`<p>${regularLines.join('<br/>')}</p>`);
        }
      }
    }
  }

  return result.join('');
};

/**
 * Strip HTML tags from text
 * @param {string} html - HTML string
 * @returns {string} - Plain text
 */
export const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

/**
 * Convert line breaks to <br> tags
 * @param {string} text - Plain text
 * @returns {string} - HTML with br tags
 */
export const nl2br = (text) => {
  if (!text) return '';
  return text.replace(/\n/g, '<br/>');
};
