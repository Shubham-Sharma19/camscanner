'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Dropzone } from '@/components/Dropzone';
import { AdSlot } from '@/components/AdSlot';
import { applyScannerFilter, ScannerFilterType } from '@/lib/scanner-engine';
import { imagesToPDF } from '@/lib/pdf-engine';
import { 
  Camera, 
  Sparkles, 
  Plus, 
  Trash2, 
  Download, 
  FileCheck2, 
  RotateCw, 
  Check, 
  ArrowLeft,
  Layers,
  Wand2
} from 'lucide-react';

interface ScannedPage {
  id: string;
  originalDataUrl: string;
  filteredDataUrl: string;
  width: number;
  height: number;
  rotation: number;
  filter: ScannerFilterType;
}

export default function ScannerPage() {
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<ScannerFilterType>('magic');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Hidden working canvas for filter processing
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // When files are added
  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const img = new Image();
        img.onload = () => {
          const newPage: ScannedPage = {
            id: `page-${Date.now()}-${Math.random()}`,
            originalDataUrl: dataUrl,
            filteredDataUrl: dataUrl,
            width: img.width,
            height: img.height,
            rotation: 0,
            filter: 'magic',
          };
          setPages((prev) => [...prev, newPage]);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  };

  // Re-run filter on the currently selected page
  const updatePageFilter = (filterType: ScannerFilterType) => {
    if (pages.length === 0) return;
    setActiveFilter(filterType);

    const currentPage = pages[selectedPageIndex];
    if (!currentPage) return;

    const img = new Image();
    img.src = currentPage.originalDataUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      applyScannerFilter(ctx, canvas.width, canvas.height, filterType);

      const filteredUrl = canvas.toDataURL('image/jpeg', 0.92);

      setPages((prev) =>
        prev.map((p, idx) =>
          idx === selectedPageIndex
            ? { ...p, filter: filterType, filteredDataUrl: filteredUrl }
            : p
        )
      );
    };
  };

  // Apply default magic filter when a new page is loaded
  useEffect(() => {
    if (pages.length > 0 && pages[selectedPageIndex]?.filter === 'magic' && pages[selectedPageIndex]?.filteredDataUrl === pages[selectedPageIndex]?.originalDataUrl) {
      updatePageFilter('magic');
    }
  }, [pages.length, selectedPageIndex]);

  // Remove a page
  const removePage = (indexToRemove: number) => {
    setPages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    if (selectedPageIndex >= indexToRemove && selectedPageIndex > 0) {
      setSelectedPageIndex((prev) => prev - 1);
    }
  };

  // Export all pages to single PDF
  const handleExportPDF = async () => {
    if (pages.length === 0) return;
    setIsProcessing(true);
    try {
      const imagesPayload = pages.map((p) => ({
        dataUrl: p.filteredDataUrl,
        width: p.width,
        height: p.height,
      }));

      const pdfBytes = await imagesToPDF(imagesPayload, true);
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `scanned-document-${Date.now()}.pdf`;
      link.click();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const activePage = pages[selectedPageIndex];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3 border border-emerald-200 dark:border-emerald-800">
          <Camera className="w-4 h-4" />
          <span>CamScanner Web Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Smart Document Scanner
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Scan pages with your camera, apply Magic Color or Xerox B&W filters, combine multiple pages, and export to a crystal-clear PDF.
        </p>
      </div>

      <AdSlot type="top-banner" />

      {pages.length === 0 ? (
        <Dropzone
          onFilesSelected={handleFiles}
          title="Take Photo or Upload Document"
          subtitle="Click 'Take Photo' on your mobile to use the live camera, or upload pictures."
          allowCamera={true}
        />
      ) : (
        <div className="space-y-6">
          
          {/* Top Actions: Add Next Page & Export */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer transition-colors">
                <Plus className="w-4 h-4 text-emerald-500" />
                <span>Add Next Page</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) handleFiles(Array.from(e.target.files));
                  }}
                  className="hidden"
                />
              </label>

              <span className="text-xs font-semibold text-slate-400">
                {pages.length} {pages.length === 1 ? 'Page' : 'Pages'} Scanned
              </span>
            </div>

            <button
              onClick={handleExportPDF}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{isProcessing ? 'Generating PDF...' : 'Download Combined PDF'}</span>
            </button>
          </div>

          {/* Main Scanner Workspace Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left: Pages Thumbnail Reel */}
            <div className="lg:col-span-1 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>Document Pages</span>
              </h4>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {pages.map((p, idx) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPageIndex(idx)}
                    className={`relative group p-2 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPageIndex === idx
                        ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="aspect-[3/4] overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <img
                        src={p.filteredDataUrl}
                        alt={`Page ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="mt-1.5 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        Page {idx + 1}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removePage(idx);
                        }}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                        title="Delete page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Active Page Preview & Filter Controls */}
            <div className="lg:col-span-3 space-y-4">
              
              {/* Filter Toolbar */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 shadow-xs">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 pl-2">
                  <Wand2 className="w-4 h-4 text-brand-600" />
                  <span>Scanner Filters:</span>
                </span>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'magic', label: 'Magic Color' },
                    { id: 'bw', label: 'B&W Xerox' },
                    { id: 'grayscale', label: 'Grayscale' },
                    { id: 'contrast', label: 'Sharp Contrast' },
                    { id: 'original', label: 'Original' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => updatePageFilter(f.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        activePage?.filter === f.id
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Image Canvas Display */}
              <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/50 p-4 min-h-[480px] flex items-center justify-center overflow-auto shadow-inner">
                {activePage ? (
                  <img
                    src={activePage.filteredDataUrl}
                    alt="Active Scanned Preview"
                    className="max-h-[600px] w-auto object-contain rounded-lg shadow-md border border-slate-300 dark:border-slate-700"
                  />
                ) : (
                  <p className="text-xs text-slate-400">No page selected</p>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Success Notification */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom">
          <Check className="w-4 h-4" />
          <span>Scanned PDF Downloaded Successfully!</span>
        </div>
      )}

      <AdSlot type="download-screen" className="mt-8" />
    </div>
  );
}
