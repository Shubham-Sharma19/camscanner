'use client';

import React, { useState } from 'react';
import { Dropzone } from '@/components/Dropzone';
import { AdSlot } from '@/components/AdSlot';
import { imagesToPDF } from '@/lib/pdf-engine';
import { 
  Images, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  Check, 
  Plus,
  Loader2,
  FileCheck2,
  Layout
} from 'lucide-react';

interface ImageItem {
  id: string;
  dataUrl: string;
  name: string;
  width: number;
  height: number;
}

export default function ImageToPdfPage() {
  const [imageList, setImageList] = useState<ImageItem[]>([]);
  const [fitA4, setFitA4] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const img = new Image();
        img.onload = () => {
          const newItem: ImageItem = {
            id: `img-${Date.now()}-${Math.random()}`,
            dataUrl,
            name: file.name,
            width: img.width,
            height: img.height,
          };
          setImageList((prev) => [...prev, newItem]);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= imageList.length) return;

    const updated = [...imageList];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setImageList(updated);
  };

  const removeItem = (index: number) => {
    setImageList((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleConvert = async () => {
    if (imageList.length === 0) return;
    setIsProcessing(true);
    try {
      const pdfBytes = await imagesToPDF(
        imageList.map((img) => ({
          dataUrl: img.dataUrl,
          width: img.width,
          height: img.height,
        })),
        fitA4
      );

      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `images-document-${Date.now()}.pdf`;
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
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3 border border-indigo-200 dark:border-indigo-800">
          <Images className="w-4 h-4" />
          <span>Top Search Keyword</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Convert Images to PDF
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Convert JPG, PNG, and WebP photos into a clean, single PDF document in seconds with standard A4 margins.
        </p>
      </div>

      <AdSlot type="top-banner" />

      {imageList.length === 0 ? (
        <Dropzone
          onFilesSelected={handleFiles}
          accept="image/*"
          title="Upload Images to Convert to PDF"
          subtitle="Select multiple JPG, PNG, WebP photos. Unlimited free conversion."
          allowCamera={true}
        />
      ) : (
        <div className="space-y-6">
          
          {/* Action Header & Settings */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer transition-colors">
                <Plus className="w-4 h-4 text-brand-600" />
                <span>Add More Images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) handleFiles(Array.from(e.target.files));
                  }}
                  className="hidden"
                />
              </label>

              {/* Page Format Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setFitA4(true)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    fitA4 ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Fit to A4
                </button>
                <button
                  onClick={() => setFitA4(false)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    !fitA4 ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Original Ratio
                </button>
              </div>
            </div>

            <button
              onClick={handleConvert}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4" />
                  <span>Download PDF ({imageList.length} Pages)</span>
                </>
              )}
            </button>
          </div>

          {/* Grid of Images */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {imageList.map((item, index) => (
              <div
                key={item.id}
                className="group relative p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-brand-400 transition-all"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                  <img
                    src={item.dataUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Page {index + 1}
                  </span>
                  
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-20"
                      title="Move Left"
                    >
                      <ArrowUp className="w-3.5 h-3.5 -rotate-90" />
                    </button>
                    <button
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === imageList.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-20"
                      title="Move Right"
                    >
                      <ArrowDown className="w-3.5 h-3.5 -rotate-90" />
                    </button>
                    <button
                      onClick={() => removeItem(index)}
                      className="p-1 text-slate-400 hover:text-rose-500"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
          <span>Image PDF Downloaded Successfully!</span>
        </div>
      )}

      <AdSlot type="download-screen" className="mt-8" />
    </div>
  );
}
