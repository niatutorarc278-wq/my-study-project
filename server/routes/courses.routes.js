import express from 'express';
import { getPool, getDbStatus } from '../config/db.js';
import { memoryStore } from '../store.js';

const router = express.Router();

const formatYouTubeEmbedUrl = (url) => {
  if (!url) return 'https://www.youtube.com/embed/SqcY0GlETPk';
  if (url.includes('embed/')) return url;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : url;
};

// GET /api/courses - List all courses
router.get('/', async (req, res) => {
  try {
    if (getDbStatus()) {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM courses ORDER BY created_at DESC');
      const formatted = rows.map((r) => ({
        ...r,
        price: parseFloat(r.price || 0),
        originalPrice: parseFloat(r.original_price || 0),
        rating: parseFloat(r.rating || 5.0),
        reviewsCount: parseInt(r.reviews_count || 0),
        studentsCount: parseInt(r.students_count || 0),
        lessonsCount: parseInt(r.lessons_count || 0),
        enrolled: Boolean(r.enrolled),
        youtubeUrl: r.youtube_url || '',
        lastAccessed: r.last_accessed || null,
        instructorTitle: r.instructor_title || '',
        instructorAvatar: r.instructor_avatar || '',
        features: typeof r.features === 'string' ? JSON.parse(r.features) : (r.features || []),
        curriculum: typeof r.curriculum === 'string' ? JSON.parse(r.curriculum) : (r.curriculum || []),
        units: typeof r.units === 'string' ? JSON.parse(r.units) : (r.units || [])
      }));
      return res.json(formatted);
    }
    return res.json(memoryStore.courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    return res.json(memoryStore.courses);
  }
});

// GET /api/courses/:id - Get single course
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (getDbStatus()) {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM courses WHERE id = ?', [id]);
      if (rows.length > 0) {
        const r = rows[0];
        return res.json({
          ...r,
          price: parseFloat(r.price || 0),
          originalPrice: parseFloat(r.original_price || 0),
          rating: parseFloat(r.rating || 5.0),
          reviewsCount: parseInt(r.reviews_count || 0),
          studentsCount: parseInt(r.students_count || 0),
          enrolled: Boolean(r.enrolled),
          youtubeUrl: r.youtube_url || '',
          lastAccessed: r.last_accessed || null,
          instructorTitle: r.instructor_title || '',
          instructorAvatar: r.instructor_avatar || '',
          features: typeof r.features === 'string' ? JSON.parse(r.features) : (r.features || []),
          curriculum: typeof r.curriculum === 'string' ? JSON.parse(r.curriculum) : (r.curriculum || []),
          units: typeof r.units === 'string' ? JSON.parse(r.units) : (r.units || [])
        });
      }
    }
    const course = memoryStore.courses.find((c) => c.id === id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    return res.json(course);
  } catch (err) {
    const course = memoryStore.courses.find((c) => c.id === id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    return res.json(course);
  }
});

