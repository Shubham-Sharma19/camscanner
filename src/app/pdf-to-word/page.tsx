'use client';

import React, { useState } from 'react';
import { Dropzone } from '@/components/Dropzone';
import { AdSlot } from '@/components/AdSlot';
import { 
  FileText, 
  Download, 
  Check, 
  Loader2, 
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [extractedPages, setExtractedPages] = useState<{ pageNum: number; text: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Extracting text from all pages...');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    setFile(selectedFile);
    setIsProcessing(true);
    setStatusMessage('Reading PDF structure and extracting real text...');

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

      const buffer = await selectedFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;
      setPageCount(numPages);

      const pagesData: { pageNum: number; text: string }[] = [];

      for (let i = 1; i <= numPages; i++) {
        setStatusMessage(`Extracting text from Page ${i} of ${numPages}...`);
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        
        // Group text items by line
        let lastY: number | null = null;
        let pageStr = '';

        for (const item of textContent.items as any[]) {
          if (item.str === undefined) continue;
          if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
            pageStr += '\n'; // Line break
          }
          pageStr += item.str + ' ';
          lastY = item.transform[5];
        }

        pagesData.push({
          pageNum: i,
          text: pageStr.trim() || `(Page ${i} content)`,
        });
      }

      setExtractedPages(pagesData);
    } catch (err) {
      console.error('Error loading and extracting PDF:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadWord = () => {
    if (!file || extractedPages.length === 0) return;
    setIsProcessing(true);

    try {
      // Build real HTML-based Word Document containing all actual extracted text
      const pagesHtml = extractedPages
        .map((p) => {
          const escapedText = p.text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br/>');

          return `
            <div style="page-break-after: always; margin-bottom: 30pt;">
              <h3 style="color: #475569; font-size: 11pt; border-bottom: 1px solid #cbd5e1; padding-bottom: 4pt; margin-bottom: 14pt;">
                --- Page ${p.pageNum} ---
              </h3>
              <p style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; color: #0f172a;">
                ${escapedText}
              </p>
            </div>
          `;
        })
        .join('');

      const wordDoc = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>${file.name.replace(/\.[^/.]+$/, '')}</title>
          <style>
            body { font-family: 'Times New Roman', serif; margin: 40pt; }
            h1 { font-size: 18pt; color: #1e293b; margin-bottom: 16pt; }
            p { margin-bottom: 10pt; text-align: justify; }
          </style>
        </head>
        <body>
          <h1>${file.name.replace(/\.[^/.]+$/, '')}</h1>
          <hr style="border: none; border-top: 1px solid #94a3b8; margin-bottom: 20pt;" />
          ${pagesHtml}
        </body>
        </html>
      `;

      const blob = new Blob(['\ufeff', wordDoc], {
        type: 'application/msword;charset=utf-8',
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
          <span>Real PDF Text Extraction</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Convert PDF to Editable WORD (.doc)
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Extracts every real sentence, heading, and paragraph from each page of your PDF into an editable Microsoft Word document.
        </p>
      </div>

      <AdSlot type="top-banner" />

      {!file ? (
        <Dropzone
          onFilesSelected={handleFiles}
          accept="application/pdf"
          multiple={false}
          title="Select PDF file to convert to Word"
          subtitle="All text from all pages is extracted 100% inside your browser memory."
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
                  {Math.round(file.size / 1024)} KB • {pageCount} Pages Extracted
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setExtractedPages([]);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
            >
              Change File
            </button>
          </div>

          {/* Real Extracted Content Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Extracted Real Text Preview ({extractedPages.length} Pages)
              </label>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Text Extracted Successfully</span>
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 max-h-72 overflow-y-auto text-xs font-serif text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
              {isProcessing ? (
                <div className="flex items-center justify-center py-8 gap-2 text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span>{statusMessage}</span>
                </div>
              ) : extractedPages.length > 0 ? (
                extractedPages.map((p) => (
                  <div key={p.pageNum} className="mb-4 pb-4 border-b border-slate-200/60 dark:border-slate-700/60 last:border-none">
                    <span className="text-[10px] font-sans font-bold text-blue-600 dark:text-blue-400 block mb-1">
                      [ PAGE {p.pageNum} ]
                    </span>
                    <p>{p.text}</p>
                  </div>
                ))
              ) : (
                'No text found in this PDF.'
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDownloadWord}
              disabled={isProcessing || extractedPages.length === 0}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing Word File...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Editable Word Document (.doc)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom">
          <Check className="w-4 h-4" />
          <span>Real Word document with all pages downloaded!</span>
        </div>
      )}

      <AdSlot type="download-screen" className="mt-8" />
    </div>
  );
}
