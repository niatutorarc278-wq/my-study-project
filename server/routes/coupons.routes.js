import express from 'express';
import { getPool, getDbStatus } from '../config/db.js';
import { memoryStore } from '../store.js';

const router = express.Router();

// GET /api/coupons - List all coupons
router.get('/', async (req, res) => {
  try {
    if (getDbStatus()) {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM coupons ORDER BY created_at DESC');
      const formatted = rows.map((r) => ({
        ...r,
        discountType: r.discount_type,
        discountValue: parseFloat(r.discount_value || 0),
        minSpend: parseFloat(r.min_spend || 0),
        expiryDate: r.expiry_date || '',
        usageLimit: parseInt(r.usage_limit || 500),
        usageCount: parseInt(r.usage_count || 0)
      }));
      return res.json(formatted);
    }
    return res.json(memoryStore.coupons);
  } catch (err) {
    return res.json(memoryStore.coupons);
  }
});

// POST /api/coupons - Create new coupon
router.post('/', async (req, res) => {
  const newCouponData = req.body;
  const newCoupon = {
    id: `cup-${Date.now()}`,
    usageCount: 0,
    status: 'Active',
    ...newCouponData,
    discountValue: parseFloat(newCouponData.discountValue || 0),
    minSpend: parseFloat(newCouponData.minSpend || 0),
    usageLimit: parseInt(newCouponData.usageLimit || 500)
  };

  try {
    if (getDbStatus()) {
      const pool = getPool();
      await pool.execute(
        `INSERT INTO coupons (id, code, discount_type, discount_value, min_spend, expiry_date, usage_limit, usage_count, status, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          newCoupon.id,
          newCoupon.code || `CODE${Date.now()}`,
          newCoupon.discountType || 'percentage',
          newCoupon.discountValue || 0,
          newCoupon.minSpend || 0,
          newCoupon.expiryDate || '2026-12-31',
          newCoupon.usageLimit || 500,
          newCoupon.usageCount || 0,
          newCoupon.status || 'Active',
          newCoupon.description || ''
        ]
      );
      console.log(`✅ Coupon "${newCoupon.code}" inserted into MySQL!`);
    }
    memoryStore.coupons.unshift(newCoupon);
    return res.status(201).json(newCoupon);
  } catch (err) {
    console.error('Error creating coupon in MySQL:', err);
    memoryStore.coupons.unshift(newCoupon);
    return res.status(201).json(newCoupon);
  }
});

// PATCH /api/coupons/:id/status - Toggle coupon status (Active <-> Expired)
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  try {
    let nextStatus = 'Active';
    const target = memoryStore.coupons.find((c) => c.id === id);
    if (target) {
      nextStatus = target.status === 'Active' ? 'Expired' : 'Active';
      target.status = nextStatus;
    }

    if (getDbStatus()) {
      const pool = getPool();
      await pool.execute('UPDATE coupons SET status = ? WHERE id = ?', [nextStatus, id]);
    }
    return res.json({ id, status: nextStatus });
  } catch (err) {
    return res.json({ id, status: 'Active' });
  }
});

// DELETE /api/coupons/:id - Delete coupon
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (getDbStatus()) {
      const pool = getPool();
      await pool.execute('DELETE FROM coupons WHERE id = ?', [id]);
    }
    memoryStore.coupons = memoryStore.coupons.filter((c) => c.id !== id);
    return res.json({ success: true, id });
  } catch (err) {
    memoryStore.coupons = memoryStore.coupons.filter((c) => c.id !== id);
    return res.json({ success: true, id });
  }
});

export default router;
