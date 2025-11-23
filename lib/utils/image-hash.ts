/**
 * Generate a hash for an image URL to detect duplicate analyses
 * This uses a combination of URL content hash for cache detection
 */

import crypto from 'crypto';

/**
 * Generate a hash from image URL
 * For URLs, we hash the URL itself
 * For uploaded images, the URL includes unique identifiers from storage
 */
export function generateImageHash(imageUrl: string): string {
  // Create a SHA-256 hash of the image URL
  return crypto.createHash('sha256').update(imageUrl).digest('hex');
}

/**
 * Generate a fast, reliable hash using HEAD request metadata
 * This approach is 100x faster than downloading the entire image
 * Combines URL, content-type, content-length, and last-modified for uniqueness
 */
export async function generateImageContentHash(imageUrl: string): Promise<string> {
  try {
    console.log('[ImageHash] Generating fast metadata-based hash for:', imageUrl.substring(0, 100) + '...');

    // Use HEAD request to get metadata without downloading the image (much faster)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // Reduced to 5 seconds

    const response = await fetch(imageUrl, {
      method: 'HEAD', // Only fetch headers, not the entire image
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NativeFlows/1.0)',
      },
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('[ImageHash] Failed to fetch image metadata. Status:', response.status, response.statusText);
      console.log('[ImageHash] Falling back to URL-based hash');
      return generateImageHash(imageUrl);
    }

    // Extract metadata for hash generation
    const contentLength = response.headers.get('content-length') || '0';
    const contentType = response.headers.get('content-type') || 'unknown';
    const lastModified = response.headers.get('last-modified') || '';
    const etag = response.headers.get('etag') || '';

    console.log('[ImageHash] Metadata retrieved - Size:', contentLength, 'bytes, Type:', contentType);

    // Create a composite hash from URL + metadata
    // This is unique enough to detect duplicates while being extremely fast
    const hashInput = `${imageUrl}:${contentLength}:${contentType}:${lastModified}:${etag}`;
    const hash = crypto.createHash('sha256').update(hashInput).digest('hex');

    console.log('[ImageHash] Metadata hash generated successfully:', hash.substring(0, 16) + '...');
    return hash;
  } catch (error) {
    console.error('[ImageHash] Error generating metadata hash:', error);

    // Log specific error types for better debugging
    if (error instanceof Error) {
      console.error('[ImageHash] Error name:', error.name);
      console.error('[ImageHash] Error message:', error.message);

      // Check for specific error types
      if (error.name === 'AbortError') {
        console.error('[ImageHash] Fetch timed out after 5 seconds');
      } else if (error.name === 'TypeError') {
        console.error('[ImageHash] Network error or invalid URL');
      }
    }

    console.log('[ImageHash] Falling back to URL-based hash');
    // Fallback to URL hash on error
    return generateImageHash(imageUrl);
  }
}

/**
 * Generate full content hash by downloading the entire image
 * Only use this for critical duplicate detection where metadata isn't sufficient
 * WARNING: This is slow and should be avoided in user-facing flows
 */
export async function generateFullContentHash(imageUrl: string): Promise<string> {
  try {
    console.log('[ImageHash] Generating full content hash (slow) for:', imageUrl.substring(0, 100) + '...');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NativeFlows/1.0)',
      },
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('[ImageHash] Failed to fetch full image. Status:', response.status);
      return generateImageHash(imageUrl);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    console.log('[ImageHash] Full content hash generated:', hash.substring(0, 16) + '...');
    return hash;
  } catch (error) {
    console.error('[ImageHash] Error generating full content hash:', error);
    return generateImageHash(imageUrl);
  }
}

/**
 * Compare two image hashes to check if they're the same image
 */
export function isSameImage(hash1: string, hash2: string): boolean {
  return hash1 === hash2;
}
