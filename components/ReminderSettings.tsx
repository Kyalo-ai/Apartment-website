
import React from 'react';
import { AppState, ReminderConfig, SentReminder } from '../types';

interface ReminderSettingsProps {
  config: ReminderConfig;
  logs: SentReminder[];
  onUpdateConfig: (newConfig: ReminderConfig) => void;
  onRunAutomation: () => void;
  isProcessing: boolean;
}

const ReminderSettings: React.FC<ReminderSettingsProps> = ({ config, logs, onUpdateConfig, onRunAutomation, isProcessing }) => {
  const toggleMethod = (method: 'EMAIL' | 'SMS') => {
    const methods = config.methods.includes(method)
      ? config.methods.filter(m => m !== method)
      : [...config.methods, method];
    onUpdateConfig({ ...config, methods });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Automated Reminders</h2>
          <p className="text-sm text-slate-500">Configure AI-driven SMS and Email rent reminders.</p>
        </div>
        <button 
          onClick={onRunAutomation}
          disabled={isProcessing || !config.enabled}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
        >
          {isProcessing ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : '✨ Run Automation Now'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">Configuration</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-700">Enable Automation</p>
                  <p className="text-xs text-slate-500">Auto-check daily</p>
                </div>
                <button 
                  onClick={() => onUpdateConfig({ ...config, enabled: !config.enabled })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${config.enabled ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.enabled ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pre-due Reminder</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      value={config.sendBeforeDays}
                      onChange={(e) => onUpdateConfig({ ...config, sendBeforeDays: parseInt(e.target.value) || 0 })}
                      className="w-16 px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-600">days before due date</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Overdue Reminder</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      value={config.sendAfterDays}
                      onChange={(e) => onUpdateConfig({ ...config, sendAfterDays: parseInt(e.target.value) || 0 })}
                      className="w-16 px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-600">days after due date</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Notification Methods</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleMethod('EMAIL')}
                    className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold border transition ${config.methods.includes('EMAIL') ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-400'}`}
                  >
                    📧 Email
                  </button>
                  <button 
                    onClick={() => toggleMethod('SMS')}
                    className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold border transition ${config.methods.includes('SMS') ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-400'}`}
                  >
                    📱 SMS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Reminder Activity Logs</h3>
              <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-bold">{logs.length} Total</span>
            </div>
            <div className="overflow-y-auto max-h-[500px]">
              {logs.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <p className="text-3xl mb-2">📡</p>
                  <p className="text-sm">No reminders sent yet. Automation is ready.</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest sticky top-0">
                    <tr>
                      <th className="px-6 py-3">Timestamp</th>
                      <th className="px-6 py-3">Tenant</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[...logs].reverse().map((log) => (
                      <tr key={log.id} className="text-xs hover:bg-slate-50 transition">
                        <td className="px-6 py-4 text-slate-500 font-mono">{new Date(log.sentAt).toLocaleString()}</td>
                        <td className="px-6 py-4 font-bold text-slate-700">{log.tenantName}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded ${log.type === 'OVERDUE' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {log.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1">
                            {log.method === 'SMS' ? '📱' : '📧'} {log.method}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderSettings;
