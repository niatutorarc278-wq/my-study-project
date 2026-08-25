import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BuyCourseModal } from './BuyCourseModal';
import {
  ArrowLeft,
  Star,
  Clock,
  Users,
  Award,
  CheckCircle2,
  PlayCircle,
  FileText,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Check,
  MessageSquare,
  Share2,
  Heart,
  ExternalLink,
  Lock,
  Play,
  BookOpen
} from 'lucide-react';

export const CourseDetailPage = () => {
  const { id } = useParams();
  const { courses, showToast, completedChapters, isChapterUnlocked, getCourseProgress } = useApp();
  const navigate = useNavigate();
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('curriculum'); // 'curriculum' | 'overview' | 'instructor' | 'reviews'
  const [isSaved, setIsSaved] = useState(false);

  const course = courses.find((c) => c.id === id) || courses[0];

  // Helper to standardize units & chapters structure
  const units = course.units || (course.curriculum ? course.curriculum.map((sec, idx) => ({
    id: `unit-${idx + 1}`,
    unitNumber: idx + 1,
    title: sec.section,
    chapters: sec.lessons.map((les, lIdx) => ({
      id: `${course.id}-u${idx + 1}-ch${lIdx + 1}`,
      title: `Chapter ${lIdx + 1}: ${les}`,
      duration: '12:30',
      youtubeUrl: course.youtubeUrl || 'https://www.youtube.com/embed/SqcY0GlETPk',
      summary: `In-depth practical lesson covering ${les} with hands-on coding examples.`
    }))
  })) : []);

  const allChapters = units.flatMap((u) => u.chapters || []);
  const courseCompletedList = completedChapters[course.id] || [];

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return 'https://www.youtube.com/embed/SqcY0GlETPk';
    if (url.includes('embed/')) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  const handleSelectChapter = (chap) => {
    if (!course.enrolled) {
      showToast(`🔒 Course Locked! Please purchase "${course.title}" to unlock video lessons.`, 'error');
      setIsBuyModalOpen(true);
      return;
    }
    const unlocked = isChapterUnlocked(course, chap.id);
    if (!unlocked) {
      const idx = allChapters.findIndex((c) => c.id === chap.id);
      const prevChap = idx > 0 ? allChapters[idx - 1] : null;
      showToast(`🔒 Locked! Complete "${prevChap ? prevChap.title : 'previous chapter'}" first to unlock.`, 'error');
      return;
    }
    navigate(`/courses/${course.id}/chapters/${chap.id}`);
  };

  // Find first unlocked chapter or default to chapter 1
  const firstUnlockedChapter = allChapters.find((ch) => !courseCompletedList.includes(ch.id) && isChapterUnlocked(course, ch.id)) || allChapters[0];

  const totalChaptersCount = allChapters.length;
  const completedCount = courseCompletedList.length;
  const progressPercent = getCourseProgress(course);
  const previewEmbedUrl = getYouTubeEmbedUrl(course.youtubeUrl);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Back Button & Save Quick Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/courses')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsSaved(!isSaved);
              showToast(isSaved ? 'Removed from wishlist' : 'Saved to wishlist!', 'info');
            }}
            className={`p-2 rounded-xl border text-xs font-bold transition-all ${
              isSaved
                ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              showToast('Course link copied to clipboard!', 'success');
            }}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Share Course"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Left 2 Cols: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-500/20">
              {course.category}
            </span>
            {course.badge && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                {course.badge}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {course.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {course.subtitle}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-amber-500 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{course.rating}</span>
              <span className="text-slate-400 font-normal">({course.reviewsCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-400" />
              <span>{course.studentsCount} Enrolled</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-500" />
              <span>Certificate Included</span>
            </div>
          </div>

          {/* Instructor Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <img
              src={course.instructorAvatar}
              alt={course.instructor}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/30"
            />
            <div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Instructor</p>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{course.instructor}</h4>
              <p className="text-xs text-slate-500">{course.instructorTitle}</p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Course Introduction / Preview Video Box */}
        <div className="flex flex-col justify-between p-6 rounded-3xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 shadow-xl space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-600/90 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md flex items-center gap-1">
                <PlayCircle className="w-3 h-3 text-indigo-200" /> Course Preview Video
              </span>
              <a
                href={course.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
              >
                <span>Open YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
              <iframe
                src={`${previewEmbedUrl}?enablejsapi=1`}
                title={`${course.title} Introduction Preview`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="space-y-1 pt-1">
              <h4 className="text-sm font-extrabold text-white line-clamp-1">
                Course Introduction & Trailer
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                Watch the official course preview video above. Click any chapter below to launch full chapter lessons on a dedicated video player page!
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {course.enrolled ? (
              <div className="space-y-2">
                <button
                  onClick={() => firstUnlockedChapter && handleSelectChapter(firstUnlockedChapter)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
                >
                  <PlayCircle className="w-4 h-4" /> Open Chapter Video Player ➔
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsBuyModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                <ShoppingBag className="w-4 h-4" /> Buy Course Now (₹{course.price.toLocaleString()})
              </button>
            )}

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 30-Day Money Back Guarantee
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'curriculum', label: 'Units & Chapters', icon: BookOpen },
          { id: 'overview', label: 'About & Features', icon: FileText },
          { id: 'instructor', label: 'Instructor Profile', icon: Award },
          { id: 'reviews', label: 'Reviews & Feedback', icon: MessageSquare }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          {/* Progress Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" /> Course Syllabus & Sequential Chapters
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Click any unlocked chapter to launch its full video on a dedicated video player page! 🎬
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{progressPercent}%</span>
                <span className="block text-[10px] text-slate-400 font-semibold">{completedCount} of {totalChaptersCount} Done</span>
              </div>
              <div className="w-28 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Units Accordion & Chapters List */}
          <div className="space-y-6">
            {units.map((unit, uIdx) => (
              <div
                key={unit.id || uIdx}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm space-y-0"
              >
                {/* Unit Banner Header */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-100 via-slate-50 to-white dark:from-slate-800/80 dark:via-slate-800/50 dark:to-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md">
                      {unit.unitNumber || uIdx + 1}
                    </span>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                      {unit.title}
                    </h4>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                    {unit.chapters ? unit.chapters.length : 0} Chapters
                  </span>
                </div>

                {/* Chapters List */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {unit.chapters &&
                    unit.chapters.map((chap) => {
                      const isDone = courseCompletedList.includes(chap.id);
                      const isUnlocked = isChapterUnlocked(course, chap.id);

                      return (
                        <div
                          key={chap.id}
                          onClick={() => handleSelectChapter(chap)}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-3 transition-all cursor-pointer ${
                            isUnlocked
                              ? 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                              : 'bg-slate-50/50 dark:bg-slate-900/40 opacity-70 cursor-not-allowed'
                          }`}
                        >
                          {/* Left: Status Icon & Chapter Title */}
                          <div className="flex items-start gap-3.5">
                            <div className="mt-0.5 shrink-0">
                              {isDone ? (
                                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                                  <Check className="w-4 h-4 stroke-[3]" />
                                </div>
                              ) : isUnlocked ? (
                                <div className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                  <Play className="w-3 h-3 fill-current ml-0.5" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center">
                                  <Lock className="w-3.5 h-3.5" />
                                </div>
                              )}
                            </div>

                            <div className="space-y-1">
                              <h5 className={`text-xs sm:text-sm font-bold ${
                                isDone
                                  ? 'text-slate-700 dark:text-slate-300'
                                  : isUnlocked
                                  ? 'text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
                                  : 'text-slate-400 dark:text-slate-500'
                              }`}>
                                {chap.title}
                              </h5>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                {chap.summary}
                              </p>
                            </div>
                          </div>

                          {/* Right: Duration & Launch Video Page Action */}
                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{chap.duration}</span>
                            </div>

                            <div>
                              {isDone ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectChapter(chap);
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 transition-colors"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Re-watch Video
                                </button>
                              ) : isUnlocked ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectChapter(chap);
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
                                >
                                  <PlayCircle className="w-3.5 h-3.5" /> Play Full Chapter Video ➔
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold border border-slate-300/40 dark:border-slate-700/40">
                                  <Lock className="w-3.5 h-3.5" /> Locked
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Description</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Key Features Included</h3>
            <ul className="space-y-3">
              {course.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'instructor' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 max-w-2xl">
          <div className="flex items-center gap-4">
            <img
              src={course.instructorAvatar}
              alt={course.instructor}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-500/20"
            />
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{course.instructor}</h3>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{course.instructorTitle}</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Passionate educator and industry practitioner with over 10+ years of experience engineering scalable web software applications and mentoring thousands of developers worldwide.
          </p>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6 max-w-3xl">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Learner Reviews</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{course.rating} out of 5</span>
                <span className="text-xs text-slate-400">({course.reviewsCount} global ratings)</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Sarah Jenkins', date: '3 days ago', comment: 'The dedicated chapter video page with sidebar playlist navigation is so smooth! Love being able to focus on one chapter at a time.' },
              { name: 'Michael Chen', date: '1 week ago', comment: 'Clear video lessons, smooth sequential unlocking, and easy return to course catalog.' }
            ].map((rev, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{rev.name}</span>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      <BuyCourseModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        course={course}
      />
    </div>
  );
};
