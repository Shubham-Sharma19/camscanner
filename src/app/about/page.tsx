import React from 'react';
import { Sparkles, Heart, ShieldCheck, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 text-xs font-bold mb-3 border border-brand-200 dark:border-brand-800">
          <Sparkles className="w-4 h-4" />
          <span>Our Mission</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          About DocMaster Pro
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Free, unlimited document utilities built for office workers, students, and job seekers worldwide.
        </p>
      </div>

      <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <p>
          DocMaster Pro was founded with one clear vision: <strong>eliminate the frustrating paywalls and privacy concerns of modern document tools</strong>.
        </p>
        <p>
          Most existing PDF and scanner tools force users to purchase high-priced monthly subscriptions after just 2 conversions, or upload sensitive financial and personal files to remote servers where they risk data exposure.
        </p>
        <p>
          By leveraging modern browser capabilities like <strong>WebAssembly, HTML5 Canvas, and Web Workers</strong>, DocMaster Pro runs 100% locally on your computer or smartphone. This guarantees zero server hosting bills for us, allowing us to keep all features 100% free and unlimited for you.
        </p>
      </div>
    </div>
  );
}
