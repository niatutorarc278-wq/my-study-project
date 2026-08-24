import express from 'express';
import { getPool, getDbStatus } from '../config/db.js';
import { memoryStore } from '../store.js';

const router = express.Router();

// GET /api/progress - Get completed chapters map
router.get('/', async (req, res) => {
  const userId = req.query.userId || 'usr-1';
  try {
    if (getDbStatus()) {
      const pool = getPool();
      const [rows] = await pool.query(
        'SELECT course_id, chapter_id FROM completed_chapters WHERE user_id = ?',
        [userId]
      );
      const completedMap = {};
      rows.forEach((r) => {
        if (!completedMap[r.course_id]) completedMap[r.course_id] = [];
        completedMap[r.course_id].push(r.chapter_id);
      });
      return res.json(completedMap);
    }
    return res.json(memoryStore.completedChapters);
  } catch (err) {
    return res.json(memoryStore.completedChapters);
  }
});

// POST /api/progress/complete - Mark chapter complete
router.post('/complete', async (req, res) => {
  const { courseId, chapterId, userId = 'usr-1' } = req.body;

  if (!courseId || !chapterId) {
    return res.status(400).json({ error: 'courseId and chapterId are required' });
  }

  const currentList = memoryStore.completedChapters[courseId] || [];
  if (!currentList.includes(chapterId)) {
    memoryStore.completedChapters[courseId] = [...currentList, chapterId];
  }

  const targetCourse = memoryStore.courses.find((c) => c.id === courseId);
  let newProgress = targetCourse?.progress || 0;

  if (targetCourse && targetCourse.units) {
    const totalChapters = targetCourse.units.reduce(
      (acc, unit) => acc + (unit.chapters ? unit.chapters.length : 0),
      0
    );
    if (totalChapters > 0) {
      newProgress = Math.min(100, Math.round((memoryStore.completedChapters[courseId].length / totalChapters) * 100));
      targetCourse.progress = newProgress;
    }
  }

  try {
    if (getDbStatus()) {
      const pool = getPool();
      await pool.execute(
        `INSERT IGNORE INTO completed_chapters (user_id, course_id, chapter_id)
         VALUES (?, ?, ?);`,
        [userId, courseId, chapterId]
      );

      await pool.execute('UPDATE courses SET progress = ? WHERE id = ?', [newProgress, courseId]);
    }

    return res.json({
      success: true,
      courseId,
      chapterId,
      progress: newProgress,
      completedChapters: memoryStore.completedChapters[courseId]
    });
  } catch (err) {
    console.error('Error completing chapter:', err);
    return res.json({
      success: true,
      courseId,
      chapterId,
      progress: newProgress,
      completedChapters: memoryStore.completedChapters[courseId]
    });
  }
});

export default router;
