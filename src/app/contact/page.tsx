'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, Send, Check } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Contact Us
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Have questions, feature suggestions, or business inquiries? We'd love to hear from you.
        </p>
      </div>

      <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
          <Mail className="w-5 h-5 text-brand-600" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Support</h4>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">support@docmaster-pro.com</p>
          </div>
        </div>

        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center gap-2 text-sm font-semibold">
            <Check className="w-4 h-4" />
            <span>Thank you! Your message has been sent successfully.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Your Name</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                placeholder="e.g. Amit Kumar"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Your Email</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                placeholder="amit@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Message</label>
              <textarea
                rows={4}
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
