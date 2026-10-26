/**
 * CamScanner-style Canvas Image Processing Engine
 * 100% Client-Side with 0 latency
 */

export type ScannerFilterType = 'original' | 'magic' | 'bw' | 'grayscale' | 'contrast';

export function applyScannerFilter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  filter: ScannerFilterType
): void {
  if (filter === 'original') return;

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const len = data.length;

  if (filter === 'grayscale') {
    for (let i = 0; i < len; i += 4) {
      const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = avg;
      data[i + 1] = avg;
      data[i + 2] = avg;
    }
  } else if (filter === 'bw') {
    // CamScanner Document / Xerox Thresholding Mode
    // Turns paper background pure white and ink crisp dark black
    for (let i = 0; i < len; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      // Adaptive-style thresholding: boost highs, clamp lows
      const val = gray > 140 ? 255 : gray < 70 ? 0 : Math.min(255, (gray - 70) * (255 / 70));
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    }
  } else if (filter === 'magic') {
    // CamScanner Magic Color Mode:
    // 1. Removes shadows
    // 2. Brightens paper to clean white
    // 3. Increases ink contrast and vibrancy
    for (let i = 0; i < len; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Contrast stretching
      r = Math.min(255, Math.max(0, (r - 40) * 1.35));
      g = Math.min(255, Math.max(0, (g - 40) * 1.35));
      b = Math.min(255, Math.max(0, (b - 40) * 1.35));

      // White background detection & boost (if near-white/gray, push to 255)
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      if (brightness > 180) {
        const boost = (brightness - 180) / 75;
        r = Math.min(255, r + (255 - r) * boost);
        g = Math.min(255, g + (255 - g) * boost);
        b = Math.min(255, b + (255 - b) * boost);
      }

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }
  } else if (filter === 'contrast') {
    const factor = (259 * (128 + 50)) / (255 * (259 - 50));
    for (let i = 0; i < len; i += 4) {
      data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
      data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
      data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Rotates an image on a new canvas and returns it as a dataURL
 */
export function rotateImageCanvas(
  sourceCanvas: HTMLCanvasElement,
  angleDegrees: number
): HTMLCanvasElement {
  const newCanvas = document.createElement('canvas');
  const ctx = newCanvas.getContext('2d');
  if (!ctx) return sourceCanvas;

  const radians = (angleDegrees * Math.PI) / 180;
  const is90or270 = Math.abs(angleDegrees % 180) === 90;

  newCanvas.width = is90or270 ? sourceCanvas.height : sourceCanvas.width;
  newCanvas.height = is90or270 ? sourceCanvas.width : sourceCanvas.height;

  ctx.translate(newCanvas.width / 2, newCanvas.height / 2);
  ctx.rotate(radians);
  ctx.drawImage(sourceCanvas, -sourceCanvas.width / 2, -sourceCanvas.height / 2);

  return newCanvas;
}
