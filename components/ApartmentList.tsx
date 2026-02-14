
import React, { useState } from 'react';
import { Apartment, ApartmentStatus } from '../types';

interface ApartmentListProps {
  apartments: Apartment[];
}

const ApartmentList: React.FC<ApartmentListProps> = ({ apartments }) => {
  const [search, setSearch] = useState('');

  const filtered = apartments.filter(a => 
    a.unitNumber.toLowerCase().includes(search.toLowerCase()) ||
    a.type.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (status: ApartmentStatus) => {
    switch (status) {
      case ApartmentStatus.OCCUPIED: return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case ApartmentStatus.VACANT: return 'bg-green-500/10 text-green-700 border-green-500/20';
      case ApartmentStatus.MAINTENANCE: return 'bg-orange-500/10 text-orange-700 border-orange-500/20';
      default: return 'bg-slate-500/10 text-slate-700 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Inventory</h2>
          <p className="text-slate-600 font-medium">Manage units and occupancy</p>
        </div>
        
        <div className="flex flex-1 md:flex-none gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search units..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/40 backdrop-blur-md rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-bold text-sm"
            />
          </div>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-sm font-black hover:bg-blue-700 transition shadow-2xl shadow-blue-200 hover:scale-105 active:scale-95 whitespace-nowrap">
            + ADD UNIT
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-white/40 shadow-2xl overflow-hidden animate-scale-in">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/40 border-b border-white/20">
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Unit</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Floor</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Type</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Rent</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20">
            {filtered.map((apt) => (
              <tr key={apt.id} className="hover:bg-white/60 transition-all duration-300 group cursor-pointer">
                <td className="px-8 py-6">
                  <span className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{apt.unitNumber}</span>
                </td>
                <td className="px-8 py-6 text-sm font-bold text-slate-600">{apt.floor}</td>
                <td className="px-8 py-6 text-sm font-bold text-slate-600">
                  <span className="bg-slate-100/50 px-2 py-1 rounded-lg">{apt.type}</span>
                </td>
                <td className="px-8 py-6">
                   <span className="text-lg font-black text-slate-900">${apt.rentAmount}</span>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border ${getStatusStyle(apt.status)}`}>
                    {apt.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <button className="bg-white border border-slate-200 p-2 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition shadow-sm">
                      ✏️
                    </button>
                    <button className="bg-white border border-slate-200 p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition shadow-sm">
                      📋
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold">
                  No units matching your search found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApartmentList;
