'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, Camera, FileUp, Sparkles } from 'lucide-react';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  title?: string;
  subtitle?: string;
  allowCamera?: boolean;
}

export function Dropzone({
  onFilesSelected,
  accept = 'image/*,application/pdf',
  multiple = true,
  title = 'Drag & drop files here',
  subtitle = 'Supports PDF, JPG, PNG, WebP up to 50MB (Processed 100% locally)',
  allowCamera = true,
}: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full rounded-2xl border-2 border-dashed p-8 md:p-12 text-center transition-all ${
        isDragOver
          ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 scale-[1.01]'
          : 'border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/40 hover:border-brand-400 dark:hover:border-brand-600'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
      {allowCamera && (
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      )}

      <div className="flex flex-col items-center justify-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 shadow-inner">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          {subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
          >
            <FileUp className="w-4 h-4" />
            <span>Select Files</span>
          </button>

          {allowCamera && (
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-sm transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700"
            >
              <Camera className="w-4 h-4 text-emerald-500" />
              <span>Take Photo</span>
            </button>
          )}
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Files are processed in your browser memory — 100% private.</span>
        </div>
      </div>
    </div>
  );
}
