'use client';

import React, { useState } from 'react';
import { Dropzone } from '@/components/Dropzone';
import { AdSlot } from '@/components/AdSlot';
import { mergePDFs, getPDFPageCount } from '@/lib/pdf-engine';
import { 
  Combine, 
  FileText, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  Check, 
  Plus,
  Loader2
} from 'lucide-react';

interface PDFItem {
  id: string;
  file: File;
  name: string;
  sizeKb: number;
  pageCount: number;
}

export default function MergePdfPage() {
  const [pdfList, setPdfList] = useState<PDFItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleFiles = async (files: File[]) => {
    const pdfOnly = files.filter((f) => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    
    for (const file of pdfOnly) {
      try {
        const pages = await getPDFPageCount(file);
        const newItem: PDFItem = {
          id: `pdf-${Date.now()}-${Math.random()}`,
          file,
          name: file.name,
          sizeKb: Math.round(file.size / 1024),
          pageCount: pages,
        };
        setPdfList((prev) => [...prev, newItem]);
      } catch (err) {
        console.error('Error reading PDF:', err);
      }
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pdfList.length) return;

    const updated = [...pdfList];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setPdfList(updated);
  };

  const removeItem = (index: number) => {
    setPdfList((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleMerge = async () => {
    if (pdfList.length < 2) return;
    setIsProcessing(true);
    try {
      const files = pdfList.map((item) => item.file);
      const mergedBytes = await mergePDFs(files);
      const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `merged-document-${Date.now()}.pdf`;
      link.click();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPages = pdfList.reduce((acc, curr) => acc + curr.pageCount, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold mb-3 border border-blue-200 dark:border-blue-800">
          <Combine className="w-4 h-4" />
          <span>iLovePDF Style Toolkit</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Merge Multiple PDF Files
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Combine two or more PDF files into a single organized document. Reorder pages and merge in under 1 second.
        </p>
      </div>

      <AdSlot type="top-banner" />

      {pdfList.length === 0 ? (
        <Dropzone
          onFilesSelected={handleFiles}
          accept="application/pdf"
          title="Upload PDF Files to Merge"
          subtitle="Select 2 or more PDF documents. Files are processed 100% locally."
          allowCamera={false}
        />
      ) : (
        <div className="space-y-6">
          
          {/* Action Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer transition-colors">
                <Plus className="w-4 h-4 text-brand-600" />
                <span>Add More PDFs</span>
                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) handleFiles(Array.from(e.target.files));
                  }}
                  className="hidden"
                />
              </label>
              <span className="text-xs font-semibold text-slate-400">
                {pdfList.length} Files ({totalPages} Total Pages)
              </span>
            </div>

            <button
              onClick={handleMerge}
              disabled={isProcessing || pdfList.length < 2}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Merging PDFs...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Merge & Download PDF</span>
                </>
              )}
            </button>
          </div>

          {/* Files List */}
          <div className="space-y-2.5">
            {pdfList.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-brand-300 transition-colors"
              >
                <div className="flex items-center gap-3 truncate pr-4">
                  <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </h4>
                    <span className="text-xs text-slate-400">
                      {item.sizeKb} KB • {item.pageCount} Pages
                    </span>
                  </div>
                </div>

                {/* Move & Delete Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === pdfList.length - 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeItem(index)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 ml-1"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Success Notification */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom">
          <Check className="w-4 h-4" />
          <span>Merged PDF Downloaded Successfully!</span>
        </div>
      )}

      <AdSlot type="download-screen" className="mt-8" />
    </div>
  );
}
