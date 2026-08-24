import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { BuyCourseModal } from './BuyCourseModal';
import { StatCard } from '../../components/common/StatCard';
import {
  BookOpen,
  Star,
  Users,
  Clock,
  CheckCircle,
  ShoppingBag,
  Sparkles,
  Search,
  ArrowRight,
  Heart,
  TrendingUp,
  Award,
  SlidersHorizontal,
  PlayCircle
} from 'lucide-react';

export const CourseCatalogPage = () => {
  const { courses, currentUser, showToast } = useApp();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [wishlist, setWishlist] = useState([]);
  const [selectedCourseForBuy, setSelectedCourseForBuy] = useState(null);

  const categories = ['All', 'Development', 'Design', 'AI & Data', 'DevOps'];

  const toggleWishlist = (courseId, e) => {
    e.stopPropagation();
    if (wishlist.includes(courseId)) {
      setWishlist(wishlist.filter(id => id !== courseId));
      showToast('Removed from your saved list', 'info');
    } else {
      setWishlist([...wishlist, courseId]);
      showToast('Saved to your wishlist!', 'success');
    }
  };

  // Filter & Sort logic
  const filteredCourses = courses
    .filter((course) => {
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      // Default: popular (by students count)
      return b.studentsCount - a.studentsCount;
    });

  const enrolledCourses = courses.filter((c) => c.enrolled);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner Overview */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 p-6 sm:p-10 text-white shadow-xl shadow-indigo-600/20">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold tracking-wider uppercase border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Welcome back, {currentUser.name}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Master New Skills with Hands-on Engineering Courses
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed max-w-xl">
              Explore industry-vetted courses, interactive projects, and step-by-step guidance designed to accelerate your career.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-3 shrink-0">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-indigo-900 font-extrabold text-xs shadow-lg hover:bg-indigo-50 transition-all"
            >
              <Award className="w-4 h-4 text-indigo-600" />
              My Learning Stats
            </button>
            <button
              onClick={() => navigate('/refer-earn')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs backdrop-blur-md transition-all"
            >
              <TrendingUp className="w-4 h-4 text-amber-300" />
              Earn Rewards
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Available Courses" value={courses.length} subValue="Explore Catalog" change="Active" changeLabel="Updated" changeType="info" icon={BookOpen} color="indigo" />
        <StatCard title="Enrolled Courses" value={enrolledCourses.length} subValue="My Learning" change="+1" changeLabel="this month" changeType="positive" icon={CheckCircle} color="emerald" />
        <StatCard title="Saved Wishlist" value={wishlist.length} subValue="Saved Items" change="Bookmarked" changeType="neutral" icon={Heart} color="purple" />
        <StatCard title="Reward Balance" value="₹12,500.00" subValue="Redeemable Cash" change="Available" changeType="positive" icon={ShoppingBag} color="amber" />
      </div>

      {/* Search, Category & Sort Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const count = cat === 'All' ? courses.length : courses.filter(c => c.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  selectedCategory === cat ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative w-full sm:w-auto flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-500 font-medium shrink-0">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="popular" className="bg-white dark:bg-slate-900">Most Popular</option>
              <option value="rating" className="bg-white dark:bg-slate-900">Highest Rated</option>
              <option value="price-low" className="bg-white dark:bg-slate-900">Price: Low to High</option>
              <option value="price-high" className="bg-white dark:bg-slate-900">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No courses found</h3>
          <p className="text-xs text-slate-500">Try tweaking your search keywords or active category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCourses.map((course) => {
            const isSaved = wishlist.includes(course.id);
            const progress = course.progress || (course.enrolled ? 45 : 0);
            const isDiscounted = course.originalPrice && course.originalPrice > course.price;
            const discountPercent = isDiscounted
              ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
              : 0;

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

                  {/* Top Bar Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    {/* Category Tag */}
                    <span className="px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[11px] font-extrabold text-indigo-300 border border-white/15 shadow-sm">
                      {course.category}
                    </span>

                    {/* Right Action & Badge Stack */}
                    <div className="flex items-center gap-2">
                      {course.badge && (
                        <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>{course.badge}</span>
                        </span>
                      )}

                      <button
                        onClick={(e) => toggleWishlist(course.id, e)}
                        className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
                          isSaved
                            ? 'bg-rose-500/30 text-rose-400 border-rose-500/50 shadow-md'
                            : 'bg-slate-950/60 text-slate-300 border-white/15 hover:bg-slate-900 hover:text-white'
                        }`}
                        title={isSaved ? 'Remove from saved' : 'Save to wishlist'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Rating & Level Overlay */}
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

                {/* Structured Card Content Body */}
                <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4">
                  {/* Instructor Avatar & Name Row */}
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

                  {/* Course Title & Subtitle */}
                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {course.subtitle}
                    </p>
                  </div>

                  {/* Enrolled Progress Bar */}
                  {course.enrolled && (
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
                  )}

                  {/* Meta Stats Strip */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                      <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                      <Users className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span className="truncate">{(course.studentsCount || 0).toLocaleString()} learners</span>
                    </div>
                  </div>

                  {/* Card Pricing & CTA Action Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      {isDiscounted && (
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="text-slate-400 line-through">
                            ₹{course.originalPrice.toLocaleString()}
                          </span>
                          <span className="font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-200 dark:border-rose-800/60">
                            {discountPercent}% OFF
                          </span>
                        </div>
                      )}
                      <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                        ₹{course.price.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      {course.enrolled ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/courses/${course.id}`);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>Continue</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCourseForBuy(course);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all hover:scale-105"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>Buy Now</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Checkout Modal */}
      <BuyCourseModal
        isOpen={!!selectedCourseForBuy}
        onClose={() => setSelectedCourseForBuy(null)}
        course={selectedCourseForBuy}
      />
    </div>
  );
};
