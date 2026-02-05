
/**
 * Super Hyper Optimized Image Utility
 * automatically injects format, quality, and sizing parameters.
 */
export const cld = (url: string, width: number = 800) => {
  if (!url || !url.includes('cloudinary')) return url;
  
  // f_auto: Serves WebP or AVIF automatically based on browser support
  // q_auto: Intelligent compression with no visual loss
  // w_{width}: Resizes image to exact need to save bandwidth
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
};
