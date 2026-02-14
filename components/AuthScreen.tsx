
import React, { useState } from 'react';
import { dbService } from '../services/databaseService';
import { UserRole, User } from '../types';

interface AuthScreenProps {
  onAuthComplete: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthComplete }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role] = useState<UserRole>(UserRole.TENANT);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const user = dbService.login(formData.email, formData.password);
      if (user) {
        onAuthComplete(user);
      } else {
        setError('Invalid email or password');
      }
    } else {
      if (!dbService.isEmailAvailable(formData.email)) {
        setError('Email already registered');
        return;
      }
      const newUser = dbService.signUp({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: role
      });
      onAuthComplete(newUser);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="max-w-md w-full relative z-20 animate-fade-in py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-600 rounded-[2rem] shadow-2xl shadow-blue-500/40 mb-6 text-5xl animate-bounce-slow">
            🏠
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">LuxeRent Pro</h1>
          <p className="text-white font-bold mt-3 text-lg drop-shadow-lg opacity-100 bg-black/20 backdrop-blur-sm inline-block px-4 py-1 rounded-full">Elite Apartment Management</p>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/40 overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
          <div className="flex bg-slate-50/50 border-b border-slate-100">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-7 text-[12px] font-black uppercase tracking-[0.3em] transition-all duration-300 ${isLogin ? 'text-blue-600 bg-white border-b-4 border-blue-600 shadow-inner' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-7 text-[12px] font-black uppercase tracking-[0.3em] transition-all duration-300 ${!isLogin ? 'text-blue-600 bg-white border-b-4 border-blue-600 shadow-inner' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-12 space-y-8">
            {!isLogin && (
              <div className="space-y-8 animate-slide-up">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Account Category</label>
                  <div className="inline-flex items-center gap-3 px-5 py-3 bg-blue-50 text-blue-700 rounded-2xl text-[11px] font-black border border-blue-100 shadow-sm">
                    <span className="text-lg">💎</span> VERIFIED RESIDENT (TENANT)
                  </div>
                </div>
                <div className="group">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 group-focus-within:text-blue-600 transition-colors">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-8 py-5 rounded-[1.5rem] border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                    placeholder="e.g. Alexander Pierce"
                  />
                </div>
                <div className="group">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 group-focus-within:text-blue-600 transition-colors">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-8 py-5 rounded-[1.5rem] border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                    placeholder="e.g. 0712345678"
                  />
                </div>
              </div>
            )}

            <div className="space-y-8">
              <div className="group">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 group-focus-within:text-blue-600 transition-colors">Email Address</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-8 py-5 rounded-[1.5rem] border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                  placeholder="name@luxerent.com"
                />
              </div>

              <div className="group">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 group-focus-within:text-blue-600 transition-colors">Private Password</label>
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-8 py-5 rounded-[1.5rem] border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-5 bg-red-50 border border-red-100 text-red-600 text-[12px] font-black rounded-[1.5rem] text-center animate-shake flex items-center justify-center gap-3">
                <span className="text-lg">⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-blue-600 text-white py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-slate-400/30 transition-all hover:scale-[1.03] active:scale-[0.98] mt-6 flex items-center justify-center gap-3"
            >
              {isLogin ? 'Authorize Entry' : 'Register Account'} <span>→</span>
            </button>
          </form>
          
          <div className="p-10 bg-slate-50 border-t border-slate-100 text-center">
             <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
               {isLogin ? "New to LuxeRent?" : "Already an elite member?"}
               <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-blue-600 font-black hover:underline transition-all"
               >
                 {isLogin ? 'Sign up now' : 'Log in here'}
               </button>
             </p>
          </div>
        </div>
        
        <p className="text-center text-white text-[11px] font-black mt-12 tracking-widest drop-shadow-md">
          © 2024 LUXERENT RESIDENCES • SECURE ACCESS PORTAL
        </p>
      </div>
      
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.05); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default AuthScreen;
