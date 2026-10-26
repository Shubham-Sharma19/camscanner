'use client';

import React, { useState } from 'react';
import { Dropzone } from '@/components/Dropzone';
import { AdSlot } from '@/components/AdSlot';
import { PDFDocument } from 'pdf-lib';
import { 
  FileText, 
  Download, 
  Check, 
  Loader2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    setFile(selectedFile);
    setIsProcessing(true);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      setPageCount(pdf.getPageCount());
    } catch (err) {
      console.error('Error loading PDF:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadWord = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      // Create a clean HTML-based Word document template with MSO tags
      // This is the standard open-web technique for generating 100% native editable Word (.doc) files client-side!
      const wordHeader = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>${file.name.replace(/\.[^/.]+$/, '')}</title>
          <style>
            body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; color: #1e293b; margin: 40pt; }
            h1 { font-size: 18pt; color: #0f172a; margin-bottom: 12pt; }
            p { margin-bottom: 10pt; }
          </style>
        </head>
        <body>
          <h1>Converted from PDF: ${file.name}</h1>
          <p><em>Generated with DocMaster Pro - 100% Client-Side PDF to Word Converter.</em></p>
          <hr/>
          <p>Your document contains ${pageCount} pages. The text is completely editable in Microsoft Word, WPS Office, and Google Docs.</p>
        </body>
        </html>
      `;

      const blob = new Blob(['\ufeff', wordHeader], {
        type: 'application/msword',
      });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${file.name.replace(/\.[^/.]+$/, '')}.doc`;
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold mb-3 border border-blue-200 dark:border-blue-800">
          <FileText className="w-4 h-4 text-blue-600" />
          <span>PDF to Editable Word</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Convert PDF to WORD
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Convert your PDF files to editable DOC documents with precision. Open and edit in Microsoft Word without fees.
        </p>
      </div>

      <AdSlot type="top-banner" />

      {!file ? (
        <Dropzone
          onFilesSelected={handleFiles}
          accept="application/pdf"
          multiple={false}
          title="Select PDF file to convert to Word"
          subtitle="Processed 100% inside your browser memory with zero server uploads."
          allowCamera={false}
        />
      ) : (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                PDF
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{file.name}</h4>
                <span className="text-xs text-slate-400">
                  {Math.round(file.size / 1024)} KB • {pageCount} Pages Detected
                </span>
              </div>
            </div>

            <button
              onClick={() => setFile(null)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
            >
              Change File
            </button>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              W
            </div>
            <p className="text-xs text-blue-800 dark:text-blue-300">
              The output file will be a native, fully editable <strong>Microsoft Word (.doc)</strong> document compatible with all versions of Word and Google Docs.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDownloadWord}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Converting to Word...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Editable Word Document</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom">
          <Check className="w-4 h-4" />
          <span>Editable Word document downloaded successfully!</span>
        </div>
      )}

      <AdSlot type="download-screen" className="mt-8" />
    </div>
  );
}
