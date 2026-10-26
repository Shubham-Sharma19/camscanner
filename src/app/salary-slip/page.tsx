'use client';

import React, { useState } from 'react';
import { generateSalarySlipPDF, SalarySlipData } from '@/lib/receipt-generator';
import { AdSlot } from '@/components/AdSlot';
import { 
  FileSpreadsheet, 
  Download, 
  Check, 
  Building2, 
  User, 
  DollarSign, 
  FileCheck2,
  Sparkles 
} from 'lucide-react';

export default function SalarySlipPage() {
  const [formData, setFormData] = useState<SalarySlipData>({
    companyName: 'TechVision Infotech Pvt. Ltd.',
    companyAddress: 'Plot 45, Cyber City, Gurugram, Haryana - 122002',
    employeeName: 'Amit Verma',
    employeeId: 'EMP-2049',
    designation: 'Senior Software Engineer',
    monthYear: 'October 2026',
    bankAccount: 'HDFC Bank - 50100239482910',
    panNumber: 'BNZPV7821Q',
    basicSalary: 45000,
    hra: 18000,
    conveyance: 3000,
    specialAllowance: 14000,
    providentFund: 1800,
    professionalTax: 200,
    tds: 2500,
  });

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const totalEarnings = formData.basicSalary + formData.hra + formData.conveyance + formData.specialAllowance;
  const totalDeductions = formData.providentFund + formData.professionalTax + formData.tds;
  const netPay = totalEarnings - totalDeductions;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pdfBytes = generateSalarySlipPDF(formData);
    const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `salary-slip-${formData.employeeName.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
    link.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 text-xs font-bold mb-3 border border-purple-200 dark:border-purple-800">
          <FileSpreadsheet className="w-4 h-4" />
          <span>Office HR & Payroll Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Professional Salary Slip Maker
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Generate clean, official company payslips with earnings, deductions, PF, and employer stamp areas in 1 click.
        </p>
      </div>

      <AdSlot type="top-banner" />

      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        
        {/* Company Details */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-brand-600" />
            <span>Company Information</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Company Name</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Company Address</label>
              <input
                type="text"
                required
                value={formData.companyAddress}
                onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Employee Details */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <User className="w-4 h-4 text-brand-600" />
            <span>Employee Information</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Employee Name</label>
              <input
                type="text"
                required
                value={formData.employeeName}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Employee ID</label>
              <input
                type="text"
                required
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Designation</label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Earnings & Deductions Grid */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Earnings */}
          <div className="space-y-3 p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
            <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Earnings (₹)
            </h5>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Basic Salary</label>
              <input
                type="number"
                value={formData.basicSalary}
                onChange={(e) => setFormData({ ...formData, basicSalary: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">House Rent Allowance (HRA)</label>
              <input
                type="number"
                value={formData.hra}
                onChange={(e) => setFormData({ ...formData, hra: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Conveyance Allowance</label>
              <input
                type="number"
                value={formData.conveyance}
                onChange={(e) => setFormData({ ...formData, conveyance: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Special Allowance</label>
              <input
                type="number"
                value={formData.specialAllowance}
                onChange={(e) => setFormData({ ...formData, specialAllowance: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border rounded-lg"
              />
            </div>
            <div className="pt-2 font-bold text-xs text-emerald-800 dark:text-emerald-300 flex justify-between">
              <span>Total Earnings:</span>
              <span>₹ {totalEarnings.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Deductions */}
          <div className="space-y-3 p-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900/40">
            <h5 className="font-bold text-xs uppercase tracking-wider text-rose-700 dark:text-rose-400">
              Deductions (₹)
            </h5>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Provident Fund (PF)</label>
              <input
                type="number"
                value={formData.providentFund}
                onChange={(e) => setFormData({ ...formData, providentFund: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Professional Tax (PT)</label>
              <input
                type="number"
                value={formData.professionalTax}
                onChange={(e) => setFormData({ ...formData, professionalTax: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">TDS / Income Tax</label>
              <input
                type="number"
                value={formData.tds}
                onChange={(e) => setFormData({ ...formData, tds: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border rounded-lg"
              />
            </div>
            <div className="pt-2 font-bold text-xs text-rose-800 dark:text-rose-300 flex justify-between">
              <span>Total Deductions:</span>
              <span>₹ {totalDeductions.toLocaleString('en-IN')}</span>
            </div>
          </div>

        </div>

        {/* Net Salary Total Bar */}
        <div className="p-4 bg-brand-50 dark:bg-brand-950/60 rounded-xl border border-brand-200 dark:border-brand-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
              Net Take-Home Salary
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              ₹ {netPay.toLocaleString('en-IN')}/-
            </h3>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Official Payslip PDF</span>
          </button>
        </div>

      </form>

      {/* Success Notification */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom">
          <Check className="w-4 h-4" />
          <span>Salary Slip PDF Downloaded Successfully!</span>
        </div>
      )}

      <AdSlot type="download-screen" className="mt-8" />
    </div>
  );
}
