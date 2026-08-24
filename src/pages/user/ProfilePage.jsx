import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../../components/common/StatCard';
import {
  User,
  Mail,
  Phone,
  FileText,
  Camera,
  Check,
  Award,
  BookOpen,
  Sparkles,
  Shield,
  Star,
  Clock,
  PlayCircle,
  Flame,
  TrendingUp,
  Share2,
  Copy,
  CheckCircle2,
  Settings,
  Layers,
  Lock,
  Zap,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, updateProfile, courses, completedChapters, showToast } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'courses' | 'achievements' | 'settings'

  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    bio: currentUser.bio || 'Passionate software developer and lifelong learner.',
    avatar: currentUser.avatar || ''
  });

  const avatarOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  ];

  const userAchievements = [
    { title: 'Full-Stack Developer', category: 'Development', progress: 85, level: 'Level 4', icon: Zap, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30' },
    { title: 'UI/UX Design Master', category: 'Design', progress: 100, level: 'Mastery Verified', icon: Award, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
    { title: 'AI & Data Science', category: 'AI Research', progress: 40, level: 'Level 2', icon: Sparkles, color: 'text-purple-500 bg-purple-500/10 border-purple-500/30' },
    { title: 'DevOps & Cloud Native', category: 'Infrastructure', progress: 60, level: 'Level 3', icon: Star, color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' }
  ];

  const enrolledCourses = courses.filter((c) => c.enrolled);

  const totalCompletedChapters = Object.values(completedChapters || {}).reduce(
    (acc, list) => acc + (list ? list.length : 0),
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    showToast('Profile details updated successfully! 🎉', 'success');
  };

  const copyReferralCode = () => {
    if (currentUser.referralCode) {
      navigator.clipboard.writeText(currentUser.referralCode);
      showToast('Referral code copied to clipboard!', 'success');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-6xl mx-auto">
      {/* Hero Profile Glassmorphism Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-950 text-white shadow-xl border border-indigo-700/40 p-6 sm:p-8">
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-48 top-0 w-56 h-56 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          {/* Avatar & Profile Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="relative group">
              <img
                src={formData.avatar || currentUser.avatar}
                alt={formData.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white/20 shadow-2xl transition-transform group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg border border-white/20 transition-all hover:scale-110"
                title="Change Avatar"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{currentUser.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Active Student
                </span>
              </div>

              <p className="text-xs sm:text-sm text-indigo-200/90 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <Mail className="w-3.5 h-3.5" /> {currentUser.email}
                <span>•</span>
                <Clock className="w-3.5 h-3.5" /> Joined {currentUser.joinedDate}
              </p>

              <p className="text-xs text-indigo-200/70 max-w-lg line-clamp-2 italic">
                "{formData.bio}"
              </p>

              {/* Status Badges Row */}
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold text-amber-300 border border-white/15 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 7-Day Streak
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold text-indigo-200 border border-white/15 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-indigo-300" /> Level 4 Scholar
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3 shrink-0 self-center md:self-start">
            <button
              onClick={() => setActiveTab('settings')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all shadow-md"
            >
              <Settings className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Header */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: Layers },
          { id: 'courses', label: 'Enrolled Courses', icon: BookOpen, count: enrolledCourses.length },
          { id: 'achievements', label: 'Skill Badges & Mastery', icon: Award },
          { id: 'settings', label: 'Account Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* Stat Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              title="Enrolled Programs"
              value={enrolledCourses.length}
              subValue="Active Learning Tracks"
              change="Active"
              changeType="positive"
              icon={BookOpen}
              color="indigo"
            />
            <StatCard
              title="Completed Chapters"
              value={totalCompletedChapters}
              subValue="Sequential Progress"
              change="+3 this week"
              changeType="positive"
              icon={CheckCircle2}
              color="emerald"
            />
            <StatCard
              title="Total Learning Hours"
              value="48 Hours"
              subValue="Watched Content"
              change="+12h"
              changeLabel="this month"
              changeType="positive"
              icon={Clock}
              color="purple"
            />
            <StatCard
              title="Skill Certifications"
              value="1 Certificate"
              subValue="Verified Credential"
              change="Achieved"
              changeType="info"
              icon={Award}
              color="amber"
            />
          </div>

          {/* Referral Code Quick Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  Your Personal Referral Code
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Share your code with friends and earn ₹500 credits for every new student enrollment!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-black text-amber-600 dark:text-amber-400 tracking-wider">
                {currentUser.referralCode || 'STUDY-PRO-2026'}
              </span>
              <button
                type="button"
                onClick={copyReferralCode}
                className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20"
                title="Copy Code"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Skill Badges Preview */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-500" /> Learning Skill Mastery
              </h3>
              <button
                onClick={() => setActiveTab('achievements')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View All Badges ➔
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {userAchievements.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-transform hover:scale-[1.02] ${badge.color}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/80 dark:bg-slate-900/80 shadow-sm shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{badge.title}</h4>
                        <span className="text-[10px] font-semibold text-slate-500">{badge.level}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500">
                        <span>Mastery</span>
                        <span>{badge.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${badge.progress}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Enrolled Courses */}
      {activeTab === 'courses' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Enrolled Learning Programs
              </h3>
              <p className="text-xs text-slate-500">Track your progress and launch chapter video lessons.</p>
            </div>
            <button
              onClick={() => navigate('/courses')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Browse Catalog
            </button>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">No active courses enrolled yet</h4>
              <p className="text-xs text-slate-500">Explore our course catalog to start learning!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourses.map((course) => {
                const progress = course.progress || 45;

                return (
                  <div
                    key={course.id}
                    onClick={() => navigate(`/courses/${course.id}`)}
                    className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    {/* Widescreen 16:9 Thumbnail Header */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[11px] font-extrabold text-indigo-300 border border-white/15">
                          {course.category}
                        </span>
                        {course.badge && (
                          <span className="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                            {course.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                          {course.title}
                        </h4>
                        <p className="text-xs text-slate-500">Instructor: {course.instructor} • {course.duration}</p>
                      </div>

                      {/* Progress Indicator */}
                      <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                        <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <span>Course Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/courses/${course.id}`);
                        }}
                        className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md transition-all hover:scale-[1.02]"
                      >
                        <PlayCircle className="w-4 h-4" /> Continue Learning ➔
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Achievements & Badges */}
      {activeTab === 'achievements' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" /> Skill Badges & Verified Credentials
            </h3>
            <p className="text-xs text-slate-500">Earn badges as you complete units and courses.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {userAchievements.map((b, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                    <b.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">{b.title}</h4>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{b.category} • {b.level}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                    <span>Skill Progress</span>
                    <span>{b.progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${b.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Settings & Form */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in max-w-4xl mx-auto">
          {/* Avatar Selector Section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Camera className="w-4 h-4 text-indigo-500" /> Select Profile Avatar Preset
            </h3>

            <div className="flex flex-wrap items-center gap-4">
              <img
                src={formData.avatar}
                alt="Avatar Preview"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/30 shrink-0"
              />

              <div className="flex flex-wrap items-center gap-3">
                {avatarOptions.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: url })}
                    className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                      formData.avatar === url
                        ? 'border-indigo-600 ring-2 ring-indigo-500/30 scale-105'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                    {formData.avatar === url && (
                      <div className="absolute inset-0 bg-indigo-600/40 flex items-center justify-center text-white">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Personal Information Inputs */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Personal Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Referral Code (Fixed)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    disabled
                    value={currentUser.referralCode || 'STUDY-PRO-2026'}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-400 font-mono font-bold"
                  />
                  <button
                    type="button"
                    onClick={copyReferralCode}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold shrink-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Short Bio / Headline
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full p-3 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all hover:scale-105"
            >
              Save Profile Details
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
