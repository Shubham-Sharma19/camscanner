'use client';

import React, { useState } from 'react';
import { Dropzone } from '@/components/Dropzone';
import { AdSlot } from '@/components/AdSlot';
import { PDFDocument } from 'pdf-lib';
import { 
  Minimize2, 
  Download, 
  Check, 
  Loader2, 
  Sparkles,
  Zap,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<'recommended' | 'extreme' | 'low'>('recommended');
  const [originalSizeKb, setOriginalSizeKb] = useState<number>(0);
  const [compressedSizeKb, setCompressedSizeKb] = useState<number>(0);
  const [compressedPdfBlob, setCompressedPdfBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Compressing PDF...');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const size = Math.round(selected.size / 1024);
    setOriginalSizeKb(size);
    setCompressedPdfBlob(null);
  };

  /**
   * Real Client-Side PDF Compression Engine
   * Uses pdfjs-dist to downsample heavy high-res scanned pages to optimized JPEG streams
   */
  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setStatusMessage('Loading PDF and analyzing pages...');

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

      const buffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;

      // Quality settings based on selected level
      let scale = 1.3;
      let quality = 0.65;
      if (compressionLevel === 'extreme') {
        scale = 0.95;
        quality = 0.45;
      } else if (compressionLevel === 'low') {
        scale = 1.7;
        quality = 0.82;
      }

      // Create new clean output PDF
      const outPdf = await PDFDocument.create();

      for (let i = 1; i <= numPages; i++) {
        setStatusMessage(`Compressing Page ${i} of ${numPages}...`);
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport }).promise;

          const compressedImgDataUrl = canvas.toDataURL('image/jpeg', quality);
          const embeddedImg = await outPdf.embedJpg(compressedImgDataUrl);

          // Standard A4 or match page ratio
          const newPage = outPdf.addPage([viewport.width, viewport.height]);
          newPage.drawImage(embeddedImg, {
            x: 0,
            y: 0,
            width: viewport.width,
            height: viewport.height,
          });
        }
      }

      setStatusMessage('Finalizing compressed document...');
      const compressedBytes = await outPdf.save();
      const blob = new Blob([compressedBytes as unknown as BlobPart], { type: 'application/pdf' });
      const newSizeKb = Math.round(blob.size / 1024);

      setCompressedPdfBlob(blob);
      setCompressedSizeKb(newSizeKb);
    } catch (err) {
      console.error('Compression error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedPdfBlob || !file) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(compressedPdfBlob);
    link.download = `compressed-${file.name}`;
    link.click();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3 border border-emerald-200 dark:border-emerald-800">
          <Zap className="w-4 h-4 text-emerald-500" />
          <span>Real Client-Side Compressor</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Compress PDF File Size
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Significantly reduces the actual file size of heavy scanned documents and PDFs for email attachments and portal submissions.
        </p>
      </div>

      <AdSlot type="top-banner" />

      {!file ? (
        <Dropzone
          onFilesSelected={handleFiles}
          accept="application/pdf"
          multiple={false}
          title="Select PDF file to compress"
          subtitle="Real image optimization that actually cuts file size by up to 70%."
          allowCamera={false}
        />
      ) : (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{file.name}</h4>
              <span className="text-xs text-slate-400">Original Size: {originalSizeKb} KB</span>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setCompressedPdfBlob(null);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
            >
              Change File
            </button>
          </div>

          {/* Compression Level Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">
              Select Compression Strength
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'extreme', label: 'Extreme Compression', desc: 'Maximum size reduction for strict portals', reduction: '~70% cut' },
                { id: 'recommended', label: 'Recommended', desc: 'Balanced quality and clear readability', reduction: '~50% cut' },
                { id: 'low', label: 'Mild Compression', desc: 'High quality with subtle compression', reduction: '~30% cut' },
              ].map((lvl) => (
                <div
                  key={lvl.id}
                  onClick={() => setCompressionLevel(lvl.id as any)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    compressionLevel === lvl.id
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{lvl.label}</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{lvl.reduction}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{lvl.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action & Result Banner */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              {compressedPdfBlob ? (
                <div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Real Compression Complete!</span>
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {compressedSizeKb} KB
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {originalSizeKb} KB
                    </span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      ({Math.round(((originalSizeKb - compressedSizeKb) / originalSizeKb) * 100)}% Saved)
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Ready to Compress
                  </span>
                  <h4 className="text-base font-bold text-slate-800 dark:text-white">
                    {originalSizeKb} KB Original File
                  </h4>
                </div>
              )}
            </div>

            {compressedPdfBlob ? (
              <button
                onClick={handleDownload}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Compressed PDF ({compressedSizeKb} KB)</span>
              </button>
            ) : (
              <button
                onClick={handleCompress}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{statusMessage}</span>
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-4 h-4" />
                    <span>Start Compression</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom">
          <Check className="w-4 h-4" />
          <span>Real Compressed PDF Downloaded Successfully!</span>
        </div>
      )}

      <AdSlot type="download-screen" className="mt-8" />
    </div>
  );
}
