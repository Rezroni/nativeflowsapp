/**
 * Client-side image compression utilities
 * Reduces camera photo sizes before upload to improve reliability
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1
  mimeType?: string;
}

/**
 * Compress an image file using Canvas API
 * This significantly reduces file size for camera photos (typically 70-90% reduction)
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<Blob> {
  const {
    maxWidth = 1920, // Good balance for chart images
    maxHeight = 1920,
    quality = 0.85, // 85% quality maintains readability while reducing size
    mimeType = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    console.log('[ImageCompression] Starting compression...');
    console.log('[ImageCompression] Original file size:', Math.round(file.size / 1024), 'KB');
    console.log('[ImageCompression] Original file type:', file.type);

    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('[ImageCompression] Failed to get canvas context');
      reject(new Error('Failed to create canvas context'));
      return;
    }

    img.onload = () => {
      console.log('[ImageCompression] Image loaded:', img.width, 'x', img.height);

      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      console.log('[ImageCompression] New dimensions:', Math.round(width), 'x', Math.round(height));

      // Set canvas size
      canvas.width = width;
      canvas.height = height;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Convert canvas to Blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error('[ImageCompression] Failed to create blob');
            reject(new Error('Failed to compress image'));
            return;
          }

          console.log('[ImageCompression] ✓ Compression successful!');
          console.log('[ImageCompression] Compressed size:', Math.round(blob.size / 1024), 'KB');
          console.log(
            '[ImageCompression] Size reduction:',
            Math.round(((file.size - blob.size) / file.size) * 100),
            '%'
          );

          resolve(blob);
        },
        mimeType,
        quality
      );
    };

    img.onerror = (error) => {
      console.error('[ImageCompression] Failed to load image:', error);
      reject(new Error('Failed to load image for compression'));
    };

    // Load image from file
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = (error) => {
      console.error('[ImageCompression] FileReader error:', error);
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Convert Blob to base64 data URL
 */
export async function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Compress image and return as data URL
 * All-in-one function for camera uploads
 */
export async function compressImageToDataURL(
  file: File,
  options?: CompressionOptions
): Promise<string> {
  console.log('[ImageCompression] Compressing image to data URL...');

  // Compress the image
  const compressedBlob = await compressImage(file, options);

  // Convert to data URL
  const dataURL = await blobToDataURL(compressedBlob);

  console.log('[ImageCompression] Final data URL length:', dataURL.length, 'characters');
  console.log('[ImageCompression] Estimated size:', Math.round(dataURL.length / 1024), 'KB');

  return dataURL;
}
