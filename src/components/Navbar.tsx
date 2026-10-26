'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ChevronDown, 
  Sparkles, 
  Moon, 
  Sun, 
  Coffee, 
  Menu, 
  X,
  Camera,
  FilePenLine,
  Minimize2,
  Combine,
  Scissors,
  Receipt,
  FileSpreadsheet,
  Maximize2
} from 'lucide-react';
import { UpiTipModal } from './UpiTipModal';

export function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [isTipOpen, setIsTipOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [convertDropdownOpen, setConvertDropdownOpen] = useState(false);
  const [allToolsDropdownOpen, setAllToolsDropdownOpen] = useState(false);

  const convertRef = useRef<HTMLDivElement>(null);
  const allToolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check initial dark mode preference
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }

    // Close dropdowns on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (convertRef.current && !convertRef.current.contains(e.target as Node)) {
        setConvertDropdownOpen(false);
      }
      if (allToolsRef.current && !allToolsRef.current.contains(e.target as Node)) {
        setAllToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/95 dark:bg-[#090d16]/95 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo (Adobe / iLovePDF style) */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex items-baseline">
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                Doc<span className="text-red-600">Master</span>
              </span>
              <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-sm">
                Pro
              </span>
            </div>
          </Link>

          {/* Desktop Navigation with Mega Menus */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-black tracking-wider uppercase text-slate-700 dark:text-slate-200">
            
            <Link
              href="/merge-pdf"
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              MERGE PDF
            </Link>

            <Link
              href="/split-pdf"
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              SPLIT PDF
            </Link>

            <Link
              href="/compress-pdf"
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              COMPRESS PDF
            </Link>

            {/* CONVERT PDF Mega Dropdown (Matching Screenshot 1) */}
            <div 
              ref={convertRef}
              className="relative"
              onMouseEnter={() => setConvertDropdownOpen(true)}
            >
              <button
                onClick={() => setConvertDropdownOpen(!convertDropdownOpen)}
                className={`flex items-center gap-1 hover:text-red-600 transition-colors py-2 ${
                  convertDropdownOpen ? 'text-red-600 dark:text-red-400' : ''
                }`}
              >
                <span>CONVERT PDF</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${convertDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Dropdown Panel */}
              {convertDropdownOpen && (
                <div 
                  onMouseLeave={() => setConvertDropdownOpen(false)}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-[520px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 grid grid-cols-2 gap-8 z-50 animate-in fade-in slide-in-from-top-2 duration-150 normal-case"
                >
                  
                  {/* Left Column: CONVERT TO PDF */}
                  <div>
                    <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-4 pb-1 border-b border-slate-100 dark:border-slate-800">
                      CONVERT TO PDF
                    </h5>
                    <ul className="space-y-3">
                      <li>
                        <Link 
                          href="/image-to-pdf"
                          onClick={() => setConvertDropdownOpen(false)}
                          className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 group transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            JPG
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-red-600 transition-colors block">
                              JPG to PDF
                            </span>
                            <span className="text-[10px] text-slate-400 block">Convert images to PDF</span>
                          </div>
                        </Link>
                      </li>

                      <li>
                        <Link 
                          href="/word-to-pdf"
                          onClick={() => setConvertDropdownOpen(false)}
                          className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 group transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                            W
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-red-600 transition-colors block">
                              WORD to PDF
                            </span>
                            <span className="text-[10px] text-slate-400 block">DOC and DOCX to PDF</span>
                          </div>
                        </Link>
                      </li>

                      <li>
                        <Link 
                          href="/scanner"
                          onClick={() => setConvertDropdownOpen(false)}
                          className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 group transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            CAM
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-red-600 transition-colors block">
                              Camera Scan to PDF
                            </span>
                            <span className="text-[10px] text-slate-400 block">Photo scan to PDF</span>
                          </div>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Right Column: CONVERT FROM PDF */}
                  <div>
                    <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-4 pb-1 border-b border-slate-100 dark:border-slate-800">
                      CONVERT FROM PDF
                    </h5>
                    <ul className="space-y-3">
                      <li>
                        <Link 
                          href="/pdf-to-image"
                          onClick={() => setConvertDropdownOpen(false)}
                          className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 group transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            JPG
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-red-600 transition-colors block">
                              PDF to JPG
                            </span>
                            <span className="text-[10px] text-slate-400 block">Extract PDF as photos</span>
                          </div>
                        </Link>
                      </li>

                      <li>
                        <Link 
                          href="/pdf-to-word"
                          onClick={() => setConvertDropdownOpen(false)}
                          className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 group transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                            W
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-red-600 transition-colors block">
                              PDF to WORD
                            </span>
                            <span className="text-[10px] text-slate-400 block">Convert to editable DOC</span>
                          </div>
                        </Link>
                      </li>

                      <li>
                        <Link 
                          href="/text-editor"
                          onClick={() => setConvertDropdownOpen(false)}
                          className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 group transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            OCR
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-red-600 transition-colors block">
                              PDF to Editable Text
                            </span>
                            <span className="text-[10px] text-slate-400 block">In-place OCR edit</span>
                          </div>
                        </Link>
                      </li>
                    </ul>
                  </div>

                </div>
              )}
            </div>

            {/* ALL PDF TOOLS Mega Dropdown */}
            <div 
              ref={allToolsRef}
              className="relative"
              onMouseEnter={() => setAllToolsDropdownOpen(true)}
            >
              <button
                onClick={() => setAllToolsDropdownOpen(!allToolsDropdownOpen)}
                className={`flex items-center gap-1 hover:text-red-600 transition-colors py-2 ${
                  allToolsDropdownOpen ? 'text-red-600 dark:text-red-400' : ''
                }`}
              >
                <span>ALL PDF TOOLS</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${allToolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {allToolsDropdownOpen && (
                <div 
                  onMouseLeave={() => setAllToolsDropdownOpen(false)}
                  className="absolute right-0 top-full mt-1 w-[460px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 grid grid-cols-2 gap-6 z-50 animate-in fade-in slide-in-from-top-2 duration-150 normal-case"
                >
                  <div>
                    <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3 pb-1 border-b">
                      ORGANIZE & EDIT
                    </h5>
                    <ul className="space-y-2 text-xs">
                      <li><Link href="/merge-pdf" onClick={() => setAllToolsDropdownOpen(false)} className="hover:text-red-600 font-bold block">Merge PDF</Link></li>
                      <li><Link href="/split-pdf" onClick={() => setAllToolsDropdownOpen(false)} className="hover:text-red-600 font-bold block">Split PDF</Link></li>
                      <li><Link href="/sign-pdf" onClick={() => setAllToolsDropdownOpen(false)} className="hover:text-red-600 font-bold block">Sign PDF Document</Link></li>
                      <li><Link href="/watermark-pdf" onClick={() => setAllToolsDropdownOpen(false)} className="hover:text-red-600 font-bold block">Watermark PDF</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3 pb-1 border-b">
                      GOVT & OFFICE SPECIAL
                    </h5>
                    <ul className="space-y-2 text-xs">
                      <li><Link href="/photo-resizer" onClick={() => setAllToolsDropdownOpen(false)} className="hover:text-red-600 font-bold block">Govt 20KB-50KB Resizer</Link></li>
                      <li><Link href="/signature-cleaner" onClick={() => setAllToolsDropdownOpen(false)} className="hover:text-red-600 font-bold block">Signature Cleaner</Link></li>
                      <li><Link href="/rent-receipt" onClick={() => setAllToolsDropdownOpen(false)} className="hover:text-red-600 font-bold block">Rent Receipt (HRA)</Link></li>
                      <li><Link href="/salary-slip" onClick={() => setAllToolsDropdownOpen(false)} className="hover:text-red-600 font-bold block">Salary Slip Maker</Link></li>
                      <li><Link href="/cash-invoice" onClick={() => setAllToolsDropdownOpen(false)} className="hover:text-red-600 font-bold block">Cash Memo & Invoice</Link></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Killer Feature Highlight Link */}
            <Link
              href="/text-editor"
              className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 flex items-center gap-1.5 font-bold transition-colors"
            >
              <FilePenLine className="w-3.5 h-3.5" />
              <span>EDIT SCANNED TEXT</span>
            </Link>

          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            
            {/* Direct UPI Support Button */}
            <button
              onClick={() => setIsTipOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 transition-colors shadow-xs"
              title="Support this project"
            >
              <Coffee className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">₹20 Chai</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-2 pb-6 space-y-1.5 bg-white dark:bg-[#090d16] border-b border-slate-200 dark:border-slate-800 max-h-[80vh] overflow-y-auto">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 pt-2 pb-1">Core PDF Tools</div>
            <Link href="/merge-pdf" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 rounded-lg text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100">Merge PDF</Link>
            <Link href="/split-pdf" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 rounded-lg text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100">Split PDF</Link>
            <Link href="/compress-pdf" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 rounded-lg text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100">Compress PDF</Link>
            <Link href="/word-to-pdf" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 rounded-lg text-sm font-bold text-blue-600 hover:bg-slate-100">WORD to PDF</Link>
            <Link href="/pdf-to-word" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 rounded-lg text-sm font-bold text-blue-600 hover:bg-slate-100">PDF to WORD</Link>
            <Link href="/image-to-pdf" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 rounded-lg text-sm font-bold text-amber-600 hover:bg-slate-100">JPG to PDF</Link>
            <Link href="/pdf-to-image" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 rounded-lg text-sm font-bold text-amber-600 hover:bg-slate-100">PDF to JPG</Link>

            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 pt-3 pb-1">Scanner & In-Place Editor</div>
            <Link href="/text-editor" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 rounded-lg text-sm font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/40">✏️ Edit Scanned Document Text</Link>
            <Link href="/scanner" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 rounded-lg text-sm font-bold text-emerald-600 hover:bg-slate-100">📸 Web CamScanner</Link>

            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 pt-3 pb-1">Govt & Office</div>
            <Link href="/photo-resizer" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 rounded-lg text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100">Govt 20KB-50KB Resizer</Link>
            <Link href="/signature-cleaner" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 rounded-lg text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100">Signature Cleaner</Link>
            <Link href="/rent-receipt" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 rounded-lg text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100">Rent Receipt (HRA Tax)</Link>
            <Link href="/salary-slip" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 rounded-lg text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100">Salary Slip Maker</Link>
            <Link href="/cash-invoice" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 rounded-lg text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100">Cash Memo & Invoice</Link>
          </div>
        )}
      </header>

      <UpiTipModal isOpen={isTipOpen} onClose={() => setIsTipOpen(false)} />
    </>
  );
}
