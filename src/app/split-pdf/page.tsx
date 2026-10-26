'use client';

import React, { useState } from 'react';
import { Dropzone } from '@/components/Dropzone';
import { AdSlot } from '@/components/AdSlot';
import { splitPDF, getPDFPageCount } from '@/lib/pdf-engine';
import { 
  Scissors, 
  Download, 
  Check, 
  Loader2, 
  Sparkles,
  FileCheck2
} from 'lucide-react';

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [selectedPagesStr, setSelectedPagesStr] = useState<string>('1-2');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    try {
      const count = await getPDFPageCount(selected);
      setPageCount(count);
      setSelectedPagesStr(count > 1 ? `1-${Math.min(count, 2)}` : '1');
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Parse range string like "1-3, 5, 8-10" into [1, 2, 3, 5, 8, 9, 10]
   */
  const parsePageNumbers = (str: string, max: number): number[] => {
    const pagesSet = new Set<number>();
    const parts = str.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map((n) => parseInt(n.trim(), 10));
        if (!isNaN(start) && !isNaN(end)) {
          for (let p = Math.max(1, start); p <= Math.min(max, end); p++) {
            pagesSet.add(p);
          }
        }
      } else {
        const p = parseInt(trimmed, 10);
        if (!isNaN(p) && p >= 1 && p <= max) {
          pagesSet.add(p);
        }
      }
    }

    return Array.from(pagesSet).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const pagesToExtract = parsePageNumbers(selectedPagesStr, pageCount);
      if (pagesToExtract.length === 0) {
        alert('Please enter valid page numbers to extract.');
        setIsProcessing(false);
        return;
      }

      const splitBytes = await splitPDF(file, pagesToExtract);
      const blob = new Blob([splitBytes as unknown as BlobPart], { type: 'application/pdf' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `extracted-pages-${file.name}`;
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-xs font-bold mb-3 border border-red-200 dark:border-red-800">
          <Scissors className="w-4 h-4 text-red-500" />
          <span>Organize & Extract PDF</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Split & Extract Pages from PDF
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Extract specific pages or page ranges from any PDF document into an independent, new PDF file.
        </p>
      </div>

      <AdSlot type="top-banner" />

      {!file ? (
        <Dropzone
          onFilesSelected={handleFiles}
          accept="application/pdf"
          multiple={false}
          title="Select PDF file to split"
          subtitle="Separate individual pages or extract custom page ranges in 1 second."
          allowCamera={false}
        />
      ) : (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{file.name}</h4>
              <span className="text-xs text-slate-400">Total: {pageCount} Pages Available</span>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
            >
              Change File
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Pages to Extract (e.g. 1-3, 5, 8)
            </label>
            <input
              type="text"
              value={selectedPagesStr}
              onChange={(e) => setSelectedPagesStr(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-red-500"
              placeholder="1-3, 5"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Enter specific page numbers separated by commas, or ranges with hyphens.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSplit}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Splitting...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Extract & Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom">
          <Check className="w-4 h-4" />
          <span>Extracted PDF Downloaded Successfully!</span>
        </div>
      )}

      <AdSlot type="download-screen" className="mt-8" />
    </div>
  );
}
