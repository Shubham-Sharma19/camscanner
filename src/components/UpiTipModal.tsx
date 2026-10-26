'use client';

import React, { useState } from 'react';
import { X, Check, Copy, Heart, Coffee } from 'lucide-react';

interface UpiTipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpiTipModal({ isOpen, onClose }: UpiTipModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(20);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // The UPI ID can be changed easily by the owner
  const upiId = 'supportdocmaster@upi';
  const payeeName = 'DocMaster Project';
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${selectedAmount}&cu=INR&tn=Chai%20Support`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mb-3 shadow-inner">
            <Coffee className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Support Free Tools with a Chai! ☕
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            We don't charge any monthly subscription or steal your data. If this tool saved your office day, consider buying us a chai!
          </p>
        </div>

        {/* Quick Amount Selector */}
        <div className="flex gap-2 justify-center mb-5">
          {[20, 50, 100].map((amt) => (
            <button
              key={amt}
              onClick={() => setSelectedAmount(amt)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedAmount === amt
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-105'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              ₹{amt}
            </button>
          ))}
        </div>

        {/* QR Code Container (Simulated crisp QR Box) */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 mb-4">
          <div className="w-44 h-44 bg-white p-3 rounded-lg shadow-xs flex flex-col items-center justify-center">
            {/* SVG QR Code Pattern */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
              {/* Corner squares */}
              <rect x="5" y="5" width="26" height="26" fill="currentColor" rx="4" />
              <rect x="9" y="9" width="18" height="18" fill="white" rx="2" />
              <rect x="13" y="13" width="10" height="10" fill="currentColor" rx="1" />

              <rect x="69" y="5" width="26" height="26" fill="currentColor" rx="4" />
              <rect x="73" y="9" width="18" height="18" fill="white" rx="2" />
              <rect x="77" y="13" width="10" height="10" fill="currentColor" rx="1" />

              <rect x="5" y="69" width="26" height="26" fill="currentColor" rx="4" />
              <rect x="9" y="73" width="18" height="18" fill="white" rx="2" />
              <rect x="13" y="77" width="10" height="10" fill="currentColor" rx="1" />

              {/* Data dots */}
              <rect x="36" y="8" width="6" height="6" fill="currentColor" />
              <rect x="46" y="8" width="6" height="6" fill="currentColor" />
              <rect x="56" y="8" width="6" height="6" fill="currentColor" />

              <rect x="36" y="20" width="6" height="6" fill="currentColor" />
              <rect x="48" y="22" width="8" height="8" fill="currentColor" />
              <rect x="60" y="20" width="4" height="4" fill="currentColor" />

              <rect x="12" y="38" width="8" height="8" fill="currentColor" />
              <rect x="24" y="38" width="6" height="6" fill="currentColor" />
              <rect x="36" y="36" width="10" height="10" fill="currentColor" />
              <rect x="52" y="38" width="6" height="6" fill="currentColor" />
              <rect x="64" y="38" width="8" height="8" fill="currentColor" />
              <rect x="78" y="38" width="6" height="6" fill="currentColor" />

              <rect x="10" y="52" width="6" height="6" fill="currentColor" />
              <rect x="22" y="50" width="8" height="8" fill="currentColor" />
              <rect x="36" y="52" width="8" height="8" fill="currentColor" />
              <rect x="48" y="50" width="10" height="10" fill="currentColor" />
              <rect x="66" y="52" width="6" height="6" fill="currentColor" />
              <rect x="80" y="50" width="8" height="8" fill="currentColor" />

              <rect x="38" y="68" width="8" height="8" fill="currentColor" />
              <rect x="52" y="68" width="6" height="6" fill="currentColor" />
              <rect x="64" y="68" width="8" height="8" fill="currentColor" />
              <rect x="78" y="68" width="6" height="6" fill="currentColor" />

              <rect x="38" y="82" width="6" height="6" fill="currentColor" />
              <rect x="50" y="80" width="8" height="8" fill="currentColor" />
              <rect x="68" y="82" width="6" height="6" fill="currentColor" />
              <rect x="80" y="82" width="8" height="8" fill="currentColor" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-2">
            Scan via GPay, PhonePe, Paytm or any UPI App
          </span>
        </div>

        {/* Copy UPI ID */}
        <div className="flex items-center gap-2 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm">
          <span className="flex-1 font-mono text-xs text-slate-700 dark:text-slate-300 truncate">
            {upiId}
          </span>
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center gap-1 px-3 py-1 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg text-xs font-semibold shadow-xs hover:bg-slate-50 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy UPI'}</span>
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for everyone worldwide.
          </p>
        </div>
      </div>
    </div>
  );
}
