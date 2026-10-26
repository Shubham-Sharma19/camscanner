import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, Sparkles, Lock, Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#090d16]/50 backdrop-blur-md">
      {/* Privacy Trust Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-slate-200/70 dark:border-slate-800/70">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          
          <div className="flex items-center gap-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">100% Client-Side Privacy</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your files never leave your device or hit a cloud server.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Zero Daily Limits</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Process as many documents as you need without paywalls.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">All-in-One Powerhouse</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">CamScanner + iLovePDF + In-Place OCR Editor in one tab.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
              Scanner & Editor
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/scanner" className="hover:text-brand-600 transition-colors">Web CamScanner</Link></li>
              <li><Link href="/text-editor" className="hover:text-brand-600 transition-colors">Edit Scanned Text</Link></li>
              <li><Link href="/photo-resizer" className="hover:text-brand-600 transition-colors">Govt 20KB-50KB Resizer</Link></li>
              <li><Link href="/signature-cleaner" className="hover:text-brand-600 transition-colors">Signature Cleaner</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
              Essential PDF Tools
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/merge-pdf" className="hover:text-brand-600 transition-colors">Merge PDF</Link></li>
              <li><Link href="/split-pdf" className="hover:text-brand-600 transition-colors">Split PDF</Link></li>
              <li><Link href="/compress-pdf" className="hover:text-brand-600 transition-colors">Compress PDF</Link></li>
              <li><Link href="/image-to-pdf" className="hover:text-brand-600 transition-colors">Image to PDF</Link></li>
              <li><Link href="/pdf-to-image" className="hover:text-brand-600 transition-colors">PDF to Image</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
              Office & HR Generators
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/rent-receipt" className="hover:text-brand-600 transition-colors">Rent Receipt (HRA Tax)</Link></li>
              <li><Link href="/salary-slip" className="hover:text-brand-600 transition-colors">Salary Slip Generator</Link></li>
              <li><Link href="/cash-invoice" className="hover:text-brand-600 transition-colors">Cash Memo & Invoice</Link></li>
              <li><Link href="/sign-pdf" className="hover:text-brand-600 transition-colors">Sign PDF Document</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
              Legal & AdSense Policy
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/privacy" className="hover:text-brand-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="/about" className="hover:text-brand-600 transition-colors">About DocMaster</Link></li>
              <li><Link href="/contact" className="hover:text-brand-600 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} DocMaster Pro. All document rights remain strictly with the user.</p>
          <div className="flex items-center gap-1">
            <span>Built with zero server cost & 100% privacy.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
