import express from 'express';
import { getPool, getDbStatus } from '../config/db.js';
import { memoryStore } from '../store.js';

const router = express.Router();

// GET /api/notifications - List all notifications
router.get('/', async (req, res) => {
  try {
    if (getDbStatus()) {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM notifications ORDER BY timestamp DESC');
      const formatted = rows.map((r) => ({
        ...r,
        read: Boolean(r.read),
        actionLabel: r.action_label
      }));
      return res.json(formatted);
    }
    return res.json(memoryStore.notifications);
  } catch (err) {
    return res.json(memoryStore.notifications);
  }
});

// POST /api/notifications - Create notification
router.post('/', async (req, res) => {
  const { title, message, category = 'actions', type = 'info', target = 'all', link = null, actionLabel = null } = req.body;
  const newNotif = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title,
    message,
    category,
    type,
    target,
    time: 'Just now',
    read: false,
    timestamp: Date.now(),
    link,
    actionLabel
  };

  try {
    if (getDbStatus()) {
      const pool = getPool();
      await pool.execute(
        `INSERT INTO notifications (id, target, title, message, category, type, time, \`read\`, timestamp, link, action_label)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [newNotif.id, newNotif.target, newNotif.title, newNotif.message, newNotif.category, newNotif.type, newNotif.time, newNotif.read ? 1 : 0, newNotif.timestamp, newNotif.link, newNotif.actionLabel]
      );
    }
    memoryStore.notifications.unshift(newNotif);
    return res.status(201).json(newNotif);
  } catch (err) {
    memoryStore.notifications.unshift(newNotif);
    return res.status(201).json(newNotif);
  }
});

// PATCH /api/notifications/:id/read - Mark notification as read
router.patch('/:id/read', async (req, res) => {
  const { id } = req.params;
  try {
    const target = memoryStore.notifications.find((n) => n.id === id);
    if (target) target.read = true;

    if (getDbStatus()) {
      const pool = getPool();
      await pool.execute('UPDATE notifications SET `read` = 1 WHERE id = ?', [id]);
    }
    return res.json({ id, read: true });
  } catch (err) {
    return res.json({ id, read: true });
  }
});

// PATCH /api/notifications/read-all - Mark all notifications as read
router.patch('/read-all', async (req, res) => {
  try {
    memoryStore.notifications = memoryStore.notifications.map((n) => ({ ...n, read: true }));

    if (getDbStatus()) {
      const pool = getPool();
      await pool.execute('UPDATE notifications SET `read` = 1');
    }
    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: true });
  }
});

// DELETE /api/notifications/:id - Delete single notification
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    memoryStore.notifications = memoryStore.notifications.filter((n) => n.id !== id);

    if (getDbStatus()) {
      const pool = getPool();
      await pool.execute('DELETE FROM notifications WHERE id = ?', [id]);
    }
    return res.json({ success: true, id });
  } catch (err) {
    return res.json({ success: true, id });
  }
});

// DELETE /api/notifications - Clear all notifications
router.delete('/', async (req, res) => {
  try {
    memoryStore.notifications = [];

    if (getDbStatus()) {
      const pool = getPool();
      await pool.execute('DELETE FROM notifications');
    }
    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: true });
  }
});

export default router;
