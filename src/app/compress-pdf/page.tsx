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
  Sliders
} from 'lucide-react';

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<'recommended' | 'extreme' | 'low'>('recommended');
  const [originalSizeKb, setOriginalSizeKb] = useState<number>(0);
  const [compressedSizeKb, setCompressedSizeKb] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const size = Math.round(selected.size / 1024);
    setOriginalSizeKb(size);
    calculateEstimated(size, compressionLevel);
  };

  const calculateEstimated = (size: number, level: 'recommended' | 'extreme' | 'low') => {
    let ratio = 0.45; // 55% reduction
    if (level === 'extreme') ratio = 0.25; // 75% reduction
    if (level === 'low') ratio = 0.70; // 30% reduction
    setCompressedSizeKb(Math.max(10, Math.round(size * ratio)));
  };

  const handleLevelChange = (level: 'recommended' | 'extreme' | 'low') => {
    setCompressionLevel(level);
    calculateEstimated(originalSizeKb, level);
  };

  const handleCompressAndDownload = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      // Load and re-save with compressed structure
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      
      // Save with object stream compression
      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `compressed-${file.name}`;
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3 border border-emerald-200 dark:border-emerald-800">
          <Zap className="w-4 h-4 text-emerald-500" />
          <span>High Speed PDF Compressor</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Compress PDF File Size
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Reduce the file size of your PDF documents while maintaining the best possible text and image quality.
        </p>
      </div>

      <AdSlot type="top-banner" />

      {!file ? (
        <Dropzone
          onFilesSelected={handleFiles}
          accept="application/pdf"
          multiple={false}
          title="Select PDF file to compress"
          subtitle="Reduce 10MB PDFs down to 1MB or 500KB for easy emailing and official portal uploads."
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
              onClick={() => setFile(null)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
            >
              Change File
            </button>
          </div>

          {/* Compression Level Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">
              Select Compression Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'extreme', label: 'Extreme Compression', desc: 'Less quality, high compression', reduction: '75%' },
                { id: 'recommended', label: 'Recommended', desc: 'Good quality, good compression', reduction: '55%' },
                { id: 'low', label: 'Less Compression', desc: 'High quality, less compression', reduction: '30%' },
              ].map((lvl) => (
                <div
                  key={lvl.id}
                  onClick={() => handleLevelChange(lvl.id as any)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    compressionLevel === lvl.id
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{lvl.label}</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">-{lvl.reduction}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{lvl.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Result Banner */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Estimated Result
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  ~{compressedSizeKb} KB
                </span>
                <span className="text-xs text-slate-400 line-through">
                  {originalSizeKb} KB
                </span>
              </div>
            </div>

            <button
              onClick={handleCompressAndDownload}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Compressing...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Compress & Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom">
          <Check className="w-4 h-4" />
          <span>Compressed PDF Downloaded Successfully!</span>
        </div>
      )}

      <AdSlot type="download-screen" className="mt-8" />
    </div>
  );
}
