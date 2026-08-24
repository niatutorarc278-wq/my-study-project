import express from 'express';
import { getPool, getDbStatus } from '../config/db.js';
import { memoryStore } from '../store.js';

const router = express.Router();

// GET /api/referrals - Get referral metadata
router.get('/', async (req, res) => {
  const userId = req.query.userId || 'usr-1';
  try {
    if (getDbStatus()) {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM referrals WHERE user_id = ?', [userId]);
      if (rows.length > 0) {
        const r = rows[0];
        return res.json({
          referralCode: r.referral_code,
          referralLink: r.referral_link,
          totalEarned: parseFloat(r.total_earned),
          pendingRewards: parseFloat(r.pending_rewards),
          totalInvites: parseInt(r.total_invites),
          successfulConversions: parseInt(r.successful_conversions),
          milestones: typeof r.milestones === 'string' ? JSON.parse(r.milestones) : (r.milestones || []),
          invitesList: typeof r.invites_list === 'string' ? JSON.parse(r.invites_list) : (r.invites_list || [])
        });
      }
    }
    return res.json(memoryStore.referralData);
  } catch (err) {
    return res.json(memoryStore.referralData);
  }
});

export default router;
