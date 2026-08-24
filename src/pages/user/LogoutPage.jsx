import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { LogOut, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const LogoutPage = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();

  const handleLoginAgain = () => {
    showToast('Welcome back! Session restored.', 'success');
    navigate('/courses');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 animate-fade-in">
      <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6 shadow-xl shadow-rose-500/10">
        <LogOut className="w-10 h-10" />
      </div>

      <div className="max-w-md space-y-3">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
          You Have Been Logged Out
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Thank you for spending time learning on Study LMS. Your progress and study stats have been safely saved.
        </p>

        <div className="pt-6">
          <button
            onClick={handleLoginAgain}
            className="inline-flex items-center gap-2 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xl shadow-indigo-600/25 transition-all"
          >
            <span>Log In Again</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
