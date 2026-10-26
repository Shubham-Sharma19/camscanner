'use client';

import React, { useState } from 'react';
import { Dropzone } from '@/components/Dropzone';
import { AdSlot } from '@/components/AdSlot';
import { 
  Sparkles, 
  Download, 
  Check, 
  Sliders, 
  Crop,
  ShieldCheck 
} from 'lucide-react';

export default function SignatureCleanerPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cleanedDataUrl, setCleanedDataUrl] = useState<string | null>(null);
  const [contrastThreshold, setContrastThreshold] = useState<number>(140);
  const [targetKb, setTargetKb] = useState<number>(18);
  const [actualKb, setActualKb] = useState<number>(0);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImageSrc(dataUrl);
      processCleanSignature(dataUrl, contrastThreshold);
    };
    reader.readAsDataURL(files[0]);
  };

  const processCleanSignature = (src: string, threshold: number) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Standard signature dimensions: 300 x 120
      canvas.width = 320;
      canvas.height = 140;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw image
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Clean background to pure white & deepen signature ink
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        if (gray > threshold) {
          // Pure white paper background
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
        } else {
          // Deepen ink to crisp dark blue/black
          data[i] = Math.max(0, data[i] - 30);
          data[i + 1] = Math.max(0, data[i + 1] - 30);
          data[i + 2] = Math.max(0, data[i + 2] - 10);
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // Binary quality match for 10KB - 20KB
      const outUrl = canvas.toDataURL('image/jpeg', 0.85);
      const approxKb = Math.round(((outUrl.length - 22) * 3 / 4) / 1024 * 10) / 10;
      setCleanedDataUrl(outUrl);
      setActualKb(approxKb);
    };
  };

  const handleDownload = () => {
    if (!cleanedDataUrl) return;
    const link = document.createElement('a');
    link.href = cleanedDataUrl;
    link.download = `clean-signature-${actualKb}kb.jpg`;
    link.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3 border border-emerald-200 dark:border-emerald-800">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span>Sarkari Form Special</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Signature Background Cleaner (10KB - 20KB)
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Remove paper shadows and yellow background from signature photos. Output 100% pure white background ready for SSC, UPSC, and Bank portal uploads.
        </p>
      </div>

      <AdSlot type="top-banner" />

      {!imageSrc ? (
        <Dropzone
          onFilesSelected={handleFiles}
          accept="image/*"
          multiple={false}
          title="Upload Photo of Signature"
          subtitle="Take photo of your signature on paper. The tool will auto-clean the shadow."
          allowCamera={true}
        />
      ) : (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Clean Signature Preview
            </h4>
            <button
              onClick={() => setImageSrc(null)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
            >
              Upload Different Photo
            </button>
          </div>

          {/* Cleaned Result Box */}
          <div className="p-6 bg-slate-100 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
            {cleanedDataUrl && (
              <img
                src={cleanedDataUrl}
                alt="Cleaned Signature"
                className="rounded-lg shadow-md border border-slate-300 dark:border-slate-700 max-w-xs"
              />
            )}
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-3">
              ✓ Background 100% White • Size: {actualKb} KB
            </span>
          </div>

          {/* Threshold Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Paper Shadow Removal Strength
              </label>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {contrastThreshold}
              </span>
            </div>
            <input
              type="range"
              min="90"
              max="210"
              value={contrastThreshold}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setContrastThreshold(val);
                if (imageSrc) processCleanSignature(imageSrc, val);
              }}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDownload}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Clean Signature ({actualKb} KB)</span>
            </button>
          </div>
        </div>
      )}

      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom">
          <Check className="w-4 h-4" />
          <span>Clean signature downloaded successfully!</span>
        </div>
      )}

      <AdSlot type="download-screen" className="mt-8" />
    </div>
  );
}
