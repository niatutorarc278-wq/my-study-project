import {
  initialCourses,
  initialCoupons,
  initialUsers,
  initialPayments,
  initialReferralData,
  initialNotifications
} from '../src/data/mockData.js';

// Pure Database State Store (Synchronized live from MySQL studylms_db with fallback initial data)
export const memoryStore = {
  courses: [...initialCourses],
  coupons: [...initialCoupons],
  users: [...initialUsers],
  payments: [...initialPayments],
  referralData: { ...initialReferralData },
  notifications: [...initialNotifications],
  completedChapters: {
    'course-1': ['c1-u1-ch1', 'c1-u1-ch2'],
    'course-2': ['c2-u1-ch1']
  }
};

