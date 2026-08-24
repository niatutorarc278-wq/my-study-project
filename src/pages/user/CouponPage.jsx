import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../../components/common/StatCard';
import { Ticket, Copy, Check, Sparkles, Clock, Percent, ShoppingBag, Zap } from 'lucide-react';

export const CouponPage = () => {
  const { coupons, showToast } = useApp();
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(null);
  const [filter, setFilter] = useState('All');

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon code '${code}' copied! Use it at checkout.`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleApplyCoupon = (code) => {
    handleCopyCode(code);
    navigate('/courses');
  };

  const filteredCoupons = coupons.filter((c) => {
    if (filter === 'Active') return c.status === 'Active';
    if (filter === 'Expired') return c.status === 'Expired';
    return true;
  });

  const activeCount = coupons.filter((c) => c.status === 'Active').length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-800 p-6 sm:p-10 text-white shadow-xl shadow-purple-600/15">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Exclusive Savings Hub
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Available Discount Coupons</h1>
          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
            Save big on your engineering learning path. Tap any active coupon code to copy and apply directly at checkout!
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Platform Vouchers" value={coupons.length} subValue="Available Offers" change="Updated" changeLabel="Live" changeType="info" icon={Ticket} color="purple" />
        <StatCard title="Active & Claimable" value={activeCount} subValue="Ready to Use" change="Verified" changeType="positive" icon={Sparkles} color="emerald" />
        <StatCard title="Max Discount Deal" value="50% OFF" subValue="Limited Time" change="Featured" changeType="positive" icon={Percent} color="indigo" />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {['All', 'Active', 'Expired'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === tab
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab} Coupons
          </button>
        ))}
      </div>

      {/* Coupon Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`relative flex flex-col justify-between p-6 rounded-3xl border transition-all duration-300 ${
              coupon.status === 'Active'
                ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-purple-500/30'
                : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60'
            }`}
          >
            {/* Top Tag & Expiry Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    coupon.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                  }`}
                >
                  {coupon.status}
                </span>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5 text-purple-500" />
                  <span>Exp: {coupon.expiryDate}</span>
                </div>
              </div>

              {/* Discount Offer */}
              <div className="space-y-1">
                <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {coupon.discountType === 'percentage'
                    ? `${coupon.discountValue}% OFF`
                    : `₹${coupon.discountValue.toLocaleString()} OFF`}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {coupon.description}
                </p>
              </div>
            </div>

            {/* Ticket Code Box & Actions */}
            <div className="mt-6 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="font-mono text-sm font-extrabold tracking-widest text-purple-600 dark:text-purple-400 uppercase">
                  {coupon.code}
                </span>
                <button
                  onClick={() => handleCopyCode(coupon.code)}
                  disabled={coupon.status !== 'Active'}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm"
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>

              {/* Apply to Catalog Button */}
              {coupon.status === 'Active' && (
                <button
                  onClick={() => handleApplyCoupon(coupon.code)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-500/20 transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Use Coupon Now</span>
                </button>
              )}

              <p className="text-[11px] text-slate-400 text-center font-medium">
                Min Spend: ₹{coupon.minSpend.toLocaleString()} • Claimed {coupon.usageCount}/{coupon.usageLimit} times
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
