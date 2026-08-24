import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-500 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200',
    error: 'border-rose-500/30 bg-rose-500/10 text-rose-900 dark:text-rose-200',
    info: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-900 dark:text-indigo-200'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md transition-all ${borders[toast.type] || borders.info}`}>
        {icons[toast.type] || icons.info}
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    </div>
  );
};
