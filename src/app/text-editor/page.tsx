'use client';

import React, { useState } from 'react';
import { Dropzone } from '@/components/Dropzone';
import { TextEditorCanvas } from '@/components/TextEditorCanvas';
import { AdSlot } from '@/components/AdSlot';
import { Sparkles, FilePenLine, Info, CheckCircle2 } from 'lucide-react';

export default function TextEditorPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Tool Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 text-xs font-bold mb-3 border border-brand-200 dark:border-brand-800">
          <Sparkles className="w-4 h-4" />
          <span>🔥 Auto-Font & Ink Color Matching</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Edit Text in Scanned Document / Photo
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Upload any scanned bill, certificate, marksheet, or document photo. Click on any text or number to edit it in the exact same font, ink color, and baseline style.
        </p>
      </div>

      {/* Top Banner Ad Slot */}
      <AdSlot type="top-banner" />

      {/* Main Workspace */}
      {!imageSrc ? (
        <div className="space-y-6">
          <Dropzone
            onFilesSelected={handleFiles}
            accept="image/*"
            multiple={false}
            title="Upload Scanned Image or Document Photo"
            subtitle="JPG, PNG, WebP supported. Your document stays 100% inside your browser."
          />

          {/* Quick Guide */}
          <div className="p-5 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800/60">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-brand-600" />
              <span>How It Works (Under the Hood):</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>1. OCR Auto-Scan:</strong> Locates every character, word position, and line baseline.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>2. Font & Ink Match:</strong> Identifies Serif, Sans, or Typewriter font and samples ink shade.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>3. Seamless Replace:</strong> Inpaints paper background and types new text with natural texture.</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setImageSrc(null)}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              ← Upload a different document
            </button>
          </div>
          <TextEditorCanvas imageSrc={imageSrc} onReset={() => setImageSrc(null)} />
        </div>
      )}

      {/* Download Screen / Contextual Ad */}
      <AdSlot type="download-screen" className="mt-8" />
    </div>
  );
}
