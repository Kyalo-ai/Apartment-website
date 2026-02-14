
import React, { useState } from 'react';
import { Invoice, PaymentStatus, Tenant, Apartment } from '../types';

interface BillingViewProps {
  invoices: Invoice[];
  tenants: Tenant[];
  apartments: Apartment[];
  onGenerateNotice: (tenantId: string, invoice: Invoice) => void;
  onStartMpesa: (invoice: Invoice) => void;
  onShowReceipt: (invoice: Invoice) => void;
}

const BillingView: React.FC<BillingViewProps> = ({ invoices, tenants, apartments, onGenerateNotice, onStartMpesa, onShowReceipt }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');

  const getStatusStyle = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID: return 'bg-green-100 text-green-700 border-green-200';
      case PaymentStatus.PENDING: return 'bg-amber-100 text-amber-700 border-amber-200';
      case PaymentStatus.OVERDUE: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTenantName = (id: string) => tenants.find(t => t.id === id)?.name || 'Unknown';
  const getUnit = (id: string) => apartments.find(a => a.id === id)?.unitNumber || 'N/A';

  const filtered = invoices.filter(inv => {
    const matchesSearch = getTenantName(inv.tenantId).toLowerCase().includes(search.toLowerCase()) || 
                         inv.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Invoices & Payments</h2>
          <p className="text-slate-500 font-bold text-sm mt-1">Manage tenant billing history</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search invoices..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/40 backdrop-blur-md rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-bold text-sm"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-3 bg-white/50 border border-white/40 backdrop-blur-md rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-bold text-sm cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value={PaymentStatus.PAID}>Paid</option>
            <option value={PaymentStatus.PENDING}>Pending</option>
            <option value={PaymentStatus.OVERDUE}>Overdue</option>
          </select>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-white/40 shadow-2xl overflow-hidden animate-scale-in">
        <table className="w-full text-left">
          <thead className="bg-white/40 border-b border-white/20">
            <tr>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">ID</th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Tenant / Unit</th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Amount</th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Due Date</th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20">
            {filtered.map((inv) => (
              <tr key={inv.id} className="hover:bg-white/60 transition-all duration-200 group">
                <td className="px-6 py-5 text-xs font-mono text-slate-400">#{inv.id.toUpperCase()}</td>
                <td className="px-6 py-5">
                  <div className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{getTenantName(inv.tenantId)}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Unit: {getUnit(inv.apartmentId)}</div>
                </td>
                <td className="px-6 py-5 text-sm font-black text-slate-900">${inv.amount.toLocaleString()}</td>
                <td className="px-6 py-5 text-sm font-bold text-slate-600">{inv.dueDate}</td>
                <td className="px-6 py-5">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border ${getStatusStyle(inv.status)}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    {inv.status !== PaymentStatus.PAID && (
                      <button 
                        onClick={() => onStartMpesa(inv)}
                        className="bg-[#00A34E] text-white hover:bg-[#008a42] px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition transform active:scale-95 shadow-lg shadow-green-200/50"
                      >
                        MPESA
                      </button>
                    )}
                    {inv.status === PaymentStatus.OVERDUE && (
                      <button 
                        onClick={() => onGenerateNotice(inv.tenantId, inv)}
                        className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition transform active:scale-95 border border-red-200"
                      >
                        AI NOTICE
                      </button>
                    )}
                    {inv.status === PaymentStatus.PAID && (
                      <button 
                        onClick={() => onShowReceipt(inv)}
                        className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition transform active:scale-95 border border-blue-200"
                      >
                        RECEIPT
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold">
                  No billing records found matching your selection.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingView;
