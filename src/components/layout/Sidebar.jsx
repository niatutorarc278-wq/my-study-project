import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Ticket,
  Share2,
  CreditCard,
  User,
  KeyRound,
  LogOut,
  Layers,
  Users,
  DollarSign,
  LayoutDashboard,
  X
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { activePanel, switchPanel } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const adminMenuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Courses', path: '/admin/courses', icon: Layers },
    { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
    { name: 'User Details', path: '/admin/users', icon: Users },
    { name: 'Payment Details', path: '/admin/payments', icon: DollarSign }
  ];

  const userMenuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Coupons', path: '/coupons', icon: Ticket },
    { name: 'Refer & Earn', path: '/refer-earn', icon: Share2 },
    { name: 'Payment Details', path: '/payment-details', icon: CreditCard },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Change Password', path: '/change-password', icon: KeyRound },
    { name: 'Logout', path: '/logout', icon: LogOut, isDanger: true }
  ];

  const currentItems = activePanel === 'user' ? userMenuItems : adminMenuItems;

  const handleSwitchPanel = () => {
    const nextPanel = activePanel === 'admin' ? 'user' : 'admin';
    switchPanel(nextPanel);
    if (nextPanel === 'user') {
      navigate('/dashboard');
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-40 h-full lg:h-[calc(100vh-4rem)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-transform duration-300 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full py-4 px-3 justify-between">
          {/* Top Section */}
          <div className="flex flex-col gap-3">
            {/* Panel Header Indicator */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    activePanel === 'admin' ? 'bg-purple-500 animate-pulse' : 'bg-emerald-500'
                  }`}
                />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {activePanel === 'admin' ? 'Admin Panel' : 'User Panel'}
                </span>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Section */}
            <nav className="space-y-1">
              <p className="px-3 text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-2">
                Navigation Menu
              </p>
              {currentItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path === '/courses' && location.pathname.startsWith('/courses/'));

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive: linkActive }) => {
                      const active = linkActive || isActive;
                      if (item.isDanger) {
                        return `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          active
                            ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                            : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                        }`;
                      }
                      return `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        active
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 dark:bg-indigo-500'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                      }`;
                    }}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Quick Panel Switcher Footer Card */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-100 dark:to-slate-800 border border-indigo-500/20 text-center">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {activePanel === 'admin' ? 'Managing Platform' : 'Learning Mode'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Switch perspective anytime
              </p>
              <button
                onClick={handleSwitchPanel}
                className="mt-2 w-full py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors"
              >
                Switch to {activePanel === 'admin' ? 'User Panel' : 'Admin Panel'}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

