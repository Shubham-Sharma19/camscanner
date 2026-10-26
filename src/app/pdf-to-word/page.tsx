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
  CheckCircle2,
  FileCode2,
  Layers
} from 'lucide-react';

interface SemanticBlock {
  type: 'title' | 'heading' | 'subheading' | 'eyebrow' | 'code' | 'bullet' | 'paragraph';
  fontSize: number;
  hasBold: boolean;
  text: string;
}

interface ParsedPage {
  pageNum: number;
  blocks: SemanticBlock[];
}

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [parsedPages, setParsedPages] = useState<ParsedPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Extracting and analyzing PDF layout...');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    setFile(selectedFile);
    setIsProcessing(true);
    setStatusMessage('Reading PDF structure and analyzing typography layout...');

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

      const buffer = await selectedFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;
      setPageCount(numPages);

      const allPages: ParsedPage[] = [];

      for (let p = 1; p <= numPages; p++) {
        setStatusMessage(`Analyzing typography and layout of Page ${p} of ${numPages}...`);
        const page = await pdfDoc.getPage(p);
        const textContent = await page.getTextContent();

        // 1. Cluster text items by Y coordinate (within 4px tolerance)
        const lineBuckets: { [key: number]: any[] } = {};
        for (const item of textContent.items as any[]) {
          if (!item.str) continue;
          const y = Math.round(item.transform[5]);
          let key = Object.keys(lineBuckets).find((k) => Math.abs(Number(k) - y) <= 4);
          if (!key) {
            lineBuckets[y] = [];
            key = String(y);
          }
          lineBuckets[Number(key)].push({
            x: Math.round(item.transform[4]),
            str: item.str,
            fontSize: Math.round(Math.hypot(item.transform[0], item.transform[1])),
            fontName: item.fontName || '',
            width: item.width || 0,
          });
        }

        // Sort lines top to bottom (Y descending)
        const sortedY = Object.keys(lineBuckets)
          .map(Number)
          .sort((a, b) => b - a);

        // 2. Reconstruct lines with intelligent spacing
        const rawLines: { y: number; text: string; fontSize: number; hasBold: boolean; isCode: boolean }[] = [];
        for (const y of sortedY) {
          const row = lineBuckets[y].sort((a, b) => a.x - b.x);

          let lineText = '';
          let maxFontSize = 0;
          let hasBold = false;
          let isCode = false;

          for (let j = 0; j < row.length; j++) {
            const item = row[j];
            if (item.fontSize > maxFontSize) maxFontSize = item.fontSize;
            if (/bold|black|heavy|semibold|bld|medium/i.test(item.fontName)) hasBold = true;
            if (/courier|mono|consolas/i.test(item.fontName)) isCode = true;

            if (j > 0) {
              const prevItem = row[j - 1];
              const gap = item.x - (prevItem.x + (prevItem.width || 0));
              if (gap > 2 && !lineText.endsWith(' ') && !item.str.startsWith(' ')) {
                lineText += ' ';
              }
            }
            lineText += item.str;
          }

          lineText = lineText.replace(/\s+/g, ' ').trim();
          if (!lineText) continue;

          rawLines.push({
            y,
            text: lineText,
            fontSize: maxFontSize || 11,
            hasBold,
            isCode,
          });
        }

        // 3. Group consecutive lines into semantic blocks (Title, Heading, Paragraph, List, Code)
        const blocks: SemanticBlock[] = [];
        let currentBlock: SemanticBlock | null = null;

        for (let i = 0; i < rawLines.length; i++) {
          const line = rawLines[i];
          const prevLine = i > 0 ? rawLines[i - 1] : null;
          const verticalGap = prevLine ? prevLine.y - line.y : 0;

          const isBullet = /^([•–\-\*]|\d+[\.\)])\s/.test(line.text);
          const isEyebrow = line.fontSize <= 9 && /^[A-Z0-9\s·\-\–\']+$/.test(line.text) && line.text.length < 60;
          const isCommand = /^(mkdir|cd|npm|npx|git|claude|node|brew|curl)\s/i.test(line.text);

          let blockType: SemanticBlock['type'] = 'paragraph';
          if (line.fontSize >= 24) blockType = 'title';
          else if (line.fontSize >= 17) blockType = 'heading';
          else if (line.fontSize >= 13) blockType = 'subheading';
          else if (isEyebrow) blockType = 'eyebrow';
          else if (isCommand || line.isCode) blockType = 'code';
          else if (isBullet) blockType = 'bullet';

          const isSameType = currentBlock && currentBlock.type === blockType;
          const isCloseGap = verticalGap <= line.fontSize * 1.8;
          const canMerge = isSameType && isCloseGap && blockType !== 'bullet' && blockType !== 'eyebrow' && blockType !== 'code';

          if (canMerge && currentBlock) {
            currentBlock.text += ' ' + line.text;
          } else {
            if (currentBlock) blocks.push(currentBlock);
            currentBlock = {
              type: blockType,
              fontSize: line.fontSize,
              hasBold: line.hasBold,
              text: line.text,
            };
          }
        }
        if (currentBlock) blocks.push(currentBlock);

        allPages.push({
          pageNum: p,
          blocks,
        });
      }

      setParsedPages(allPages);
    } catch (err) {
      console.error('Error loading and extracting PDF:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadWord = () => {
    if (!file || parsedPages.length === 0) return;
    setIsProcessing(true);

    try {
      let pagesHtml = '';

      for (const page of parsedPages) {
        let pageContentHtml = '';

        for (const b of page.blocks) {
          const escaped = b.text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

          if (b.type === 'title') {
            pageContentHtml += `
              <h1 style="font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: ${b.fontSize}pt; font-weight: bold; color: #0f172a; margin-top: 20pt; margin-bottom: 8pt; line-height: 1.15;">
                ${escaped}
              </h1>`;
          } else if (b.type === 'heading') {
            pageContentHtml += `
              <h2 style="font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: ${b.fontSize}pt; font-weight: bold; color: #1e3a8a; margin-top: 18pt; margin-bottom: 6pt; line-height: 1.25; border-bottom: 1.5pt solid #dbeafe; padding-bottom: 3pt;">
                ${escaped}
              </h2>`;
          } else if (b.type === 'subheading') {
            pageContentHtml += `
              <h3 style="font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: ${b.fontSize}pt; font-weight: bold; color: #1e293b; margin-top: 14pt; margin-bottom: 4pt; line-height: 1.3;">
                ${escaped}
              </h3>`;
          } else if (b.type === 'eyebrow') {
            pageContentHtml += `
              <div style="font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 8.5pt; font-weight: bold; color: #4f46e5; text-transform: uppercase; letter-spacing: 1.5pt; margin-top: 12pt; margin-bottom: 3pt;">
                ${escaped}
              </div>`;
          } else if (b.type === 'code') {
            pageContentHtml += `
              <div style="font-family: 'Consolas', 'Courier New', monospace; font-size: 10pt; background-color: #f8fafc; border-left: 3pt solid #4f46e5; padding: 5pt 10pt; margin: 4pt 0 6pt 0; color: #0f172a;">
                ${escaped}
              </div>`;
          } else if (b.type === 'bullet') {
            pageContentHtml += `
              <p style="font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #1e293b; margin: 3pt 0 4pt 24pt; text-indent: -16pt;">
                ${b.hasBold ? `<strong>${escaped}</strong>` : escaped}
              </p>`;
          } else {
            pageContentHtml += `
              <p style="font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: ${b.fontSize}pt; line-height: 1.55; color: #1e293b; margin-top: 4pt; margin-bottom: 8pt; text-align: justify;">
                ${b.hasBold ? `<strong>${escaped}</strong>` : escaped}
              </p>`;
          }
        }

        pagesHtml += `
          <!-- PAGE ${page.pageNum} START -->
          <div class="WordSection${page.pageNum}" style="page-break-after: always; margin-bottom: 40pt;">
            <div style="text-align: right; font-size: 8pt; color: #94a3b8; border-bottom: 1px solid #e2e8f0; padding-bottom: 4pt; margin-bottom: 20pt;">
              Page ${page.pageNum} of ${pageCount}
            </div>
            ${pageContentHtml}
          </div>
          <!-- PAGE ${page.pageNum} END -->
        `;
      }

      const fullWordDocument = `
        <html xmlns:v="urn:schemas-microsoft-com:vml"
              xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:w="urn:schemas-microsoft-com:office:word"
              xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <title>${file.name.replace(/\.[^/.]+$/, '')}</title>
          <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>100</w:Zoom>
              <w:DoNotOptimizeForBrowser/>
            </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            @page {
              size: 8.5in 11in;
              margin: 1.0in 1.0in 1.0in 1.0in;
              mso-header-margin: 0.5in;
              mso-footer-margin: 0.5in;
              mso-paper-source: 0;
            }
            body {
              font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
              font-size: 11pt;
              line-height: 1.5;
              color: #1e293b;
            }
            h1, h2, h3, h4 {
              font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
              page-break-after: avoid;
            }
          </style>
        </head>
        <body>
          ${pagesHtml}
        </body>
        </html>
      `;

      const blob = new Blob(['\ufeff', fullWordDocument], {
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
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Smart Layout & Typography Reconstruction</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Convert PDF to Formatted WORD (.doc)
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Preserves original headings, fonts, bold styles, numbered lists, and paragraph formatting just like iLovePDF and Adobe.
        </p>
      </div>

      <AdSlot type="top-banner" />

      {!file ? (
        <Dropzone
          onFilesSelected={handleFiles}
          accept="application/pdf"
          multiple={false}
          title="Select PDF file to convert to Word"
          subtitle="Analyzes font sizes, headings, lists & layout 100% inside your browser."
          allowCamera={false}
        />
      ) : (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                DOC
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{file.name}</h4>
                <span className="text-xs text-slate-400">
                  {Math.round(file.size / 1024)} KB • {pageCount} Pages Formatted
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setParsedPages([]);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
            >
              Change File
            </button>
          </div>

          {/* Formatted Semantic Preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500" />
                <span>Formatted Document Preview ({parsedPages.length} Pages)</span>
              </label>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Layout & Headings Detected</span>
              </span>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 max-h-96 overflow-y-auto space-y-8 shadow-inner font-sans">
              {isProcessing ? (
                <div className="flex items-center justify-center py-12 gap-2 text-slate-500">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <span className="text-sm font-medium">{statusMessage}</span>
                </div>
              ) : parsedPages.length > 0 ? (
                parsedPages.map((p) => (
                  <div key={p.pageNum} className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-xs border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400">
                      <span className="text-blue-600 dark:text-blue-400">PAGE {p.pageNum}</span>
                      <span>PAGE {p.pageNum} OF {pageCount}</span>
                    </div>

                    <div className="space-y-3">
                      {p.blocks.map((b, idx) => {
                        if (b.type === 'title') {
                          return (
                            <h1 key={idx} className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight mt-3">
                              {b.text}
                            </h1>
                          );
                        }
                        if (b.type === 'heading') {
                          return (
                            <h2 key={idx} className="text-lg font-bold text-blue-900 dark:text-blue-300 border-b border-blue-100 dark:border-blue-900/40 pb-1 mt-4">
                              {b.text}
                            </h2>
                          );
                        }
                        if (b.type === 'subheading') {
                          return (
                            <h3 key={idx} className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2">
                              {b.text}
                            </h3>
                          );
                        }
                        if (b.type === 'eyebrow') {
                          return (
                            <span key={idx} className="inline-block text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                              {b.text}
                            </span>
                          );
                        }
                        if (b.type === 'code') {
                          return (
                            <div key={idx} className="font-mono text-xs bg-slate-100 dark:bg-slate-800 border-l-2 border-indigo-500 p-2 rounded text-slate-800 dark:text-slate-200">
                              {b.text}
                            </div>
                          );
                        }
                        if (b.type === 'bullet') {
                          return (
                            <div key={idx} className="text-xs text-slate-700 dark:text-slate-300 pl-4 relative leading-relaxed">
                              {b.hasBold ? <strong>{b.text}</strong> : b.text}
                            </div>
                          );
                        }
                        return (
                          <p key={idx} className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                            {b.hasBold ? <strong className="text-slate-800 dark:text-slate-200">{b.text}</strong> : b.text}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                'No content extracted.'
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDownloadWord}
              disabled={isProcessing || parsedPages.length === 0}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Formatting Document...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Formatted Word Document (.doc)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom">
          <Check className="w-4 h-4" />
          <span>Formatted Word document with all pages & styles downloaded!</span>
        </div>
      )}

      <AdSlot type="download-screen" className="mt-8" />
    </div>
  );
}
