'use client';

import React, { useState } from 'react';
import { AdSlot } from '@/components/AdSlot';
import jsPDF from 'jspdf';
import { 
  FileText, 
  Download, 
  Check, 
  Plus, 
  Trash2, 
  Building, 
  User 
} from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
}

export default function CashInvoicePage() {
  const [shopName, setShopName] = useState('Super Retail Store');
  const [shopAddress, setShopAddress] = useState('Shop No. 12, Main Market, Delhi - 110001');
  const [customerName, setCustomerName] = useState('Ramesh Sharma');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Office Paper Ream (A4 75 GSM)', qty: 2, rate: 280 },
    { id: '2', description: 'Ballpoint Pens Pack (10 Pcs)', qty: 3, rate: 90 },
  ]);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), description: 'New Item', qty: 1, rate: 100 },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const grandTotal = items.reduce((acc, curr) => acc + curr.qty * curr.rate, 0);

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Border
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(0.5);
    doc.rect(15, 15, 180, 267);

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(220, 38, 38);
    doc.text(shopName.toUpperCase(), 105, 26, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(shopAddress, 105, 32, { align: 'center' });

    doc.setFillColor(254, 242, 242);
    doc.rect(15, 38, 180, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(185, 28, 28);
    doc.text('CASH MEMO / BILL', 105, 43.5, { align: 'center' });

    // Details Grid
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(`Customer Name: ${customerName}`, 20, 53);
    doc.text(`Date: ${invoiceDate}`, 150, 53);
    doc.text(`Bill No: CM-${Date.now().toString().slice(-6)}`, 20, 59);

    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(20, 65, 170, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('S.N.', 23, 70);
    doc.text('Item Description', 35, 70);
    doc.text('Qty', 130, 70);
    doc.text('Rate (Rs)', 150, 70);
    doc.text('Amount (Rs)', 175, 70);

    let y = 78;
    doc.setFont('helvetica', 'normal');
    items.forEach((item, index) => {
      doc.text((index + 1).toString(), 23, y);
      doc.text(item.description, 35, y);
      doc.text(item.qty.toString(), 130, y);
      doc.text(item.rate.toLocaleString('en-IN'), 150, y);
      doc.text((item.qty * item.rate).toLocaleString('en-IN'), 175, y);
      y += 8;
    });

    // Total line
    doc.setDrawColor(203, 213, 225);
    doc.line(20, y + 4, 190, y + 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(`TOTAL AMOUNT: Rs. ${grandTotal.toLocaleString('en-IN')}/-`, 190, y + 14, { align: 'right' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('Terms: Goods once sold will not be taken back.', 20, 260);
    doc.text('Authorized Signature', 160, 260, { align: 'center' });

    const pdfBlob = doc.output('blob');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = `cash-memo-${Date.now()}.pdf`;
    link.click();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-xs font-bold mb-3 border border-red-200 dark:border-red-800">
          <FileText className="w-4 h-4 text-red-500" />
          <span>Billing & Retail</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Quick Cash Memo & Invoice Maker
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Generate clean, printable PDF cash bills and invoices for retail shops, freelancers, and small businesses.
        </p>
      </div>

      <AdSlot type="top-banner" />

      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Shop / Business Name
            </label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Address & Contact
            </label>
            <input
              type="text"
              value={shopAddress}
              onChange={(e) => setShopAddress(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Bill Date
            </label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl"
            />
          </div>
        </div>

        {/* Items Table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Bill Items
            </h4>
            <button
              onClick={addItem}
              className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg"
                  placeholder="Item Name"
                />
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value, 10) || 1)}
                  className="w-16 px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg text-center"
                  placeholder="Qty"
                />
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                  className="w-24 px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg text-right"
                  placeholder="Rate"
                />
                <span className="w-24 text-right text-xs font-bold text-slate-700 dark:text-slate-300">
                  ₹ {(item.qty * item.rate).toLocaleString('en-IN')}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  disabled={items.length <= 1}
                  className="p-1 text-slate-400 hover:text-rose-500 disabled:opacity-20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Total & Download */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Total Payable:</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              ₹ {grandTotal.toLocaleString('en-IN')}/-
            </h3>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Cash Memo PDF</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom">
          <Check className="w-4 h-4" />
          <span>Cash Memo PDF Downloaded Successfully!</span>
        </div>
      )}

      <AdSlot type="download-screen" className="mt-8" />
    </div>
  );
}
