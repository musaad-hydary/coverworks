import type { ImagePlacement } from '../types';

export function fileToImagePlacement(file: File): Promise<ImagePlacement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        resolve({
          dataUrl,
          scale: 1,
          offsetXMm: 0,
          offsetYMm: 0,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        });
      };
      img.onerror = reject;
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}
