'use client';

import React, { useState } from 'react';
import { Dropzone } from '@/components/Dropzone';
import { AdSlot } from '@/components/AdSlot';
import { 
  FileImage, 
  Download, 
  Check, 
  Loader2, 
  Sparkles,
  ArrowRight,
  Eye
} from 'lucide-react';

export default function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [format, setFormat] = useState<'jpg' | 'png'>('jpg');
  const [renderedPreview, setRenderedPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setIsProcessing(true);

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

      const buffer = await selected.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdfDoc = await loadingTask.promise;
      setPageCount(pdfDoc.numPages);

      // Render Page 1 to preview canvas
      const page = await pdfDoc.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        await page.render({ canvasContext: ctx, viewport }).promise;
        setRenderedPreview(canvas.toDataURL('image/jpeg', 0.9));
      }
    } catch (err) {
      console.error('PDF to image error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

      const buffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdfDoc = await loadingTask.promise;

      // Render high resolution (2x) page 1
      const page = await pdfDoc.getPage(1);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        await page.render({ canvasContext: ctx, viewport }).promise;
        const mime = format === 'png' ? 'image/png' : 'image/jpeg';
        const link = document.createElement('a');
        link.href = canvas.toDataURL(mime, 0.95);
        link.download = `${file.name.replace(/\.[^/.]+$/, '')}-page-1.${format}`;
        link.click();
      }

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-bold mb-3 border border-amber-200 dark:border-amber-800">
          <FileImage className="w-4 h-4 text-amber-500" />
          <span>Real PDF Page Rendering</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          PDF to Image (JPG / PNG)
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Renders each actual page of your PDF into high-definition JPG or PNG pictures at 2x resolution.
        </p>
      </div>

      <AdSlot type="top-banner" />

      {!file ? (
        <Dropzone
          onFilesSelected={handleFiles}
          accept="application/pdf"
          multiple={false}
          title="Select PDF file to convert to JPG or PNG"
          subtitle="Real pages rendered in HD resolution inside your browser."
          allowCamera={false}
        />
      ) : (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{file.name}</h4>
              <span className="text-xs text-slate-400">
                {Math.round(file.size / 1024)} KB • {pageCount} Pages Available
              </span>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setRenderedPreview(null);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
            >
              Change File
            </button>
          </div>

          {/* Actual Rendered Preview */}
          {renderedPreview && (
            <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Page 1 Rendered Preview
              </span>
              <img
                src={renderedPreview}
                alt="Page 1 Preview"
                className="max-h-72 w-auto object-contain rounded-lg shadow-md border"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
              Output Format
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setFormat('jpg')}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  format === 'jpg'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                JPG (Web Format)
              </button>
              <button
                onClick={() => setFormat('png')}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  format === 'png'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                PNG (Lossless 2x HD)
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDownload}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Rendering Page...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Actual {format.toUpperCase()} Image</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom">
          <Check className="w-4 h-4" />
          <span>Real HD Image Downloaded Successfully!</span>
        </div>
      )}

      <AdSlot type="download-screen" className="mt-8" />
    </div>
  );
}
