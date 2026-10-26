'use client';

import React, { useRef, useState } from 'react';
import { Dropzone } from '@/components/Dropzone';
import { AdSlot } from '@/components/AdSlot';
import { PDFDocument } from 'pdf-lib';
import { 
  PenTool, 
  Download, 
  Check, 
  RotateCcw, 
  Sparkles,
  Loader2 
} from 'lucide-react';

export default function SignPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [inkColor, setInkColor] = useState<string>('#000000');
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = inkColor;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSignAndDownload = async () => {
    if (!file || !sigCanvasRef.current || !hasDrawn) return;
    setIsProcessing(true);

    try {
      const sigDataUrl = sigCanvasRef.current.toDataURL('image/png');
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      const sigImage = await pdfDoc.embedPng(sigDataUrl);

      // Place signature on the last page of the document
      const pages = pdfDoc.getPages();
      const lastPage = pages[pages.length - 1];
      const { width } = lastPage.getSize();

      // Draw signature bottom right
      lastPage.drawImage(sigImage, {
        x: width - 200,
        y: 60,
        width: 150,
        height: 60,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `signed-${file.name}`;
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3 border border-indigo-200 dark:border-indigo-800">
          <PenTool className="w-4 h-4 text-indigo-600" />
          <span>Digital Signature</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Sign PDF Document Online
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Draw your electronic signature on screen and apply it directly to your PDF contracts, agreements, and forms.
        </p>
      </div>

      <AdSlot type="top-banner" />

      {!file ? (
        <Dropzone
          onFilesSelected={(files) => files.length > 0 && setFile(files[0])}
          accept="application/pdf"
          multiple={false}
          title="Upload PDF document to sign"
          subtitle="Processed 100% locally. Your signature and document are never stored."
          allowCamera={false}
        />
      ) : (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{file.name}</h4>
              <span className="text-xs text-slate-400">{Math.round(file.size / 1024)} KB</span>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
            >
              Change File
            </button>
          </div>

          {/* Signature Pad */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Draw Your Signature (Use mouse or finger)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInkColor('#000000')}
                  className={`w-5 h-5 rounded-full bg-black border ${inkColor === '#000000' ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
                  title="Black Ink"
                />
                <button
                  type="button"
                  onClick={() => setInkColor('#1e40af')}
                  className={`w-5 h-5 rounded-full bg-blue-800 border ${inkColor === '#1e40af' ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
                  title="Blue Ink"
                />
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-rose-500 ml-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-1 flex items-center justify-center">
              <canvas
                ref={sigCanvasRef}
                width={500}
                height={160}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="cursor-crosshair max-w-full h-auto bg-transparent touch-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSignAndDownload}
              disabled={isProcessing || !hasDrawn}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Signed PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom">
          <Check className="w-4 h-4" />
          <span>Signed PDF Downloaded Successfully!</span>
        </div>
      )}

      <AdSlot type="download-screen" className="mt-8" />
    </div>
  );
}
