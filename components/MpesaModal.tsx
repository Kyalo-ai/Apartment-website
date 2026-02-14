
import React, { useState, useEffect } from 'react';

interface MpesaModalProps {
  amount: number;
  tenantName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const MpesaModal: React.FC<MpesaModalProps> = ({ amount, tenantName, onClose, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'input' | 'sending' | 'waiting' | 'success'>('input');
  const [error, setError] = useState('');

  const handlePay = () => {
    if (!phoneNumber.match(/^(?:254|\+254|0)?(7|1)(?:(?:[0-9][0-9])|(?:[0-9][0-9]))[0-9]{6}$/)) {
      setError('Please enter a valid M-Pesa number');
      return;
    }
    setError('');
    setStep('sending');

    // Simulate STK Push request to Safaricom
    setTimeout(() => {
      setStep('waiting');
    }, 2000);
  };

  useEffect(() => {
    if (step === 'waiting') {
      // Simulate user entering PIN on their phone
      const timer = setTimeout(() => {
        setStep('success');
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [step, onSuccess]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#00A34E] p-6 text-white text-center">
          <div className="text-3xl mb-2 font-bold">M-PESA</div>
          <p className="text-sm opacity-90">STK Push Payment Portal</p>
        </div>

        <div className="p-8">
          {step === 'input' && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-slate-500 text-sm">Amount to Pay</p>
                <h4 className="text-3xl font-bold text-slate-800">${amount.toLocaleString()}</h4>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  M-Pesa Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">+254</span>
                  <input
                    type="tel"
                    placeholder="712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={`w-full pl-14 pr-4 py-3 rounded-xl border ${error ? 'border-red-500' : 'border-slate-200'} focus:ring-2 focus:ring-[#00A34E] outline-none transition`}
                  />
                </div>
                {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
              </div>

              <button
                onClick={handlePay}
                className="w-full bg-[#00A34E] hover:bg-[#008a42] text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2"
              >
                Send STK Push
              </button>
              
              <button 
                onClick={onClose}
                className="w-full text-slate-400 text-sm font-medium hover:text-slate-600 transition"
              >
                Cancel Transaction
              </button>
            </div>
          )}

          {(step === 'sending' || step === 'waiting') && (
            <div className="text-center py-8 space-y-6">
              <div className="relative inline-block">
                <div className="w-20 h-20 border-4 border-green-100 border-t-[#00A34E] rounded-full animate-spin mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl animate-pulse">📱</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {step === 'sending' ? 'Connecting to M-Pesa...' : 'Check Your Phone'}
                </h3>
                <p className="text-slate-500 mt-2">
                  {step === 'sending' 
                    ? 'Initializing secure STK push request' 
                    : `Please enter your M-Pesa PIN on the device associated with +254${phoneNumber}`}
                </p>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex items-start gap-3 text-left">
                <span className="text-amber-500">⚠️</span>
                <p className="text-xs text-amber-700 leading-relaxed">
                  The M-Pesa prompt may take up to 30 seconds to appear. Do not close this window or refresh the page.
                </p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-[#00A34E] text-4xl animate-bounce">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Payment Successful</h3>
              <p className="text-slate-500">Transaction confirmed. Your invoice status is being updated.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MpesaModal;
