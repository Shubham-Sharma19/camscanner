'use client';

import React, { useState } from 'react';
import { Dropzone } from '@/components/Dropzone';
import { AdSlot } from '@/components/AdSlot';
import { addWatermarkToPDF } from '@/lib/pdf-engine';
import { 
  Stamp, 
  Download, 
  Check, 
  Loader2, 
  Sparkles 
} from 'lucide-react';

export default function WatermarkPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleWatermark = async () => {
    if (!file || !watermarkText) return;
    setIsProcessing(true);

    try {
      const pdfBytes = await addWatermarkToPDF(file, watermarkText);
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `watermarked-${file.name}`;
      link.click();

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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold mb-3 border border-rose-200 dark:border-rose-800">
          <Stamp className="w-4 h-4 text-rose-500" />
          <span>Stamp & Watermark</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Add Watermark to PDF
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Stamp an official watermark over your PDF documents. Choose text like CONFIDENTIAL, PAID, or your company name.
        </p>
      </div>

      <AdSlot type="top-banner" />

      {!file ? (
        <Dropzone
          onFilesSelected={(files) => files.length > 0 && setFile(files[0])}
          accept="application/pdf"
          multiple={false}
          title="Select PDF file to add watermark"
          subtitle="Processed 100% locally with zero server upload."
          allowCamera={false}
        />
      ) : (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{file.name}</h4>
              <span className="text-xs text-slate-400">{Math.round(file.size / 1024)} KB</span>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
            >
              Change File
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Watermark Text
            </label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value.toUpperCase())}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold uppercase tracking-widest text-slate-900 dark:text-white"
              placeholder="e.g. CONFIDENTIAL, DRAFT, PAID"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {['CONFIDENTIAL', 'DRAFT', 'PAID', 'DO NOT COPY', 'SAMPLE'].map((txt) => (
                <button
                  key={txt}
                  type="button"
                  onClick={() => setWatermarkText(txt)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                >
                  {txt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleWatermark}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition-all flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Stamping Watermark...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Watermarked PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom">
          <Check className="w-4 h-4" />
          <span>Watermarked PDF Downloaded Successfully!</span>
        </div>
      )}

      <AdSlot type="download-screen" className="mt-8" />
    </div>
  );
}
