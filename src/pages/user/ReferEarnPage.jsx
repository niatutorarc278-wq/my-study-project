import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import {
  Share2,
  Copy,
  Check,
  Gift,
  DollarSign,
  Users,
  Award,
  Sparkles,
  Trophy,
  MessageCircle,
  Send,
  Globe,
  Mail,
  ArrowRight
} from 'lucide-react';

export const ReferEarnPage = () => {
  const { referralData, showToast } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralData.referralLink);
    setCopiedLink(true);
    showToast('Referral link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralData.referralCode);
    setCopiedCode(true);
    showToast('Referral code copied!', 'success');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const shareText = encodeURIComponent(
    `Join me on Study LMS and get 15% off your first engineering course using my referral code: ${referralData.referralCode}!`
  );

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-emerald-500 hover:bg-emerald-600',
      url: `https://api.whatsapp.com/send?text=${shareText}`
    },
    {
      name: 'Telegram / X',
      icon: Send,
      color: 'bg-sky-500 hover:bg-sky-600',
      url: `https://twitter.com/intent/tweet?text=${shareText}`
    },
    {
      name: 'LinkedIn Web',
      icon: Globe,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralData.referralLink)}`
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      url: `mailto:?subject=Learn%20with%20me%20on%20Study%20LMS&body=${shareText}`
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 p-6 sm:p-10 text-white shadow-xl shadow-teal-600/15">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5 text-amber-300" /> Share & Earn Program
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Invite Friends & Earn Up To ₹25,000 Cash Rewards
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            Give your friends a 15% discount on their first course and earn ₹1,000 cash bonus for every successful enrollment!
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Cash Earned" value={`₹${referralData.totalEarned.toLocaleString()}`} subValue="Total Earnings" change="+ ₹2,000" changeLabel="this week" changeType="positive" icon={DollarSign} color="emerald" />
        <StatCard title="Pending Rewards" value={`₹${referralData.pendingRewards.toLocaleString()}`} subValue="Processing Payout" change="In Progress" changeType="neutral" icon={Gift} color="amber" />
        <StatCard title="Total Invites Sent" value={referralData.totalInvites} subValue="Invited Friends" change="Active" changeType="info" icon={Users} color="indigo" />
        <StatCard title="Successful Conversions" value={referralData.successfulConversions} subValue="Joined Platform" change="High Rate" changeType="positive" icon={Award} color="purple" />
      </div>

      {/* Referral Code & Quick Social Share Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Referral Link & Code Box */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Your Referral Code & Link</h3>
            <p className="text-xs text-slate-500">Copy your link or code and share with colleagues.</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Referral Code</label>
              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="flex-1 px-2 font-mono text-base font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400">
                  {referralData.referralCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm shrink-0"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Direct Link</label>
              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <input
                  type="text"
                  readOnly
                  value={referralData.referralLink}
                  className="flex-1 bg-transparent px-2 text-xs font-mono text-slate-700 dark:text-slate-300 focus:outline-none truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Share Grid */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Share Directly to Social</h3>
            <p className="text-xs text-slate-500">Spread the word on your favorite channels in one tap.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {socialLinks.map((platform) => {
              const Icon = platform.icon;
              return (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl text-white font-bold text-xs shadow-sm transition-transform hover:scale-[1.02] ${platform.color}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{platform.name}</span>
                </a>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center text-xs text-indigo-700 dark:text-indigo-300 font-semibold mt-4">
            💡 Pro-tip: Share on developer Discord & LinkedIn groups to reach 10x more learners!
          </div>
        </div>
      </div>

      {/* Milestone Progress Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Reward Milestones</h3>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            6 Converted Invites
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {referralData.milestones.map((m, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all ${
                m.achieved
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold">{m.title}</span>
                {m.achieved && <Check className="w-4 h-4 text-emerald-500" />}
              </div>
              <span className="text-sm font-extrabold block">{m.reward}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Invites History Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Referred Friends History</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4">Friend Name</th>
                <th className="py-3 px-4">Invite Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Earned Reward</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {referralData.invitesList.map((invite, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">{invite.name}</td>
                  <td className="py-3.5 px-4 text-slate-500">{invite.date}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        invite.status.includes('Purchased')
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {invite.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {invite.reward}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
