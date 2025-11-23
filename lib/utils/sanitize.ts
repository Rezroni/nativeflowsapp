/**
 * HTML and text sanitization utilities for preventing XSS attacks
 * Uses DOMPurify for robust HTML sanitization
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content for blog posts and rich text content
 * Allows safe HTML tags while removing scripts and event handlers
 */
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span', 'mark', 'del', 'ins', 'sub', 'sup'
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'alt', 'src', 'class', 'id',
      'target', 'rel', 'width', 'height'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    // Ensure links open in new tab safely
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'base', 'form'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });
}

/**
 * Sanitize rich text content (like TipTap editor output)
 * More permissive than basic HTML but still safe
 */
export function sanitizeRichText(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span', 'mark', 'del', 'ins', 'sub', 'sup',
      'hr', 'figure', 'figcaption'
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'alt', 'src', 'class', 'id',
      'target', 'rel', 'width', 'height', 'style'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    ADD_ATTR: ['target'],
  });
}

/**
 * Sanitize plain text - strips all HTML tags
 * Use for user names, comments, titles, etc.
 */
export function sanitizePlainText(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize user input for display (escapes HTML but preserves newlines)
 * Converts newlines to <br> tags safely
 */
export function sanitizeUserInput(dirty: string): string {
  const text = sanitizePlainText(dirty);
  return text.replace(/\n/g, '<br>');
}

/**
 * Sanitize JSON content - ensures no script injection in JSON strings
 * Use before storing user-generated JSON in database
 */
export function sanitizeJSON(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizePlainText(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeJSON);
  }

  if (obj !== null && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[sanitizePlainText(key)] = sanitizeJSON(value);
    }
    return sanitized;
  }

  return obj;
}

/**
 * Validate and sanitize URL to prevent javascript: and data: URLs
 */
export function sanitizeURL(url: string): string | null {
  const cleaned = url.trim();

  // Block dangerous protocols
  const dangerousProtocols = /^(javascript|data|vbscript|file):/i;
  if (dangerousProtocols.test(cleaned)) {
    console.warn('[Sanitize] Blocked dangerous URL protocol:', cleaned.substring(0, 50));
    return null;
  }

  // Ensure valid HTTP/HTTPS URL
  try {
    const parsed = new URL(cleaned);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    return parsed.toString();
  } catch {
    // Invalid URL
    return null;
  }
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string | null {
  const cleaned = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(cleaned)) {
    return null;
  }

  return sanitizePlainText(cleaned);
}
