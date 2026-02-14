
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { AppState, PaymentStatus, ApartmentStatus } from '../types';

interface DashboardProps {
  state: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const { apartments, invoices } = state;

  const stats = useMemo(() => {
    const totalRent = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const collected = invoices
      .filter(i => i.status === PaymentStatus.PAID)
      .reduce((sum, inv) => sum + inv.amount, 0);
    const pending = invoices
      .filter(i => i.status === PaymentStatus.PENDING || i.status === PaymentStatus.OVERDUE)
      .reduce((sum, inv) => sum + inv.amount, 0);
    const occupancy = Math.round((apartments.filter(a => a.status === ApartmentStatus.OCCUPIED).length / apartments.length) * 100);

    return { totalRent, collected, pending, occupancy };
  }, [apartments, invoices]);

  const chartData = [
    { name: 'Collected', value: stats.collected, color: '#10b981' },
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
  ];

  const occupancyData = [
    { name: 'Occupied', value: apartments.filter(a => a.status === ApartmentStatus.OCCUPIED).length, color: '#3b82f6' },
    { name: 'Vacant', value: apartments.filter(a => a.status === ApartmentStatus.VACANT).length, color: '#10b981' },
    { name: 'Maint.', value: apartments.filter(a => a.status === ApartmentStatus.MAINTENANCE).length, color: '#94a3b8' },
  ];

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">System Health</h2>
          <p className="text-slate-600 font-medium mt-1">Real-time performance metrics</p>
        </div>
        <div className="flex gap-2">
          <span className="px-4 py-2 bg-green-500/10 backdrop-blur-md text-green-700 rounded-2xl text-[10px] font-black border border-green-500/20 flex items-center gap-2 tracking-widest uppercase">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Live Analytics
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `$${stats.totalRent.toLocaleString()}`, sub: '↑ 12.4% vs L.M', color: 'blue', icon: '💎' },
          { label: 'Collected', value: `$${stats.collected.toLocaleString()}`, sub: `${Math.round((stats.collected / stats.totalRent) * 100)}% Conversion`, color: 'emerald', icon: '💰' },
          { label: 'Outstanding', value: `$${stats.pending.toLocaleString()}`, sub: 'Attention Required', color: 'amber', icon: '⚠️' },
          { label: 'Occupancy', value: `${stats.occupancy}%`, sub: `${apartments.filter(a => a.status === ApartmentStatus.VACANT).length} Free Units`, color: 'indigo', icon: '🏠' },
        ].map((item) => (
          <div key={item.label} className="glass-panel p-6 rounded-[2rem] shadow-xl hover-lift group cursor-pointer border border-white/60">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.label}</p>
              <span className="text-xl opacity-20 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 grayscale group-hover:grayscale-0">{item.icon}</span>
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{item.value}</p>
            <p className="mt-3 text-[10px] font-black text-slate-500 bg-white/40 border border-white/20 w-fit px-3 py-1.5 rounded-xl uppercase tracking-wider">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/40 shadow-2xl h-[420px] animate-scale-in">
          <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <span className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-xl text-xs shadow-lg shadow-blue-200">📊</span>
            Collection Funnel
          </h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="rgba(0,0,0,0.03)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 900}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
              <Tooltip 
                cursor={{fill: 'rgba(59, 130, 246, 0.05)', radius: [12, 12, 0, 0]}}
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', color: 'white' }} 
                itemStyle={{ color: 'white', fontWeight: 900, fontSize: '12px' }}
                labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Total']} 
              />
              <Bar dataKey="value" radius={[14, 14, 0, 0]} barSize={50}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/40 shadow-2xl h-[420px] animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <span className="bg-emerald-600 text-white w-8 h-8 flex items-center justify-center rounded-xl text-xs shadow-lg shadow-emerald-200">🏘️</span>
            Portfolio Distribution
          </h3>
          <ResponsiveContainer width="100%" height="70%">
            <PieChart>
              <Pie
                data={occupancyData}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={105}
                paddingAngle={10}
                dataKey="value"
                stroke="none"
              >
                {occupancyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity cursor-pointer" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', color: 'white' }}
                itemStyle={{ color: 'white', fontWeight: 900, fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            {occupancyData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 group cursor-default">
                <div className="w-3 h-3 rounded-full shadow-sm group-hover:scale-150 transition-transform" style={{ backgroundColor: entry.color }}></div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
