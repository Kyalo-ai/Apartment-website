
import React from 'react';
import { Invoice, Tenant, Apartment } from '../types';
import { SUPPORT_CONTACT } from '../constants';

interface ReceiptModalProps {
  invoice: Invoice;
  tenant: Tenant;
  apartment: Apartment;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ invoice, tenant, apartment, onClose }) => {
  const handlePrint = () => {
    // Dynamically change page title for clean PDF filename
    const originalTitle = document.title;
    document.title = `Receipt_${invoice.id.toUpperCase()}_${tenant.name.replace(/\s+/g, '_')}`;
    window.print();
    document.title = originalTitle;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[120] p-4 animate-fade-in">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-xl w-full overflow-hidden border border-white/40 flex flex-col receipt-container animate-scale-in">
        {/* Header Branding */}
        <div className="bg-slate-900 p-10 text-white relative">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black tracking-tighter mb-1">LUXERENT PRO</h2>
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">Official Payment Receipt</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Receipt No.</p>
              <p className="font-mono text-sm">#{invoice.id.toUpperCase()}</p>
            </div>
          </div>
          {/* Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-20deg] opacity-[0.03] text-[120px] font-black pointer-events-none">
            PAID
          </div>
        </div>

        <div className="p-10 space-y-8 relative">
          {/* PAID Stamp overlay */}
          <div className="absolute top-10 right-10 border-4 border-emerald-500/30 text-emerald-500/40 text-2xl font-black px-4 py-2 rounded-xl rotate-12 pointer-events-none uppercase">
            PAID IN FULL
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Account Holder</h4>
              <p className="font-bold text-slate-800 text-lg">{tenant.name}</p>
              <p className="text-sm text-slate-500">{tenant.email}</p>
              <p className="text-sm text-slate-500">{tenant.phone || 'N/A'}</p>
            </div>
            <div className="text-right">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Unit Allocation</h4>
              <p className="font-bold text-slate-800">Apartment {apartment.unitNumber}</p>
              <p className="text-sm text-slate-500">Floor {apartment.floor}</p>
              <p className="text-sm text-slate-500">{apartment.type}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Transaction Details</h4>
            <div className="flex justify-between items-center bg-slate-50 p-5 rounded-2xl mb-2 border border-slate-100">
              <span className="font-bold text-slate-700">{invoice.description}</span>
              <span className="font-black text-slate-900 text-lg">${invoice.amount.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Payment Gateway</span>
              <span className="font-bold text-slate-800">M-Pesa Express</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Date of Settlement</span>
              <span className="font-bold text-slate-800">{new Date(invoice.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric'})}</span>
            </div>
            <div className="flex justify-between text-xl pt-5 border-t border-slate-100">
              <span className="font-black text-slate-900 uppercase tracking-tighter">Total Amount</span>
              <span className="font-black text-blue-600">${invoice.amount.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-8 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl mb-4 flex items-center justify-center shadow-inner">
              <span className="text-2xl">🛡️</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
              Legally binding digital receipt<br/>
              LuxeRent Residences Support: {SUPPORT_CONTACT}
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 no-print">
          <button 
            onClick={handlePrint}
            className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
          >
            <span>📥</span> Download PDF Receipt
          </button>
          <button 
            onClick={onClose}
            className="px-8 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
