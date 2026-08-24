import { getPool, initDb } from './config/db.js';
import {
  initialCourses,
  initialCoupons,
  initialUsers,
  initialPayments,
  initialReferralData,
  initialNotifications
} from '../src/data/mockData.js';

export const seedDatabase = async () => {
  const dbConnected = await initDb();
  if (!dbConnected) {
    console.log('Skipping MySQL seeding because MySQL server is offline.');
    return false;
  }

  const pool = getPool();

  try {
    console.log('🌱 Checking MySQL database seeding...');

    // 1. Seed Users (INSERT IGNORE preserves any manual MySQL Workbench edits)
    for (const u of initialUsers) {
      await pool.execute(
        `INSERT IGNORE INTO users (id, name, email, role, avatar, joined_date, enrolled_count, status, phone, bio, referral_code)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [u.id, u.name, u.email, u.role, u.avatar, u.joinedDate, u.enrolledCount, u.status, u.phone, u.bio, u.referralCode]
      );
    }
    console.log(`✅ Verified Users table in MySQL`);

    // 2. Seed Courses, Units, Chapters (INSERT IGNORE preserves manual MySQL edits)
    for (const c of initialCourses) {
      await pool.execute(
        `INSERT IGNORE INTO courses (
          id, title, subtitle, category, price, original_price, rating, reviews_count,
          students_count, instructor, instructor_title, instructor_avatar, thumbnail,
          youtube_url, duration, lessons_count, level, status, enrolled, progress,
          last_accessed, badge, description, features, curriculum, units
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          c.id, c.title, c.subtitle, c.category, c.price, c.originalPrice, c.rating, c.reviewsCount,
          c.studentsCount, c.instructor, c.instructorTitle, c.instructorAvatar, c.thumbnail,
          c.youtubeUrl, c.duration, c.lessonsCount, c.level, c.status, c.enrolled ? 1 : 0, c.progress,
          c.lastAccessed, c.badge, c.description, JSON.stringify(c.features || []),
          JSON.stringify(c.curriculum || []), JSON.stringify(c.units || [])
        ]
      );

      // Seed Units & Chapters
      if (c.units && Array.isArray(c.units)) {
        for (const unit of c.units) {
          await pool.execute(
            `INSERT IGNORE INTO units (id, course_id, unit_number, title)
             VALUES (?, ?, ?, ?);`,
            [unit.id, c.id, unit.unitNumber, unit.title]
          );

          if (unit.chapters && Array.isArray(unit.chapters)) {
            for (const ch of unit.chapters) {
              await pool.execute(
                `INSERT IGNORE INTO chapters (id, unit_id, course_id, title, duration, youtube_url, summary)
                 VALUES (?, ?, ?, ?, ?, ?, ?);`,
                [ch.id, unit.id, c.id, ch.title, ch.duration, ch.youtubeUrl, ch.summary]
              );
            }
          }
        }
      }
    }
    console.log(`✅ Verified Courses, Units & Chapters tables in MySQL`);

    // 3. Seed Completed Chapters
    const completedMap = {
      'usr-1': {
        'course-1': ['c1-u1-ch1', 'c1-u1-ch2'],
        'course-2': ['c2-u1-ch1']
      }
    };
    for (const [courseId, chList] of Object.entries(completedMap['usr-1'])) {
      for (const chId of chList) {
        await pool.execute(
          `INSERT IGNORE INTO completed_chapters (user_id, course_id, chapter_id)
           VALUES (?, ?, ?);`,
          ['usr-1', courseId, chId]
        );
      }
    }

    // 4. Seed Coupons
    for (const cp of initialCoupons) {
      await pool.execute(
        `INSERT IGNORE INTO coupons (id, code, discount_type, discount_value, min_spend, expiry_date, usage_limit, usage_count, status, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [cp.id, cp.code, cp.discountType, cp.discountValue, cp.minSpend, cp.expiryDate, cp.usageLimit, cp.usageCount, cp.status, cp.description]
      );
    }
    console.log(`✅ Verified Coupons table in MySQL`);

    // 5. Seed Payments
    for (const p of initialPayments) {
      await pool.execute(
        `INSERT IGNORE INTO payments (id, user_name, user_email, course_title, amount, original_price, coupon_code, date, payment_method, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [p.id, p.user, p.userEmail, p.courseTitle, p.amount, p.originalPrice, p.couponCode, p.date, p.paymentMethod, p.status]
      );
    }
    console.log(`✅ Verified Payments table in MySQL`);

    // 6. Seed Notifications
    for (const n of initialNotifications) {
      await pool.execute(
        `INSERT IGNORE INTO notifications (id, target, title, message, category, type, time, \`read\`, timestamp, link, action_label)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [n.id, n.target, n.title, n.message, n.category, n.type, n.time, n.read ? 1 : 0, n.timestamp, n.link || null, n.actionLabel || null]
      );
    }
    console.log(`✅ Verified Notifications table in MySQL`);

    // 7. Seed Referrals
    await pool.execute(
      `REPLACE INTO referrals (user_id, referral_code, referral_link, total_earned, pending_rewards, total_invites, successful_conversions, milestones, invites_list)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        'usr-1',
        initialReferralData.referralCode,
        initialReferralData.referralLink,
        initialReferralData.totalEarned,
        initialReferralData.pendingRewards,
        initialReferralData.totalInvites,
        initialReferralData.successfulConversions,
        JSON.stringify(initialReferralData.milestones),
        JSON.stringify(initialReferralData.invitesList)
      ]
    );
    console.log('✅ Cleaned Referral Data in MySQL');

    console.log('🎉 MySQL Seeding Check Completed! All user edits preserved.');
    return true;
  } catch (err) {
    console.error('Error in MySQL database seeding check:', err);
    return false;
  }
};

// Execute if run directly
if (process.argv[1].endsWith('seed.js')) {
  seedDatabase().then(() => process.exit(0));
}
