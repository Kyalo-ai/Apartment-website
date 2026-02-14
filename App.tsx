
import React, { useState, useEffect, useCallback } from 'react';
import { MOCK_APARTMENTS, MOCK_TENANTS, MOCK_INVOICES } from './constants';
import { AppState, Invoice, PaymentStatus, UserRole, User, ReminderConfig, SentReminder } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ApartmentList from './components/ApartmentList';
import BillingView from './components/BillingView';
import AIInsightsView from './components/AIInsightsView';
import MpesaModal from './components/MpesaModal';
import TenantPortal from './components/TenantPortal';
import AuthScreen from './components/AuthScreen';
import ReminderSettings from './components/ReminderSettings';
import ReceiptModal from './components/ReceiptModal';
import { geminiService } from './services/geminiService';
import { dbService } from './services/databaseService';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isProcessingAutomation, setIsProcessingAutomation] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [state, setState] = useState<AppState>({
    apartments: MOCK_APARTMENTS,
    tenants: MOCK_TENANTS,
    invoices: MOCK_INVOICES,
    currentUser: null,
    reminderConfig: {
      enabled: true,
      sendBeforeDays: 3,
      sendAfterDays: 1,
      methods: ['EMAIL', 'SMS']
    },
    reminderLogs: []
  });

  const [aiNotice, setAiNotice] = useState<string | null>(null);
  const [isGeneratingNotice, setIsGeneratingNotice] = useState(false);
  const [activeMpesaInvoice, setActiveMpesaInvoice] = useState<Invoice | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<Invoice | null>(null);

  const addToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  // Background Generation
  useEffect(() => {
    const setGeneratedBackground = async () => {
      const bgUrl = await geminiService.generateBackgroundImage();
      if (bgUrl) {
        const bgEl = document.getElementById('app-background');
        if (bgEl) {
          bgEl.style.backgroundImage = `url('${bgUrl}')`;
          bgEl.style.opacity = '1';
        }
      }
    };
    setGeneratedBackground();
  }, []);

  // Auth Lifecycle
  useEffect(() => {
    const sessionUser = dbService.getSession();
    if (sessionUser) {
      setState(prev => ({ ...prev, currentUser: sessionUser }));
      setActiveTab(sessionUser.role === UserRole.TENANT ? 'my-unit' : 'dashboard');
    }
  }, []);

  const handleAuthComplete = (user: User) => {
    setState(prev => ({ ...prev, currentUser: user }));
    setActiveTab(user.role === UserRole.TENANT ? 'my-unit' : 'dashboard');
    addToast(`Account verified: ${user.name}`, 'success');
  };

  const handleLogout = () => {
    dbService.logout();
    setState(prev => ({ ...prev, currentUser: null }));
    addToast("Session closed", "info");
  };

  const runAutomation = async () => {
    setIsProcessingAutomation(true);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newLogs: SentReminder[] = [];

    for (const inv of state.invoices) {
      if (inv.status === PaymentStatus.PAID) continue;

      const dueDate = new Date(inv.dueDate);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let shouldSend = false;
      let type: 'PRE_DUE' | 'OVERDUE' = 'PRE_DUE';

      if (diffDays === state.reminderConfig.sendBeforeDays && diffDays > 0) {
        shouldSend = true;
        type = 'PRE_DUE';
      }
      if (Math.abs(diffDays) === state.reminderConfig.sendAfterDays && diffDays < 0) {
        shouldSend = true;
        type = 'OVERDUE';
      }

      if (shouldSend) {
        const tenant = state.tenants.find(t => t.id === inv.tenantId);
        if (tenant) {
          for (const method of state.reminderConfig.methods) {
            newLogs.push({
              id: Math.random().toString(36).substr(2, 9),
              invoiceId: inv.id,
              tenantName: tenant.name,
              sentAt: new Date().toISOString(),
              method: method,
              type: type
            });
          }
        }
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    setState(prev => ({
      ...prev,
      reminderLogs: [...prev.reminderLogs, ...newLogs]
    }));
    setIsProcessingAutomation(false);
    addToast(`Automation completed. ${newLogs.length} reminders sent.`, 'success');
  };

  const handleGenerateNotice = async (tenantId: string, invoice: Invoice) => {
    setIsGeneratingNotice(true);
    const tenant = state.tenants.find(t => t.id === tenantId);
    if (tenant) {
      const notice = await geminiService.generateLateNotice(tenant.name, invoice.amount, invoice.dueDate);
      setAiNotice(notice);
      addToast("AI notice generated successfully", "success");
    }
    setIsGeneratingNotice(false);
  };

  const handleMpesaSuccess = () => {
    if (!activeMpesaInvoice) return;

    setState(prev => ({
      ...prev,
      invoices: prev.invoices.map(inv => 
        inv.id === activeMpesaInvoice.id ? { ...inv, status: PaymentStatus.PAID } : inv
      )
    }));
    setActiveMpesaInvoice(null);
    addToast("Payment received! Receipt available.", "success");
  };

  if (!state.currentUser) {
    return (
      <div className="relative z-10 w-full h-full flex items-center justify-center animate-fade-in">
        <AuthScreen onAuthComplete={handleAuthComplete} />
      </div>
    );
  }

  const renderContent = () => {
    const user = state.currentUser!;
    
    if (user.role === UserRole.TENANT) {
      if (activeTab === 'my-unit') return <TenantPortal state={state} onPay={setActiveMpesaInvoice} onShowReceipt={setActiveReceipt} view="unit" />;
      if (activeTab === 'my-billing') return <TenantPortal state={state} onPay={setActiveMpesaInvoice} onShowReceipt={setActiveReceipt} view="billing" />;
      return <TenantPortal state={state} onPay={setActiveMpesaInvoice} onShowReceipt={setActiveReceipt} view="unit" />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard state={state} />;
      case 'apartments':
        return <ApartmentList apartments={state.apartments} />;
      case 'tenants':
        return (
          <div className="glass-panel p-8 rounded-2xl border border-white/20 text-center animate-slide-up">
             <h2 className="text-xl font-bold text-slate-800 mb-2">Tenant Management</h2>
             <p className="text-slate-600">Currently managing {state.tenants.length} active leases.</p>
             <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {state.tenants.map(t => (
                  <div key={t.id} className="p-4 border border-white/30 rounded-xl text-left bg-white/40 shadow-sm hover:scale-[1.02] hover:bg-white/60 transition-all cursor-pointer">
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-sm text-slate-600">{t.email}</div>
                    <div className="mt-2 pt-2 border-t border-white/20 text-xs font-semibold text-blue-700">
                      LEASE END: {t.leaseEnd}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        );
      case 'billing':
        return <BillingView 
          invoices={state.invoices} 
          tenants={state.tenants} 
          apartments={state.apartments}
          onGenerateNotice={handleGenerateNotice}
          onStartMpesa={(inv) => setActiveMpesaInvoice(inv)}
          onShowReceipt={setActiveReceipt}
        />;
      case 'reminders':
        return (
          <ReminderSettings 
            config={state.reminderConfig}
            logs={state.reminderLogs}
            onUpdateConfig={(reminderConfig) => {
              setState(prev => ({ ...prev, reminderConfig }));
              addToast("Settings updated", "info");
            }}
            onRunAutomation={runAutomation}
            isProcessing={isProcessingAutomation}
          />
        );
      case 'ai-insights':
        return <AIInsightsView state={state} />;
      default:
        return <Dashboard state={state} />;
    }
  };

  return (
    <div className="flex h-screen w-full relative z-10 animate-fade-in">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={state.currentUser}
        onLogout={handleLogout}
        onShowProfile={() => setShowProfile(true)}
      />
      
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scroll">
        <div className="max-w-6xl mx-auto pb-12">
          {renderContent()}
        </div>
      </main>

      {/* Global Toast Notification List */}
      <div className="fixed bottom-8 right-8 space-y-3 z-[200]">
        {toasts.map(toast => (
          <div key={toast.id} className="toast-notification animate-scale-in">
            <span className="text-lg">
              {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <p className="text-sm font-bold tracking-tight">{toast.message}</p>
          </div>
        ))}
      </div>

      {showProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[150] p-4 animate-fade-in no-print">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 border border-white/40 animate-scale-in relative">
            <button 
              onClick={() => setShowProfile(false)}
              className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition text-2xl"
            >
              &times;
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl mb-6 shadow-xl shadow-blue-200 flex items-center justify-center text-white text-4xl font-black">
                {state.currentUser?.name[0]}
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{state.currentUser?.name}</h3>
              <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Verified Account Holder</p>
              
              <div className="w-full mt-10 space-y-4 text-left">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Registered Email</p>
                   <p className="text-sm font-bold text-slate-700">{state.currentUser?.email}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact Phone</p>
                   <p className="text-sm font-bold text-slate-700">{state.currentUser?.phone || 'Not provided'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Role</p>
                   <p className="text-sm font-bold text-slate-700">{state.currentUser?.role}</p>
                </div>
              </div>

              <button 
                onClick={() => setShowProfile(false)}
                className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {activeMpesaInvoice && (
        <MpesaModal 
          amount={activeMpesaInvoice.amount}
          tenantName={state.tenants.find(t => t.id === activeMpesaInvoice.tenantId)?.name || 'Tenant'}
          onClose={() => setActiveMpesaInvoice(null)}
          onSuccess={handleMpesaSuccess}
        />
      )}

      {activeReceipt && (
        <ReceiptModal 
          invoice={activeReceipt}
          tenant={state.tenants.find(t => t.id === activeReceipt.tenantId)!}
          apartment={state.apartments.find(a => a.id === activeReceipt.apartmentId)!}
          onClose={() => setActiveReceipt(null)}
        />
      )}

      {aiNotice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in no-print">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden border border-white/40 animate-scale-in">
            <div className="p-6 border-b border-white/20 flex justify-between items-center bg-blue-600/90 text-white">
              <h3 className="text-lg font-bold">AI Generated Payment Notice</h3>
              <button onClick={() => setAiNotice(null)} className="text-white hover:opacity-70 text-2xl">&times;</button>
            </div>
            <div className="p-8 overflow-y-auto whitespace-pre-wrap font-serif text-slate-800 leading-relaxed bg-white/30 custom-scroll">
              {aiNotice}
            </div>
            <div className="p-6 border-t border-white/20 flex justify-end gap-3 bg-white/50">
              <button 
                onClick={() => setAiNotice(null)}
                className="px-6 py-2 text-sm font-semibold text-slate-600 hover:bg-white/50 rounded-xl transition"
              >
                Discard
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(aiNotice);
                  addToast("Notice copied to clipboard", "success");
                }}
                className="px-6 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}

      {(isGeneratingNotice || isProcessingAutomation) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[110] animate-fade-in no-print">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl flex items-center gap-6 border border-white/40 animate-scale-in">
             <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="font-bold text-slate-800 text-lg">
               {isGeneratingNotice ? 'Gemini is drafting your notice...' : 'Automation checking invoices...'}
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
