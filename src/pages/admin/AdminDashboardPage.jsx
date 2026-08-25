import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';
import {
  DollarSign,
  Users,
  BookOpen,
  Ticket,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Zap,
  Target,
  Sparkles,
  Search,
  ChevronRight,
  Calendar,
  CreditCard,
  Edit3,
  Check,
  RefreshCw,
  Award
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const {
    courses,
    coupons,
    users,
    payments,
    addCourse,
    createCoupon,
    updateCourse,
    updateTransactionStatus,
    showToast
  } = useApp();

  // State
  const [timeframe, setTimeframe] = useState('all'); // 'all' | 'month' | 'week' | 'today'
  const [chartMode, setChartMode] = useState('revenue'); // 'revenue' | 'enrollments'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [topSortBy, setTopSortBy] = useState('revenue'); // 'revenue' | 'students' | 'rating'
  const [targetGoal, setTargetGoal] = useState(50000);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoalInput, setTempGoalInput] = useState(50000);

  // Modals
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [hoveredChartPoint, setHoveredChartPoint] = useState(null);

  // Form states
  const [newCourseData, setNewCourseData] = useState({
    title: '',
    subtitle: '',
    category: 'Development',
    price: '',
    originalPrice: '',
    duration: '30 Hours',
    instructor: 'Studycademy',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    description: ''
  });

  const [newCouponData, setNewCouponData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minSpend: '0',
    expiryDate: '2026-12-31',
    description: ''
  });

  // Calculate timeframe filtered payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const pDate = p.date || '';
      if (timeframe === 'today') return pDate.includes('2026-08-19') || pDate.includes('2026-08-18');
      if (timeframe === 'week') return true; // mock data has recent transactions
      if (timeframe === 'month') return pDate.includes('2026-08');
      return true;
    });
  }, [payments, timeframe]);

  // Derived Metrics
  const totalRevenue = useMemo(() => {
    return filteredPayments
      .filter((p) => p.status === 'Completed')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  }, [filteredPayments]);

  const totalDiscountSaved = useMemo(() => {
    return filteredPayments
      .filter((p) => p.status === 'Completed')
      .reduce((sum, p) => sum + ((p.originalPrice || 0) - (p.amount || 0)), 0);
  }, [filteredPayments]);

  const activeLearnersCount = useMemo(() => {
    return users.filter((u) => u.status === 'Active').length;
  }, [users]);

  const totalPublishedCourses = useMemo(() => {
    return courses.filter((c) => c.status === 'Published').length;
  }, [courses]);

  const avgRating = useMemo(() => {
    if (courses.length === 0) return 0;
    const sum = courses.reduce((acc, c) => acc + (c.rating || 5.0), 0);
    return (sum / courses.length).toFixed(1);
  }, [courses]);

  const activeCouponsCount = useMemo(() => {
    return coupons.filter((c) => c.status === 'Active').length;
  }, [coupons]);

  // Chart Data Generation based on payments & timeframe
  const chartData = useMemo(() => {
    const days = [
      { day: 'Mon', date: 'Aug 13', revenue: 2400, enrollments: 3 },
      { day: 'Tue', date: 'Aug 14', revenue: 5998, enrollments: 7 },
      { day: 'Wed', date: 'Aug 15', revenue: 3849, enrollments: 4 },
      { day: 'Thu', date: 'Aug 16', revenue: 4499, enrollments: 5 },
      { day: 'Fri', date: 'Aug 17', revenue: 6890, enrollments: 8 },
      { day: 'Sat', date: 'Aug 18', revenue: 8450, enrollments: 11 },
      { day: 'Sun', date: 'Aug 19', revenue: totalRevenue > 0 ? Math.round(totalRevenue) : 4999, enrollments: filteredPayments.length || 6 }
    ];
    return days;
  }, [filteredPayments, totalRevenue]);

  // Category breakdown calculation
  const categoryStats = useMemo(() => {
    const categories = ['Development', 'Design', 'AI & Data', 'DevOps'];
    const map = {};
    categories.forEach((cat) => (map[cat] = { count: 0, revenue: 0 }));

    courses.forEach((c) => {
      if (map[c.category]) {
        map[c.category].count += 1;
      }
    });

    payments.forEach((p) => {
      const match = courses.find((c) => c.title === p.courseTitle);
      if (match && map[match.category] && p.status === 'Completed') {
        map[match.category].revenue += (p.amount || 0);
      }
    });

    const totalCatRevenue = Object.values(map).reduce((a, b) => a + b.revenue, 1);

    return categories.map((cat) => ({
      name: cat,
      count: map[cat].count,
      revenue: map[cat].revenue,
      percent: Math.round((map[cat].revenue / totalCatRevenue) * 100) || 25
    }));
  }, [courses, payments]);

  // Payment Method Breakdown
  const paymentMethodsStats = useMemo(() => {
    const map = { 'UPI / NetBanking': 0, 'Credit Card': 0, 'Razorpay': 0 };
    payments.forEach((p) => {
      const method = p.paymentMethod || '';
      if (method.includes('UPI')) map['UPI / NetBanking'] += 1;
      else if (method.includes('Card')) map['Credit Card'] += 1;
      else map['Razorpay'] += 1;
    });
    const total = payments.length || 1;
    return Object.entries(map).map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / total) * 100)
    }));
  }, [payments]);

  // Ranked Top Courses
  const sortedTopCourses = useMemo(() => {
    return [...courses].sort((a, b) => {
      if (topSortBy === 'revenue') {
        const revA = payments
          .filter((p) => p.courseTitle === a.title && p.status === 'Completed')
          .reduce((sum, p) => sum + (p.amount || 0), 0);
        const revB = payments
          .filter((p) => p.courseTitle === b.title && p.status === 'Completed')
          .reduce((sum, p) => sum + (p.amount || 0), 0);
        return revB - revA || b.price - a.price;
      }
      if (topSortBy === 'students') return b.studentsCount - a.studentsCount;
      return b.rating - a.rating;
    });
  }, [courses, payments, topSortBy]);

  // Filtered recent activity list
  const recentTransactions = useMemo(() => {
    return payments.filter((p) => {
      const userStr = p.user || p.user_name || '';
      const titleStr = p.courseTitle || p.course_title || '';
      const idStr = p.id || '';
      const statusStr = p.status || '';

      const matchesSearch =
        userStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        titleStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idStr.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || statusStr.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [payments, searchQuery, statusFilter]);

  // CSV Export Handler
  const exportCSVReport = () => {
    let csvContent = 'data:text/csv;charset=utf-8,ID,User,Email,Course,Amount,Coupon,Date,PaymentMethod,Status\n';
    payments.forEach((p) => {
      csvContent += `"${p.id}","${p.user}","${p.userEmail}","${p.courseTitle}",${p.amount},"${p.couponCode}","${p.date}","${p.paymentMethod}","${p.status}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lms_analytics_report_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Analytics CSV report downloaded successfully!', 'success');
  };

  // Handlers
  const handleAddCourseSubmit = (e) => {
    e.preventDefault();
    addCourse(newCourseData);
    setIsCourseModalOpen(false);
    setNewCourseData({
      title: '',
      subtitle: '',
      category: 'Development',
      price: '',
      originalPrice: '',
      duration: '30 Hours',
      instructor: 'Studycademy',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      description: ''
    });
  };

  const handleAddCouponSubmit = (e) => {
    e.preventDefault();
    createCoupon(newCouponData);
    setIsCouponModalOpen(false);
    setNewCouponData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minSpend: '0',
      expiryDate: '2026-12-31',
      description: ''
    });
  };

  const handleSaveGoal = (e) => {
    e.preventDefault();
    const val = parseFloat(tempGoalInput);
    if (val > 0) {
      setTargetGoal(val);
      setIsEditingGoal(false);
      showToast(`Monthly revenue target updated to ₹${val.toLocaleString()}`, 'success');
    }
  };

  const goalProgress = Math.min(100, Math.round((totalRevenue / targetGoal) * 100));

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 text-white p-6 sm:p-8 shadow-xl shadow-indigo-600/10">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-48 h-48 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide text-indigo-100 mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Real-Time Admin Analytics & Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Platform Executive Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/90 mt-1 max-w-xl">
              Monitor gross revenue, active student enrollments, course conversions, and coupon impacts in real time.
            </p>
          </div>

          {/* Quick Action Center */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsCourseModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs shadow-lg hover:bg-slate-100 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              Add Course
            </button>

            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-xs backdrop-blur-md transition-all"
            >
              <Ticket className="w-4 h-4" />
              New Coupon
            </button>

            <button
              onClick={exportCSVReport}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 text-white border border-purple-400/30 font-bold text-xs backdrop-blur-md transition-all"
              title="Export CSV Analytics Report"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Timeframe Filter Switcher Bar */}
        <div className="relative z-10 mt-6 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-200" />
            <span className="text-xs font-semibold text-indigo-100">Timeframe:</span>
            <div className="flex items-center p-1 rounded-xl bg-slate-950/20 backdrop-blur-md border border-white/10">
              {[
                { id: 'all', label: 'All Time' },
                { id: 'month', label: 'This Month' },
                { id: 'week', label: 'Last 7 Days' },
                { id: 'today', label: 'Today' }
              ].map((tf) => (
                <button
                  key={tf.id}
                  onClick={() => setTimeframe(tf.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    timeframe === tf.id
                      ? 'bg-white text-indigo-900 shadow-sm'
                      : 'text-indigo-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-indigo-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Live Sync Active ({filteredPayments.length} transactions match)</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Gross Platform Revenue"
          value={`₹${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subValue="Processed Payments"
          change="+18.4%"
          changeLabel="vs last period"
          changeType="positive"
          icon={DollarSign}
          color="emerald"
        />

        <StatCard
          title="Active Enrolled Users"
          value={activeLearnersCount.toLocaleString()}
          subValue="Active Platform Students"
          change="+12%"
          changeLabel="growth this month"
          changeType="positive"
          icon={Users}
          color="indigo"
        />

        <StatCard
          title="Catalog & Rating"
          value={`${totalPublishedCourses} Courses`}
          subValue={`${avgRating} ★ Average Rating`}
          change="98%"
          changeLabel="Completion"
          changeType="info"
          icon={BookOpen}
          color="purple"
          progress={98}
        />

        <StatCard
          title="Coupons & Redemptions"
          value={`${activeCouponsCount} Active`}
          subValue={`₹${totalDiscountSaved.toLocaleString()} Saved`}
          change="High"
          changeLabel="Conversion"
          changeType="positive"
          icon={Ticket}
          color="amber"
        />
      </div>

      {/* Main Grid: Interactive Multi-Mode Chart + Revenue Target Goal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Interactive Multi-Mode Chart (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Performance & Trend Analytics
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Hover over data points to inspect daily totals & conversion counts
              </p>
            </div>

            {/* Toggle Mode: Revenue vs Enrollments */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 self-start sm:self-auto">
              <button
                onClick={() => setChartMode('revenue')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  chartMode === 'revenue'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Revenue (₹)
              </button>
              <button
                onClick={() => setChartMode('enrollments')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  chartMode === 'enrollments'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Enrollments
              </button>
            </div>
          </div>

          {/* Interactive Chart Container */}
          <div className="relative pt-4">
            {/* Tooltip Overlay */}
            {hoveredChartPoint && (
              <div
                className="absolute z-20 pointer-events-none p-3 rounded-2xl bg-slate-950 text-white text-xs shadow-2xl border border-slate-800 animate-fade-in"
                style={{
                  left: `${(hoveredChartPoint.index / (chartData.length - 1)) * 75 + 10}%`,
                  top: '10%'
                }}
              >
                <p className="text-[10px] font-bold text-slate-400">{hoveredChartPoint.date} ({hoveredChartPoint.day})</p>
                <p className="text-sm font-black text-emerald-400">
                  {chartMode === 'revenue'
                    ? `₹${hoveredChartPoint.revenue.toLocaleString()}`
                    : `${hoveredChartPoint.enrollments} Students`}
                </p>
                <p className="text-[10px] text-indigo-300">Click to filter activity</p>
              </div>
            )}

            {/* SVG Visual Bars & Line Chart */}
            <div className="h-64 w-full flex items-end justify-between gap-3 pt-8 pb-6 px-4 border-b border-slate-100 dark:border-slate-800/80">
              {chartData.map((item, idx) => {
                const maxVal = chartMode === 'revenue' ? 10000 : 15;
                const currentVal = chartMode === 'revenue' ? item.revenue : item.enrollments;
                const heightPercent = Math.min(100, Math.max(15, Math.round((currentVal / maxVal) * 100)));

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredChartPoint({ ...item, index: idx })}
                    onMouseLeave={() => setHoveredChartPoint(null)}
                    className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end"
                  >
                    <div className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {chartMode === 'revenue' ? `₹${item.revenue}` : item.enrollments}
                    </div>

                    <div className="w-full max-w-[40px] bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-1 h-full flex items-end">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-xl transition-all duration-500 ${
                          chartMode === 'revenue'
                            ? 'bg-gradient-to-t from-indigo-600 to-purple-500 group-hover:from-indigo-500 group-hover:to-purple-400 shadow-md shadow-indigo-500/20'
                            : 'bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-500 group-hover:to-teal-300 shadow-md shadow-emerald-500/20'
                        }`}
                      />
                    </div>

                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 mt-3 px-2">
              <span>Showing last 7 active platform cycles</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                Peak: {chartMode === 'revenue' ? '₹8,450 (Saturday)' : '11 Enrollments (Saturday)'}
              </span>
            </div>
          </div>
        </div>

        {/* Goal Tracker Widget + Category Ratios (1 Col) */}
        <div className="space-y-6">
          {/* Target Goal Widget */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-lg space-y-4 border border-indigo-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Monthly Target</h4>
                  <p className="text-[11px] text-slate-400">Financial Revenue Benchmark</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setTempGoalInput(targetGoal);
                  setIsEditingGoal(true);
                }}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-semibold transition-colors"
                title="Edit Goal"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-2xl font-black tracking-tight text-white">
                  ₹{totalRevenue.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-indigo-300">
                  Goal: ₹{targetGoal.toLocaleString()}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700">
                <div
                  style={{ width: `${goalProgress}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-700 shadow-lg shadow-indigo-500/50"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                <span>{goalProgress}% Achieved</span>
                <span>
                  {goalProgress >= 100
                    ? '🎉 Target Surpassed!'
                    : `₹${(targetGoal - totalRevenue).toLocaleString()} remaining`}
                </span>
              </div>
            </div>
          </div>

          {/* Category Distribution Box */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Revenue by Category
            </h4>

            <div className="space-y-3">
              {categoryStats.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {cat.name} ({cat.count} courses)
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      ₹{cat.revenue.toLocaleString()} ({cat.percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${cat.percent}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Breakdown & Top Ranking Courses Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods Ratio (1 Col) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Payment Gateway Ratios
            </h3>
          </div>
          <p className="text-xs text-slate-500">Distribution across student checkout channels</p>

          <div className="space-y-4 pt-2">
            {paymentMethodsStats.map((method) => (
              <div
                key={method.name}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs border border-slate-200/60 dark:border-slate-700">
                    <CreditCard className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{method.name}</p>
                    <p className="text-[10px] text-slate-400">{method.count} Transactions</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black">
                  {method.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Courses Table (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Course Catalog Performance Leaderboard
                </h3>
              </div>
              <p className="text-xs text-slate-500">Top revenue generating & high-converting offerings</p>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Sort by:</span>
              <select
                value={topSortBy}
                onChange={(e) => setTopSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-transparent text-slate-900 dark:text-slate-100 font-bold focus:outline-none"
              >
                <option value="revenue">Gross Revenue</option>
                <option value="students">Students Enrolled</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="py-3 px-3">Course</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Rating</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Quick Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sortedTopCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-10 h-9 rounded-lg object-cover shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1 max-w-xs">
                            {course.title}
                          </p>
                          <p className="text-[10px] text-slate-400">By {course.instructor}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                        {course.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-black text-slate-900 dark:text-slate-100">
                      ₹{course.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-amber-500 font-bold">
                      {course.rating} ★ ({course.reviewsCount || 0})
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          course.status === 'Published'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() =>
                          updateCourse(course.id, {
                            status: course.status === 'Published' ? 'Draft' : 'Published'
                          })
                        }
                        className="px-2.5 py-1 rounded-xl text-[10px] font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap"
                      >
                        Set to {course.status === 'Published' ? 'Draft' : 'Published'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Filterable Recent Transactions & Activity Table Box */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Live Platform Transactions & Enrollments Log
            </h3>
            <p className="text-xs text-slate-500">Real-time payment history and audit entries</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search user, course, TXN ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-transparent text-slate-900 dark:text-slate-100 font-bold focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4">Txn ID</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Course Enrolled</th>
                <th className="py-3 px-4">Paid Amount</th>
                <th className="py-3 px-4">Coupon</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No transactions match your search filter.
                  </td>
                </tr>
              ) : (
                recentTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {txn.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100">{txn.user}</p>
                        <p className="text-[10px] text-slate-400">{txn.userEmail}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 line-clamp-1 max-w-xs">
                      {txn.courseTitle}
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900 dark:text-slate-100">
                      ₹{txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px]">
                        {txn.couponCode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{txn.date}</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() =>
                          updateTransactionStatus(
                            txn.id,
                            txn.status === 'Completed' ? 'Pending' : 'Completed'
                          )
                        }
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          txn.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {txn.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedTxn(txn)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                        title="View Full Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Course Modal */}
      <Modal isOpen={isCourseModalOpen} onClose={() => setIsCourseModalOpen(false)} title="Create New Course">
        <form onSubmit={handleAddCourseSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Course Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Master Next.js 15 Full Stack Architecture"
              value={newCourseData.title}
              onChange={(e) => setNewCourseData({ ...newCourseData, title: e.target.value })}
              className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                value={newCourseData.category}
                onChange={(e) => setNewCourseData({ ...newCourseData, category: e.target.value })}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
              >
                <option>Development</option>
                <option>Design</option>
                <option>AI & Data</option>
                <option>DevOps</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Price (₹)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="4999"
                value={newCourseData.price}
                onChange={(e) => setNewCourseData({ ...newCourseData, price: e.target.value })}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subtitle / Summary</label>
            <input
              type="text"
              required
              placeholder="Short description of key takeaways"
              value={newCourseData.subtitle}
              onChange={(e) => setNewCourseData({ ...newCourseData, subtitle: e.target.value })}
              className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCourseModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
            >
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md">
              Publish Course
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Coupon Modal */}
      <Modal isOpen={isCouponModalOpen} onClose={() => setIsCouponModalOpen(false)} title="Create Promotional Coupon">
        <form onSubmit={handleAddCouponSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Coupon Code</label>
            <input
              type="text"
              required
              placeholder="e.g. SUPER50"
              value={newCouponData.code}
              onChange={(e) => setNewCouponData({ ...newCouponData, code: e.target.value.toUpperCase() })}
              className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono font-bold uppercase focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Discount Type</label>
              <select
                value={newCouponData.discountType}
                onChange={(e) => setNewCouponData({ ...newCouponData, discountType: e.target.value })}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Value ({newCouponData.discountType === 'percentage' ? '%' : '₹'})
              </label>
              <input
                type="number"
                required
                placeholder="50"
                value={newCouponData.discountValue}
                onChange={(e) => setNewCouponData({ ...newCouponData, discountValue: e.target.value })}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCouponModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
            >
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md">
              Create Coupon
            </button>
          </div>
        </form>
      </Modal>

      {/* Target Goal Edit Modal */}
      <Modal isOpen={isEditingGoal} onClose={() => setIsEditingGoal(false)} title="Set Monthly Revenue Target">
        <form onSubmit={handleSaveGoal} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Monthly Revenue Goal (₹)
            </label>
            <input
              type="number"
              required
              value={tempGoalInput}
              onChange={(e) => setTempGoalInput(e.target.value)}
              className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none font-bold"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditingGoal(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800"
            >
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">
              Save Target Goal
            </button>
          </div>
        </form>
      </Modal>

      {/* Transaction Detail Modal */}
      <Modal isOpen={!!selectedTxn} onClose={() => setSelectedTxn(null)} title="Transaction Invoice Audit">
        {selectedTxn && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{selectedTxn.id}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedTxn.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {selectedTxn.status}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedTxn.courseTitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-600 dark:text-slate-300">
              <div>
                <span className="text-[10px] text-slate-400 block">Student Name</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedTxn.user}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Student Email</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedTxn.userEmail}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Payment Method</span>
                <span className="font-bold">{selectedTxn.paymentMethod}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Transaction Date</span>
                <span className="font-bold">{selectedTxn.date}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Original Course Price:</span>
                <span>₹{(selectedTxn.originalPrice || selectedTxn.amount).toFixed(2)}</span>
              </div>
              {selectedTxn.couponCode !== 'None' && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Coupon Applied ({selectedTxn.couponCode}):</span>
                  <span>-₹{((selectedTxn.originalPrice || selectedTxn.amount) - selectedTxn.amount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm text-slate-900 dark:text-slate-100 pt-1 border-t border-slate-200 dark:border-slate-700">
                <span>Final Paid Amount:</span>
                <span className="text-indigo-600 dark:text-indigo-400">₹{selectedTxn.amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTxn(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Close Invoice
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