// POST /api/courses - Create new course
router.post('/', async (req, res) => {
  const newCourseData = req.body;
  const newCourse = {
    id: `course-${Date.now()}`,
    rating: 5.0,
    reviewsCount: 0,
    studentsCount: 0,
    enrolled: false,
    progress: 0,
    status: 'Published',
    youtubeUrl: formatYouTubeEmbedUrl(newCourseData.youtubeUrl),
    curriculum: newCourseData.curriculum || [
      { section: '1. Course Introduction', lessons: ['Welcome & Overview', 'Environment Setup'] }
    ],
    features: newCourseData.features || ['Lifetime access to content', 'Downloadable resources', 'Completion certificate'],
    units: newCourseData.units || [
      {
        id: `c-${Date.now()}-u1`,
        unitNumber: 1,
        title: 'Unit 1: Fundamentals & Getting Started',
        chapters: [
          {
            id: `c-${Date.now()}-u1-ch1`,
            title: 'Chapter 1: Course Overview & Introduction',
            duration: '10:00',
            youtubeUrl: formatYouTubeEmbedUrl(newCourseData.youtubeUrl),
            summary: 'Welcome to the course! Overview of topics and objectives.'
          }
        ]
      }
    ],
    ...newCourseData,
    price: parseFloat(newCourseData.price || 0),
    originalPrice: parseFloat(newCourseData.originalPrice || newCourseData.price || 0)
  };

  try {
    if (getDbStatus()) {
      const pool = getPool();
      await pool.execute(
        `INSERT INTO courses (
          id, title, subtitle, category, price, original_price, rating, reviews_count,
          students_count, instructor, instructor_title, instructor_avatar, thumbnail,
          youtube_url, duration, lessons_count, level, status, enrolled, progress,
          last_accessed, badge, description, features, curriculum, units
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          newCourse.id,
          newCourse.title || 'Untitled Course',
          newCourse.subtitle || null,
          newCourse.category || 'Development',
          newCourse.price || 0,
          newCourse.originalPrice || 0,
          newCourse.rating || 5.0,
          newCourse.reviewsCount || 0,
          newCourse.studentsCount || 0,
          newCourse.instructor || 'Alex Rivera',
          newCourse.instructorTitle || 'Senior Architect',
          newCourse.instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          newCourse.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
          newCourse.youtubeUrl || 'https://www.youtube.com/embed/SqcY0GlETPk',
          newCourse.duration || '30 Hours',
          newCourse.lessonsCount || 1,
          newCourse.level || 'All Levels',
          newCourse.status || 'Published',
          newCourse.enrolled ? 1 : 0,
          newCourse.progress || 0,
          newCourse.lastAccessed || null,
          newCourse.badge || 'Popular',
          newCourse.description || '',
          JSON.stringify(newCourse.features || []),
          JSON.stringify(newCourse.curriculum || []),
          JSON.stringify(newCourse.units || [])
        ]
      );

      // Insert units and chapters into units & chapters relational tables
      if (newCourse.units && Array.isArray(newCourse.units)) {
        for (const unit of newCourse.units) {
          await pool.execute(
            `INSERT INTO units (id, course_id, unit_number, title) VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE title = VALUES(title), unit_number = VALUES(unit_number);`,
            [unit.id, newCourse.id, unit.unitNumber || 1, unit.title || 'Unit']
          );

          if (unit.chapters && Array.isArray(unit.chapters)) {
            for (const ch of unit.chapters) {
              await pool.execute(
                `INSERT INTO chapters (id, unit_id, course_id, title, duration, youtube_url, summary) VALUES (?, ?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE title = VALUES(title), duration = VALUES(duration), youtube_url = VALUES(youtube_url), summary = VALUES(summary);`,
                [ch.id, unit.id, newCourse.id, ch.title || 'Chapter', ch.duration || '10:00', ch.youtubeUrl || '', ch.summary || '']
              );
            }
          }
        }
      }
      console.log(`✅ Course "${newCourse.title}" successfully inserted into MySQL!`);
    }
    memoryStore.courses.unshift(newCourse);
    return res.status(201).json(newCourse);
  } catch (err) {
    console.error('Error creating course in MySQL:', err);
    memoryStore.courses.unshift(newCourse);
    return res.status(201).json(newCourse);
  }
});

// PUT /api/courses/:id - Update course
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = { ...req.body };

  if (updatedData.youtubeUrl) {
    updatedData.youtubeUrl = formatYouTubeEmbedUrl(updatedData.youtubeUrl);
  }

  try {
    if (getDbStatus()) {
      const pool = getPool();
      await pool.execute(
        `UPDATE courses SET
          title = COALESCE(?, title),
          subtitle = COALESCE(?, subtitle),
          category = COALESCE(?, category),
          price = COALESCE(?, price),
          original_price = COALESCE(?, original_price),
          instructor = COALESCE(?, instructor),
          thumbnail = COALESCE(?, thumbnail),
          youtube_url = COALESCE(?, youtube_url),
          duration = COALESCE(?, duration),
          level = COALESCE(?, level),
          description = COALESCE(?, description),
          lessons_count = COALESCE(?, lessons_count),
          units = COALESCE(?, units)
         WHERE id = ?;`,
        [
          updatedData.title ?? null,
          updatedData.subtitle ?? null,
          updatedData.category ?? null,
          updatedData.price !== undefined ? parseFloat(updatedData.price) : null,
          updatedData.originalPrice !== undefined ? parseFloat(updatedData.originalPrice) : null,
          updatedData.instructor ?? null,
          updatedData.thumbnail ?? null,
          updatedData.youtubeUrl ?? null,
          updatedData.duration ?? null,
          updatedData.level ?? null,
          updatedData.description ?? null,
          updatedData.lessonsCount !== undefined ? parseInt(updatedData.lessonsCount) : null,
          updatedData.units ? JSON.stringify(updatedData.units) : null,
          id
        ]
      );

      if (updatedData.units && Array.isArray(updatedData.units)) {
        for (const unit of updatedData.units) {
          await pool.execute(
            `INSERT INTO units (id, course_id, unit_number, title) VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE title = VALUES(title), unit_number = VALUES(unit_number);`,
            [unit.id, id, unit.unitNumber || 1, unit.title || 'Unit']
          );

          if (unit.chapters && Array.isArray(unit.chapters)) {
            for (const ch of unit.chapters) {
              await pool.execute(
                `INSERT INTO chapters (id, unit_id, course_id, title, duration, youtube_url, summary) VALUES (?, ?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE title = VALUES(title), duration = VALUES(duration), youtube_url = VALUES(youtube_url), summary = VALUES(summary);`,
                [ch.id, unit.id, id, ch.title || 'Chapter', ch.duration || '10:00', ch.youtubeUrl || '', ch.summary || '']
              );
            }
          }
        }
      }
    }

    memoryStore.courses = memoryStore.courses.map((c) => (c.id === id ? { ...c, ...updatedData } : c));
    const course = memoryStore.courses.find((c) => c.id === id);
    return res.json(course);
  } catch (err) {
    console.error('Error updating course in MySQL:', err);
    memoryStore.courses = memoryStore.courses.map((c) => (c.id === id ? { ...c, ...updatedData } : c));
    const course = memoryStore.courses.find((c) => c.id === id);
    return res.json(course);
  }
});

// DELETE /api/courses/:id - Delete course
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (getDbStatus()) {
      const pool = getPool();
      await pool.execute('DELETE FROM courses WHERE id = ?', [id]);
    }
    memoryStore.courses = memoryStore.courses.filter((c) => c.id !== id);
    return res.json({ success: true, id });
  } catch (err) {
    memoryStore.courses = memoryStore.courses.filter((c) => c.id !== id);
    return res.json({ success: true, id });
  }
});

export default router;
