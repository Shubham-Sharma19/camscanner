import React from 'react';
import { Lock, ShieldCheck, EyeOff } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3 border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-4 h-4" />
          <span>Client-Side Privacy Guarantee</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-slate-500">Last Updated: October 2026</p>
      </div>

      <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
          <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">Core Principle: Zero Server Data Storage</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              DocMaster Pro processes your documents, PDFs, photos, and images entirely inside your web browser using HTML5 Canvas, WebAssembly, and Client-Side JavaScript. Your files are NEVER uploaded to any remote server, database, or third-party storage bucket.
            </p>
          </div>
        </div>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">1. Information We Collect</h2>
          <p>
            Because all file conversions and OCR editing happen directly on your device, we do not collect, view, store, or share your documents, Aadhaar cards, PAN numbers, salary slips, or photographs.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">2. Cookies and Advertising</h2>
          <p>
            We may use third-party advertising vendors (such as Google AdSense, Adsterra, or Monetag) to serve advertisements when you visit our website. These companies may use cookies and web beacons to collect non-personally identifiable information (such as your browser type, device type, or approximate location) to deliver relevant ads.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">3. Google AdSense & DoubleClick Cookie</h2>
          <p>
            Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visits to our site and/or other sites on the Internet. Users may opt out of personalized advertising by visiting Google Ads Settings.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">4. Contact Information</h2>
          <p>
            If you have any questions or feedback regarding our privacy practices, you can contact us at: <span className="font-semibold text-brand-600">privacy@docmaster-pro.com</span>.
          </p>
        </section>

      </div>
    </div>
  );
}
