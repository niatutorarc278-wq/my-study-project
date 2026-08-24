import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import {
  DollarSign,
  CreditCard,
  Download,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Copy,
  Check,
  Eye,
  ArrowUpDown,
  BookOpen,
  Tag,
  Printer,
  TrendingUp,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Table as TableIcon,
  Mail,
  Sparkles,
  ShieldCheck,
  Zap,
  ChevronDown
} from 'lucide-react';

export const AdminPaymentsPage = () => {
  const { payments, updatePaymentStatus, showToast } = useApp();

  // Filters & View State
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('auto'); // 'auto' | 'table' | 'cards'
  const [selectedTxnIds, setSelectedTxnIds] = useState([]);
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [copiedTxnId, setCopiedTxnId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Metrics
  const totalRevenue = useMemo(() => {
    return payments
      .filter((p) => p.status === 'Completed')
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [payments]);

  const completedCount = useMemo(
    () => payments.filter((p) => p.status === 'Completed').length,
    [payments]
  );
  const pendingCount = useMemo(
    () => payments.filter((p) => p.status === 'Pending').length,
    [payments]
  );

  const avgOrderValue = useMemo(() => {
    return completedCount > 0 ? (totalRevenue / completedCount).toFixed(2) : 0;
  }, [totalRevenue, completedCount]);

  const totalDiscountSavings = useMemo(() => {
    return payments
      .filter((p) => p.status === 'Completed')
      .reduce((acc, curr) => acc + ((curr.originalPrice || curr.amount) - curr.amount), 0);
  }, [payments]);

  // Filtered & Sorted Payments
  const filteredPayments = useMemo(() => {
    return payments
      .filter((p) => {
        const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

        let matchesMethod = true;
        if (methodFilter !== 'All') {
          matchesMethod = p.paymentMethod.toLowerCase().includes(methodFilter.toLowerCase());
        }

        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          p.id.toLowerCase().includes(query) ||
          p.user.toLowerCase().includes(query) ||
          p.userEmail.toLowerCase().includes(query) ||
          p.courseTitle.toLowerCase().includes(query) ||
          (p.couponCode && p.couponCode.toLowerCase().includes(query));

        return matchesStatus && matchesMethod && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'amount-high') return b.amount - a.amount;
        if (sortBy === 'amount-low') return a.amount - b.amount;
        return 0;
      });
  }, [payments, statusFilter, methodFilter, searchQuery, sortBy]);

  // Paginated Payments
  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / itemsPerPage));
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPayments.slice(start, start + itemsPerPage);
  }, [filteredPayments, currentPage, itemsPerPage]);

  // Handle Copy Txn ID
  const handleCopyId = (id, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedTxnId(id);
    showToast(`Copied ${id} to clipboard!`, 'info');
    setTimeout(() => setCopiedTxnId(null), 2000);
  };

  // Bulk Selection Handlers
  const isAllSelected =
    paginatedPayments.length > 0 &&
    paginatedPayments.every((p) => selectedTxnIds.includes(p.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedTxnIds((prev) =>
        prev.filter((id) => !paginatedPayments.some((p) => p.id === id))
      );
    } else {
      const pageIds = paginatedPayments.map((p) => p.id);
      setSelectedTxnIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleSelectRow = (id, e) => {
    if (e) e.stopPropagation();
    setSelectedTxnIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // CSV Export Generator
  const handleExportCSV = (listToExport = filteredPayments) => {
    if (listToExport.length === 0) {
      showToast('No records available to export', 'error');
      return;
    }

    const headers = [
      'Transaction ID',
      'Customer Name',
      'Customer Email',
      'Course Title',
      'Date',
      'Payment Method',
      'Coupon',
      'Original Price',
      'Paid Amount',
      'Status',
      'Gateway Ref'
    ];
    const rows = listToExport.map((p) => [
      p.id,
      `"${p.user}"`,
      `"${p.userEmail}"`,
      `"${p.courseTitle.replace(/"/g, '""')}"`,
      `"${p.date}"`,
      `"${p.paymentMethod}"`,
      `"${p.couponCode || 'None'}"`,
      p.originalPrice || p.amount,
      p.amount,
      p.status,
      `"${p.gatewayRef || 'N/A'}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `financial_audit_${new Date().toISOString().substring(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${listToExport.length} transaction records to CSV!`, 'success');
  };

  // Bulk Status Update
  const handleBulkStatusUpdate = (newStatus) => {
    selectedTxnIds.forEach((id) => updatePaymentStatus(id, newStatus));
    showToast(`Updated ${selectedTxnIds.length} transactions to ${newStatus}`, 'success');
    setSelectedTxnIds([]);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Financial Revenue & Audit
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-xs">
              <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
              Live Gateway Log
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time transaction log, digital receipts, payment breakdown, and financial audits.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-between sm:justify-end">
          {/* Layout View Switcher */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
            <button
              onClick={() => setViewMode('auto')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'auto'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Auto Responsive View"
            >
              Auto
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Force Desktop Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Force Modern Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() =>
              handleExportCSV(
                selectedTxnIds.length > 0
                  ? payments.filter((p) => selectedTxnIds.includes(p.id))
                  : filteredPayments
              )
            }
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>
              {selectedTxnIds.length > 0 ? `Export (${selectedTxnIds.length})` : 'Export CSV'}
            </span>
          </button>
        </div>
      </div>

      {/* Modern High-Impact Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue Card */}
        <div className="relative group p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-white to-white dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900 border border-emerald-500/20 dark:border-emerald-500/30 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Gross Revenue
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h4>
          </div>
          <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            <TrendingUp className="w-3 h-3" /> +18.4% vs last month
          </p>
        </div>

        {/* Completed Orders Card */}
        <div className="relative group p-5 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-white to-white dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-900 border border-indigo-500/20 dark:border-indigo-500/30 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Completed Orders
            </span>
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {completedCount} Orders
            </h4>
          </div>
          <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
            <ShieldCheck className="w-3 h-3" />
            {payments.length ? Math.round((completedCount / payments.length) * 100) : 0}% order success rate
          </p>
        </div>

        {/* Pending Escrow Card */}
        <div className="relative group p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-white to-white dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 border border-amber-500/20 dark:border-amber-500/30 shadow-sm hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pending Escrow
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {pendingCount} Pending
            </h4>
          </div>
          <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
            <Zap className="w-3 h-3" /> {pendingCount > 0 ? 'Action needed' : 'All transactions cleared'}
          </p>
        </div>

        {/* Avg Order Value Card */}
        <div className="relative group p-5 rounded-3xl bg-gradient-to-br from-purple-500/10 via-white to-white dark:from-purple-950/20 dark:via-slate-900 dark:to-slate-900 border border-purple-500/20 dark:border-purple-500/30 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Avg Order Value (AOV)
            </span>
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ₹{Number(avgOrderValue).toLocaleString('en-IN')}
            </h4>
          </div>
          <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
            <Tag className="w-3 h-3" /> ₹{totalDiscountSavings.toLocaleString()} saved in coupons
          </p>
        </div>
      </div>

      {/* Main Financial Data Container */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 sm:space-y-6">
        {/* Controls, Filters & Search Toolbar */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
            {/* Status Pills */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 overflow-x-auto no-scrollbar w-full lg:w-auto">
              {['All', 'Completed', 'Pending', 'Refunded'].map((status) => {
                const count =
                  status === 'All'
                    ? payments.length
                    : payments.filter((p) => p.status === status).length;
                return (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setCurrentPage(1);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 flex-1 sm:flex-none justify-center cursor-pointer ${
                      statusFilter === status
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {status}
                    <span
                      className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                        statusFilter === status
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                          : 'bg-slate-200 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Dropdown Filters & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* Payment Method Selector */}
              <div className="relative flex-1 sm:w-38">
                <select
                  value={methodFilter}
                  onChange={(e) => {
                    setMethodFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-3 pr-8 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="All">All Methods</option>
                  <option value="UPI">UPI / NetBanking</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Razorpay">Razorpay</option>
                  <option value="PayPal">PayPal</option>
                </select>
                <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>

              {/* Sort Selector */}
              <div className="relative flex-1 sm:w-38">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount-high">Highest Amount</option>
                  <option value="amount-low">Lowest Amount</option>
                </select>
                <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Txn ID, user, course..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bulk Selection Bar */}
          {selectedTxnIds.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  {selectedTxnIds.length} transaction{selectedTxnIds.length > 1 ? 's' : ''} selected
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleBulkStatusUpdate('Completed')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('Refunded')}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Mark Refunded
                </button>
                <button
                  onClick={() => setSelectedTxnIds([])}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {paginatedPayments.length === 0 ? (
          <div className="py-12 text-center text-slate-400 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="flex flex-col items-center gap-2">
              <Search className="w-8 h-8 stroke-1 text-slate-300" />
              <p className="font-bold text-slate-600 dark:text-slate-300">No matching transactions found</p>
              <p className="text-xs text-slate-400">Try adjusting your filter parameters or search query.</p>
              <button
                onClick={() => {
                  setStatusFilter('All');
                  setMethodFilter('All');
                  setSearchQuery('');
                }}
                className="mt-2 text-indigo-600 font-bold hover:underline cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* PRECISE SINGLE-LINE DESKTOP TABLE VIEW */}
            <div
              className={`overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs ${
                viewMode === 'cards'
                  ? 'hidden'
                  : viewMode === 'table'
                  ? 'block'
                  : 'hidden md:block'
              }`}
            >
              <table className="w-full text-left text-xs align-middle">
                <thead>
                  <tr className="bg-slate-50/90 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap">
                    <th className="py-3.5 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-4">Txn ID</th>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Customer Name</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Purchased Course</th>
                    <th className="py-3.5 px-4">Payment Method</th>
                    <th className="py-3.5 px-4">Coupon</th>
                    <th className="py-3.5 px-4 text-right">Amount</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                  {paginatedPayments.map((p) => {
                    const isSelected = selectedTxnIds.includes(p.id);
                    const isCopied = copiedTxnId === p.id;

                    return (
                      <tr
                        key={p.id}
                        onClick={() => setActiveInvoice(p)}
                        className={`group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer ${
                          isSelected ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                        }`}
                      >
                        <td className="py-3.5 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(p.id, e)}
                            className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-slate-900 dark:text-slate-100 text-xs">
                              {p.id}
                            </span>
                            <button
                              onClick={(e) => handleCopyId(p.id, e)}
                              title="Copy Transaction ID"
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                            >
                              {isCopied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400 font-medium">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {p.date}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shadow-xs flex-shrink-0">
                              {p.user.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                              {p.user}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {p.userEmail}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap max-w-[240px]">
                          <div className="flex items-center gap-1.5" title={p.courseTitle}>
                            <BookOpen className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                            <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                              {p.courseTitle}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                            <CreditCard className="w-3 h-3 text-indigo-500" />
                            {p.paymentMethod}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {p.couponCode && p.couponCode !== 'None' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-[10px] border border-indigo-200/50 dark:border-indigo-800/50">
                              <Tag className="w-2.5 h-2.5" />
                              {p.couponCode}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono">—</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap font-black text-slate-900 dark:text-slate-100 text-sm">
                          ₹{p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>

                        <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="relative inline-block text-left group/status">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-2xs cursor-pointer ${
                                p.status === 'Completed'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                  : p.status === 'Pending'
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              }`}
                            >
                              {p.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                              {p.status === 'Pending' && <Clock className="w-3 h-3" />}
                              {p.status === 'Refunded' && <RotateCcw className="w-3 h-3" />}
                              {p.status}
                            </span>

                            <div className="hidden group-hover/status:flex flex-col absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-20">
                              <button
                                onClick={() => updatePaymentStatus(p.id, 'Completed')}
                                className="px-3 py-1.5 text-left text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"
                              >
                                Mark Completed
                              </button>
                              <button
                                onClick={() => updatePaymentStatus(p.id, 'Pending')}
                                className="px-3 py-1.5 text-left text-[11px] font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer"
                              >
                                Mark Pending
                              </button>
                              <button
                                onClick={() => updatePaymentStatus(p.id, 'Refunded')}
                                className="px-3 py-1.5 text-left text-[11px] font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                              >
                                Issue Refund
                              </button>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setActiveInvoice(p)}
                            title="View Full Invoice"
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:border-indigo-300 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ULTRA-ATTRACTIVE MODERN TRANSACTION CARD GRID / LIST VIEW */}
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 ${
                viewMode === 'table'
                  ? 'hidden'
                  : viewMode === 'cards'
                  ? 'grid'
                  : 'grid md:hidden'
              }`}
            >
              {paginatedPayments.map((p) => {
                const isSelected = selectedTxnIds.includes(p.id);
                const isCopied = copiedTxnId === p.id;
                const discountVal = p.originalPrice ? (p.originalPrice - p.amount).toFixed(2) : 0;

                return (
                  <div
                    key={p.id}
                    onClick={() => setActiveInvoice(p)}
                    className={`group relative p-5 rounded-3xl border transition-all duration-300 cursor-pointer space-y-4 overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-br from-indigo-50/90 via-white to-white dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 border-indigo-500/60 dark:border-indigo-500/60 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                        : 'bg-white dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 hover:border-indigo-400/80 dark:hover:border-indigo-500/60 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1'
                    }`}
                  >
                    {/* Background Subtle Accent Glow */}
                    <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform pointer-events-none"></div>

                    {/* Card Header Row */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(p.id, e)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
                          <span className="font-mono font-black text-slate-900 dark:text-slate-100 text-xs">
                            {p.id}
                          </span>
                          <button
                            onClick={(e) => handleCopyId(p.id, e)}
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                            title="Copy Transaction ID"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Status Dropdown Pill */}
                      <div className="relative group/cardstatus" onClick={(e) => e.stopPropagation()}>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-2xs cursor-pointer ${
                            p.status === 'Completed'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : p.status === 'Pending'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {p.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {p.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                          {p.status === 'Refunded' && <RotateCcw className="w-3.5 h-3.5" />}
                          {p.status}
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                        </span>

                        <div className="hidden group-hover/cardstatus:flex flex-col absolute right-0 top-full mt-1 w-34 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-30">
                          <button
                            onClick={() => updatePaymentStatus(p.id, 'Completed')}
                            className="px-3 py-1.5 text-left text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"
                          >
                            Mark Completed
                          </button>
                          <button
                            onClick={() => updatePaymentStatus(p.id, 'Pending')}
                            className="px-3 py-1.5 text-left text-xs font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer"
                          >
                            Mark Pending
                          </button>
                          <button
                            onClick={() => updatePaymentStatus(p.id, 'Refunded')}
                            className="px-3 py-1.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                          >
                            Issue Refund
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Customer Profile Section */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-sm flex items-center justify-center shadow-md shadow-indigo-500/20 flex-shrink-0">
                          {p.user.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 truncate">
                            {p.user}
                          </h5>
                          <p className="text-xs text-slate-400 truncate flex items-center gap-1 font-mono">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {p.userEmail}
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg flex-shrink-0">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {p.date}
                      </span>
                    </div>

                    {/* Purchased Course Inner Block */}
                    <div className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 space-y-2">
                      <div className="flex items-start gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xs text-slate-900 dark:text-slate-100 leading-snug">
                            {p.courseTitle}
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                              <CreditCard className="w-3 h-3 text-indigo-500" />
                              {p.paymentMethod}
                            </span>

                            {p.couponCode && p.couponCode !== 'None' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200/50 dark:border-indigo-800/50">
                                <Tag className="w-2.5 h-2.5" />
                                {p.couponCode}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Amount Paid & Action Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <div>
                        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                          Net Paid Amount
                        </p>
                        <p className="font-black text-slate-900 dark:text-slate-100 text-lg tracking-tight">
                          ₹{p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveInvoice(p);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Receipt
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Table/Cards Footer: Stats & Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center justify-between sm:justify-start gap-4 text-xs text-slate-500">
            <p>
              Showing <span className="font-bold text-slate-900 dark:text-slate-100">{paginatedPayments.length}</span> of{' '}
              <span className="font-bold text-slate-900 dark:text-slate-100">{filteredPayments.length}</span> records
            </p>
            <div className="flex items-center gap-1.5">
              <span>Per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1 text-xs border border-transparent font-medium cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {activeInvoice && (
        <Modal
          isOpen={!!activeInvoice}
          onClose={() => setActiveInvoice(null)}
          title={`Digital Receipt - ${activeInvoice.id}`}
        >
          <div className="space-y-5">
            {/* Header Banner */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                  Official Payment Voucher
                </p>
                <h3 className="text-lg font-mono font-bold text-indigo-400">
                  {activeInvoice.id}
                </h3>
                <p className="text-xs text-slate-300">{activeInvoice.date}</p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  activeInvoice.status === 'Completed'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : activeInvoice.status === 'Pending'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                {activeInvoice.status}
              </span>
            </div>

            {/* Customer & Payment Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                  Customer Info
                </p>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {activeInvoice.user}
                </p>
                <p className="text-slate-500">{activeInvoice.userEmail}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                  Payment Method
                </p>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {activeInvoice.paymentMethod}
                </p>
                <p className="text-slate-500 font-mono text-[11px]">
                  Ref: {activeInvoice.gatewayRef || 'N/A'}
                </p>
              </div>
            </div>

            {/* Course Item Line Item */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex justify-between">
                <span>Description</span>
                <span>Amount</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      {activeInvoice.courseTitle}
                    </p>
                    <p className="text-[11px] text-slate-400">Full Course Access Credential</p>
                  </div>
                  <span className="font-mono font-bold text-xs text-slate-900 dark:text-slate-100">
                    ₹
                    {(activeInvoice.originalPrice || activeInvoice.amount).toLocaleString('en-IN', {
                      minimumFractionDigits: 2
                    })}
                  </span>
                </div>

                {activeInvoice.couponCode && activeInvoice.couponCode !== 'None' && (
                  <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 text-xs">
                    <span className="flex items-center gap-1 font-mono">
                      <Tag className="w-3 h-3" /> Voucher ({activeInvoice.couponCode})
                    </span>
                    <span className="font-mono font-bold">
                      -₹
                      {(
                        (activeInvoice.originalPrice || activeInvoice.amount) -
                        activeInvoice.amount
                      ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between items-center text-slate-900 dark:text-slate-100 font-black text-sm">
                  <span>Net Amount Paid</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                    ₹{activeInvoice.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Status Control Inside Invoice Modal */}
            <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Update Order Status:
              </span>
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <button
                  onClick={() => {
                    updatePaymentStatus(activeInvoice.id, 'Completed');
                    setActiveInvoice((prev) => ({ ...prev, status: 'Completed' }));
                  }}
                  className={`flex-1 sm:flex-initial px-2.5 py-1.5 rounded-lg font-bold cursor-pointer text-center ${
                    activeInvoice.status === 'Completed'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-500 hover:text-white'
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => {
                    updatePaymentStatus(activeInvoice.id, 'Pending');
                    setActiveInvoice((prev) => ({ ...prev, status: 'Pending' }));
                  }}
                  className={`flex-1 sm:flex-initial px-2.5 py-1.5 rounded-lg font-bold cursor-pointer text-center ${
                    activeInvoice.status === 'Pending'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-500 hover:text-white'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => {
                    updatePaymentStatus(activeInvoice.id, 'Refunded');
                    setActiveInvoice((prev) => ({ ...prev, status: 'Refunded' }));
                  }}
                  className={`flex-1 sm:flex-initial px-2.5 py-1.5 rounded-lg font-bold cursor-pointer text-center ${
                    activeInvoice.status === 'Refunded'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-500 hover:text-white'
                  }`}
                >
                  Refunded
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Print Invoice
              </button>
              <button
                type="button"
                onClick={() => setActiveInvoice(null)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
