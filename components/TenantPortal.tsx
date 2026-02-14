
import React, { useState } from 'react';
import { AppState, PaymentStatus, Invoice, UserRole } from '../types';
import { SUPPORT_CONTACT, AMENITIES, SAMPLE_LEASE_DOC } from '../constants';

interface TenantPortalProps {
  state: AppState;
  onPay: (invoice: Invoice) => void;
  onShowReceipt: (invoice: Invoice) => void;
  view: 'unit' | 'billing';
}

const TenantPortal: React.FC<TenantPortalProps> = ({ state, onPay, onShowReceipt, view }) => {
  const [modal, setModal] = useState<'lease' | 'amenities' | null>(null);
  
  const currentUser = state.currentUser;
  // Try to find tenant record in state, otherwise fallback to currentUser info
  const tenant = state.tenants.find(t => t.id === currentUser?.tenantId || t.email === currentUser?.email);
  const apartment = state.apartments.find(a => a.id === tenant?.apartmentId);
  
  // Filter invoices for this specific tenant
  const myInvoices = state.invoices.filter(i => 
    i.tenantId === tenant?.id || i.tenantId === currentUser?.tenantId
  );
  const pendingCount = myInvoices.filter(i => i.status !== PaymentStatus.PAID).length;

  if (view === 'unit') {
    return (
      <div className="space-y-6 animate-fade-in">
        <header className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
             <span className="text-[160px] font-black">UNIT</span>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Authenticated Resident</p>
              <h2 className="text-4xl font-black tracking-tighter">Welcome back, {currentUser?.name}</h2>
              <p className="mt-2 text-slate-300 font-medium">
                {apartment ? `Unit ${apartment.unitNumber} • ${apartment.type} • Floor ${apartment.floor}` : 'Awaiting Unit Allocation'}
              </p>
            </div>
            <a 
              href={`tel:${SUPPORT_CONTACT}`}
              className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-3 hover:bg-white/20 transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              <span>📞</span> Support Hotline
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-4 relative z-10">
             <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 px-8">
                <p className="text-[9px] uppercase font-black text-blue-300 tracking-widest mb-1">Monthly commitment</p>
                <p className="text-2xl font-black">${apartment?.rentAmount.toLocaleString() || '0'}</p>
             </div>
             <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 px-8">
                <p className="text-[9px] uppercase font-black text-blue-300 tracking-widest mb-1">Lease Maturity</p>
                <p className="text-2xl font-black">{tenant?.leaseEnd || 'Flexible'}</p>
             </div>
             <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 px-8">
                <p className="text-[9px] uppercase font-black text-blue-300 tracking-widest mb-1">Account Status</p>
                <p className="text-2xl font-black flex items-center gap-2">
                  {pendingCount === 0 ? 'Verified ✅' : 'Action Needed ⚠️'}
                </p>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-8 rounded-[2rem] shadow-xl border border-white/40">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
               <span className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xs">⚡</span>
               Resident Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Maintenance', icon: '🛠️', action: () => {} },
                { label: 'Lease Doc', icon: '📄', action: () => setModal('lease') },
                { label: 'Concierge', icon: '📞', action: () => window.location.href = `tel:${SUPPORT_CONTACT}` },
                { label: 'Amenities', icon: '🏘️', action: () => setModal('amenities') },
              ].map((btn) => (
                <button 
                  key={btn.label}
                  onClick={btn.action}
                  className="flex flex-col items-center justify-center p-6 bg-white/40 border border-white/60 rounded-[1.5rem] hover:bg-white hover:border-blue-200 transition-all duration-300 group hover:-translate-y-1 shadow-sm hover:shadow-lg"
                >
                  <span className="text-3xl mb-3 group-hover:scale-125 transition-transform duration-300">{btn.icon}</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={`p-8 rounded-[2rem] shadow-xl border flex flex-col justify-center text-center animate-scale-in ${
            pendingCount > 0 
            ? 'bg-amber-500/10 border-amber-500/20' 
            : 'bg-emerald-500/10 border-emerald-500/20'
          }`}>
            {pendingCount > 0 ? (
              <>
                <div className="text-5xl mb-4 drop-shadow-lg">💳</div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Payments Due</h3>
                <p className="text-sm font-medium text-slate-600 mt-2 mb-8">You have {pendingCount} outstanding balance{pendingCount > 1 ? 's' : ''} on your account.</p>
                <button 
                   onClick={() => onPay(myInvoices.find(i => i.status !== PaymentStatus.PAID)!)}
                   className="w-full bg-[#00A34E] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-green-200 hover:bg-[#008a42] transition-all transform hover:scale-105"
                >
                  Pay via M-Pesa
                </button>
              </>
            ) : (
              <>
                <div className="text-5xl mb-4 drop-shadow-lg">💎</div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Prime Account</h3>
                <p className="text-sm font-medium text-slate-600 mt-2">All payments are fully settled. Thank you for being an elite resident.</p>
                <div className="mt-8 pt-8 border-t border-emerald-500/10">
                   <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Next Invoice: 1st of Next Month</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Modal for Lease Document */}
        {modal === 'lease' && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[150] p-4 animate-fade-in">
            <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-white/40 animate-scale-in">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
                <div>
                  <h3 className="text-xl font-black tracking-tight">Residency Agreement</h3>
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Official Document Copy</p>
                </div>
                <button onClick={() => setModal(null)} className="text-white/60 hover:text-white text-3xl transition">&times;</button>
              </div>
              <div className="p-10 overflow-y-auto font-serif text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50/50 custom-scroll">
                {SAMPLE_LEASE_DOC.replace('[Unit Number]', apartment?.unitNumber || 'N/A')
                                  .replace('[Amount]', apartment?.rentAmount.toLocaleString() || '0')
                                  .replace('[Start Date]', tenant?.leaseStart || 'N/A')
                                  .replace('[End Date]', tenant?.leaseEnd || 'N/A')}
              </div>
              <div className="p-8 border-t border-slate-100 flex justify-end gap-3 bg-white">
                <button 
                  onClick={() => window.print()}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-slate-800 transition"
                >
                  Print Copy
                </button>
                <button 
                  onClick={() => setModal(null)}
                  className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Amenities */}
        {modal === 'amenities' && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[150] p-4 animate-fade-in">
            <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full border border-white/40 animate-scale-in overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-blue-600 text-white">
                <div>
                  <h3 className="text-xl font-black tracking-tight">Exclusive Amenities</h3>
                  <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">Resident Perks</p>
                </div>
                <button onClick={() => setModal(null)} className="text-white/60 hover:text-white text-3xl transition">&times;</button>
              </div>
              <div className="p-10 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/50">
                {AMENITIES.map((item) => (
                  <div key={item.name} className="p-6 bg-white border border-slate-100 rounded-2xl flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <span className="text-4xl">{item.icon}</span>
                    <div>
                      <p className="font-black text-slate-800 text-sm mb-1">{item.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 border-t border-slate-100 flex justify-center bg-white">
                <button 
                  onClick={() => setModal(null)}
                  className="w-full max-w-xs bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-200"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Financial Record</h2>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Historical settlement data for {currentUser?.name}</p>
        </div>
        <div className="text-right">
           <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account ID</span>
           <span className="text-xs font-mono font-bold bg-white/50 px-3 py-1 rounded-lg border border-white/40">#{currentUser?.id.toUpperCase()}</span>
        </div>
      </div>

      <div className="glass-panel rounded-[2rem] border border-white/40 shadow-2xl overflow-hidden animate-scale-in">
        <table className="w-full text-left">
          <thead className="bg-white/40 border-b border-white/20">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Settlement</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20">
            {myInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-white/60 transition-all duration-300 group">
                <td className="px-8 py-5 text-xs font-mono text-slate-400">#{inv.id.toUpperCase()}</td>
                <td className="px-8 py-5">
                   <div className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">{inv.description}</div>
                   <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Maturity: {inv.dueDate}</div>
                </td>
                <td className="px-8 py-5 text-lg font-black text-slate-900">${inv.amount.toLocaleString()}</td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border ${
                    inv.status === PaymentStatus.PAID 
                    ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  {inv.status !== PaymentStatus.PAID ? (
                    <button 
                       onClick={() => onPay(inv)}
                       className="bg-[#00A34E] text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition shadow-lg shadow-green-100"
                    >
                      PAY NOW
                    </button>
                  ) : (
                    <button 
                      onClick={() => onShowReceipt(inv)}
                      className="bg-blue-50 text-blue-600 border border-blue-100 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition shadow-sm flex items-center gap-2 ml-auto"
                    >
                      <span>📥</span> RECEIPT
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {myInvoices.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-black uppercase tracking-widest">
                   No financial history found for this account.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TenantPortal;
