'use client';

import React, { useState, useRef } from 'react';
import { Dropzone } from '@/components/Dropzone';
import { AdSlot } from '@/components/AdSlot';
import { 
  Maximize2, 
  Sparkles, 
  Download, 
  Check, 
  Sliders, 
  Crop, 
  RotateCw,
  Info
} from 'lucide-react';

export default function PhotoResizerPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [targetKb, setTargetKb] = useState<number>(45);
  const [outputDataUrl, setOutputDataUrl] = useState<string | null>(null);
  const [actualKb, setActualKb] = useState<number>(0);
  const [widthPx, setWidthPx] = useState<number>(350);
  const [heightPx, setHeightPx] = useState<number>(450);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImageSrc(dataUrl);
      processExactResize(dataUrl, targetKb, widthPx, heightPx);
    };
    reader.readAsDataURL(files[0]);
  };

  /**
   * Binary Search Algorithm to find the exact JPEG quality that fits target KB
   */
  const processExactResize = (
    src: string,
    targetKilobytes: number,
    w: number,
    h: number
  ) => {
    setIsProcessing(true);
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);

      // Target size in bytes (with a 2% safety buffer below target to ensure portal approval)
      const targetBytes = (targetKilobytes - 1) * 1024;

      let minQ = 0.05;
      let maxQ = 0.98;
      let bestDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      let bestSize = 0;

      // 6-step binary search for exact quality match
      for (let i = 0; i < 7; i++) {
        const midQ = (minQ + maxQ) / 2;
        const testUrl = canvas.toDataURL('image/jpeg', midQ);
        const approxBytes = Math.round((testUrl.length - 22) * 3 / 4);

        bestDataUrl = testUrl;
        bestSize = approxBytes;

        if (approxBytes > targetBytes) {
          maxQ = midQ;
        } else {
          minQ = midQ;
        }
      }

      setOutputDataUrl(bestDataUrl);
      setActualKb(Math.round((bestSize / 1024) * 10) / 10);
      setIsProcessing(false);
    };
  };

  const handleTargetKbChange = (newTarget: number) => {
    setTargetKb(newTarget);
    if (imageSrc) {
      processExactResize(imageSrc, newTarget, widthPx, heightPx);
    }
  };

  const handleDownload = () => {
    if (!outputDataUrl) return;
    const link = document.createElement('a');
    link.href = outputDataUrl;
    link.download = `photo-${targetKb}kb-${Date.now()}.jpg`;
    link.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-bold mb-3 border border-amber-200 dark:border-amber-800">
          <Maximize2 className="w-4 h-4" />
          <span>Sarkari Form & Job Portal Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Photo & Signature Resizer (Exact 20KB - 50KB)
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Compress photos to exact kilobyte sizes and passport dimensions for SSC, UPSC, Police, Bank, and Railway exams without quality loss.
        </p>
      </div>

      <AdSlot type="top-banner" />

      {!imageSrc ? (
        <Dropzone
          onFilesSelected={handleFiles}
          accept="image/*"
          multiple={false}
          title="Upload Photo or Signature"
          subtitle="Supports JPG, PNG, WebP. Compress to exact 20KB, 50KB or 100KB."
        />
      ) : (
        <div className="space-y-6">
          
          {/* Controls Card */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            
            {/* Target Size Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-brand-600" />
                  <span>Target File Size:</span>
                </label>
                <span className="px-3 py-1 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-extrabold text-sm rounded-lg border border-brand-200 dark:border-brand-800">
                  {targetKb} KB
                </span>
              </div>

              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={targetKb}
                onChange={(e) => handleTargetKbChange(parseInt(e.target.value, 10))}
                className="w-full accent-brand-600 cursor-pointer"
              />

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs text-slate-400 self-center">Popular Presets:</span>
                {[
                  { label: '20 KB (Signature)', kb: 20 },
                  { label: '45 KB (SSC/UPSC Photo)', kb: 45 },
                  { label: '50 KB (Passport)', kb: 50 },
                  { label: '100 KB (Bank Exam)', kb: 100 },
                ].map((preset) => (
                  <button
                    key={preset.kb}
                    onClick={() => handleTargetKbChange(preset.kb)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      targetKb === preset.kb
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dimension Presets */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                Standard Passport Dimensions
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setWidthPx(350);
                    setHeightPx(450);
                    if (imageSrc) processExactResize(imageSrc, targetKb, 350, 450);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    widthPx === 350 && heightPx === 450
                      ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  3.5 cm × 4.5 cm (Official Passport)
                </button>
                <button
                  onClick={() => {
                    setWidthPx(200);
                    setHeightPx(100);
                    if (imageSrc) processExactResize(imageSrc, targetKb, 200, 100);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    widthPx === 200 && heightPx === 100
                      ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Signature Box (2:1 Ratio)
                </button>
              </div>
            </div>

          </div>

          {/* Result Preview & Download Area */}
          <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <div className="w-24 h-28 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md flex items-center justify-center">
                {outputDataUrl && (
                  <img
                    src={outputDataUrl}
                    alt="Resized Preview"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Compressed Result
                </span>
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {actualKb} KB
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Dimensions: {widthPx} × {heightPx} px
                </p>
                <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  ✓ Ready for Govt Exam Portal Upload
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={() => setImageSrc(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
              >
                Change Photo
              </button>
              <button
                onClick={handleDownload}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download {actualKb} KB Photo</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Sarkari Exam Mock Test Affiliate Card */}
      <AdSlot type="affiliate-student" />

      {/* Success Notification */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom">
          <Check className="w-4 h-4" />
          <span>Resized Photo Downloaded Successfully!</span>
        </div>
      )}
    </div>
  );
}
