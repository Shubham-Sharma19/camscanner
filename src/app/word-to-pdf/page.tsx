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
  AlertCircle
} from 'lucide-react';

export default function WordToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [convertedText, setConvertedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const extractTextFromHtmlDoc = (htmlStr: string): string => {
    // Strip styles, scripts, comments and xml
    const cleaned = htmlStr
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<xml[\s\S]*?<\/xml>/gi, '')
      .replace(/<!--[\s\S]*?-->/gi, '')
      .replace(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi, '\n\n## $1\n\n')
      .replace(/<h[4-6][^>]*>(.*?)<\/h[4-6]>/gi, '\n\n### $1\n\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '\n• $1')
      .replace(/<div[^>]*>(.*?)<\/div>/gi, '\n$1\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return cleaned;
  };

  const extractTextFromBinaryDoc = (buffer: ArrayBuffer): string => {
    // Fallback for legacy binary Word 97-2003 OLE2 documents
    const uint8 = new Uint8Array(buffer);
    let extracted = '';
    let currentWord = '';

    for (let i = 0; i < uint8.length; i++) {
      const code = uint8[i];
      // Printable ASCII characters
      if ((code >= 32 && code <= 126) || code === 10 || code === 13) {
        currentWord += String.fromCharCode(code);
      } else {
        if (currentWord.trim().length > 3) {
          extracted += currentWord + ' ';
        }
        currentWord = '';
      }
    }
    return extracted.replace(/\s+/g, ' ').trim();
  };

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    setFile(selectedFile);
    setIsProcessing(true);
    setErrorMessage(null);
    setConvertedText('');

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      let extracted = '';

      const fileName = selectedFile.name.toLowerCase();

      // Case 1: Try text-based HTML Word (.doc generated from HTML or Word OpenXML)
      const textDecoder = new TextDecoder('utf-8', { fatal: false });
      const rawText = textDecoder.decode(arrayBuffer);

      if (rawText.includes('<html') || rawText.includes('<w:WordDocument') || rawText.includes('xmlns:w=')) {
        extracted = extractTextFromHtmlDoc(rawText);
      } else if (fileName.endsWith('.docx')) {
        // Case 2: Standard .docx OpenXML ZIP package
        try {
          const result = await mammoth.extractRawText({ arrayBuffer });
          extracted = result.value.trim();
        } catch (docxErr) {
          console.warn('Mammoth failed on .docx, falling back:', docxErr);
          extracted = extractTextFromHtmlDoc(rawText);
        }
      } else {
        // Case 3: Binary .doc Word format
        try {
          const result = await mammoth.extractRawText({ arrayBuffer });
          extracted = result.value.trim();
        } catch {
          extracted = extractTextFromBinaryDoc(arrayBuffer);
        }
      }

      if (!extracted || extracted.length < 5) {
        extracted = extractTextFromHtmlDoc(rawText) || extractTextFromBinaryDoc(arrayBuffer);
      }

      if (!extracted || extracted.trim().length === 0) {
        setErrorMessage('Could not extract readable text from this Word document. Please ensure it is not password-protected.');
      } else {
        setConvertedText(extracted);
      }
    } catch (err: any) {
      console.error('Word extraction error:', err);
      setErrorMessage(err?.message || 'Error reading Word document. Please try another file.');
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

      const margin = 45;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const maxLineWidth = pageWidth - margin * 2;

      let cursorY = margin + 20;

      // Split document into lines
      const paragraphs = convertedText.split(/\n+/);

      for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
        const para = paragraphs[pIdx].trim();
        if (!para) continue;

        // Check if paragraph is a heading
        const isH1 = para.startsWith('## ');
        const isH2 = para.startsWith('### ');
        const cleanPara = para.replace(/^#{1,3}\s+/, '');

        if (isH1) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(16);
          doc.setTextColor(15, 23, 42); // slate-900
        } else if (isH2) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(13);
          doc.setTextColor(30, 58, 138); // blue-900
        } else {
          doc.setFont('times', 'normal');
          doc.setFontSize(11);
          doc.setTextColor(30, 41, 59); // slate-800
        }

        const lines = doc.splitTextToSize(cleanPara, maxLineWidth);
        const lineHeight = isH1 ? 22 : isH2 ? 18 : 15;

        // Ensure page break if space runs out
        if (cursorY + (lines.length * lineHeight) > pageHeight - margin) {
          doc.addPage();
          cursorY = margin + 20;
        }

        for (let i = 0; i < lines.length; i++) {
          if (cursorY + lineHeight > pageHeight - margin) {
            doc.addPage();
            cursorY = margin + 20;
          }
          doc.text(lines[i], margin, cursorY);
          cursorY += lineHeight;
        }

        cursorY += isH1 ? 8 : isH2 ? 6 : 4; // Paragraph gap
      }

      const pdfBlob = doc.output('blob');
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = `${file?.name.replace(/\.[^/.]+$/, '') || 'converted-document'}.pdf`;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold mb-3 border border-blue-200 dark:border-blue-800">
          <FileText className="w-4 h-4 text-blue-600" />
          <span>Universal Word (.docx &amp; .doc) to PDF</span>
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
                setErrorMessage(null);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
            >
              Change File
            </button>
          </div>

          {/* Processing or Error Alert */}
          {errorMessage && (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Preview Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>Document Text Preview</span>
              {convertedText && (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Ready to Convert ({convertedText.split(/\s+/).length} Words)</span>
                </span>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 max-h-72 overflow-y-auto text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {isProcessing ? (
                <div className="flex items-center justify-center py-8 gap-2 text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span>Reading and parsing Word document...</span>
                </div>
              ) : (
                convertedText || 'No readable text found in document.'
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDownloadPDF}
              disabled={isProcessing || !convertedText}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating PDF...</span>
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
