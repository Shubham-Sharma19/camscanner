'use client';

import React, { useState } from 'react';
import { generateRentReceiptPDF, RentReceiptData } from '@/lib/receipt-generator';
import { AdSlot } from '@/components/AdSlot';
import { 
  Receipt, 
  Download, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Calendar,
  Building,
  User,
  CreditCard,
  FileCheck2
} from 'lucide-react';

export default function RentReceiptPage() {
  const [formData, setFormData] = useState<RentReceiptData>({
    tenantName: 'Rahul Sharma',
    landlordName: 'Anil Verma',
    landlordPan: 'ABCDE1234F',
    rentAmount: 18000,
    propertyAddress: 'Flat 402, Sunshine Apartments, Sector 62, Noida, UP - 201301',
    startMonth: '2024-04',
    numMonths: 12,
  });

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pdfBytes = generateRentReceiptPDF(formData);
    const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rent-receipts-${formData.tenantName.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
    link.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3 border border-emerald-200 dark:border-emerald-800">
          <Receipt className="w-4 h-4" />
          <span>Income Tax HRA Exemption</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Free Rent Receipt Generator
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Generate official monthly rent receipts with Revenue Stamp markings to claim House Rent Allowance (HRA) tax exemption in seconds.
        </p>
      </div>

      <AdSlot type="top-banner" />

      {/* Main Form & Tax Affiliate Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Tenant Name (Your Name)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.tenantName}
                    onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Monthly Rent Amount (₹)
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="number"
                    required
                    value={formData.rentAmount}
                    onChange={(e) => setFormData({ ...formData, rentAmount: parseInt(e.target.value, 10) || 0 })}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                    placeholder="15000"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Landlord Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.landlordName}
                  onChange={(e) => setFormData({ ...formData, landlordName: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. Anil Verma"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Landlord PAN (Mandatory if rent &gt; ₹1 Lakh/yr)
                </label>
                <input
                  type="text"
                  value={formData.landlordPan}
                  onChange={(e) => setFormData({ ...formData, landlordPan: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 font-mono uppercase"
                  placeholder="ABCDE1234F"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Rented Property Address
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.propertyAddress}
                  onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                  placeholder="House No, Street, City, State, PIN"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Starting Month
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="month"
                    required
                    value={formData.startMonth}
                    onChange={(e) => setFormData({ ...formData, startMonth: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Number of Months (1 to 12)
                </label>
                <select
                  value={formData.numMonths}
                  onChange={(e) => setFormData({ ...formData, numMonths: parseInt(e.target.value, 10) })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                >
                  <option value={1}>1 Month (Single Receipt)</option>
                  <option value={3}>3 Months (Quarterly)</option>
                  <option value={6}>6 Months (Half Yearly)</option>
                  <option value={12}>12 Months (Full Financial Year)</option>
                </select>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Generate Official PDF Rent Receipts</span>
              </button>
            </div>

          </form>
        </div>

        {/* Affiliate & Information Column */}
        <div className="lg:col-span-1 space-y-4">
          <AdSlot type="affiliate-tax" />
          
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2.5">
            <h5 className="font-bold text-slate-900 dark:text-white text-sm">
              Income Tax HRA Rules:
            </h5>
            <p>
              • If annual rent exceeds <strong>₹1,00,000</strong>, Landlord's PAN is mandatory to claim tax exemption under Section 10(13A).
            </p>
            <p>
              • A <strong>₹1 Revenue Stamp</strong> is printed on every receipt where payment exceeds ₹5,000.
            </p>
          </div>
        </div>

      </div>

      {/* Success Notification */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom">
          <Check className="w-4 h-4" />
          <span>Rent Receipts PDF Downloaded Successfully!</span>
        </div>
      )}

      <AdSlot type="download-screen" className="mt-8" />
    </div>
  );
}
