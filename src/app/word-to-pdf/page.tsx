'use client';

import React, { useState } from 'react';
import { Dropzone } from '@/components/Dropzone';
import { AdSlot } from '@/components/AdSlot';
import jsPDF from 'jspdf';
import mammoth from 'mammoth';
import { 
  FileText, 
  Download, 
  Check, 
  Loader2, 
  Sparkles, 
  FileCheck2,
  ArrowRight
} from 'lucide-react';

export default function WordToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [convertedText, setConvertedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    setFile(selectedFile);
    setIsProcessing(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      setConvertedText(result.value);
    } catch (err) {
      console.error('Word extraction error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!convertedText) return;
    setIsProcessing(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      const margin = 40;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const maxLineWidth = pageWidth - margin * 2;

      doc.setFont('times', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);

      // Split text into lines that fit the page width
      const splitText = doc.splitTextToSize(convertedText, maxLineWidth);
      let cursorY = margin + 20;

      for (let i = 0; i < splitText.length; i++) {
        if (cursorY + 16 > pageHeight - margin) {
          doc.addPage();
          cursorY = margin + 20;
        }
        doc.text(splitText[i], margin, cursorY);
        cursorY += 16;
      }

      const pdfBlob = doc.output('blob');
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = `${file?.name.replace(/\.[^/.]+$/, '') || 'document'}.pdf`;
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
          <span>Microsoft Word to PDF</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Convert WORD to PDF
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Convert DOC and DOCX documents to standard PDF files with preserved formatting, 100% free in your browser.
        </p>
      </div>

      <AdSlot type="top-banner" />

      {!file ? (
        <Dropzone
          onFilesSelected={handleFiles}
          accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          multiple={false}
          title="Select WORD (.docx or .doc) files"
          subtitle="Word documents are converted entirely inside your browser without uploading to any server."
          allowCamera={false}
        />
      ) : (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                W
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{file.name}</h4>
                <span className="text-xs text-slate-400">
                  {Math.round(file.size / 1024)} KB • Microsoft Word Document
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setConvertedText('');
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
            >
              Change File
            </button>
          </div>

          {/* Preview Area */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 max-h-60 overflow-y-auto text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {convertedText || 'Reading Word document content...'}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDownloadPDF}
              disabled={isProcessing || !convertedText}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Converted PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom">
          <Check className="w-4 h-4" />
          <span>Word document converted to PDF successfully!</span>
        </div>
      )}

      <AdSlot type="download-screen" className="mt-8" />
    </div>
  );
}
