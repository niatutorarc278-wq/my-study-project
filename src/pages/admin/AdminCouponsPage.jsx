import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';
import {
  Ticket,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  LayoutGrid,
  List,
  Copy,
  Check,
  Percent,
  DollarSign,
  Calendar,
  Zap,
  Tag,
  Eye,
  AlertCircle,
  TrendingUp,
  ArrowUpDown
} from 'lucide-react';

export const AdminCouponsPage = () => {
  const { coupons, createCoupon, deleteCoupon, toggleCouponStatus, showToast } = useApp();

  // State
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All'); // 'All' | 'percentage' | 'fixed'
  const [selectedStatus, setSelectedStatus] = useState('All'); // 'All' | 'Active' | 'Expired'
  const [sortBy, setSortBy] = useState('discount'); // 'discount' | 'usage' | 'expiry' | 'code'

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [selectedCouponDetails, setSelectedCouponDetails] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minSpend: '0',
    expiryDate: '2026-12-31',
    usageLimit: '500',
    description: ''
  });

  // Filtered & Sorted Coupons
  const filteredCoupons = useMemo(() => {
    return coupons
      .filter((c) => {
        const matchesSearch =
          c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesType = selectedType === 'All' || c.discountType === selectedType;
        const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;
        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'discount') return b.discountValue - a.discountValue;
        if (sortBy === 'usage') return b.usageCount - a.usageCount;
        if (sortBy === 'expiry') return new Date(a.expiryDate) - new Date(b.expiryDate);
        if (sortBy === 'code') return a.code.localeCompare(b.code);
        return 0;
      });
  }, [coupons, searchQuery, selectedType, selectedStatus, sortBy]);

  // Derived Stats
  const activeCoupons = useMemo(() => coupons.filter((c) => c.status === 'Active'), [coupons]);
  const totalClaims = useMemo(() => coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0), [coupons]);

  // Copy Code Handler
  const handleCopyCode = (code, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon code "${code}" copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    createCoupon(formData);
    setIsModalOpen(false);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minSpend: '0',
      expiryDate: '2026-12-31',
      usageLimit: '500',
      description: ''
    });
  };

  // Preset Quick Fill Button Handler
  const handleApplyPreset = (code, type, value, min, desc) => {
    setFormData({
      code,
      discountType: type,
      discountValue: value.toString(),
      minSpend: min.toString(),
      expiryDate: '2026-12-31',
      usageLimit: '500',
      description: desc
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Promotional Coupons & Vouchers
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold">
              {coupons.length} Active Codes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create, track redemption limits, and manage promotional discount vouchers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Grid vs Table View Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Ticket Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Table List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" /> Create New Coupon
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Platform Vouchers"
          value={coupons.length}
          subValue="Voucher Campaigns"
          change="Updated"
          changeLabel="Live Sync"
          changeType="info"
          icon={Ticket}
          color="purple"
        />
        <StatCard
          title="Active Campaigns"
          value={`${activeCoupons.length} Active`}
          subValue="Ready to redeem"
          change="High"
          changeLabel="Conversion"
          changeType="positive"
          icon={Sparkles}
          color="emerald"
        />
        <StatCard
          title="Total Redemptions"
          value={`${totalClaims.toLocaleString()} Claims`}
          subValue="Claimed by learners"
          change="Strong"
          changeLabel="Engagement"
          changeType="positive"
          icon={CheckCircle2}
          color="indigo"
        />
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Discount Type Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'All', label: 'All Discount Types' },
              { id: 'percentage', label: 'Percentage (%)' },
              { id: 'fixed', label: 'Fixed Amount (₹)' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedType === t.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search coupon code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-transparent text-slate-900 dark:text-slate-100 focus:outline-none font-mono uppercase"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-transparent text-slate-900 dark:text-slate-100 font-bold focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-transparent text-slate-900 dark:text-slate-100 font-bold focus:outline-none"
            >
              <option value="discount">Highest Discount</option>
              <option value="usage">Most Claimed</option>
              <option value="expiry">Expiring Soonest</option>
              <option value="code">Code (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid View Mode: Responsive & Interactive Ticket Coupon Cards */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredCoupons.map((c) => {
            const isPercentage = c.discountType === 'percentage';
            const usagePercent = Math.min(100, Math.round((c.usageCount / c.usageLimit) * 100));
            const isCopied = copiedCode === c.code;

            return (
              <div
                key={c.id}
                className="group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden glow-card"
              >
                {/* Coupon Header Banner with Ticket Cutout Aesthetics */}
                <div
                  className={`relative p-5 text-white overflow-hidden ${
                    c.status === 'Active'
                      ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700'
                      : 'bg-gradient-to-r from-slate-600 to-slate-700'
                  }`}
                >
                  {/* Decorative background circle */}
                  <div className="absolute right-0 top-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

                  {/* Top Status & Type Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wide">
                      {isPercentage ? <Percent className="w-3 h-3" /> : <DollarSign className="w-3 h-3" />}
                      {isPercentage ? 'Percentage Discount' : 'Fixed Savings'}
                    </span>

                    <button
                      onClick={() => toggleCouponStatus(c.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow-xs transition-transform hover:scale-105 ${
                        c.status === 'Active'
                          ? 'bg-emerald-400 text-slate-950'
                          : 'bg-rose-400 text-slate-950'
                      }`}
                    >
                      {c.status}
                    </button>
                  </div>

                  {/* Main Value Display */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black tracking-tight">
                      {isPercentage ? `${c.discountValue}% OFF` : `₹${c.discountValue.toLocaleString()} OFF`}
                    </span>
                  </div>

                  <p className="text-xs text-purple-100/90 mt-1 line-clamp-1">
                    {c.description || 'Promotional coupon code discount.'}
                  </p>
                </div>

                {/* Ticket Dividing Line with Cutout Notches */}
                <div className="relative flex items-center justify-between px-4 my-[-12px] z-10">
                  <div className="w-5 h-5 rounded-full bg-slate-50 dark:bg-slate-950 -ml-6 border-r border-slate-200 dark:border-slate-800" />
                  <div className="flex-1 border-b-2 border-dashed border-slate-200 dark:border-slate-800 mx-2" />
                  <div className="w-5 h-5 rounded-full bg-slate-50 dark:bg-slate-950 -mr-6 border-l border-slate-200 dark:border-slate-800" />
                </div>

                {/* Card Body Details */}
                <div className="p-5 pt-6 space-y-4 flex-1 flex flex-col justify-between">
                  {/* Copyable Code Box */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Promotional Code
                      </span>
                      <span className="text-base font-mono font-black tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                        {c.code}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleCopyCode(c.code, e)}
                      className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        isCopied
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'
                      }`}
                    >
                      {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Minimum Spend & Expiry Meta */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold">Min Spend</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {c.minSpend > 0 ? `₹${c.minSpend.toLocaleString()}` : 'No Min Limit'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold">Valid Until</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{c.expiryDate}</span>
                    </div>
                  </div>

                  {/* Usage Progress Gauge */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        Redemption Usage
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {c.usageCount} / {c.usageLimit} ({usagePercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${usagePercent}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          usagePercent >= 90
                            ? 'bg-rose-500'
                            : 'bg-gradient-to-r from-purple-500 to-indigo-600'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Action Bar Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedCouponDetails(c)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect Details
                    </button>

                    <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shrink-0 whitespace-nowrap">
                      <button
                        onClick={() => deleteCoupon(c.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-400 transition-all shadow-xs"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View Mode */
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Discount Rate</th>
                  <th className="py-3 px-4">Min Spend</th>
                  <th className="py-3 px-4">Redemptions</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCoupons.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-indigo-600 dark:text-indigo-400 uppercase text-sm">
                      <div className="flex items-center gap-2">
                        <span>{c.code}</span>
                        <button
                          onClick={(e) => handleCopyCode(c.code, e)}
                          className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                          title="Copy Code"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {c.discountType === 'percentage'
                        ? `${c.discountValue}% OFF`
                        : `₹${c.discountValue.toLocaleString()} OFF`}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {c.minSpend > 0 ? `₹${c.minSpend.toLocaleString()}` : 'No Min'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                      {c.usageCount} / {c.usageLimit}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{c.expiryDate}</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleCouponStatus(c.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {c.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shrink-0 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedCouponDetails(c)}
                          className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all shadow-xs"
                          title="Inspect Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteCoupon(c.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-400 transition-all shadow-xs"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Coupon Modal with Presets */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Coupon Voucher">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick Preset Buttons */}
          <div>
            <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              Quick Preset Templates:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleApplyPreset('WELCOME50', 'percentage', 50, 2499, '50% off on first course enrollment!')
                }
                className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold border border-indigo-500/20"
              >
                50% Welcome Off
              </button>
              <button
                type="button"
                onClick={() =>
                  handleApplyPreset('FLASHSALE30', 'percentage', 30, 1999, 'Flash sale 30% off any course item!')
                }
                className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-bold border border-purple-500/20"
              >
                30% Flash Sale
              </button>
              <button
                type="button"
                onClick={() =>
                  handleApplyPreset('SAVE1000', 'fixed', 1000, 3499, 'Flat ₹1,000 instant discount over ₹3,499')
                }
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20"
              >
                Flat ₹1,000 OFF
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Coupon Code</label>
            <input
              type="text"
              required
              placeholder="e.g. FLASH50"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 uppercase font-mono tracking-wider focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Discount Type</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Discount Value ({formData.discountType === 'percentage' ? '%' : '₹'})
              </label>
              <input
                type="number"
                required
                placeholder="25"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Minimum Spend (₹)</label>
              <input
                type="number"
                value={formData.minSpend}
                onChange={(e) => setFormData({ ...formData, minSpend: e.target.value })}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Max Redemptions</label>
              <input
                type="number"
                required
                placeholder="500"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Expiry Date</label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <input
              type="text"
              placeholder="e.g. 25% off on special tech week"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800"
            >
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md">
              Create Voucher
            </button>
          </div>
        </form>
      </Modal>

      {/* Coupon Details Inspector Modal */}
      <Modal
        isOpen={!!selectedCouponDetails}
        onClose={() => setSelectedCouponDetails(null)}
        title="Promotional Coupon Inspector"
      >
        {selectedCouponDetails && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-lg tracking-wider uppercase">
                  {selectedCouponDetails.code}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold">
                  {selectedCouponDetails.status}
                </span>
              </div>
              <p className="text-sm font-bold">
                {selectedCouponDetails.discountType === 'percentage'
                  ? `${selectedCouponDetails.discountValue}% OFF Total Order`
                  : `₹${selectedCouponDetails.discountValue.toLocaleString()} Instant Savings`}
              </p>
              <p className="text-[11px] text-purple-100/90">{selectedCouponDetails.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Minimum Purchase</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedCouponDetails.minSpend > 0 ? `₹${selectedCouponDetails.minSpend.toLocaleString()}` : 'No Minimum'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Expiration Date</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedCouponDetails.expiryDate}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2">
              <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                <span>Usage Progress:</span>
                <span>
                  {selectedCouponDetails.usageCount} of {selectedCouponDetails.usageLimit} redemptions used
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((selectedCouponDetails.usageCount / selectedCouponDetails.usageLimit) * 100)
                    )}%`
                  }}
                  className="h-full bg-purple-600 rounded-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={(e) => handleCopyCode(selectedCouponDetails.code, e)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
              >
                Copy Coupon Code
              </button>
              <button
                onClick={() => setSelectedCouponDetails(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
