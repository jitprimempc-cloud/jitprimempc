/**
 * Image processing utilities for client-side compression and conversion.
 * Enables 100% reliable image uploads on static hosting platforms (Vercel, Netlify, GitHub Pages)
 * as well as mobile devices with large camera photos.
 */

export async function compressImageFile(
  file: File, 
  maxDimension: number = 1000, 
  quality: number = 0.72
): Promise<string> {
  // If not an image (e.g. PDF), convert directly to data URL
  if (!file.type.startsWith('image/')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // If it's an SVG or GIF, preserve vector / animation data directly
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;

          // Scale down if dimensions exceed maxDimension
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Try exporting to WebP first for ultra-lightweight size, fallback to JPEG
          let outputDataUrl = '';
          try {
            outputDataUrl = canvas.toDataURL('image/webp', quality);
            // Verify if browser actually supported webp export
            if (!outputDataUrl.startsWith('data:image/webp')) {
              outputDataUrl = canvas.toDataURL('image/jpeg', quality);
            }
          } catch {
            outputDataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          // If still larger than 400KB, resize further to guarantee safety with Firestore
          if (outputDataUrl.length > 500000) {
            try {
              const canvas2 = document.createElement('canvas');
              canvas2.width = Math.round(width * 0.7);
              canvas2.height = Math.round(height * 0.7);
              const ctx2 = canvas2.getContext('2d');
              if (ctx2) {
                ctx2.imageSmoothingEnabled = true;
                ctx2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height);
                outputDataUrl = canvas2.toDataURL('image/jpeg', 0.65);
              }
            } catch {
              // keep current outputDataUrl
            }
          }

          resolve(outputDataUrl);
        } catch {
          // If canvas fails, fallback to original data url
          resolve(e.target?.result as string);
        }
      };

      img.onerror = () => {
        resolve(e.target?.result as string);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      resolve('');
    };

    reader.readAsDataURL(file);
  });
}

export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return (
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('./')
  );
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Converts a base64 Data URL to a Blob for uploading to Firebase Storage
 */
export function dataURLToBlob(dataurl: string): Blob {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

