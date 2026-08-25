import React from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../../components/common/StatCard';
import {
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  PlayCircle,
  TrendingUp,
  Sparkles,
  Flame,
  ArrowRight,
  Ticket,
  Share2,
  CreditCard,
  Zap,
  Star,
  Users,
  ShieldCheck
} from 'lucide-react';

export const UserDashboardPage = () => {
  const { currentUser, courses, completedChapters, coupons, getCourseProgress } = useApp();
  const navigate = useNavigate();

  const enrolledCourses = courses.filter((c) => c.enrolled);
  
  // Calculate total completed chapters across all courses
  const totalCompletedChapters = Object.values(completedChapters || {}).reduce(
    (acc, list) => acc + (list ? list.length : 0),
    0
  );

  // Active course (most recently accessed or first enrolled)
  const activeCourse = enrolledCourses[0] || courses[0];
  const activeCourseProgress = getCourseProgress(activeCourse);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-950 text-white shadow-xl border border-indigo-700/40">
        {/* Decorative Background Accents */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 top-0 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Student Learning Hub</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-teal-200 to-emerald-300">{currentUser.name}</span>! 👋
            </h1>

            <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
              You are on a <span className="font-bold text-amber-300">7-Day Learning Streak 🔥</span>. Keep up the momentum to complete your next course milestone!
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-xl object-cover ring-2 ring-amber-400/80 shadow-md"
            />
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">Account Level</span>
              <h4 className="text-sm font-black text-white">{currentUser.role === 'admin' ? 'Administrator' : 'Pro Learner'}</h4>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Account Verified
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Enrolled Courses"
          value={enrolledCourses.length}
          subValue="Active Programs"
          change="Active"
          changeType="positive"
          icon={BookOpen}
          color="indigo"
        />
        <StatCard
          title="Chapters Completed"
          value={totalCompletedChapters}
          subValue="Sequential Progress"
          change="+3 this week"
          changeType="positive"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Learning Hours"
          value="48.5 hrs"
          subValue="Watched Content"
          change="+12.4 hrs"
          changeLabel="this month"
          changeType="positive"
          icon={Clock}
          color="purple"
        />
        <StatCard
          title="Active Rewards"
          value={`${coupons.filter((c) => c.status === 'Active').length} Coupons`}
          subValue="Available Discounts"
          change="Claim Ready"
          changeType="info"
          icon={Ticket}
          color="amber"
        />
      </div>

      {/* Resume Learning Spotlight Card */}
      {activeCourse && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Flame className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Continue Learning Spotlight</h3>
                <p className="text-xs text-slate-500">Pick up right where you left off in your active course.</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
              In Progress ({activeCourseProgress}%)
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <div className="relative aspect-[16/9] lg:aspect-auto lg:h-36 rounded-xl overflow-hidden bg-slate-900 shrink-0">
              <img src={activeCourse.thumbnail} alt={activeCourse.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                  <PlayCircle className="w-7 h-7 fill-white text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div>
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                  {activeCourse.category}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {activeCourse.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                  Instructor: {activeCourse.instructor} • {activeCourse.duration}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400">Course Completion</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{activeCourseProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${activeCourseProgress}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => navigate(`/courses/${activeCourse.id}`)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md shadow-indigo-600/25 transition-all hover:scale-105"
                >
                  <PlayCircle className="w-4 h-4" /> Resume Next Chapter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Access Shortcuts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div
          onClick={() => navigate('/courses')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-lg transition-all cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              Explore Course Catalog <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-slate-500 mt-1">Browse top-rated development, design, and AI masterclasses.</p>
          </div>
        </div>

        <div
          onClick={() => navigate('/coupons')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/50 hover:shadow-lg transition-all cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              Claim Promo Coupons <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-slate-500 mt-1">Apply active discount codes to unlock new learning tracks.</p>
          </div>
        </div>

        <div
          onClick={() => navigate('/refer-earn')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-lg transition-all cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              Refer Friends & Earn <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-slate-500 mt-1">Share your unique link and earn ₹500 credits per signup.</p>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Grid Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" /> My Enrolled Learning Programs
          </h3>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
            {enrolledCourses.length} Enrolled
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolledCourses.map((c) => {
            const progress = getCourseProgress(c);
            return (
              <div
                key={c.id}
                onClick={() => navigate(`/courses/${c.id}`)}
                className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/40 hover:shadow-xl transition-all cursor-pointer space-y-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-20 h-16 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-800 shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                      {c.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {c.title}
                    </h4>
                    <p className="text-xs text-slate-500">{c.instructor} • {c.duration}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">Progress</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
