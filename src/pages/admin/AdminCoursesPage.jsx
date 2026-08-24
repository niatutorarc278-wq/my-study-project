import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';
import {
  Layers,
  Plus,
  Trash2,
  Edit3,
  Eye,
  CheckCircle2,
  XCircle,
  Search,
  BookOpen,
  LayoutGrid,
  List,
  Star,
  Users,
  Clock,
  Sparkles,
  Tag,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Check,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export const AdminCoursesPage = () => {
  const { courses, addCourse, updateCourse, deleteCourse, showToast } = useApp();

  // View & Filter States
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price-high' | 'price-low' | 'rating' | 'students'

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [previewCourse, setPreviewCourse] = useState(null);
  const [managingUnitsCourse, setManagingUnitsCourse] = useState(null);

  // Curriculum Units & Chapters Handlers
  const handleAddUnit = () => {
    if (!managingUnitsCourse) return;
    const currentUnits = managingUnitsCourse.units || [];
    const newUnitNum = currentUnits.length + 1;
    const newUnit = {
      id: `unit-${Date.now()}`,
      unitNumber: newUnitNum,
      title: `Unit ${newUnitNum}: New Unit Title`,
      chapters: [
        {
          id: `chap-${Date.now()}-1`,
          title: `Chapter 1: New Lesson Title`,
          duration: '15:00',
          youtubeUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
          summary: 'Detailed chapter overview and summary notes.'
        }
      ]
    };
    setManagingUnitsCourse({
      ...managingUnitsCourse,
      units: [...currentUnits, newUnit]
    });
  };

  const handleUpdateUnitTitle = (unitIdx, newTitle) => {
    const updated = [...(managingUnitsCourse.units || [])];
    updated[unitIdx] = { ...updated[unitIdx], title: newTitle };
    setManagingUnitsCourse({ ...managingUnitsCourse, units: updated });
  };

  const handleDeleteUnit = (unitIdx) => {
    const updated = (managingUnitsCourse.units || []).filter((_, idx) => idx !== unitIdx);
    const reindexed = updated.map((u, idx) => ({ ...u, unitNumber: idx + 1 }));
    setManagingUnitsCourse({ ...managingUnitsCourse, units: reindexed });
  };

  const handleAddChapter = (unitIdx) => {
    const updated = [...(managingUnitsCourse.units || [])];
    const unit = updated[unitIdx];
    const currentChaps = unit.chapters || [];
    const newChapNum = currentChaps.length + 1;
    const newChap = {
      id: `chap-${Date.now()}-${newChapNum}`,
      title: `Chapter ${newChapNum}: New Lesson Title`,
      duration: '12:30',
      youtubeUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
      summary: 'Lesson summary notes.'
    };
    updated[unitIdx] = { ...unit, chapters: [...currentChaps, newChap] };
    setManagingUnitsCourse({ ...managingUnitsCourse, units: updated });
  };

  const handleUpdateChapter = (unitIdx, chapIdx, field, value) => {
    const updated = [...(managingUnitsCourse.units || [])];
    const unit = updated[unitIdx];
    const chaps = [...(unit.chapters || [])];
    chaps[chapIdx] = { ...chaps[chapIdx], [field]: value };
    updated[unitIdx] = { ...unit, chapters: chaps };
    setManagingUnitsCourse({ ...managingUnitsCourse, units: updated });
  };

  const handleDeleteChapter = (unitIdx, chapIdx) => {
    const updated = [...(managingUnitsCourse.units || [])];
    const unit = updated[unitIdx];
    const chaps = (unit.chapters || []).filter((_, idx) => idx !== chapIdx);
    updated[unitIdx] = { ...unit, chapters: chaps };
    setManagingUnitsCourse({ ...managingUnitsCourse, units: updated });
  };

  const handleSaveCurriculum = (e) => {
    e.preventDefault();
    if (!managingUnitsCourse) return;
    const totalLessons = (managingUnitsCourse.units || []).reduce(
      (acc, u) => acc + (u.chapters ? u.chapters.length : 0),
      0
    );
    updateCourse(managingUnitsCourse.id, {
      units: managingUnitsCourse.units,
      lessonsCount: totalLessons
    });
    setManagingUnitsCourse(null);
    showToast('Course Units & Chapters saved successfully! 🎉', 'success');
  };

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'Development',
    price: '',
    originalPrice: '',
    duration: '30 Hours',
    instructor: 'Alex Rivera',
    badge: 'Popular',
    level: 'All Levels',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    youtubeUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
    description: ''
  });

  // Category counts
  const categoryList = ['All', 'Development', 'Design', 'AI & Data', 'DevOps'];

  // Dynamic Filtering & Sorting
  const filteredCourses = useMemo(() => {
    return courses
      .filter((c) => {
        const matchesSearch =
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.instructor.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
        const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'students') return (b.studentsCount || 0) - (a.studentsCount || 0);
        return 0; // default order
      });
  }, [courses, searchQuery, selectedCategory, selectedStatus, sortBy]);

  // Catalog Metrics
  const totalEnrolled = useMemo(
    () => courses.reduce((acc, c) => acc + (c.studentsCount || 0), 0),
    [courses]
  );

  const avgRating = useMemo(() => {
    if (!courses.length) return 0;
    return (courses.reduce((acc, c) => acc + (c.rating || 5.0), 0) / courses.length).toFixed(1);
  }, [courses]);

  const totalPublished = useMemo(
    () => courses.filter((c) => c.status === 'Published').length,
    [courses]
  );

  // Handlers
  const handleAddSubmit = (e) => {
    e.preventDefault();
    addCourse({
      ...formData,
      price: parseFloat(formData.price || 0),
      originalPrice: parseFloat(formData.originalPrice || formData.price || 0)
    });
    setIsAddModalOpen(false);
    setFormData({
      title: '',
      subtitle: '',
      category: 'Development',
      price: '',
      originalPrice: '',
      duration: '30 Hours',
      instructor: 'Alex Rivera',
      badge: 'Popular',
      level: 'All Levels',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      youtubeUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
      description: ''
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editingCourse) {
      updateCourse(editingCourse.id, {
        title: editingCourse.title,
        subtitle: editingCourse.subtitle,
        price: parseFloat(editingCourse.price),
        originalPrice: parseFloat(editingCourse.originalPrice || editingCourse.price),
        category: editingCourse.category,
        badge: editingCourse.badge,
        youtubeUrl: editingCourse.youtubeUrl,
        status: editingCourse.status
      });
      setEditingCourse(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Title & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Course Catalog Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
              {courses.length} Courses
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create, organize, price, and manage interactive learning courses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="List Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" /> Create New Course
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Catalog Courses"
          value={`${courses.length} Courses`}
          subValue={`${totalPublished} Published Live`}
          change="Updated"
          changeLabel="Today"
          changeType="info"
          icon={Layers}
          color="indigo"
        />
        <StatCard
          title="Active Enrolled Learners"
          value={totalEnrolled.toLocaleString()}
          subValue="Registered Students"
          change="+14.2%"
          changeLabel="Month-over-Month"
          changeType="positive"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Catalog Rating Avg"
          value={`${avgRating} ★`}
          subValue="Out of 5.0 Rating"
          change="High"
          changeLabel="Satisfaction"
          changeType="positive"
          icon={Star}
          color="amber"
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categoryList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search course or instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-transparent text-slate-900 dark:text-slate-100 font-bold focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-transparent text-slate-900 dark:text-slate-100 font-bold focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="rating">Top Rated</option>
              <option value="students">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid View Mode */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredCourses.map((c) => {
            const isDiscounted = c.originalPrice && c.originalPrice > c.price;
            const discountPercent = isDiscounted
              ? Math.round(((c.originalPrice - c.price) / c.originalPrice) * 100)
              : 0;

            return (
              <div
                key={c.id}
                className="group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/90 shadow-sm hover:shadow-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Widescreen 16:9 Thumbnail Container */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Top Bar Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5 pointer-events-none">
                    <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
                      <span className="px-2.5 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md text-white text-[10px] font-extrabold border border-white/20 whitespace-nowrap shadow-sm">
                        {c.category}
                      </span>
                      {c.badge && (
                        <span className="px-2 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black uppercase shadow-md flex items-center gap-1 whitespace-nowrap">
                          <Sparkles className="w-3 h-3 shrink-0" />
                          <span>{c.badge}</span>
                        </span>
                      )}
                    </div>

                    {/* Status Toggle Button Overlay */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateCourse(c.id, {
                          status: c.status === 'Published' ? 'Draft' : 'Published'
                        });
                      }}
                      className={`pointer-events-auto px-2.5 py-1 rounded-xl text-[10px] font-extrabold shadow-md backdrop-blur-md border transition-all hover:scale-105 whitespace-nowrap shrink-0 ${
                        c.status === 'Published'
                          ? 'bg-emerald-500/90 text-white border-emerald-400/40'
                          : 'bg-amber-500/90 text-slate-950 border-amber-400/40'
                      }`}
                    >
                      {c.status}
                    </button>
                  </div>

                  {/* Bottom Rating & Instructor Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold border border-white/10 shadow-sm">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{c.rating || 4.8}</span>
                      <span className="text-[10px] text-slate-400">({c.reviewsCount || 120})</span>
                    </div>

                    <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-slate-300 border border-white/10 whitespace-nowrap">
                      {c.level || 'All Levels'}
                    </span>
                  </div>
                </div>

                {/* Card Content Details Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  {/* Instructor Avatar & Name Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={c.instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={c.instructor || 'Instructor'}
                        className="w-6 h-6 rounded-full object-cover ring-2 ring-indigo-500/30 shrink-0"
                      />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                        {c.instructor || 'Studycademy'}
                      </span>
                    </div>

                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60 whitespace-nowrap shrink-0">
                      {c.lessonsCount || 40} Lessons
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-1.5">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {c.subtitle || c.description}
                    </p>
                  </div>

                  {/* Stats Meta Row */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 min-w-0">
                      <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate whitespace-nowrap">{(c.studentsCount || 0).toLocaleString()} Enrolled</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 min-w-0">
                      <Clock className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span className="truncate whitespace-nowrap">{c.duration || '30h'}</span>
                    </div>
                  </div>

                  {/* Pricing & Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      {isDiscounted && (
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="text-slate-400 line-through truncate">
                            ₹{c.originalPrice.toLocaleString()}
                          </span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                            -{discountPercent}%
                          </span>
                        </div>
                      )}
                      <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight block truncate">
                        ₹{c.price.toLocaleString()}
                      </span>
                    </div>

                    {/* Action Buttons Group */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setManagingUnitsCourse(JSON.parse(JSON.stringify(c)))}
                        className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 transition-colors"
                        title="Manage Units & Chapters"
                      >
                        <BookOpen className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setPreviewCourse(c)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                        title="Preview Course"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setEditingCourse(c)}
                        className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 transition-colors"
                        title="Edit Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => deleteCourse(c.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View Mode */
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Course Info</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Learners</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img src={c.thumbnail} alt={c.title} className="w-12 h-10 rounded-lg object-cover shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1 max-w-xs">{c.title}</p>
                          <p className="text-[11px] text-slate-400">By {c.instructor}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                        {c.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900 dark:text-slate-100">
                      ₹{c.price.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{(c.studentsCount || 0).toLocaleString()} Enrolled</td>
                    <td className="py-3.5 px-4 text-amber-500 font-bold">{c.rating || 4.8} ★</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() =>
                          updateCourse(c.id, {
                            status: c.status === 'Published' ? 'Draft' : 'Published'
                          })
                        }
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === 'Published'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {c.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shrink-0 whitespace-nowrap">
                        <button
                          onClick={() => setManagingUnitsCourse(JSON.parse(JSON.stringify(c)))}
                          className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-purple-600 dark:text-purple-400 transition-all shadow-xs"
                          title="Manage Units & Chapters"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setPreviewCourse(c)}
                          className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all shadow-xs"
                          title="Preview Course"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingCourse(c)}
                          className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 transition-all shadow-xs"
                          title="Edit Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteCourse(c.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-400 transition-all shadow-xs"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Course offering">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Course Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Master Next.js 15 & AI Engineering"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
              >
                <option>Development</option>
                <option>Design</option>
                <option>AI & Data</option>
                <option>DevOps</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Badge Tag</label>
              <select
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
              >
                <option>Bestseller</option>
                <option>Popular</option>
                <option>Trending</option>
                <option>New</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Selling Price (₹)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="4999"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Original Price (₹)</label>
              <input
                type="number"
                step="0.01"
                placeholder="8999"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subtitle / Summary</label>
            <input
              type="text"
              required
              placeholder="Short catchy description of course outcomes"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Thumbnail Image URL</label>
            <input
              type="text"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">YouTube Preview Link / Embed URL</label>
            <input
              type="text"
              placeholder="e.g. https://www.youtube.com/watch?v=SqcY0GlETPk"
              value={formData.youtubeUrl}
              onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
              className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
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

      {/* Edit Course Modal */}
      <Modal isOpen={!!editingCourse} onClose={() => setEditingCourse(null)} title="Edit Course Details">
        {editingCourse && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Course Title</label>
              <input
                type="text"
                value={editingCourse.title}
                onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingCourse.price}
                  onChange={(e) => setEditingCourse({ ...editingCourse, price: e.target.value })}
                  className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Original Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingCourse.originalPrice || editingCourse.price}
                  onChange={(e) => setEditingCourse({ ...editingCourse, originalPrice: e.target.value })}
                  className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={editingCourse.category}
                  onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                >
                  <option>Development</option>
                  <option>Design</option>
                  <option>AI & Data</option>
                  <option>DevOps</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Badge Tag</label>
                <select
                  value={editingCourse.badge || 'Popular'}
                  onChange={(e) => setEditingCourse({ ...editingCourse, badge: e.target.value })}
                  className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                >
                  <option>Bestseller</option>
                  <option>Popular</option>
                  <option>Trending</option>
                  <option>New</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">YouTube Preview Link / Embed URL</label>
              <input
                type="text"
                placeholder="e.g. https://www.youtube.com/watch?v=SqcY0GlETPk"
                value={editingCourse.youtubeUrl || ''}
                onChange={(e) => setEditingCourse({ ...editingCourse, youtubeUrl: e.target.value })}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800"
              >
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Preview Modal */}
      <Modal isOpen={!!previewCourse} onClose={() => setPreviewCourse(null)} title="Course Catalog Inspector">
        {previewCourse && (
          <div className="space-y-4 text-xs">
            <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-900">
              <img src={previewCourse.thumbnail} alt={previewCourse.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 font-bold">
                {previewCourse.rating || 4.8} ★ ({previewCourse.reviewsCount || 100} ratings)
              </div>
            </div>

            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                {previewCourse.category}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">{previewCourse.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{previewCourse.subtitle || previewCourse.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block">Selling Price</span>
                <span className="font-black text-slate-900 dark:text-white text-sm">
                  ₹{previewCourse.price.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Enrolled Learners</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {(previewCourse.studentsCount || 0).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{previewCourse.status}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewCourse(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Manage Units & Chapters Modal */}
      <Modal
        isOpen={!!managingUnitsCourse}
        onClose={() => setManagingUnitsCourse(null)}
        title={`Manage Units & Chapters: ${managingUnitsCourse?.title || ''}`}
      >
        {managingUnitsCourse && (
          <form onSubmit={handleSaveCurriculum} className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
              <div className="text-xs">
                <span className="font-extrabold text-indigo-700 dark:text-indigo-300">
                  Curriculum Architecture
                </span>
                <p className="text-[11px] text-slate-500">
                  Organize units, chapters, duration, and individual YouTube video URLs for sequential unlocking.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddUnit}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Unit</span>
              </button>
            </div>

            {/* Units List */}
            <div className="space-y-6">
              {(!managingUnitsCourse.units || managingUnitsCourse.units.length === 0) ? (
                <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                  <p className="text-xs text-slate-500 font-semibold mb-2">No units configured for this course yet.</p>
                  <button
                    type="button"
                    onClick={handleAddUnit}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                  >
                    + Create First Unit
                  </button>
                </div>
              ) : (
                managingUnitsCourse.units.map((unit, uIdx) => (
                  <div
                    key={unit.id || uIdx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4"
                  >
                    {/* Unit Header */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                          U{uIdx + 1}
                        </span>
                        <input
                          type="text"
                          required
                          value={unit.title}
                          onChange={(e) => handleUpdateUnitTitle(uIdx, e.target.value)}
                          placeholder="e.g. Unit 1: Modern JavaScript Fundamentals"
                          className="w-full p-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteUnit(uIdx)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors shrink-0"
                        title="Delete Unit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Chapters List */}
                    <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-indigo-500/30">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Unit Chapters ({unit.chapters ? unit.chapters.length : 0})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddChapter(uIdx)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold transition-colors"
                        >
                          <Plus className="w-3 h-3" /> Add Chapter
                        </button>
                      </div>

                      {unit.chapters &&
                        unit.chapters.map((chap, cIdx) => (
                          <div
                            key={chap.id || cIdx}
                            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-xs"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800 shrink-0">
                                Ch {cIdx + 1}
                              </span>

                              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <input
                                  type="text"
                                  required
                                  placeholder="Chapter Title"
                                  value={chap.title}
                                  onChange={(e) => handleUpdateChapter(uIdx, cIdx, 'title', e.target.value)}
                                  className="sm:col-span-2 p-1.5 rounded-lg text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                                />
                                <input
                                  type="text"
                                  placeholder="Duration (e.g. 15:30)"
                                  value={chap.duration}
                                  onChange={(e) => handleUpdateChapter(uIdx, cIdx, 'duration', e.target.value)}
                                  className="p-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteChapter(uIdx, cIdx)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors shrink-0"
                                title="Remove Chapter"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* YouTube URL & Summary Input */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <input
                                type="text"
                                placeholder="YouTube Video URL (e.g. https://www.youtube.com/watch?v=...)"
                                value={chap.youtubeUrl}
                                onChange={(e) => handleUpdateChapter(uIdx, cIdx, 'youtubeUrl', e.target.value)}
                                className="p-1.5 rounded-lg text-[11px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                              />
                              <input
                                type="text"
                                placeholder="Chapter Summary / Notes"
                                value={chap.summary}
                                onChange={(e) => handleUpdateChapter(uIdx, cIdx, 'summary', e.target.value)}
                                className="p-1.5 rounded-lg text-[11px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={handleAddUnit}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Another Unit
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setManagingUnitsCourse(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md transition-all"
                >
                  Save Units & Chapters
                </button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
