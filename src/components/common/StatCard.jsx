import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subValue,
  change,
  changeLabel,
  changeType = 'positive',
  icon: Icon,
  color = 'indigo',
  progress,
  footerText,
  onClick
}) => {
  // Theme color maps for dynamic visual styling
  const colorThemes = {
    indigo: {
      accentLine: 'bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400',
      iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 dark:border-indigo-400/30',
      hoverGlow: 'hover:border-indigo-500/40 hover:shadow-indigo-500/10 dark:hover:border-indigo-400/40 dark:hover:shadow-indigo-500/20',
      badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60',
      progressFill: 'bg-gradient-to-r from-indigo-500 to-blue-500',
      watermark: 'text-indigo-500/5 dark:text-indigo-400/10'
    },
    emerald: {
      accentLine: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-400/30',
      hoverGlow: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10 dark:hover:border-emerald-400/40 dark:hover:shadow-emerald-500/20',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
      progressFill: 'bg-gradient-to-r from-emerald-500 to-teal-400',
      watermark: 'text-emerald-500/5 dark:text-emerald-400/10'
    },
    purple: {
      accentLine: 'bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-400',
      iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 dark:border-purple-400/30',
      hoverGlow: 'hover:border-purple-500/40 hover:shadow-purple-500/10 dark:hover:border-purple-400/40 dark:hover:shadow-purple-500/20',
      badgeBg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
      progressFill: 'bg-gradient-to-r from-purple-500 to-violet-400',
      watermark: 'text-purple-500/5 dark:text-purple-400/10'
    },
    amber: {
      accentLine: 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 dark:border-amber-400/30',
      hoverGlow: 'hover:border-amber-500/40 hover:shadow-amber-500/10 dark:hover:border-amber-400/40 dark:hover:shadow-amber-500/20',
      badgeBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
      progressFill: 'bg-gradient-to-r from-amber-500 to-orange-400',
      watermark: 'text-amber-500/5 dark:text-amber-400/10'
    },
    rose: {
      accentLine: 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400',
      iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 dark:border-rose-400/30',
      hoverGlow: 'hover:border-rose-500/40 hover:shadow-rose-500/10 dark:hover:border-rose-400/40 dark:hover:shadow-rose-500/20',
      badgeBg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
      progressFill: 'bg-gradient-to-r from-rose-500 to-pink-400',
      watermark: 'text-rose-500/5 dark:text-rose-400/10'
    },
    cyan: {
      accentLine: 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-400',
      iconBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 dark:border-cyan-400/30',
      hoverGlow: 'hover:border-cyan-500/40 hover:shadow-cyan-500/10 dark:hover:border-cyan-400/40 dark:hover:shadow-cyan-500/20',
      badgeBg: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60',
      progressFill: 'bg-gradient-to-r from-cyan-500 to-sky-400',
      watermark: 'text-cyan-500/5 dark:text-cyan-400/10'
    }
  };

  const currentTheme = colorThemes[color] || colorThemes.indigo;

  // Determine badge styling based on change type
  const getBadgeStyle = () => {
    if (changeType === 'negative') {
      return 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/60';
    }
    if (changeType === 'neutral') {
      return 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/60';
    }
    if (changeType === 'info') {
      return 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60';
    }
    // Positive default
    return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60';
  };

  const getTrendIcon = () => {
    if (changeType === 'negative') return <TrendingDown className="w-3.5 h-3.5 shrink-0 text-rose-500" />;
    if (changeType === 'info') return <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-blue-500" />;
    if (changeType === 'neutral') return <Sparkles className="w-3.5 h-3.5 shrink-0 text-slate-400" />;
    return <TrendingUp className="w-3.5 h-3.5 shrink-0 text-emerald-500" />;
  };

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        currentTheme.hoverGlow
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Top Accent Gradient Line on Hover */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${currentTheme.accentLine}`}
      />

      {/* Decorative Background Icon Watermark */}
      {Icon && (
        <div className={`absolute -right-3 -bottom-3 pointer-events-none transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 ${currentTheme.watermark}`}>
          <Icon className="w-24 h-24" />
        </div>
      )}

      {/* TIER 1: Header Row (Title + Icon) */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border shadow-sm transition-transform duration-300 group-hover:scale-110 shrink-0 ${currentTheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* TIER 2: Main Metric & Secondary SubValue */}
      <div className="relative z-10 mt-3 space-y-1.5">
        <div className="flex flex-wrap items-baseline gap-2">
          <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none break-words">
            {value}
          </h4>
        </div>

        {subValue && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
            <span className="truncate">{subValue}</span>
          </div>
        )}
      </div>

      {/* TIER 3: Trend Badge, Progress Bar, or Footer Info */}
      {(change || footerText || progress !== undefined) && (
        <div className="relative z-10 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          {/* Progress Bar IF specified */}
          {progress !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 dark:text-slate-400">
                <span>Completion</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${currentTheme.progressFill}`}
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
            {change && (
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-colors ${getBadgeStyle()}`}>
                {getTrendIcon()}
                <span>{change}</span>
                {changeLabel && <span className="font-medium opacity-80">{changeLabel}</span>}
              </div>
            )}

            {footerText && (
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                {footerText}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

