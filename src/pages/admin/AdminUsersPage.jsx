import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  UserCheck,
  Shield,
  Ban,
  Search,
  Mail,
  Calendar,
  Phone,
  BookOpen,
  Tag,
  Check,
  Copy,
  Eye,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Table as TableIcon,
  Sparkles,
  UserPlus,
  Lock,
  Unlock,
  ShieldAlert,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export const AdminUsersPage = () => {
  const { users, toggleUserStatus, changeUserRole, showToast } = useApp();

  // State & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('auto'); // 'auto' | 'table' | 'cards'
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [activeUserDetail, setActiveUserDetail] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Metrics
  const totalUsers = users.length;
  const activeUsers = useMemo(() => users.filter((u) => u.status === 'Active').length, [users]);
  const adminCount = useMemo(() => users.filter((u) => u.role === 'admin').length, [users]);
  const blockedCount = useMemo(() => users.filter((u) => u.status === 'Blocked').length, [users]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        (u.phone && u.phone.toLowerCase().includes(query)) ||
        (u.referralCode && u.referralCode.toLowerCase().includes(query));

      const matchesRole = roleFilter === 'All' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'All' || u.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Paginated Users
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Handle Copy Code
  const handleCopyCode = (code, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Referral code ${code} copied!`, 'info');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Bulk Selection Handlers
  const isAllSelected =
    paginatedUsers.length > 0 && paginatedUsers.every((u) => selectedUserIds.includes(u.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUserIds((prev) =>
        prev.filter((id) => !paginatedUsers.some((u) => u.id === id))
      );
    } else {
      const pageIds = paginatedUsers.map((u) => u.id);
      setSelectedUserIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleSelectRow = (id, e) => {
    if (e) e.stopPropagation();
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Title & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              User Directory Administration
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-xs">
              <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
              Access Control & Roles
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage student & administrator accounts, permissions, enrollments, and status controls.
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
              title="Force User Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* High-Impact Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users Card */}
        <div className="relative group p-5 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-white to-white dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-900 border border-indigo-500/20 dark:border-indigo-500/30 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Registered Users
            </span>
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {totalUsers} Accounts
            </h4>
          </div>
          <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
            <UserPlus className="w-3 h-3" /> Platform learners & admins
          </p>
        </div>

        {/* Active Learners Card */}
        <div className="relative group p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-white to-white dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900 border border-emerald-500/20 dark:border-emerald-500/30 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Learners
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {activeUsers} Active
            </h4>
          </div>
          <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            <Check className="w-3 h-3" /> {totalUsers ? Math.round((activeUsers / totalUsers) * 100) : 0}% active status rate
          </p>
        </div>

        {/* Administrator Accounts Card */}
        <div className="relative group p-5 rounded-3xl bg-gradient-to-br from-purple-500/10 via-white to-white dark:from-purple-950/20 dark:via-slate-900 dark:to-slate-900 border border-purple-500/20 dark:border-purple-500/30 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Admin Accounts
            </span>
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {adminCount} Admins
            </h4>
          </div>
          <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
            <Lock className="w-3 h-3" /> Full privileges granted
          </p>
        </div>

        {/* Blocked Accounts Card */}
        <div className="relative group p-5 rounded-3xl bg-gradient-to-br from-rose-500/10 via-white to-white dark:from-rose-950/20 dark:via-slate-900 dark:to-slate-900 border border-rose-500/20 dark:border-rose-500/30 shadow-sm hover:shadow-xl hover:shadow-rose-500/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Suspended Accounts
            </span>
            <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 group-hover:scale-110 transition-transform duration-300">
              <Ban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {blockedCount} Blocked
            </h4>
          </div>
          <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
            <ShieldAlert className="w-3 h-3" /> {blockedCount > 0 ? 'Review flagged users' : 'No blocked users'}
          </p>
        </div>
      </div>

      {/* Main Directory Data Container */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 sm:space-y-6">
        {/* Filter & Search Toolbar */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
            {/* Role Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 overflow-x-auto no-scrollbar w-full lg:w-auto">
              {['All', 'user', 'admin'].map((role) => {
                const count =
                  role === 'All' ? users.length : users.filter((u) => u.role === role).length;
                return (
                  <button
                    key={role}
                    onClick={() => {
                      setRoleFilter(role);
                      setCurrentPage(1);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 flex-1 sm:flex-none justify-center capitalize cursor-pointer ${
                      roleFilter === role
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {role === 'All' ? 'All Roles' : `${role}s`}
                    <span
                      className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                        roleFilter === role
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
              {/* Status Filter */}
              <div className="relative flex-1 sm:w-36">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-3 pr-8 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active Only</option>
                  <option value="Blocked">Blocked Only</option>
                </select>
                <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name, email, referral code..."
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
        </div>

        {/* Empty State */}
        {paginatedUsers.length === 0 ? (
          <div className="py-12 text-center text-slate-400 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="flex flex-col items-center gap-2">
              <Search className="w-8 h-8 stroke-1 text-slate-300" />
              <p className="font-bold text-slate-600 dark:text-slate-300">No matching user accounts found</p>
              <p className="text-xs text-slate-400">Try adjusting your search criteria or role filters.</p>
              <button
                onClick={() => {
                  setRoleFilter('All');
                  setStatusFilter('All');
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
                    <th className="py-3.5 px-4">User Profile</th>
                    <th className="py-3.5 px-4">Email Address</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Joined Date</th>
                    <th className="py-3.5 px-4">Enrolled Courses</th>
                    <th className="py-3.5 px-4">Referral Code</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                  {paginatedUsers.map((u) => {
                    const isSelected = selectedUserIds.includes(u.id);

                    return (
                      <tr
                        key={u.id}
                        onClick={() => setActiveUserDetail(u)}
                        className={`group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer ${
                          isSelected ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(u.id, e)}
                            className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>

                        {/* User Profile */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/20 shadow-xs flex-shrink-0"
                            />
                            <span className="font-extrabold text-slate-900 dark:text-slate-100 text-xs">
                              {u.name}
                            </span>
                          </div>
                        </td>

                        {/* Email Address */}
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {u.email}
                          </span>
                        </td>

                        {/* Role Badge */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              u.role === 'admin'
                                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                                : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                            }`}
                          >
                            {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                            {u.role}
                          </span>
                        </td>

                        {/* Joined Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {u.joinedDate}
                          </span>
                        </td>

                        {/* Enrolled Courses */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 font-bold text-slate-900 dark:text-slate-100">
                            <BookOpen className="w-3 h-3 text-indigo-500" />
                            {u.enrolledCount} Courses
                          </span>
                        </td>

                        {/* Referral Code */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {u.referralCode ? (
                            <span className="inline-flex items-center gap-1 font-mono font-bold text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200/60 dark:border-slate-700/60">
                              <Tag className="w-2.5 h-2.5" />
                              {u.referralCode}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono">—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <span
                            onClick={() => toggleUserStatus(u.id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                              u.status === 'Active'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                            }`}
                          >
                            {u.status === 'Active' ? <Check className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                            {u.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => changeUserRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold cursor-pointer"
                            >
                              {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                            </button>
                            <button
                              onClick={() => setActiveUserDetail(u)}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 text-slate-600 dark:text-slate-300 cursor-pointer"
                              title="View Full User Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ULTRA-ATTRACTIVE MODERN USER CARD GRID VIEW */}
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 ${
                viewMode === 'table'
                  ? 'hidden'
                  : viewMode === 'cards'
                  ? 'grid'
                  : 'grid md:hidden'
              }`}
            >
              {paginatedUsers.map((u) => {
                const isSelected = selectedUserIds.includes(u.id);

                return (
                  <div
                    key={u.id}
                    onClick={() => setActiveUserDetail(u)}
                    className={`group relative p-5 rounded-3xl border transition-all duration-300 cursor-pointer space-y-4 overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-br from-indigo-50/90 via-white to-white dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 border-indigo-500/60 dark:border-indigo-500/60 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                        : 'bg-white dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 hover:border-indigo-400/80 dark:hover:border-indigo-500/60 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1'
                    }`}
                  >
                    {/* Glow Accent */}
                    <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform pointer-events-none"></div>

                    {/* Card Header Row */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(u.id, e)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer flex-shrink-0"
                        />
                        <div className="relative flex-shrink-0">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-10 h-10 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-xs"
                          />
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                              u.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          ></span>
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 truncate">
                            {u.name}
                          </h4>
                          <p className="text-xs text-slate-400 font-mono truncate">{u.email}</p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex-shrink-0 ${
                          u.role === 'admin'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                            : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                        }`}
                      >
                        {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                        {u.role}
                      </span>
                    </div>

                    {/* Info Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Enrolled</p>
                        <p className="font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                          {u.enrolledCount} Courses
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Member Since</p>
                        <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                          {u.joinedDate}
                        </p>
                      </div>
                    </div>

                    {/* Referral & Phone Tag */}
                    <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                      {u.referralCode && (
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-[10px] px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                          <Tag className="w-3 h-3" /> Ref: {u.referralCode}
                        </span>
                      )}

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {u.status}
                      </span>
                    </div>

                    {/* Card Action Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => changeUserRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                        >
                          {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                        </button>
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer ${
                            u.status === 'Active'
                              ? 'border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                              : 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                          }`}
                        >
                          {u.status === 'Active' ? 'Block' : 'Unblock'}
                        </button>
                      </div>

                      <button
                        onClick={() => setActiveUserDetail(u)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Directory Footer: Stats & Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center justify-between sm:justify-start gap-4 text-xs text-slate-500">
            <p>
              Showing <span className="font-bold text-slate-900 dark:text-slate-100">{paginatedUsers.length}</span> of{' '}
              <span className="font-bold text-slate-900 dark:text-slate-100">{filteredUsers.length}</span> accounts
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

      {/* User Details Modal */}
      {activeUserDetail && (
        <Modal
          isOpen={!!activeUserDetail}
          onClose={() => setActiveUserDetail(null)}
          title={`User Profile - ${activeUserDetail.name}`}
        >
          <div className="space-y-5">
            {/* User Profile Banner Header */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center gap-4">
              <img
                src={activeUserDetail.avatar}
                alt={activeUserDetail.name}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20 shadow-md"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black">{activeUserDetail.name}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      activeUserDetail.role === 'admin'
                        ? 'bg-purple-500/30 text-purple-300 border border-purple-400/30'
                        : 'bg-indigo-500/30 text-indigo-300 border border-indigo-400/30'
                    }`}
                  >
                    {activeUserDetail.role}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  {activeUserDetail.email}
                </p>
              </div>
            </div>

            {/* Profile Detail Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Phone Contact</p>
                <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-500" />
                  {activeUserDetail.phone || 'Not Provided'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Referral Code</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {activeUserDetail.referralCode || 'None'}
                  </span>
                  {activeUserDetail.referralCode && (
                    <button
                      onClick={(e) => handleCopyCode(activeUserDetail.referralCode, e)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md text-slate-400 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Joined Date</p>
                <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  {activeUserDetail.joinedDate}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Account Status</p>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    activeUserDetail.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {activeUserDetail.status}
                </span>
              </div>
            </div>

            {/* Bio */}
            {activeUserDetail.bio && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">About User</p>
                <p className="text-slate-700 dark:text-slate-300">{activeUserDetail.bio}</p>
              </div>
            )}

            {/* Quick Action Bar in Modal */}
            <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">Administrative Controls:</span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    changeUserRole(
                      activeUserDetail.id,
                      activeUserDetail.role === 'admin' ? 'user' : 'admin'
                    );
                    setActiveUserDetail((prev) => ({
                      ...prev,
                      role: prev.role === 'admin' ? 'user' : 'admin'
                    }));
                  }}
                  className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer"
                >
                  {activeUserDetail.role === 'admin' ? 'Demote to User' : 'Grant Admin Role'}
                </button>
                <button
                  onClick={() => {
                    toggleUserStatus(activeUserDetail.id);
                    setActiveUserDetail((prev) => ({
                      ...prev,
                      status: prev.status === 'Active' ? 'Blocked' : 'Active'
                    }));
                  }}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer ${
                    activeUserDetail.status === 'Active'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {activeUserDetail.status === 'Active' ? 'Block Account' : 'Activate Account'}
                </button>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveUserDetail(null)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
