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
 * Fetch image from URL and generate a hash from its content
 * This is more reliable than URL-based hashing for detecting duplicate images
 */
export async function generateImageContentHash(imageUrl: string): Promise<string> {
  try {
    console.log('[ImageHash] Attempting to fetch image from:', imageUrl.substring(0, 100) + '...');

    // Fetch the image with timeout and proper headers
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NativeFlows/1.0)',
      },
      // Don't follow too many redirects
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('[ImageHash] Failed to fetch image for hashing. Status:', response.status, response.statusText);
      console.log('[ImageHash] Falling back to URL-based hash');
      // Fallback to URL hash if fetch fails
      return generateImageHash(imageUrl);
    }

    console.log('[ImageHash] Image fetched successfully, generating content hash...');

    // Get image as buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('[ImageHash] Image size:', buffer.length, 'bytes');

    // Generate SHA-256 hash of the image content
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    console.log('[ImageHash] Content hash generated successfully:', hash.substring(0, 16) + '...');
    return hash;
  } catch (error) {
    console.error('[ImageHash] Error generating image content hash:', error);

    // Log specific error types for better debugging
    if (error instanceof Error) {
      console.error('[ImageHash] Error name:', error.name);
      console.error('[ImageHash] Error message:', error.message);

      // Check for specific error types
      if (error.name === 'AbortError') {
        console.error('[ImageHash] Fetch timed out after 15 seconds');
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
 * Compare two image hashes to check if they're the same image
 */
export function isSameImage(hash1: string, hash2: string): boolean {
  return hash1 === hash2;
}
