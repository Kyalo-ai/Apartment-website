
import React from 'react';
import { UserRole, User } from '../types';
import { SUPPORT_CONTACT } from '../constants';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  onShowProfile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, currentUser, onLogout, onShowProfile }) => {
  if (!currentUser) return null;

  const adminItems = [
    { id: 'dashboard', label: 'Admin Dashboard', icon: '📊' },
    { id: 'apartments', label: 'All Units', icon: '🏢' },
    { id: 'tenants', label: 'All Tenants', icon: '👥' },
    { id: 'billing', label: 'Global Billing', icon: '💳' },
    { id: 'reminders', label: 'Reminders', icon: '🔔' },
    { id: 'ai-insights', label: 'System AI', icon: '✨' },
  ];

  const landlordItems = [
    { id: 'dashboard', label: 'Portfolio Overview', icon: '📈' },
    { id: 'apartments', label: 'My Properties', icon: '🏠' },
    { id: 'billing', label: 'Rent Collections', icon: '💰' },
    { id: 'reminders', label: 'Auto-Reminders', icon: '🔔' },
  ];

  const tenantItems = [
    { id: 'my-unit', label: 'My Apartment', icon: '🔑' },
    { id: 'my-billing', label: 'My Payments', icon: '🧾' },
  ];

  const getMenuItems = () => {
    switch (currentUser.role) {
      case UserRole.ADMIN: return adminItems;
      case UserRole.LANDLORD: return landlordItems;
      case UserRole.TENANT: return tenantItems;
      default: return [];
    }
  };

  return (
    <aside className="w-64 glass-sidebar h-screen sticky top-0 flex flex-col shadow-2xl no-print">
      <div className="p-8">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tighter">
          <span className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-lg shadow-blue-200">🏠</span>
          LuxeRent
        </h1>
        <p className="text-[10px] text-blue-600 mt-2 uppercase tracking-[0.2em] font-black">
          {currentUser.role} ACCESS
        </p>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scroll">
        {getMenuItems().map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 text-sm font-bold rounded-2xl transition-all duration-300 ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-105'
                : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 space-y-4">
        <div className="bg-white/40 p-4 rounded-2xl border border-white/20">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Support Desk</p>
          <a 
            href={`tel:${SUPPORT_CONTACT}`}
            className="text-sm font-black text-blue-700 hover:underline flex items-center gap-2"
          >
            📱 {SUPPORT_CONTACT}
          </a>
        </div>

        <button 
          onClick={onShowProfile}
          className="w-full text-left group flex items-center gap-3 p-3 rounded-2xl bg-white/60 border border-white/40 shadow-lg hover:bg-white hover:border-blue-200 transition-all duration-300"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-sm font-black shadow-inner group-hover:scale-110 transition-transform">
            {currentUser.name[0]}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Account Holder</p>
            <p className="text-xs font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">{currentUser.name}</p>
          </div>
          <span className="text-slate-300 group-hover:text-blue-500 transition-colors">⚙️</span>
        </button>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3 text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50/50 rounded-xl transition-colors"
        >
          Logout Session
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
