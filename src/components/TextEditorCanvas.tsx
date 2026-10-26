'use client';

import React, { useRef, useState, useEffect } from 'react';
import { OCRWord } from '@/lib/types';
import { performDocumentOCR, replaceWordOnCanvas } from '@/lib/ocr-font-engine';
import { 
  Sparkles, 
  Download, 
  Undo2, 
  Type, 
  Check, 
  X, 
  Palette, 
  Sliders, 
  Loader2,
  FileCheck2,
  HelpCircle
} from 'lucide-react';
import jsPDF from 'jspdf';

interface TextEditorCanvasProps {
  imageSrc: string;
  onReset?: () => void;
}

export function TextEditorCanvas({ imageSrc, onReset }: TextEditorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ocrWords, setOcrWords] = useState<OCRWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [progressText, setProgressText] = useState('Scanning text & detecting fonts...');
  
  // Selected word for editing
  const [selectedWord, setSelectedWord] = useState<OCRWord | null>(null);
  const [editedText, setEditedText] = useState('');
  
  // Editable style overrides for the selected word
  const [fontFamily, setFontFamily] = useState<'sans-serif' | 'serif' | 'monospace'>('sans-serif');
  const [fontSize, setFontSize] = useState<number>(14);
  const [fontColor, setFontColor] = useState<string>('#1a1a1a');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [isBold, setIsBold] = useState<boolean>(false);

  // History for Undo
  const [history, setHistory] = useState<string[]>([]);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Initial load: render image to canvas & run OCR
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Save initial snapshot to history
      setHistory([canvas.toDataURL()]);

      // Run OCR detection
      try {
        setProgressText('Recognizing characters and matching ink colors...');
        const words = await performDocumentOCR(canvas);
        setOcrWords(words);
      } catch (err) {
        console.error('OCR Error:', err);
      } finally {
        setLoading(false);
      }
    };
  }, [imageSrc]);

  // Click on canvas to select word
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || loading) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Find clicked word
    const matched = ocrWords.find((w) => {
      const pad = 4;
      return (
        clickX >= w.bbox.x0 - pad &&
        clickX <= w.bbox.x1 + pad &&
        clickY >= w.bbox.y0 - pad &&
        clickY <= w.bbox.y1 + pad
      );
    });

    if (matched) {
      setSelectedWord(matched);
      setEditedText(matched.text);
      setFontFamily(matched.fontFamily);
      setFontSize(matched.fontSize);
      setFontColor(matched.fontColor);
      setBgColor(matched.bgColor);
      setIsBold(matched.isBold || false);
    } else {
      setSelectedWord(null);
    }
  };

  // Apply replacement
  const handleApplyEdit = () => {
    if (!selectedWord || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save state for undo
    setHistory((prev) => [...prev, canvas.toDataURL()]);

    // Replace word on canvas
    replaceWordOnCanvas(ctx, selectedWord, editedText, {
      fontFamily,
      fontSize,
      fontColor,
      bgColor,
      isBold,
    });

    // Update word in memory
    setOcrWords((prev) =>
      prev.map((w) => (w.id === selectedWord.id ? { ...w, text: editedText } : w))
    );

    setSelectedWord(null);
  };

  // Undo last edit
  const handleUndo = () => {
    if (history.length <= 1 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    newHistory.pop(); // remove current state
    const prevState = newHistory[newHistory.length - 1];

    const img = new Image();
    img.src = prevState;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHistory(newHistory);
      setSelectedWord(null);
    };
  };

  // Download edited image
  const handleDownloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `edited-document-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Download edited as PDF
  const handleDownloadPDF = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    // A4 dimensions in mm
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`edited-document-${Date.now()}.pdf`);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* Top Action Bar */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs mb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <span>Click any word on the document to edit</span>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 1 && (
            <button
              onClick={handleUndo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>
          )}

          <button
            onClick={handleDownloadImage}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-colors"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Word Editor Popup / Toolbar (Visible when a word is clicked) */}
      {selectedWord && (
        <div className="w-full max-w-4xl p-4 bg-indigo-50/90 dark:bg-indigo-950/70 border border-brand-300 dark:border-brand-800 rounded-xl shadow-lg mb-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Input field */}
            <div className="flex-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                Edit Word (Original: "{selectedWord.text}")
              </label>
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                autoFocus
                className="w-full px-3 py-2 text-sm font-medium bg-white dark:bg-slate-900 border border-brand-300 dark:border-brand-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Auto-Matched Style Controls */}
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Font Family */}
              <div>
                <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                  Font Match
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value as any)}
                  className="px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                >
                  <option value="sans-serif">Arial (Modern)</option>
                  <option value="serif">Times New Roman (Formal)</option>
                  <option value="monospace">Courier (Typewriter)</option>
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                  Size ({fontSize}px)
                </label>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setFontSize((s) => Math.max(8, s - 1))}
                    className="w-6 h-6 rounded bg-white dark:bg-slate-900 border text-xs font-bold"
                  >
                    -
                  </button>
                  <button
                    onClick={() => setFontSize((s) => s + 1)}
                    className="w-6 h-6 rounded bg-white dark:bg-slate-900 border text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Ink Color Picker */}
              <div>
                <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                  Ink Color
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="color"
                    value={fontColor.startsWith('rgb') ? '#1a1a1a' : fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    className="w-7 h-7 rounded border cursor-pointer"
                    title="Change ink color"
                  />
                </div>
              </div>

              {/* Paper Background Color Picker */}
              <div>
                <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                  Paper Color
                </label>
                <input
                  type="color"
                  value={bgColor.startsWith('rgb') ? '#ffffff' : bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-7 h-7 rounded border cursor-pointer"
                  title="Change background erase color"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-3 sm:pt-0">
                <button
                  onClick={handleApplyEdit}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply</span>
                </button>
                <button
                  onClick={() => setSelectedWord(null)}
                  className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Main Canvas Container with OCR Loading Indicator */}
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/50 p-2 sm:p-4 overflow-auto flex items-center justify-center min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs rounded-2xl">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-3" />
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              Analyzing Document With OCR...
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {progressText}
            </p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="max-w-full h-auto rounded-lg shadow-md cursor-pointer border border-slate-300/60 dark:border-slate-700/60"
        />
      </div>

      {/* Success Notification */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4" />
          <span>Edited Document Downloaded Successfully!</span>
        </div>
      )}
    </div>
  );
}
