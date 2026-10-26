'use client';

import React from 'react';
import { ExternalLink, Sparkles, Award } from 'lucide-react';

interface AdSlotProps {
  type: 'top-banner' | 'sidebar' | 'download-screen' | 'affiliate-tax' | 'affiliate-student';
  className?: string;
}

export function AdSlot({ type, className = '' }: AdSlotProps) {
  if (type === 'top-banner') {
    return (
      <div className={`my-6 flex flex-col items-center justify-center ${className}`}>
        <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
          Advertisement
        </span>
        <div className="w-full max-w-[728px] h-[90px] rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-center p-2 text-center text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Google AdSense / Adsterra 728x90 Responsive Banner Slot</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'sidebar') {
    return (
      <div className={`my-4 flex flex-col items-center ${className}`}>
        <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
          Advertisement
        </span>
        <div className="w-[300px] h-[250px] rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col items-center justify-center p-4 text-center text-xs text-slate-400">
          <span className="font-semibold text-slate-500 dark:text-slate-400 mb-1">High-Paying Sidebar Ad</span>
          <span>Google AdSense / Monetag 300x250 Medium Rectangle</span>
        </div>
      </div>
    );
  }

  if (type === 'download-screen') {
    return (
      <div className={`my-4 p-4 rounded-xl bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-brand-950/40 dark:to-indigo-950/40 border border-brand-200 dark:border-brand-800/60 ${className}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                <span className="text-xs uppercase font-bold text-brand-600 dark:text-brand-400">Sponsored</span>
                <span className="text-xs text-slate-400">• High Conversion</span>
              </div>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">Need to create invoices or file ITR?</h5>
              <p className="text-xs text-slate-600 dark:text-slate-400">Try our recommended official partner tools for free.</p>
            </div>
          </div>
          <a
            href="https://cleartax.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors shrink-0 shadow-xs"
          >
            <span>Learn More</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  if (type === 'affiliate-tax') {
    return (
      <div className={`my-6 p-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-brand-700 text-white shadow-lg shadow-brand-500/10 ${className}`}>
        <div className="flex items-start justify-between">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-xs">
            HRA Tax Exemption Partner
          </span>
          <Award className="w-5 h-5 text-amber-300" />
        </div>
        <h4 className="font-bold text-base mt-3">File Your Income Tax Return (ITR) in 3 Minutes</h4>
        <p className="text-xs text-indigo-100 mt-1">
          Auto-fetch Form 16, maximize HRA rent deductions, and get maximum refund directly into your bank account.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <a
            href="https://cleartax.in"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white text-brand-700 font-bold text-xs rounded-xl shadow-xs hover:bg-indigo-50 transition-colors inline-flex items-center gap-1.5"
          >
            <span>File ITR for Free</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <span className="text-[11px] text-indigo-200">100% Govt Certified</span>
        </div>
      </div>
    );
  }

  if (type === 'affiliate-student') {
    return (
      <div className={`my-6 p-5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/10 ${className}`}>
        <div className="flex items-start justify-between">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-xs">
            Sarkari Exam Special
          </span>
          <Award className="w-5 h-5 text-yellow-200" />
        </div>
        <h4 className="font-bold text-base mt-3">Free SSC, UPSC & Railway Mock Test Series</h4>
        <p className="text-xs text-amber-100 mt-1">
          Practice 1,000+ real exam questions with instant all-India rank and detailed explanations.
        </p>
        <div className="mt-4">
          <a
            href="https://testbook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white text-orange-700 font-bold text-xs rounded-xl shadow-xs hover:bg-orange-50 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Start Free Mock Test</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  return null;
}
