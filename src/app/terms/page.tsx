import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-slate-500">Last Updated: October 2026</p>
      </div>

      <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using DocMaster Pro, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">2. Permitted Use</h2>
          <p>
            You agree to use DocMaster Pro solely for lawful purposes. You must not use the tool to alter official, government, or legal documents with the intent to commit fraud, forgery, or deceptive practices. The user assumes full responsibility for any document edited or generated using this platform.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">3. Disclaimer of Warranties</h2>
          <p>
            DocMaster Pro is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. While we strive to ensure 100% accuracy in document formatting and compression, we do not guarantee error-free results.
          </p>
        </section>
      </div>
    </div>
  );
}
