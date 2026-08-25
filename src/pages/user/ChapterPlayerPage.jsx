import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  CheckCircle2,
  PlayCircle,
  Clock,
  BookOpen,
  Lock,
  Check,
  Play,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Award,
  Zap,
  ShieldAlert
} from 'lucide-react';

export const ChapterPlayerPage = () => {
  const { id, chapterId } = useParams();
  const navigate = useNavigate();
  const { courses, completedChapters, completeChapter, isChapterUnlocked, showToast } = useApp();

  const course = courses.find((c) => c.id === id);

  useEffect(() => {
    if (course && !course.enrolled) {
      showToast(`🔒 Access Locked! Please purchase "${course.title}" to watch lesson videos.`, 'error');
      navigate(`/courses/${course.id}`, { replace: true });
    } else if (!course && courses.length > 0) {
      showToast('🔒 Course not found!', 'error');
      navigate('/courses', { replace: true });
    }
  }, [course, courses, navigate, showToast]);

  if (!course || !course.enrolled) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 rounded-3xl bg-slate-900 text-white space-y-4 border border-slate-800 text-center animate-fade-in">
        <ShieldAlert className="w-16 h-16 text-rose-500 animate-bounce" />
        <h2 className="text-xl font-black">🔒 Course Video Player Locked</h2>
        <p className="text-xs text-slate-400 max-w-md">
          You have not purchased this course yet. Complete your purchase to gain instant lifetime access to all video lessons and downloadable resources!
        </p>
        <button
          onClick={() => navigate(`/courses/${course?.id || ''}`)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-lg hover:scale-105 transition-all"
        >
          View Course Details & Buy Access ➔
        </button>
      </div>
    );
  }

  // Helper to standardize units & chapters structure
  const units = course.units || (course.curriculum ? course.curriculum.map((sec, idx) => ({
    id: `unit-${idx + 1}`,
    unitNumber: idx + 1,
    title: sec.section,
    chapters: (sec.lessons || []).map((les, lIdx) => ({
      id: `${course.id}-u${idx + 1}-ch${lIdx + 1}`,
      title: `Chapter ${lIdx + 1}: ${les}`,
      duration: '12:30',
      youtubeUrl: course.youtubeUrl || 'https://www.youtube.com/embed/SqcY0GlETPk',
      summary: `In-depth practical lesson covering ${les} with hands-on coding examples.`
    }))
  })) : []);

  const allChapters = units.flatMap((u) => u.chapters || []);
  const currentChapterIndex = allChapters.findIndex((ch) => ch.id === chapterId);
  const currentChapter = allChapters[currentChapterIndex] || allChapters[0];

  const currentUnit = units.find((u) => u.chapters?.some((ch) => ch.id === currentChapter?.id)) || units[0];

  const courseCompletedList = completedChapters[course.id] || [];
  const isDone = currentChapter ? courseCompletedList.includes(currentChapter.id) : false;

  // 30% Watch Progress State (Stored per chapter)
  const storageKey = `watch_pct_${course.id}_${currentChapter?.id}`;
  const [watchPercent, setWatchPercent] = useState(() => {
    if (isDone) return 100;
    const saved = localStorage.getItem(storageKey);
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    if (isDone) {
      setWatchPercent(100);
    } else {
      const saved = localStorage.getItem(storageKey);
      setWatchPercent(saved ? parseInt(saved, 10) : 0);
    }
  }, [currentChapter?.id, isDone, storageKey]);

  const hasWatchedMin30Percent = watchPercent >= 30 || isDone;

  const prevChapter = currentChapterIndex > 0 ? allChapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex >= 0 && currentChapterIndex < allChapters.length - 1 ? allChapters[currentChapterIndex + 1] : null;

  const isNextUnlocked = nextChapter ? (isChapterUnlocked(course, nextChapter.id) && hasWatchedMin30Percent) : false;

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return 'https://www.youtube.com/embed/SqcY0GlETPk';
    if (url.includes('embed/')) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(url);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  const activeEmbedUrl = getYouTubeEmbedUrl(currentChapter?.youtubeUrl || course.youtubeUrl);

  const handleSimulateWatch = (targetPct = 35) => {
    const newPct = Math.min(100, Math.max(watchPercent, targetPct));
    setWatchPercent(newPct);
    localStorage.setItem(storageKey, newPct.toString());
    if (newPct >= 30) {
      showToast(`🔓 Minimum 30% video watched! Next chapter unlocked 🎉`, 'success');
    } else {
      showToast(`Video progress updated: ${newPct}%. Watch up to 30% to unlock next.`, 'info');
    }
  };

  const handleCompleteAndNext = () => {
    if (!currentChapter) return;

    if (!hasWatchedMin30Percent) {
      showToast(`🔒 Watch at least 30% of the video to unlock the next chapter! (Current: ${watchPercent}%)`, 'error');
      return;
    }

    completeChapter(course.id, currentChapter.id);

    if (nextChapter) {
      navigate(`/courses/${course.id}/chapters/${nextChapter.id}`);
    } else {
      showToast('🎉 Congratulations! You completed all chapters in this course!', 'success');
    }
  };

  const handleSelectChapter = (chap) => {
    const unlocked = isChapterUnlocked(course, chap.id);
    if (!unlocked) {
      const idx = allChapters.findIndex((c) => c.id === chap.id);
      const previousChapter = idx > 0 ? allChapters[idx - 1] : null;
      showToast(`🔒 Chapter Locked! Complete "${previousChapter ? previousChapter.title : 'previous chapter'}" first.`, 'error');
      return;
    }
    navigate(`/courses/${course.id}/chapters/${chap.id}`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/courses/${course.id}`)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700/60 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Overview
          </button>
          
          <div className="hidden md:block h-6 w-px bg-slate-800" />

          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block line-clamp-1">
              {course.title} • {currentUnit?.title}
            </span>
            <h1 className="text-sm sm:text-base font-extrabold text-white line-clamp-1">
              {currentChapter?.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
            Chapter {currentChapterIndex + 1} of {allChapters.length}
          </span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Main Video & Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Video Frame Box */}
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
            <iframe
              src={`${activeEmbedUrl}?autoplay=1&enablejsapi=1`}
              title={currentChapter?.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* 30% Video Watch Tracking Banner */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold">Video Watch Tracker</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-extrabold">
                  30% Min Required
                </span>
              </div>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${hasWatchedMin30Percent ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>
                {watchPercent}% Watched {hasWatchedMin30Percent ? '🔓 Unlocked' : '🔒 Locked'}
              </span>
            </div>

            {/* Watch Progress Bar */}
            <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className={`h-full transition-all duration-500 rounded-full ${hasWatchedMin30Percent ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-indigo-500'}`}
                style={{ width: `${watchPercent}%` }}
              />
              {/* 30% Marker Line */}
              <div className="absolute top-0 bottom-0 left-[30%] w-0.5 bg-amber-400 shadow-md shadow-amber-400" title="30% Unlock Requirement" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                {hasWatchedMin30Percent ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 30% video milestone reached! Next chapter is unlocked.
                  </span>
                ) : (
                  <span className="text-amber-300 font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Watch at least 30% of the video to enable the next chapter.
                  </span>
                )}
              </div>

              {!hasWatchedMin30Percent && (
                <button
                  onClick={() => handleSimulateWatch(35)}
                  className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[11px] transition-all shrink-0 shadow-md"
                >
                  ⚡ Fast Watch (Unlock 35%)
                </button>
              )}
            </div>
          </div>

          {/* Controls & Summary */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase">
                    {currentUnit?.title}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {currentChapter?.duration}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                  {currentChapter?.title}
                </h2>
              </div>
            </div>

            {/* Lesson Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lesson Summary</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                {currentChapter?.summary || 'Follow along step-by-step with the video walkthrough above.'}
              </p>
            </div>

            {/* Completion & Next/Prev Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                onClick={() => prevChapter && handleSelectChapter(prevChapter)}
                disabled={!prevChapter}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  prevChapter
                    ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    : 'bg-slate-100/50 dark:bg-slate-800/30 text-slate-400 opacity-50 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Previous Chapter
              </button>

              <button
                onClick={handleCompleteAndNext}
                disabled={!hasWatchedMin30Percent && !isDone}
                className={`w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-extrabold shadow-lg transition-all ${
                  isDone
                    ? 'bg-emerald-600/20 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-600/30'
                    : hasWatchedMin30Percent
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-500/20 hover:scale-[1.02]'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-60'
                }`}
              >
                {hasWatchedMin30Percent ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span>
                  {isDone
                    ? 'Completed ✓ (Re-complete & Next 🔓)'
                    : hasWatchedMin30Percent
                    ? 'Mark Chapter Complete & Unlock Next 🔓'
                    : `Watch 30% of Video to Unlock (${watchPercent}%/30%) 🔒`}
                </span>
              </button>

              <button
                onClick={() => nextChapter && handleSelectChapter(nextChapter)}
                disabled={!nextChapter || !isNextUnlocked}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  nextChapter && isNextUnlocked
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                    : 'bg-slate-100/50 dark:bg-slate-800/30 text-slate-400 opacity-50 cursor-not-allowed'
                }`}
              >
                Next Chapter <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Playlist */}
        <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" /> Units & Chapters Playlist
            </h3>
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              {allChapters.length} Total
            </span>
          </div>

          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
            {units.map((unit, uIdx) => (
              <div key={unit.id || uIdx} className="space-y-2">
                <div className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/70 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="line-clamp-1">{unit.title}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{unit.chapters?.length || 0} Ch</span>
                </div>

                <div className="space-y-1.5 pl-1">
                  {unit.chapters?.map((chap) => {
                    const isChapDone = courseCompletedList.includes(chap.id);
                    const isUnlocked = isChapterUnlocked(course, chap.id);
                    const isActive = currentChapter?.id === chap.id;

                    return (
                      <div
                        key={chap.id}
                        onClick={() => handleSelectChapter(chap)}
                        className={`flex items-center justify-between p-3 rounded-2xl text-xs transition-all cursor-pointer ${
                          isActive
                            ? 'bg-indigo-600 text-white font-extrabold shadow-md shadow-indigo-600/25 ring-2 ring-indigo-500/40'
                            : isChapDone
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 border border-emerald-200/60 dark:border-emerald-800/40'
                            : isUnlocked
                            ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                            : 'bg-slate-100/50 dark:bg-slate-900/30 text-slate-400 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div className="shrink-0">
                            {isChapDone ? (
                              <Check className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                            ) : isUnlocked ? (
                              <Play className={`w-3 h-3 fill-current ${isActive ? 'text-white' : 'text-indigo-500'}`} />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </div>
                          <span className="line-clamp-1 font-semibold text-[11px]">{chap.title}</span>
                        </div>

                        <span className={`text-[10px] shrink-0 font-medium ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                          {chap.duration}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
