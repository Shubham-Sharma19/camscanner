import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

/**
 * Merge multiple PDF files into one single PDF document
 */
export async function mergePDFs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

/**
 * Split / Extract selected pages from a PDF document
 */
export async function splitPDF(file: File, selectedPageNumbers: number[]): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(arrayBuffer);
  const outPdf = await PDFDocument.create();

  // Convert 1-indexed to 0-indexed page indices
  const indices = selectedPageNumbers
    .map((num) => num - 1)
    .filter((idx) => idx >= 0 && idx < srcPdf.getPageCount());

  const copiedPages = await outPdf.copyPages(srcPdf, indices);
  copiedPages.forEach((page) => outPdf.addPage(page));

  return await outPdf.save();
}

/**
 * Rotate all or selected pages in a PDF document
 */
export async function rotatePDF(file: File, angleDegrees: number): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();

  pages.forEach((page) => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + angleDegrees) % 360));
  });

  return await pdf.save();
}

/**
 * Convert multiple image Data URLs into a professional single PDF
 */
export async function imagesToPDF(
  images: { dataUrl: string; width: number; height: number }[],
  fitA4: boolean = true
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (const imgItem of images) {
    let embeddedImg;
    if (imgItem.dataUrl.startsWith('data:image/png')) {
      embeddedImg = await pdfDoc.embedPng(imgItem.dataUrl);
    } else {
      embeddedImg = await pdfDoc.embedJpg(imgItem.dataUrl);
    }

    if (fitA4) {
      // Standard A4 dimensions in points: 595.28 x 841.89
      const a4Width = 595.28;
      const a4Height = 841.89;
      const page = pdfDoc.addPage([a4Width, a4Height]);

      // Calculate scale to fit with margin
      const margin = 20;
      const maxWidth = a4Width - margin * 2;
      const maxHeight = a4Height - margin * 2;
      const imgRatio = embeddedImg.width / embeddedImg.height;

      let drawWidth = maxWidth;
      let drawHeight = maxWidth / imgRatio;

      if (drawHeight > maxHeight) {
        drawHeight = maxHeight;
        drawWidth = maxHeight * imgRatio;
      }

      const x = (a4Width - drawWidth) / 2;
      const y = (a4Height - drawHeight) / 2;

      page.drawImage(embeddedImg, {
        x,
        y,
        width: drawWidth,
        height: drawHeight,
      });
    } else {
      // Custom page size matching exact image dimensions
      const page = pdfDoc.addPage([embeddedImg.width, embeddedImg.height]);
      page.drawImage(embeddedImg, {
        x: 0,
        y: 0,
        width: embeddedImg.width,
        height: embeddedImg.height,
      });
    }
  }

  return await pdfDoc.save();
}

/**
 * Add Watermark text diagonally across each page of a PDF
 */
export async function addWatermarkToPDF(file: File, watermarkText: string): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();
    const fontSize = 48;
    const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);

    page.drawText(watermarkText, {
      x: width / 2 - textWidth / 2,
      y: height / 2,
      size: fontSize,
      font,
      color: rgb(0.7, 0.7, 0.7),
      opacity: 0.35,
      rotate: degrees(45),
    });
  }

  return await pdfDoc.save();
}

/**
 * Add Page Numbers at the bottom center of each page
 */
export async function addPageNumbersToPDF(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const total = pages.length;

  for (let i = 0; i < total; i++) {
    const page = pages[i];
    const { width } = page.getSize();
    const text = `Page ${i + 1} of ${total}`;
    const fontSize = 10;
    const textWidth = font.widthOfTextAtSize(text, fontSize);

    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: 20,
      size: fontSize,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
  }

  return await pdfDoc.save();
}

/**
 * Get total page count of a PDF file
 */
export async function getPDFPageCount(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  return pdfDoc.getPageCount();
}
