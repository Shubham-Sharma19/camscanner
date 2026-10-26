'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TOOLS } from '@/lib/tools-data';
import { ToolCategory } from '@/lib/types';
import { AdSlot } from '@/components/AdSlot';
import { 
  Camera, 
  FileText, 
  FilePenLine, 
  Maximize2, 
  Receipt, 
  Sparkles, 
  Lock, 
  Zap, 
  CheckCircle2, 
  Search,
  Combine,
  Scissors,
  Minimize2,
  PenTool,
  Stamp,
  Images,
  FileImage,
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterPills = [
    { id: 'all', label: 'All' },
    { id: 'organize', label: 'Organize PDF' },
    { id: 'optimize', label: 'Optimize PDF' },
    { id: 'convert', label: 'Convert PDF' },
    { id: 'editor', label: 'Edit PDF & OCR' },
    { id: 'govt', label: 'Govt & Office' },
  ];

  const getToolFilterMatch = (tool: any, cat: string) => {
    if (cat === 'all') return true;
    if (cat === 'organize') return ['merge-pdf', 'split-pdf'].includes(tool.id);
    if (cat === 'optimize') return ['compress-pdf', 'sign-pdf', 'watermark-pdf'].includes(tool.id);
    if (cat === 'convert') return ['image-to-pdf', 'word-to-pdf', 'pdf-to-word', 'pdf-to-image'].includes(tool.id);
    if (cat === 'editor') return ['text-editor', 'scanner'].includes(tool.id);
    if (cat === 'govt') return ['photo-resizer', 'signature-cleaner', 'rent-receipt', 'salary-slip', 'cash-invoice'].includes(tool.id);
    return true;
  };

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory = getToolFilterMatch(tool, selectedCategory);
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.hindiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  /**
   * Distinct Adobe & Office colored icon badges for each tool (matching user's screenshot 2!)
   */
  const getToolBadge = (id: string) => {
    switch (id) {
      case 'merge-pdf':
        return (
          <div className="w-11 h-11 rounded-xl bg-red-500 text-white flex items-center justify-center font-bold shadow-md shadow-red-500/20">
            <Combine className="w-5 h-5" />
          </div>
        );
      case 'split-pdf':
        return (
          <div className="w-11 h-11 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
            <Scissors className="w-5 h-5" />
          </div>
        );
      case 'compress-pdf':
        return (
          <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
            <Minimize2 className="w-5 h-5" />
          </div>
        );
      case 'word-to-pdf':
      case 'pdf-to-word':
        return (
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/20">
            W
          </div>
        );
      case 'image-to-pdf':
      case 'pdf-to-image':
        return (
          <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
            <Images className="w-5 h-5" />
          </div>
        );
      case 'scanner':
        return (
          <div className="w-11 h-11 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold shadow-md shadow-teal-500/20">
            <Camera className="w-5 h-5" />
          </div>
        );
      case 'text-editor':
        return (
          <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/20">
            <FilePenLine className="w-5 h-5" />
          </div>
        );
      case 'photo-resizer':
      case 'signature-cleaner':
        return (
          <div className="w-11 h-11 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-md shadow-rose-500/20">
            <Maximize2 className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
            <Receipt className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      
      {/* Hero Header (Matching Screenshot 2 Style) */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Every tool you need to work with PDFs in one place
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Every tool you need to use PDFs, at your fingertips. All are <strong>100% FREE and easy to use</strong>! Merge, split, compress, convert, rotate, and edit PDFs with just a few clicks.
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-xl mx-auto relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search tools (e.g. merge, word to pdf, compress, scanned editor)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm shadow-md focus:outline-hidden focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Filter Pills (Matching Screenshot 2) */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pt-8 pb-2">
          {filterPills.map((pill) => {
            const isSelected = selectedCategory === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setSelectedCategory(pill.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Top Banner Ad Slot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot type="top-banner" />
      </div>

      {/* Main Grid of Clean Cards (Matching Screenshot 2) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-red-500 dark:hover:border-red-500 shadow-xs hover:shadow-xl hover:shadow-red-500/5 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Colored App Badge Icon */}
                <div className="mb-4 group-hover:scale-105 transition-transform">
                  {getToolBadge(tool.id)}
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-red-600 transition-colors">
                  {tool.name}
                </h3>
                <h4 className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                  {tool.hindiName}
                </h4>

                {/* Description */}
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {tool.description}
                </p>
              </div>

              {/* Action footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-red-600 dark:text-red-400">
                <span>Use Tool</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 p-6 rounded-2xl bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-around gap-6 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-500" />
            <span className="font-bold">100% Client-Side Private</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="font-bold">0-Second Server Latency</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            <span className="font-bold">No Limits & No Paywalls</span>
          </div>
        </div>

      </main>
    </div>
  );
}
