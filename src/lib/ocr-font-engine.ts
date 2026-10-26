import { OCRWord } from './types';
import { createWorker } from 'tesseract.js';

/**
 * Samples the exact ink color of text within a bounding box
 */
export function sampleInkColor(
  ctx: CanvasRenderingContext2D,
  bbox: { x0: number; y0: number; x1: number; y1: number }
): string {
  const w = Math.max(1, bbox.x1 - bbox.x0);
  const h = Math.max(1, bbox.y1 - bbox.y0);
  const imgData = ctx.getImageData(bbox.x0, bbox.y0, w, h);
  const data = imgData.data;

  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  let darkPixelCount = 0;

  // Find the dark pixels (strokes of the text)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    // Ink strokes are typically darker than the page background
    if (lum < 160) {
      rSum += r;
      gSum += g;
      bSum += b;
      darkPixelCount++;
    }
  }

  if (darkPixelCount === 0) return '#1a1a1a'; // Default printer black

  const avgR = Math.round(rSum / darkPixelCount);
  const avgG = Math.round(gSum / darkPixelCount);
  const avgB = Math.round(bSum / darkPixelCount);

  return `rgb(${avgR}, ${avgG}, ${avgB})`;
}

/**
 * Samples the background paper color around the perimeter of the bounding box
 */
export function sampleBgColor(
  ctx: CanvasRenderingContext2D,
  bbox: { x0: number; y0: number; x1: number; y1: number }
): string {
  const pad = 3;
  const x0 = Math.max(0, bbox.x0 - pad);
  const y0 = Math.max(0, bbox.y0 - pad);
  const x1 = Math.min(ctx.canvas.width, bbox.x1 + pad);
  const y1 = Math.min(ctx.canvas.height, bbox.y1 + pad);

  const w = Math.max(1, x1 - x0);
  const h = Math.max(1, y1 - y0);
  const imgData = ctx.getImageData(x0, y0, w, h);
  const data = imgData.data;

  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  let lightPixelCount = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    // Background paper is lighter
    if (lum > 150) {
      rSum += r;
      gSum += g;
      bSum += b;
      lightPixelCount++;
    }
  }

  if (lightPixelCount === 0) return '#ffffff';

  const avgR = Math.round(rSum / lightPixelCount);
  const avgG = Math.round(gSum / lightPixelCount);
  const avgB = Math.round(bSum / lightPixelCount);

  return `rgb(${avgR}, ${avgG}, ${avgB})`;
}

/**
 * Run OCR on image/canvas and detect word coordinates and style attributes
 */
export async function performDocumentOCR(
  imageSource: string | HTMLCanvasElement,
  onProgress?: (progress: number) => void
): Promise<OCRWord[]> {
  const worker = await createWorker('eng');

  // Let Tesseract analyze document
  const ret = await worker.recognize(imageSource);
  await worker.terminate();

  // Create temporary canvas to sample colors if imageSource is a string
  let sampleCtx: CanvasRenderingContext2D | null = null;
  if (typeof imageSource === 'string') {
    const img = new Image();
    img.src = imageSource;
    await new Promise((res) => (img.onload = res));
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    sampleCtx = c.getContext('2d');
    sampleCtx?.drawImage(img, 0, 0);
  } else {
    sampleCtx = imageSource.getContext('2d');
  }

  const words: OCRWord[] = [];
  const recognizedWords = (ret.data as any).words || [];

  recognizedWords.forEach((w: any, index: number) => {
    const text = w.text?.trim();
    if (!text) return;

    const bbox = {
      x0: Math.round(w.bbox.x0),
      y0: Math.round(w.bbox.y0),
      x1: Math.round(w.bbox.x1),
      y1: Math.round(w.bbox.y1),
    };

    const h = bbox.y1 - bbox.y0;
    const fontSize = Math.max(10, Math.round(h * 0.82));

    const fontColor = sampleCtx ? sampleInkColor(sampleCtx, bbox) : '#222222';
    const bgColor = sampleCtx ? sampleBgColor(sampleCtx, bbox) : '#ffffff';

    // Heuristic font classification
    let fontFamily: 'serif' | 'sans-serif' | 'monospace' = 'sans-serif';
    if (w.font_name && /times|georgia|garamond|serif/i.test(w.font_name)) {
      fontFamily = 'serif';
    } else if (w.font_name && /courier|mono|consolas/i.test(w.font_name)) {
      fontFamily = 'monospace';
    }

    words.push({
      id: `w-${index}-${Date.now()}`,
      text,
      bbox,
      confidence: w.confidence || 90,
      fontSize,
      fontFamily,
      fontColor,
      bgColor,
      isBold: w.is_bold || false,
      isItalic: w.is_italic || false,
    });
  });

  return words;
}

/**
 * Replace a word on the canvas with matching font, background inpainting, and color
 */
export function replaceWordOnCanvas(
  ctx: CanvasRenderingContext2D,
  word: OCRWord,
  newText: string,
  overrides?: {
    fontFamily?: 'serif' | 'sans-serif' | 'monospace';
    fontSize?: number;
    fontColor?: string;
    bgColor?: string;
    isBold?: boolean;
  }
): void {
  const { bbox } = word;
  const paddingX = 2;
  const paddingY = 2;

  const bg = overrides?.bgColor || word.bgColor;
  const color = overrides?.fontColor || word.fontColor;
  const family = overrides?.fontFamily || word.fontFamily;
  const size = overrides?.fontSize || word.fontSize;
  const bold = overrides?.isBold !== undefined ? overrides.isBold : word.isBold;

  // 1. Inpaint / Erase the old word with exact background color
  ctx.fillStyle = bg;
  ctx.fillRect(
    bbox.x0 - paddingX,
    bbox.y0 - paddingY,
    bbox.x1 - bbox.x0 + paddingX * 2,
    bbox.y1 - bbox.y0 + paddingY * 2
  );

  // 2. Map font family to clean system / web font
  let resolvedFont = 'Arial, sans-serif';
  if (family === 'serif') {
    resolvedFont = '"Times New Roman", Times, Georgia, serif';
  } else if (family === 'monospace') {
    resolvedFont = '"Courier New", Courier, monospace';
  }

  // 3. Draw replacement text
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${bold ? 'bold ' : ''}${size}px ${resolvedFont}`;
  ctx.textBaseline = 'bottom';

  // Draw exactly at the baseline
  ctx.fillText(newText, bbox.x0, bbox.y1 - 1);
  ctx.restore();
}
