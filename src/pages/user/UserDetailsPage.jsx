import React from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../../components/common/StatCard';
import {
  UserCheck,
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  PlayCircle,
  TrendingUp,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  Star,
  Users
} from 'lucide-react';

export const UserDetailsPage = () => {
  const { currentUser, courses } = useApp();
  const navigate = useNavigate();

  const enrolledCourses = courses.filter((c) => c.enrolled);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header User Profile Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-500/20 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{currentUser.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> {currentUser.email}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Member since {currentUser.joinedDate}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/profile')}
          className="self-start md:self-center px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
        >
          Edit Profile
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Enrolled Courses" value={enrolledCourses.length} subValue="My Active Catalog" change="Active" changeType="positive" icon={BookOpen} color="indigo" />
        <StatCard title="Learning Hours" value="48 Hours" subValue="Completed Content" change="+12h" changeLabel="this month" changeType="positive" icon={Clock} color="purple" />
        <StatCard title="Certificates Earned" value="1 Certificate" subValue="Verified Skill" change="Achieved" changeType="info" icon={Award} color="emerald" />
      </div>

      {/* Enrolled Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" /> My Enrolled Courses
          </h2>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200/60 dark:border-slate-700/60">
            {enrolledCourses.length} Active Courses
          </span>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">No courses enrolled yet</h3>
            <p className="text-xs text-slate-500">Explore the catalog and start your learning journey!</p>
            <button
              onClick={() => navigate('/courses')}
              className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {enrolledCourses.map((course) => {
              const progress = course.progress || 45;

              return (
                <div
                  key={course.id}
                  onClick={() => navigate(`/courses/${course.id}`)}
                  className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/90 overflow-hidden shadow-sm hover:shadow-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  {/* Widescreen 16:9 Thumbnail Header */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-95 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Top Overlay Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[11px] font-extrabold text-indigo-300 border border-white/15 shadow-sm">
                        {course.category}
                      </span>
                      {course.badge && (
                        <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>{course.badge}</span>
                        </span>
                      )}
                    </div>

                    {/* Bottom Overlay Rating & Level */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-amber-400 font-extrabold shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{course.rating}</span>
                        <span className="text-slate-400 font-normal text-[11px]">({course.reviewsCount || 0})</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-slate-300 border border-white/10">
                        {course.level || 'All Levels'}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    {/* Instructor Row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={course.instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={course.instructor}
                          className="w-6 h-6 rounded-full object-cover ring-2 ring-indigo-500/30"
                        />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                          {course.instructor}
                        </span>
                      </div>

                      <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                        {course.lessonsCount || 40} Lessons
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {course.subtitle}
                      </p>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="space-y-1.5 p-3 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20">
                      <div className="flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <span>Course Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-emerald-200 dark:bg-emerald-900/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{course.duration}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/courses/${course.id}`);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Continue Learning</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Activity Log */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Recent Learning Timeline</h3>
        <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
          <div className="pt-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                <PlayCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">Completed Lesson "React 19 Hooks & Context"</p>
                <p className="text-slate-500 text-[11px]">Full-Stack Web Development Bootcamp 2026</p>
              </div>
            </div>
            <span className="text-slate-400 text-[11px]">2 hours ago</span>
          </div>

          <div className="pt-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">Passed Quiz "UI Design Token Variables"</p>
                <p className="text-slate-500 text-[11px]">Score: 100% (Passed)</p>
              </div>
            </div>
            <span className="text-slate-400 text-[11px]">Yesterday</span>
          </div>
        </div>
      </div>
    </div>
  );
};
