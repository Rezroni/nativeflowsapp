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
    // Fetch the image
    const response = await fetch(imageUrl);

    if (!response.ok) {
      console.error('Failed to fetch image for hashing:', response.statusText);
      // Fallback to URL hash if fetch fails
      return generateImageHash(imageUrl);
    }

    // Get image as buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate SHA-256 hash of the image content
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    return hash;
  } catch (error) {
    console.error('Error generating image content hash:', error);
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
