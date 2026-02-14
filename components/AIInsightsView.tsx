
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { AppState } from '../types';

interface AIInsightsViewProps {
  state: AppState;
}

const AIInsightsView: React.FC<AIInsightsViewProps> = ({ state }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAnalysis = async () => {
    setLoading(true);
    const result = await geminiService.analyzeFinancials(state.invoices, state.tenants);
    setAnalysis(result || "Failed to load insights.");
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">AI Financial Insights</h2>
        <button 
          onClick={fetchAnalysis}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition"
        >
          {loading ? 'Analyzing...' : 'Refresh Analysis ✨'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="text-8xl">💡</span>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-blue-900 mb-6 flex items-center gap-2">
              <span className="bg-blue-100 p-2 rounded-lg">✨</span>
              Gemini Pro Intelligence Report
            </h3>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                <div className="h-32 bg-slate-50 rounded mt-8"></div>
              </div>
            ) : (
              <div className="prose prose-slate max-w-none">
                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {analysis}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-2">Automated Forecasting</h4>
                <p className="text-sm text-indigo-700">Gemini uses historical payment behavior to predict next month's collection rates with 85% confidence based on current trends.</p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                <h4 className="font-bold text-emerald-900 mb-2">Policy Optimization</h4>
                <p className="text-sm text-emerald-700">The AI suggests adjusting late fee grace periods based on tenant payment clusters to maximize on-time behavior.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsView;
