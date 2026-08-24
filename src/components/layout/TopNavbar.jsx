import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  Bell,
  Search,
  Menu,
  X,
  UserCheck,
  Shield,
  GraduationCap,
  LogOut,
  User,
  ChevronDown,
  Zap,
  Info,
  Megaphone,
  CheckCheck,
  Trash2,
  ExternalLink,
  Sparkles,
  Check
} from 'lucide-react';

export const TopNavbar = ({ onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const {
    activePanel,
    switchPanel,
    currentUser,
    logout,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  } = useApp();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifTab, setNotifTab] = useState('all'); // 'all' | 'actions' | 'information' | 'announcements'

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePanelToggle = () => {
    const nextPanel = activePanel === 'admin' ? 'user' : 'admin';
    switchPanel(nextPanel);
    if (nextPanel === 'user') {
      navigate('/courses');
    } else {
      navigate('/admin/dashboard');
    }
  };

  // Filter notifications by target audience (user vs admin) based on activePanel mode
  const audienceNotifications = notifications.filter((n) => {
    if (activePanel === 'admin') {
      return n.target === 'admin' || n.target === 'all';
    }
    return n.target === 'user' || n.target === 'all';
  });

  const activeUnreadCount = audienceNotifications.filter((n) => !n.read).length;

  // Filter notifications by category tab
  const filteredNotifications = audienceNotifications.filter((n) => {
    if (notifTab === 'actions') return n.category === 'actions';
    if (notifTab === 'information') return n.category === 'information';
    if (notifTab === 'announcements') return n.category === 'announcements';
    return true;
  });

  const getCategoryIcon = (category) => {
    if (category === 'actions') {
      return (
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
          <Zap className="w-4 h-4" />
        </div>
      );
    }
    if (category === 'information') {
      return (
        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
          <Info className="w-4 h-4" />
        </div>
      );
    }
    // Announcements
    return (
      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
        <Megaphone className="w-4 h-4" />
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        {/* Left Side: Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(activePanel === 'admin' ? '/admin/dashboard' : '/courses')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider text-slate-900 dark:text-white uppercase bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                STUDY
              </span>
              <span className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-widest uppercase -mt-1">
                LMS Portal
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Global Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses, coupons, topics..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Panel Switcher Button */}
          <button
            onClick={handlePanelToggle}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              activePanel === 'admin'
                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
                : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30'
            }`}
          >
            {activePanel === 'admin' ? (
              <>
                <Shield className="w-4 h-4" />
                <span>Admin View</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>User View</span>
              </>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                setDropdownOpen(false);
              }}
              className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {activeUnreadCount > 0 && (
                <>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
                </>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 py-3 z-50 animate-fade-in overflow-hidden">
                <div className="px-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      Notifications
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        activePanel === 'admin'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                          : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                      }`}
                    >
                      {activePanel === 'admin' ? '🛡️ Admin' : '🎓 Learner'}
                    </span>
                    {activeUnreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-500/20">
                        {activeUnreadCount} New
                      </span>
                    )}
                  </div>

                  {activeUnreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark read
                    </button>
                  )}
                </div>

                <div className="px-3 py-2 bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1 overflow-x-auto text-[11px] font-bold scrollbar-none">
                  {[
                    { id: 'all', label: 'All', count: audienceNotifications.length },
                    { id: 'actions', label: '⚡ Actions', count: audienceNotifications.filter((n) => n.category === 'actions').length },
                    { id: 'information', label: 'ℹ️ Info', count: audienceNotifications.filter((n) => n.category === 'information').length },
                    { id: 'announcements', label: '📢 News', count: audienceNotifications.filter((n) => n.category === 'announcements').length }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setNotifTab(tab.id)}
                      className={`px-2.5 py-1 rounded-xl whitespace-nowrap transition-all ${
                        notifTab === tab.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>

                <div className="max-h-80 sm:max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                        <Bell className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        No notifications found
                      </p>
                      <p className="text-[11px] text-slate-400">
                        You have caught up with all updates!
                      </p>
                    </div>
                  ) : (
                    filteredNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markAsRead(notif.id);
                          if (notif.link) {
                            setNotifOpen(false);
                            navigate(notif.link);
                          }
                        }}
                        className={`group relative p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                          !notif.read
                            ? 'bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        {getCategoryIcon(notif.category)}

                        <div className="flex-1 min-w-0 pr-6 space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                              {notif.title}
                            </h4>
                            <span className="text-[10px] font-medium text-slate-400 shrink-0">
                              {notif.time}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">
                            {notif.message}
                          </p>

                          {notif.actionLabel && (
                            <div className="pt-1 flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline">
                              <span>{notif.actionLabel}</span>
                              <ExternalLink className="w-3 h-3" />
                            </div>
                          )}
                        </div>

                        <div className="absolute right-3 top-3.5 flex items-center gap-1">
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notif.id);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Dismiss notification"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-2.5 bg-slate-50/80 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium px-2">
                      {notifications.length} total alerts
                    </span>

                    <button
                      onClick={clearAllNotifications}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/40"
              />
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {currentUser.name}
                </span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                  {currentUser.role}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                </div>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  My Profile
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                    navigate('/logout');
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

