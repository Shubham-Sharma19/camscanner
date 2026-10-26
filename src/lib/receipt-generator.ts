import jsPDF from 'jspdf';

export interface RentReceiptData {
  tenantName: string;
  landlordName: string;
  landlordPan: string;
  rentAmount: number;
  propertyAddress: string;
  startMonth: string; // e.g. "2024-04"
  numMonths: number;  // 1 to 12
}

export interface SalarySlipData {
  companyName: string;
  companyAddress: string;
  employeeName: string;
  employeeId: string;
  designation: string;
  monthYear: string;
  bankAccount: string;
  panNumber: string;
  basicSalary: number;
  hra: number;
  conveyance: number;
  specialAllowance: number;
  providentFund: number;
  professionalTax: number;
  tds: number;
}

/**
 * Generate 1 to 12 Official Rent Receipts PDF for Income Tax HRA Exemption
 */
export function generateRentReceiptPDF(data: RentReceiptData): Uint8Array {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [startYearStr, startMonthStr] = data.startMonth.split('-');
  let currentYear = parseInt(startYearStr, 10);
  let currentMonthIndex = parseInt(startMonthStr, 10) - 1;

  // We can fit 2 receipts per A4 page
  for (let i = 0; i < data.numMonths; i++) {
    if (i > 0 && i % 2 === 0) {
      doc.addPage();
    }

    const yOffset = (i % 2 === 0) ? 15 : 155;
    const currentMonthName = monthNames[currentMonthIndex];

    // Receipt Box Border
    doc.setDrawColor(79, 70, 229); // Brand Indigo
    doc.setLineWidth(0.6);
    doc.roundedRect(15, yOffset, 180, 125, 3, 3);

    // Header
    doc.setFillColor(238, 242, 255);
    doc.roundedRect(15, yOffset, 180, 20, 3, 3, 'F');
    doc.setTextColor(67, 56, 202);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('RENT RECEIPT', 105, yOffset + 11, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Receipt No: RR-${currentYear}-${(i + 1).toString().padStart(2, '0')}`, 20, yOffset + 16);
    doc.text(`Date: Last Day of ${currentMonthName} ${currentYear}`, 190, yOffset + 16, { align: 'right' });

    // Body Text
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const amountFormatted = `Rs. ${data.rentAmount.toLocaleString('en-IN')}/-`;
    const bodyParagraph = `Received a sum of ${amountFormatted} from ${data.tenantName} towards rent for residential property situated at:`;
    
    doc.text(bodyParagraph, 20, yOffset + 32, { maxWidth: 170 });
    doc.setFont('helvetica', 'bold');
    doc.text(data.propertyAddress, 20, yOffset + 44, { maxWidth: 170 });

    doc.setFont('helvetica', 'normal');
    doc.text(`for the period of 1st ${currentMonthName} ${currentYear} to last day of ${currentMonthName} ${currentYear}.`, 20, yOffset + 56);

    // Landlord & Revenue Stamp Box
    doc.setDrawColor(203, 213, 225);
    doc.line(20, yOffset + 68, 190, yOffset + 68);

    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text('Landlord Name:', 20, yOffset + 76);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(data.landlordName, 55, yOffset + 76);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Landlord PAN:', 20, yOffset + 84);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(data.landlordPan || 'N/A (Rent under exemption limit)', 55, yOffset + 84);

    // Simulated Revenue Stamp
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(0.4);
    doc.rect(148, yOffset + 74, 32, 36);
    doc.setFontSize(7);
    doc.setTextColor(220, 38, 38);
    doc.text('REVENUE', 164, yOffset + 86, { align: 'center' });
    doc.text('STAMP', 164, yOffset + 91, { align: 'center' });
    doc.text('Rs. 1', 164, yOffset + 96, { align: 'center' });

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('(Sign across stamp)', 164, yOffset + 115, { align: 'center' });

    // Progress Month
    currentMonthIndex++;
    if (currentMonthIndex >= 12) {
      currentMonthIndex = 0;
      currentYear++;
    }
  }

  return doc.output('arraybuffer') as unknown as Uint8Array;
}

/**
 * Generate Professional Corporate Salary Slip PDF
 */
export function generateSalarySlipPDF(data: SalarySlipData): Uint8Array {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Border
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(0.5);
  doc.roundedRect(12, 12, 186, 273, 2, 2);

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(49, 46, 129);
  doc.text(data.companyName.toUpperCase(), 105, 25, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(data.companyAddress, 105, 31, { align: 'center' });

  doc.setFillColor(238, 242, 255);
  doc.rect(12, 38, 186, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(67, 56, 202);
  doc.text(`PAYSLIP FOR THE MONTH OF ${data.monthYear.toUpperCase()}`, 105, 45, { align: 'center' });

  // Employee Details Grid
  doc.setDrawColor(226, 232, 240);
  doc.rect(16, 54, 178, 30);
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);

  doc.text('Employee Name:', 20, 62);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(data.employeeName, 55, 62);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Employee ID:', 110, 62);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(data.employeeId, 145, 62);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Designation:', 20, 72);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(data.designation, 55, 72);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Bank A/C No:', 110, 72);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(data.bankAccount || 'XXXXXXXXXXXX', 145, 72);

  // Table Headers: Earnings vs Deductions
  doc.setFillColor(241, 245, 249);
  doc.rect(16, 92, 89, 8, 'F');
  doc.rect(105, 92, 89, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('EARNINGS', 20, 97);
  doc.text('AMOUNT (₹)', 95, 97, { align: 'right' });

  doc.text('DEDUCTIONS', 110, 97);
  doc.text('AMOUNT (₹)', 184, 97, { align: 'right' });

  // Earnings Rows
  const earnings = [
    { label: 'Basic Salary', val: data.basicSalary },
    { label: 'House Rent Allowance (HRA)', val: data.hra },
    { label: 'Conveyance Allowance', val: data.conveyance },
    { label: 'Special Allowance', val: data.specialAllowance },
  ];

  // Deductions Rows
  const deductions = [
    { label: 'Provident Fund (PF)', val: data.providentFund },
    { label: 'Professional Tax (PT)', val: data.professionalTax },
    { label: 'Tax Deducted at Source (TDS)', val: data.tds },
    { label: 'Other Deductions', val: 0 },
  ];

  let y = 107;
  doc.setFont('helvetica', 'normal');
  for (let i = 0; i < 4; i++) {
    const e = earnings[i];
    const d = deductions[i];

    doc.setTextColor(51, 65, 85);
    doc.text(e.label, 20, y);
    doc.text(e.val.toLocaleString('en-IN'), 95, y, { align: 'right' });

    doc.text(d.label, 110, y);
    doc.text(d.val.toLocaleString('en-IN'), 184, y, { align: 'right' });

    y += 9;
  }

  const totalEarnings = earnings.reduce((acc, curr) => acc + curr.val, 0);
  const totalDeductions = deductions.reduce((acc, curr) => acc + curr.val, 0);
  const netPay = totalEarnings - totalDeductions;

  // Totals Row
  doc.setDrawColor(203, 213, 225);
  doc.line(16, y + 2, 194, y + 2);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Total Earnings', 20, y + 9);
  doc.text(`₹ ${totalEarnings.toLocaleString('en-IN')}`, 95, y + 9, { align: 'right' });

  doc.text('Total Deductions', 110, y + 9);
  doc.text(`₹ ${totalDeductions.toLocaleString('en-IN')}`, 184, y + 9, { align: 'right' });

  // Net Pay Highlight Box
  doc.setFillColor(238, 242, 255);
  doc.roundedRect(16, y + 20, 178, 16, 2, 2, 'F');
  doc.setFontSize(11);
  doc.setTextColor(67, 56, 202);
  doc.text('NET SALARY PAYABLE:', 25, y + 30);
  doc.setFontSize(13);
  doc.text(`₹ ${netPay.toLocaleString('en-IN')}/-`, 180, y + 31, { align: 'right' });

  // Signature lines
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Employer Signature & Stamp', 40, 260, { align: 'center' });
  doc.text('Employee Signature', 160, 260, { align: 'center' });
  doc.line(20, 255, 60, 255);
  doc.line(140, 255, 180, 255);

  return doc.output('arraybuffer') as unknown as Uint8Array;
}
