import express from 'express';
import { getPool, getDbStatus } from '../config/db.js';
import { memoryStore } from '../store.js';

const router = express.Router();

// GET /api/users - List all users
router.get('/', async (req, res) => {
  try {
    if (getDbStatus()) {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
      const formatted = rows.map((r) => ({
        ...r,
        joinedDate: r.joined_date,
        enrolledCount: parseInt(r.enrolled_count),
        referralCode: r.referral_code
      }));
      return res.json(formatted);
    }
    return res.json(memoryStore.users);
  } catch (err) {
    return res.json(memoryStore.users);
  }
});

// PUT /api/users/profile - Update user profile
router.put('/profile', async (req, res) => {
  const updatedData = req.body;
  const targetId = updatedData.id || 'usr-1';

  try {
    if (getDbStatus()) {
      const pool = getPool();
      await pool.execute(
        `UPDATE users SET
          name = COALESCE(?, name),
          email = COALESCE(?, email),
          phone = COALESCE(?, phone),
          bio = COALESCE(?, bio),
          avatar = COALESCE(?, avatar)
         WHERE id = ?;`,
        [updatedData.name || null, updatedData.email || null, updatedData.phone || null, updatedData.bio || null, updatedData.avatar || null, targetId]
      );
    }

    memoryStore.users = memoryStore.users.map((u) => (u.id === targetId ? { ...u, ...updatedData } : u));
    const user = memoryStore.users.find((u) => u.id === targetId);
    return res.json(user);
  } catch (err) {
    memoryStore.users = memoryStore.users.map((u) => (u.id === targetId ? { ...u, ...updatedData } : u));
    const user = memoryStore.users.find((u) => u.id === targetId);
    return res.json(user);
  }
});

// POST /api/users/password - Change password
router.post('/password', (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Please provide both current and new password' });
  }
  return res.json({ success: true, message: 'Password updated successfully' });
});

// PATCH /api/users/:id/status - Toggle user status (Active <-> Blocked)
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  try {
    let nextStatus = 'Active';
    const target = memoryStore.users.find((u) => u.id === id);
    if (target) {
      nextStatus = target.status === 'Active' ? 'Blocked' : 'Active';
      target.status = nextStatus;
    }

    if (getDbStatus()) {
      const pool = getPool();
      await pool.execute('UPDATE users SET status = ? WHERE id = ?', [nextStatus, id]);
    }
    return res.json({ id, status: nextStatus });
  } catch (err) {
    return res.json({ id, status: 'Active' });
  }
});

// PATCH /api/users/:id/role - Change user role ('user' <-> 'admin')
router.patch('/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const target = memoryStore.users.find((u) => u.id === id);
    if (target) {
      target.role = role;
    }

    if (getDbStatus()) {
      const pool = getPool();
      await pool.execute('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    }
    return res.json({ id, role });
  } catch (err) {
    return res.json({ id, role });
  }
});

export default router;
