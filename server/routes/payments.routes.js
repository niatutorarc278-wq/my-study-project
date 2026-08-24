import express from 'express';
import { getPool, getDbStatus } from '../config/db.js';
import { memoryStore } from '../store.js';

const router = express.Router();

// GET /api/payments - List transaction ledger
router.get('/', async (req, res) => {
  try {
    if (getDbStatus()) {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM payments ORDER BY created_at DESC');
      const formatted = rows.map((r) => ({
        ...r,
        userEmail: r.user_email,
        courseTitle: r.course_title,
        amount: parseFloat(r.amount || 0),
        originalPrice: parseFloat(r.original_price || 0),
        couponCode: r.coupon_code || 'None',
        paymentMethod: r.payment_method || 'Credit Card'
      }));
      return res.json(formatted);
    }
    return res.json(memoryStore.payments);
  } catch (err) {
    return res.json(memoryStore.payments);
  }
});

// POST /api/payments/buy - Purchase course
router.post('/buy', async (req, res) => {
  const { courseId, couponCode = '', paymentMethod = 'Credit Card', userEmail = 'alex.rivera@example.com', userName = 'Alex Rivera' } = req.body;

  const course = memoryStore.courses.find((c) => c.id === courseId);
  if (!course) return res.status(404).json({ error: 'Course not found' });

  let finalPrice = course.price || 0;
  let appliedCoupon = null;

  if (couponCode.trim()) {
    appliedCoupon = memoryStore.coupons.find(
      (c) => c.code.toLowerCase() === couponCode.trim().toLowerCase() && c.status === 'Active'
    );
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        finalPrice = Math.max(0, course.price * (1 - (appliedCoupon.discountValue || 0) / 100));
      } else {
        finalPrice = Math.max(0, course.price - (appliedCoupon.discountValue || 0));
      }
      appliedCoupon.usageCount = (appliedCoupon.usageCount || 0) + 1;
    }
  }

  course.enrolled = true;
  course.progress = 0;

  const newTxn = {
    id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
    user: userName,
    userEmail: userEmail,
    courseTitle: course.title,
    amount: parseFloat(finalPrice.toFixed(2)),
    originalPrice: course.price || 0,
    couponCode: appliedCoupon ? appliedCoupon.code : 'None',
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    paymentMethod: paymentMethod,
    status: 'Completed'
  };

  memoryStore.payments.unshift(newTxn);

  try {
    if (getDbStatus()) {
      const pool = getPool();
      await pool.execute(
        `INSERT INTO payments (id, user_name, user_email, course_title, amount, original_price, coupon_code, date, payment_method, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          newTxn.id,
          newTxn.user || 'Student',
          newTxn.userEmail || 'student@example.com',
          newTxn.courseTitle || 'Course',
          newTxn.amount || 0,
          newTxn.originalPrice || 0,
          newTxn.couponCode || 'None',
          newTxn.date || '',
          newTxn.paymentMethod || 'Credit Card',
          newTxn.status || 'Completed'
        ]
      );

      await pool.execute('UPDATE courses SET enrolled = 1, progress = 0 WHERE id = ?', [courseId]);
      await pool.execute('UPDATE users SET enrolled_count = enrolled_count + 1 WHERE id = ?', ['usr-1']);

      if (appliedCoupon) {
        await pool.execute('UPDATE coupons SET usage_count = usage_count + 1 WHERE id = ?', [appliedCoupon.id]);
      }
      console.log(`✅ Payment ${newTxn.id} inserted into MySQL!`);
    }

    return res.status(201).json({ success: true, transaction: newTxn, course });
  } catch (err) {
    console.error('Error processing purchase in MySQL:', err);
    return res.status(201).json({ success: true, transaction: newTxn, course });
  }
});

// PATCH /api/payments/:id/status - Update transaction status
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const target = memoryStore.payments.find((p) => p.id === id);
    if (target) {
      target.status = status;
    }

    if (getDbStatus()) {
      const pool = getPool();
      await pool.execute('UPDATE payments SET status = ? WHERE id = ?', [status || 'Completed', id]);
    }
    return res.json({ id, status });
  } catch (err) {
    return res.json({ id, status });
  }
});

export default router;
