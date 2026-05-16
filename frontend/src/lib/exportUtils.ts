import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

interface ExportData {
  date: string;
  type: string;
  category: string;
  title: string;
  amount: number;
  status: string;
}

export const exportToPDF = (data: ExportData[], fileName: string = 'transaction-report') => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Transaction Ledger Report', 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${format(new Date(), 'PPP p')}`, 14, 30);

  // Define the columns
  const tableColumn = ["Date", "Type", "Category", "Description", "Amount", "Status"];
  
  // Define the rows
  const tableRows = data.map(item => [
    item.date,
    item.type.toUpperCase(),
    item.category,
    item.title,
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.amount),
    item.status
  ]);

  // Generate the table
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 35,
    theme: 'grid',
    headStyles: { fillColor: [74, 108, 247], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [245, 247, 255] },
  });

  // Save the PDF
  doc.save(`${fileName}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

export const exportToExcel = (data: ExportData[], fileName: string = 'transaction-report') => {
  // Map data to Excel format
  const worksheetData = data.map(item => ({
    "Date": item.date,
    "Type": item.type.toUpperCase(),
    "Category": item.category,
    "Description": item.title,
    "Amount": item.amount,
    "Status": item.status
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

  // Fix column widths
  const wscols = [
    { wch: 15 }, // Date
    { wch: 10 }, // Type
    { wch: 20 }, // Category
    { wch: 35 }, // Description
    { wch: 15 }, // Amount
    { wch: 15 }, // Status
  ];
  worksheet['!cols'] = wscols;

  // Generate and save Excel file
  XLSX.writeFile(workbook, `${fileName}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};
